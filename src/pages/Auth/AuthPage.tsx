import { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import Union from "../../assets/Union.png";
import LoginBg from "../../assets/login-bg.png";

const AuthPage = () => {
  const [page, setPage] = useState(0);
  const [opacity, setOpacity] = useState(100);

  const changePage = async (index: number) => {
    setOpacity(0);
    await new Promise((resolve) => setTimeout(resolve, 300));
    setPage(index);
    setOpacity(100);
  };

  const pages = [
    <Login changePage={changePage} />,
    <Register changePage={changePage} />,
  ];

  return (
    <div className="w-screen relative h-screen flex justify-between sm:bg-none">
      <div
        className={`sm:w-[55%] w-full h-full transition-all duration-700 sm:bg-white`}
      >
        <div
          className="px-12 md:px-[15%] h-full transition-all duration-500"
          style={{ opacity: opacity + "%" }}
        >
          {pages[page]}
        </div>
      </div>
      <div className="hidden w-[45%] sm:block p-12 lg:p-24 relative">
        <div className="inset-0 absolute -z-10">
          <img src={LoginBg} className="w-full h-full object-cover" />
        </div>
      </div>
      {/* Mobile bg */}
      <div className="sm:hidden inset-0 absolute -z-10 brightness-75">
        <img src={Union} className="w-full h-full object-cover" />
      </div>
    </div>
  );
};

export default AuthPage;
