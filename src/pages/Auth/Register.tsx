import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/config/constants";
import { useNavigate } from "react-router-dom";
import InputError from "@/components/ui/input-error";
import { useUser } from "@/context/UserContext";

const Register = ({ changePage }: { changePage: (index: number) => void }) => {
  const [user, fetchUser] = useUser();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await axios.post(`${BASE_URL}/auth/register`, {
        username: username,
        email: email,
        password: password,
        password_confirmation: password_confirmation,
      });
      if (result.status === 201) {
        localStorage.setItem("token", result.data.token);
        fetchUser();
        navigate("/home");
      }
    } catch (error: any) {
      console.log(error);
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={onSubmit} className="flex flex-col justify-center h-full">
        <p className="text-3xl font-bold text-white sm:text-black">
          Hi, Welcome to StreamVerse!
        </p>
        <p className="mt-1 text-white sm:text-gray-500 font-bold">
          Create an account and enjoy starting Apexify
        </p>
        <div className="mt-4">
          <label className="text-white sm:text-black" htmlFor="name">
            Name
          </label>

          <Input
            name="name"
            value={username}
            className="mt-1"
            placeholder="John Doe"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="mt-2">
          <label className="text-white sm:text-black" htmlFor="email">
            Email
          </label>

          <Input
            name="email"
            value={email}
            className="mt-1"
            placeholder="johndoe@example.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mt-2">
          <label className="text-white sm:text-black" htmlFor="password">
            Password
          </label>

          <Input
            type="password"
            name="password"
            value={password}
            className="mt-1"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mt-2">
          <label
            className="text-white sm:text-black"
            htmlFor="password_confirmation"
          >
            Confirm Password
          </label>

          <Input
            type="password"
            name="password_confirmation"
            value={password_confirmation}
            className="mt-1"
            placeholder="Confirm Password"
            onChange={(e) => setPasswordConfirmation(e.target.value)}
          />
        </div>
        <InputError message={error} className="mt-2" />
        <div className="flex flex-col items-start justify-end mt-8 gap-4">
          <Button
            className="w-full text-md bg-[#6C5DD3] py-6 text-white border-none hover:bg-[#6C5DD3]/80"
            disabled={loading}
            variant="secondary"
          >
            Register
          </Button>
          <p className="text-md text-white sm:text-gray-500">
            Already have an account?{" "}
            <span
              className="underline font-semibold cursor-pointer text-[#6C5DD3]"
              onClick={() => changePage(0)}
            >
              Login
            </span>
          </p>
        </div>
      </form>
    </>
  );
};

export default Register;
