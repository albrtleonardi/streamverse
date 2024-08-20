import MainLayout from "@/layouts/MainLayout";
import { WifiOff, X } from "react-feather";
import { Download, Video, Send } from "react-feather";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BASE_URL } from "@/config/constants";
import { useNavigate } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import GiftSelectionCard from "@/components/GiftSelectionCard";
import { useUser } from "@/context/UserContext";
import axios from "axios";
import { useParams } from "react-router-dom";
import { StreamType } from "@/types/StreamTypes";
import { UserType } from "@/types/UserTypes";
import socket from "@/lib/webSocket";
import { useToaster } from "@/context/ToastContext";
import ProfilePicture from "@/components/ProfilePicture";
import { ChatMessageType } from "@/types/StreamTypes";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const WatchStream = () => {
  const [user, fetchUser, balance, fetchBalance] = useUser();
  if (!user) {
    return <div>Loading...</div>;
  }
  const { topic_id } = useParams();
  const [streamInfo, setStreamInfo] = useState<StreamType | null>(null);
  const [streamer, setStreamer] = useState<UserType | null>(null);
  const [selectedGift, setSelectedGift] = useState<number | null>(null);
  const [liveStream, setLiveStream] = useState<MediaStream | null>(null);
  const [showChat, setShowChat] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [message, setMessage] = useState("");
  const [viewerCount, setViewerCount] = useState(0);
  const [donationAmount, setDonationAmount] = useState("");
  const [donationMessage, setDonationMessage] = useState("");
  const [senderAccountId, setSenderAccountId] = useState("");
  const { toastSuccess, toastError } = useToaster();
  const [isFollowed, setIsFollowed] = useState(false);
  const [donateLoading, setDonateLoading] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const toggleChat = () => {
    setShowChat(!showChat);
  };
  const handleGiftChange = (amount: number) => {
    if (amount >= 1000000) {
      toastError("Maximum gift amount is 1,000,000 HBAR");
      return;
    } else if (amount <= 0) {
      toastError("Please give a valid amount");
      return;
    }
    setDonationAmount(amount.toString());
    setSelectedGift((prev) => (prev === amount ? null : amount));
  };

  useEffect(() => {
    const fetchStreamer = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }
      try {
        const response = await axios.get(
          `${BASE_URL}/stream/streamer/${topic_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setIsFollowed(response.data.is_followed);
        setStreamInfo(response.data.streamer);
        console.log(response.data.userProfile);
        setStreamer(response.data.userProfile);
      } catch (error) {
        console.error("Error fetching streamer:", error);
        navigate("/home");
      }
    };
    fetchStreamer();
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

    peerConnection.ontrack = (event) => {
      if (videoRef.current) {
        videoRef.current.srcObject = event.streams[0];
      }
      setLiveStream(event.streams[0]);
    };

    socket.emit("join-room", topic_id, "watcher");

    socket.on("offer", async (offer) => {
      try {
        if (peerConnectionRef.current) {
          await peerConnectionRef.current.setRemoteDescription(
            new RTCSessionDescription(offer)
          );
          const answer = await peerConnectionRef.current.createAnswer();
          await peerConnectionRef.current.setLocalDescription(answer);
          socket.emit("answer", topic_id, answer);
        }
      } catch (error) {
        console.error("Error handling offer:", error);
      }
    });

    socket.on("ice-candidate", async (candidate) => {
      try {
        if (
          peerConnectionRef.current &&
          peerConnectionRef.current.signalingState !== "closed"
        ) {
          await peerConnectionRef.current.addIceCandidate(
            new RTCIceCandidate(candidate)
          );
        }
      } catch (error) {
        console.error("Error adding received ICE candidate:", error);
      }
    });

    socket.on("chat", (incomingMessage) => {
      setMessages((prevMessages) => [...prevMessages, incomingMessage]);
    });

    socket.on("user-connected", () => {
      console.log("User connected");
      setViewerCount((prev) => prev + 1);
    });

    socket.on("user-disconnected", () => {
      console.log("User disconnected");
      setViewerCount((prev) => prev - 1);
    });

    socket.on("stop-stream", async () => {
      videoRef.current = null;
    });

    return () => {
      peerConnection.close();
      peerConnectionRef.current = null;
      socket.off("user-connected");
      socket.off("user-disconnected");
      socket.off("offer");
      socket.off("ice-candidate");
      socket.off("stream-started");
      socket.off("chat");
      socket.emit("leave-room", topic_id);
    };
  }, [topic_id]);

  useEffect(() => {
    console.log(videoRef);
  }, [videoRef]);

  const handleMessageSubmit = (e: any) => {
    e.preventDefault();
    if (message.trim() === "") return;
    const chatMessage: ChatMessageType = {
      fullName: user.profile.full_name,
      content: message,
      timeStamp: new Date().toLocaleTimeString(),
    };
    setMessages((prevMessages) => [...prevMessages, chatMessage]);
    socket.emit("chat", topic_id, chatMessage);
    setMessage("");
  };

  function formatBalance(balance: number): string {
    if (balance >= 1e9) {
      return (balance / 1e9).toFixed(1).replace(/\.0$/, "") + "B"; // Billions
    }
    if (balance >= 1e6) {
      return (balance / 1e6).toFixed(1).replace(/\.0$/, "") + "M"; // Millions
    }
    if (balance >= 1e3) {
      return (balance / 1e3).toFixed(1).replace(/\.0$/, "") + "k"; // Thousands
    }
    return balance.toString();
  }

  const handleDonation = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      setDonateLoading(true);
      console.log("Sender Account ID:", user.hederaAccountId);
      if (Number(donationAmount) <= 0 || Number(donationAmount) >= 1000000) {
        toastError("Please give a valid amount");
        return;
      }
      const streamResponse = await axios.get<{ receiverAccountId: string }>(
        `${BASE_URL}/stream/${topic_id}/receiver`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const receiverAccountId = streamResponse.data.receiverAccountId;
      console.log("sender accid", senderAccountId);
      console.log("Receiver Account ID:", receiverAccountId);
      console.log("Donation Amount:", donationAmount);
      const response = await axios.post<{ message: string }>(
        `${BASE_URL}/donate`,
        {
          senderAccountId: user.hederaAccountId,
          receiverAccountId: receiverAccountId,
          amount: donationAmount,
          streamId: topic_id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toastSuccess(response.data.message);
      setDonationMessage(response.data.message);
      fetchBalance();
    } catch (error: any) {
      console.error("Error during donation:", error);
      setDonationMessage(
        error.response?.data?.error || "Failed to process donation"
      );
      toastError(error.response?.data?.error || "Failed to process donation");
    } finally {
      setDonateLoading(false);
    }
  };

  const handleFollow = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      setFollowLoading(true);
      const response = await axios.post(
        `${BASE_URL}/follower/${user.id}/follow`,
        {
          followingId: streamer?.id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIsFollowed((prev) => !prev);
      toastSuccess(response.data.message);
    } catch (error: any) {
      console.error("Error during follow:", error);
      toastError(error.response?.data?.error || "Failed to follow streamer");
    } finally {
      setFollowLoading(false);
    }
  };

  const handleUnfollow = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }
    try {
      setFollowLoading(true);
      const response = await axios.post(
        `${BASE_URL}/follower/${user.id}/unfollow`,
        {
          followingId: streamer?.id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIsFollowed((prev) => !prev);
      toastSuccess(response.data.message);
    } catch (error: any) {
      console.error("Error during follow:", error);
      toastError(error.response?.data?.error || "Failed to follow streamer");
    } finally {
      setFollowLoading(false);
    }
  };

  return (
    <MainLayout scrollable={false}>
      <div className="h-screen flex relative w-full overflow-y-hidden">
        <div className="flex flex-col w-full overflow-y-auto no-scrollbar">
          <video
            ref={videoRef}
            autoPlay
            muted
            className="w-full object-cover max-h-[32rem]"
          ></video>
          {/* {videoRef.current ? (
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
            </div>
          )} */}
          <div className="min-h-full flex flex-col p-6 gap-4">
            <div className="flex flex-col gap-4 justify-between md:flex-row">
              <div className="flex gap-4">
                <ProfilePicture
                  src={streamer?.profile.profile_picture}
                  full_name={streamer?.profile.full_name}
                />
                <div className="flex flex-col">
                  <p className="text-xl font-bold">
                    {streamer?.profile.full_name}
                  </p>
                  <p className="font-semibold">
                    {streamer?.followerCount} Followers
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                {isFollowed ? (
                  <Button
                    disabled={followLoading}
                    onClick={handleUnfollow}
                    className="px-8 text-lg"
                    variant={"secondary"}
                  >
                    Unfollow
                  </Button>
                ) : (
                  <Button
                    disabled={followLoading}
                    onClick={handleFollow}
                    className="px-8 text-lg"
                    variant={"secondary"}
                  >
                    Follow
                  </Button>
                )}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button className="px-12 text-lg" variant={"outline"}>
                      Gift
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[22rem] p-0">
                    <div className="flex flex-col gap-4 h-96">
                      <div className="flex gap-4 items-center px-6 pt-6">
                        <ProfilePicture
                          src={streamer?.profile.profile_picture}
                          full_name={streamer?.profile.full_name}
                          className="w-12 h-12"
                        />
                        <div className="flex flex-col">
                          <p className="text-xl font-bold">
                            {streamer?.profile.full_name}
                          </p>
                          <p className="font-semibold">
                            {streamer?.followerCount} Followers
                          </p>
                        </div>
                      </div>
                      <ScrollArea className="px-6 pb-6">
                        <div className="flex flex-col">
                          <p className="font-bold text-lg">Select gift</p>
                          <p className="text-sm">
                            Balance: {formatBalance(balance)} HBAR
                          </p>
                        </div>
                        <div className="grid grid-cols-2 mt-2">
                          {[10, 25, 50, 100, 200, 500].map((amount) => (
                            <GiftSelectionCard
                              key={amount}
                              amount={amount}
                              isSelected={selectedGift === amount}
                              onSelect={() => handleGiftChange(amount)}
                            />
                          ))}
                        </div>
                        <div className="flex flex-col items-end gap-2 mt-4 px-2">
                          <p className="font-bold w-full">Send custom amount</p>
                          <form
                            onSubmit={handleDonation}
                            className="flex w-full flex-col gap-2 items-end"
                          >
                            <Input
                              placeholder="Enter HBar amount"
                              type="number"
                              value={donationAmount}
                              onChange={(e) =>
                                setDonationAmount(e.target.value)
                              }
                              className="border border-input w-full"
                            />
                            <Button
                              disabled={donateLoading}
                              type="submit"
                              className="px-4 text-lg gap-4 max-w-40 text-md"
                              variant={"secondary"}
                            >
                              Donate <Send size={18} />
                            </Button>
                          </form>
                          {/* {donationMessage && (
                            <p className="text-green-600 mt-2">
                              {donationMessage}
                            </p>
                          )} */}
                        </div>
                      </ScrollArea>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-xl font-semibold">{streamInfo?.title}</p>
              <div className="flex justify-between">
                <div className="flex gap-4 items-center text-darkPurple">
                  <Video size={24} />
                  <p className="text-lg font-bold">
                    {viewerCount} watching now
                  </p>
                </div>
              </div>
              <br />
              <div className="flex flex-col gap-4">
                <p className="font-bold text-xl">
                  About {streamer?.profile.full_name}
                </p>
                <div className="p-4 border-2 border-purple-500 rounded-sm bg-white">
                  <p>
                    {streamer?.profile.bio || "No bio available for this user"}
                  </p>
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
          <div className="bg-white flex flex-grow overflow-y-auto">
            {liveStream && (
              <ScrollArea className="px-4 py-2 flex-grow flex flex-col gap-2 flex-wrap">
                {messages.map((msg, index) => (
                  <p key={index} className="whitespace-pre-wrap break-words">
                    <strong>{msg.fullName}:</strong> {msg.content}
                  </p>
                ))}
              </ScrollArea>
            )}
            {!liveStream && (
              <div className="flex-grow flex flex-col gap-4 items-center justify-center pb-16">
                <WifiOff size={32} className="text-gray-300" />
                <p className="text-lg text-gray-400">Chat is offline</p>
              </div>
            )}
          </div>
          {liveStream && (
            <div className="p-3 min-h-[11.4rem] border-t bg-white ">
              <p className="text-md font-semibold mb-1 text-purple-700">
                Send Chat
              </p>
              <form onSubmit={handleMessageSubmit} className="flex gap-2">
                <Input
                  placeholder="Type a message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-grow"
                />
                <Button type="submit" className="flex items-center gap-1">
                  <Send size={16} />
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default WatchStream;
