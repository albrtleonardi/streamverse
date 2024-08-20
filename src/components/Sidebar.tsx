import { X } from "react-feather";
import { Link, useLocation } from "react-router-dom";
import SidebarLink from "./SidebarLink";
import { Separator } from "./ui/separator";
import ProfileStatus from "./ProfileStatus";
import { Accordion, AccordionContent, AccordionTrigger } from "./ui/accordion";
import { AccordionItem } from "@radix-ui/react-accordion";
import { useUser } from "@/context/UserContext";
import { useEffect, useState } from "react";
import { BASE_URL } from "@/config/constants";
import axios from "axios";

type SidebarProps = {
  show?: boolean;
  toggleShow: React.Dispatch<React.SetStateAction<boolean>>;
};

type FollowingType = {
  fullName: string;
  isLive: boolean;
  topicId: string;
  followingId: string;
  profilePicture: string;
};

const Sidebar = ({ show = true, toggleShow }: SidebarProps) => {
  const [user, fetchUser] = useUser();
  const [followings, setFollowings] = useState<FollowingType[] | null>(null);

  useEffect(() => {
    const fetchFollowings = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/follower/${user?.id}/following`
        );
        setFollowings(response.data);
      } catch (error) {}
    };
    fetchFollowings();
  }, [user]);

  return (
    <aside
      className={
        "absolute left-0 top-0 z-[999] flex h-screen w-60 lg:min-w-[12.5%] flex-col overflow-y-hidden bg-white duration-300 ease-linear lg:static lg:translate-x-0 " +
        (show ? "translate-x-0" : "-translate-x-full")
      }
    >
      <div className="md:px-6 px-4 py-6 flex justify-between items-center">
        <Link
          to={"/home"}
          className="text-black text-2xl font-bold hover:text-purple-500 transition-all duration-300 ease-linear"
        >
          StreamVerse
        </Link>
        <button onClick={() => toggleShow(false)} className="lg:hidden">
          <X className="text-black" size={24} />
        </button>
      </div>
      <div className="no-scrollbar overflow-y-auto flex flex-col duration-300 ease-linear">
        <nav className="py-4 px-4 lg:px-6">
          <div className="flex flex-col gap-4">
            <SidebarLink to="/home">For you</SidebarLink>
            {user && (
              <SidebarLink to={`/stream/${user.stream.topic_id}`}>
                My Channel
              </SidebarLink>
            )}
            <SidebarLink to="/home/category">Category</SidebarLink>
            {/* <SidebarLink to="/home/trending">Trending</SidebarLink> */}
            <Separator />
            {user && (
              <Accordion type="single" collapsible className="w-full -mt-2">
                <AccordionItem value="1">
                  <AccordionTrigger>
                    <p className="text-[#868686] text-lg">Following</p>
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-4">
                    {followings?.map((following) => (
                      <ProfileStatus
                        key={following.followingId}
                        username={following.fullName}
                        online={following.isLive}
                        topicId={following.topicId}
                        avatar={following.profilePicture}
                      />
                    ))}
                    {/* <ProfileStatus />
                    <ProfileStatus
                      username="propanemethanolpropanemethanol"
                      online={true}
                    />
                    <ProfileStatus username="marcodave_" /> */}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
