import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import InputError from "@/components/ui/input-error";
import axios from "axios";
import { BASE_URL } from "@/config/constants";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";

const Login = ({ changePage }: { changePage: (index: number) => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [user, fetchUser] = useUser();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await axios.post(`${BASE_URL}/auth/login`, {
        email: email,
        password: password,
      });

      if (result.status === 200) {
        localStorage.setItem("token", result.data.token);
        fetchUser();
        navigate("/home");
      }
    } catch (error: any) {
      console.log(error);
      setError(error.response?.data?.message || "An error occurred");
    }
  };
  return (
    <>
      <form onSubmit={onSubmit} className="flex flex-col justify-center h-full">
        <p className="text-3xl font-bold text-white sm:text-black">
          Hi! Welcome Back
        </p>
        <p className="text-lg text-white sm:text-gray-500 font-bold mt-2">
          Login to your account
        </p>
        <div className="mt-4">
          <label className="text-white sm:text-black" htmlFor="email">
            Email
          </label>
          <Input
            name="email"
            value={email}
            className="mt-1"
            placeholder="john@example.com"
            onChange={(e) => setEmail(e.target.value)}
          />
          {/* <InputError message={errors.email} className="mt-1" /> */}
        </div>

        <div className="mt-4 relative">
          <label className="text-white sm:text-black" htmlFor="password">
            Password
          </label>
          <Input
            type={showPassword ? "text" : "password"}
            name="password"
            value={password}
            className="mt-1"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="absolute inset-y-0 top-[45%] right-3 flex items-center cursor-pointer"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </span>
        </div>
        <InputError message={error} className="mt-1" />
        <div className="flex flex-col items-start justify-end mt-8 gap-4">
          <Button
            className="w-full text-md bg-[#6C5DD3] py-6 text-white border-none hover:bg-[#6C5DD3]/80"
            // disabled={processing}
            variant="secondary"
          >
            Log in
          </Button>
          <p className="text-md text-white sm:text-gray-500">
            Don't have an account?{" "}
            <span
              className="underline font-semibold cursor-pointer text-[#6C5DD3]"
              onClick={() => changePage(1)}
            >
              Register
            </span>
          </p>
        </div>
      </form>
    </>
  );
};

export default Login;
