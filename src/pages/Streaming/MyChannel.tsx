import MainLayout from "@/layouts/MainLayout";
import { Wifi, X } from "react-feather";
import { Download, Video, WifiOff } from "react-feather";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { useDropzone } from "react-dropzone";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUser } from "@/context/UserContext";
import ProfilePicture from "@/components/ProfilePicture";
import useBase64 from "@/hooks/useBase64";
import { StreamType } from "@/types/StreamTypes";
import { BASE_URL } from "@/config/constants";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import socket from "@/lib/webSocket";
import { ChatMessageType } from "@/types/StreamTypes";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const MyChannel = () => {
  const [user, fetchUser] = useUser();
  if (!user) {
    return <div>Loading...</div>;
  }
  const { topic_id } = useParams();
  const [stream, setStream] = useState<StreamType>(user.stream);
  const [liveStream, setLiveStream] = useState<MediaStream | null>(null);
  const [showChat, setShowChat] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [message, setMessage] = useState("");

  const toggleChat = () => {
    setShowChat(!showChat);
  };

  const [title, setTitle] = useState(stream ? stream.title : "Untitled Stream");
  const { base64List, processImagesToBase64 } = useBase64();
  const [uploadedImage, setUploadedImage] = useState<string | null>(
    stream ? stream.thumbnail : null
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop: (acceptedFiles) => {
      processImagesToBase64(acceptedFiles);
    },
  });

  useEffect(() => {
    if (base64List.length > 0) {
      setUploadedImage(base64List[0]);
    }
  }, [base64List]);

  useEffect(() => {
    const createRoom = async () => {
      try {
        const response = await axios.post(`${BASE_URL}/stream/rooms`, {
          topic_id: topic_id,
        });
      } catch (error) {
        console.log(error);
      }
    };
    createRoom();
  }, []);

  useEffect(() => {
    const peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peerConnectionRef.current = peerConnection;

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", topic_id, event.candidate);
      }
    };

    peerConnection.onnegotiationneeded = async () => {
      try {
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        socket.emit("offer", topic_id, offer);
      } catch (error) {
        console.error("Error creating or setting offer:", error);
      }
    };

    socket.on("answer", async (answer) => {
      try {
        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(answer)
        );
      } catch (error) {
        console.error("Error setting remote description:", error);
      }
    });

    socket.on("ice-candidate", async (candidate) => {
      try {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (error) {
        console.error("Error adding received ICE candidate:", error);
      }
    });

    socket.on("chat", (incomingMessage) => {
      console.log(incomingMessage);
      setMessages((prevMessages) => [...prevMessages, incomingMessage]);
    });

    socket.emit("join-room", topic_id, "streamer");

    socket.on("user-connected", ({ id, role }) => {
      console.log(`New user connected: ${id} as ${role}`);
      if (role === "watcher") {
        peerConnection.onnegotiationneeded?.(new Event("negotiationneeded"));
      }
    });

    return () => {
      peerConnection.close();
      peerConnectionRef.current = null;
      socket.emit("stop-stream", topic_id);
      socket.off("offer");
      socket.off("user-connected");
      socket.off("user-disconnected");
      socket.off("ice-candidate");
      socket.off("chat");
    };
  }, [topic_id]);

  const startStream = async () => {
    if (!topic_id) return;
    const response = await axios.patch(`${BASE_URL}/stream/start-stream`, {
      title: title,
      thumbnail: uploadedImage,
      topic_id: topic_id,
      stream_url: topic_id,
    });
    console.log(response.data);
    try {
      const newStream = await navigator.mediaDevices.getDisplayMedia({
        audio: true,
        video: true,
      });
      setLiveStream(newStream);
      newStream.getTracks().forEach((track) => {
        peerConnectionRef.current?.addTrack(track, newStream);
      });
      socket.emit("stream-started", topic_id);
    } catch (error) {
      console.error("Error accessing screen media.", error);
    }
  };

  useEffect(() => {
    if (liveStream && videoRef.current) {
      videoRef.current.srcObject = liveStream;
      videoRef.current.play().catch((error) => {
        console.error("Error playing the video stream:", error);
      });
    }
    return () => {
      if (liveStream) {
        liveStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [liveStream]);

  const stopStream = () => {
    if (liveStream) {
      liveStream.getTracks().forEach((track) => track.stop());
      setLiveStream(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
    console.log("Emitting stop-stream event with topic_id:", topic_id);
    socket.emit("stop-stream", topic_id);
  };

  return (
    <MainLayout scrollable={false}>
      <div className="h-screen flex relative w-full overflow-y-hidden">
        <div className="flex flex-col w-full overflow-y-auto no-scrollbar">
          {liveStream ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              className="w-full object-cover"
            ></video>
          ) : (
            <div className="flex flex-col gap-4 items-center justify-center w-full bg-black min-h-[32rem]">
              <WifiOff size={48} className="text-gray-200" />
              <p className="text-gray-200 text-2xl">You are offline</p>
              <Button className="px-6 py-4 text-md" onClick={startStream}>
                <Video className="mr-2" />
                Go Live
              </Button>
            </div>
          )}

          <div className="min-h-full flex flex-col p-6 gap-4">
            <div className="flex flex-col gap-4 justify-between md:flex-row">
              <div className="flex gap-4 items-center">
                <ProfilePicture
                  src={user.profile.profile_picture}
                  full_name={user.profile.full_name}
                  className="w-16 h-16"
                />
                <div className="flex flex-col">
                  <p className="text-xl font-bold">{user.profile.full_name}</p>
                  <p className="font-semibold text-darkPurple">
                    {user.followerCount} Followers
                  </p>
                </div>
                {liveStream && (
                  <Button
                    onClick={() => stopStream()}
                    className="ml-4"
                    variant={"secondary"}
                  >
                    Stop Live
                  </Button>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-lg font-bold">Set your stream title</p>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-2 py-6 text-lg"
                />
              </div>
              <div>
                <p className="text-lg font-bold">Set your thumbnail</p>
                <div
                  {...getRootProps()}
                  className={`mt-2 flex items-center justify-center max-w-96 h-64 rounded-md ${
                    uploadedImage
                      ? ""
                      : "border-2 border-dashed border-gray-400"
                  }`}
                >
                  <input {...getInputProps()} />
                  {uploadedImage ? (
                    <img
                      src={uploadedImage}
                      alt="Thumbnail"
                      className="w-full h-full object-cover rounded-md"
                    />
                  ) : (
                    <p className="text-lg text-center text-black mx-6">
                      {isDragActive
                        ? "Drop files here"
                        : "Drag 'n' drop your thumbnail here, or click to select"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          {!showChat && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="absolute flex items-center justify-center right-4 top-4 p-2 hover:bg-gray-200 rounded-md transition-all duration-300">
                    <button onClick={toggleChat}>
                      <Download size={32} className="rotate-90 text-gray-500" />
                    </button>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="p-2">
                  <p className="text-md">Expand</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <div
          className={
            "absolute top-0 right-0 w-64 max-w-64 flex flex-col sm:w-80 sm:max-w-80 h-screen sm:relative duration-200 bg-white ease-linear border-l sm:translate-x-0 " +
            (showChat ? "translate-x-0" : "sm:hidden translate-x-full")
          }
        >
          <div className="flex items-center w-full justify-between px-6 py-4 border-b drop-shadow-md">
            <p className="text-lg font-semibold">Live Chat</p>
            <X
              size={24}
              className="cursor-pointer"
              onClick={() => setShowChat(false)}
            />
          </div>
          <div className="bg-white flex-grow flex overflow-y-auto">
            {liveStream && (
              <ScrollArea className="px-4 py-2 flex-grow">
                {messages.map((message, index) => (
                  <div key={index}>
                    <strong>{message.fullName}:</strong> {message.content}
                  </div>
                ))}
              </ScrollArea>
            )}
            {!liveStream && (
              <div className="flex-grow flex flex-col gap-4 items-center justify-center pb-16">
                <WifiOff size={32} className="text-gray-300" />
                <p className="text-lg text-gray-400">Chat not available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default MyChannel;
