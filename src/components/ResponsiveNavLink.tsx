import { Link, LinkProps } from "react-router-dom";

const ResponsiveNavLink = ({
  active = false,
  className = "",
  children,
  ...props
}: LinkProps & { active?: boolean }) => {
  return (
    <Link
      {...props}
      className={`w-full flex items-start ps-3 pe-4 py-2 border-l-4 hover:bg-purple-100 hover:border-darkPurple ${
        active ? "border-darkPurple bg-purple-100" : "border-transparent"
      }`}
    >
      {children}
    </Link>
  );
};

export default ResponsiveNavLink;
