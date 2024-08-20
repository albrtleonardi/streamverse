import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Wifi, WifiOff } from "react-feather";

type ProfileStatusProps = {
  username?: string;
  avatar?: string;
  online?: boolean;
  topicId?: string;
};

const ProfileStatus = ({
  username = "wongsodillon",
  avatar = "https://github.com/shadcn.png",
  online = false,
  topicId = "",
}: ProfileStatusProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-2 items-center">
        <Avatar className="w-8 h-8">
          <AvatarImage src={avatar} alt="@shadcn" />
          <AvatarFallback>{username.charAt(0)}</AvatarFallback>
        </Avatar>
        <Link
          to={`/stream/${topicId}`}
          className="text-md overflow-hidden text-ellipsis whitespace-nowrap max-w-[130px]"
        >
          {username}
        </Link>
      </div>
      {online ? (
        <div className="w-3 h-3 rounded-full bg-[#6BC355]"></div>
      ) : (
        <WifiOff size={20} />
      )}
    </div>
  );
};

export default ProfileStatus;
