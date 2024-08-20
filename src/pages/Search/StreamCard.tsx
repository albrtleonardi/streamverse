import ProfilePicture from "@/components/ProfilePicture";
import { SearchStreamType } from "@/types/StreamTypes";
import { Link } from "react-router-dom";

type StreamCardProps = {
  stream: SearchStreamType;
};

const StreamCard = ({ stream }: StreamCardProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-start gap-4 p-4 bg-white shadow-md rounded-lg">
      {stream.thumbnail ? (
        <img
          src={stream.thumbnail}
          alt={stream.title}
          className="w-full sm:max-w-64 h-40 object-cover rounded-lg"
        />
      ) : (
        <div className="w-full sm:max-w-64 h-40 flex items-center justify-center bg-gray-300 rounded-lg">
          <ProfilePicture
            src={stream.profile_picture}
            full_name={stream.full_name}
            className="w-12 h-12"
          />
        </div>
      )}
      <div className="flex flex-col gap-2.5 w-full">
        <h2 className="text-xl font-semibold">{stream.title}</h2>
        <p className="text-sm text-gray-500">{stream.topic_id}</p>
        <div className="flex items-center gap-2">
          <ProfilePicture
            src={stream.profile_picture}
            full_name={stream.full_name}
            className="w-9 h-9"
          />
          <Link to={`/stream/${stream.topic_id}`}>
            <p className="text-md font-semibold">{stream.full_name}</p>
          </Link>
        </div>
        {stream.is_live ? (
          <div className="flex gap-2 items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <p className="text-md">Live</p>
          </div>
        ) : (
          <p className="text-md text-gray-500">Offline</p>
        )}
      </div>
    </div>
  );
};

export default StreamCard;
