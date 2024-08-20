import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

type ProfilePictureProps = {
  src?: string;
  full_name?: string;
  className?: string;
};

const ProfilePicture = ({
  src,
  full_name = "",
  className = "",
}: ProfilePictureProps) => {
  return (
    <Avatar className={className}>
      <AvatarImage src={src} alt="" />
      <AvatarFallback className="bg-purple-300">
        {getInitials(full_name)}
      </AvatarFallback>
    </Avatar>
  );
};

export default ProfilePicture;
