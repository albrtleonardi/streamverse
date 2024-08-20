import { Link, LinkProps, useLocation } from "react-router-dom";

const SidebarLink = ({ to, className = "", children, ...props }: LinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  const activeStyles =
    "bg-purple-gradient px-3 text-white transition-all duration-500 hover:text-white";

  return (
    <Link
      to={to}
      {...props}
      className={`flex items-center py-2 text-lg rounded-md font-medium transition-all duration-200 hover:text-darkPurple ${
        isActive ? activeStyles : ""
      } ${className}`}
    >
      {children}
    </Link>
  );
};

export default SidebarLink;
