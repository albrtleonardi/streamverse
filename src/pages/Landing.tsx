import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import PurpleShape from "../assets/purple_shape.png";
import Rocket from "../assets/rocket.png";
import PurpleSphere from "../assets/purple_sphere.png";
import YellowSphere from "../assets/yellow_sphere.png";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen relative home-background no-scrollbar overflow-y-auto scroll-smooth">
      <div className="w-64 h-[44rem] border absolute top-0 drop-shadow-2xl rounded-br-full rounded-bl-full z-0">
        <img src={PurpleShape} className="h-full" />
      </div>
      <div className="w-32 h-32 absolute left-[3%] top-4 hidden md:block">
        <img src={PurpleSphere} alt="" />
      </div>
      <div className="w-16 h-16 absolute left-[15%] top-48 hidden md:block">
        <img src={PurpleSphere} alt="" />
      </div>
      <div className="w-[30%] h-64 border border-white yellow-gradient absolute bottom-0 right-0 drop-shadow-2xl rounded-tl-full rounded-bl-full z-0">
        <img
          src={YellowSphere}
          className="absolute h-16 w-16 hidden md:block"
        />
      </div>
      <Navbar />
      <main className="relative flex items-center justify-center text-center pt-32">
        <div className="lg:absolute hidden md:block md:w-[20rem] md:h-[20rem] lg:w-[30rem] lg:h-[30rem] left-0 top-[50%]">
          <img src={Rocket} className="w-full h-full" />
        </div>
        <div className="flex flex-col gap-2 items-start md:ml-12 lg:ml-80">
          <span className="text-[#892EE1] text-6xl xl:text-8xl font-anton">
            THEY ARE
          </span>
          <span className="text-[#FF9A00] text-8xl xl:text-9xl font-anton">
            WATCHING
          </span>
          <br />
          <Button
            size="xl"
            className="rounded-3xl px-16 text-xl"
            onClick={() => navigate("/home")}
          >
            Lets Start
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Landing;
