import { createContext, useContext, useEffect, useState } from "react";
import { PropsWithChildren } from "react";
import { UserType } from "@/types/UserTypes";
import { BASE_URL } from "@/config/constants";
import axios from "axios";

type UserContextType = [UserType | null, () => void, number, () => void];

const UserContext = createContext<UserContextType>([
  null,
  async () => {},
  0,
  async () => {},
]);

export function UserProvider({ children }: PropsWithChildren<{}>) {
  const [user, setUser] = useState<UserType | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      return;
    }
    try {
      const response = await axios.get(`${BASE_URL}/auth`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data);
      fetchBalance();
    } catch {
      setUser(null);
    }
  };

  const fetchBalance = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      return;
    }
    try {
      const response = await axios.get(`${BASE_URL}/account/balance`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      let balanceData = response.data.balance;
      if (typeof balanceData === "object" && balanceData !== null) {
        balanceData =
          Number(balanceData.low) + Number(balanceData.high) * 2 ** 32;
      }

      setBalance(balanceData);
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={[user, fetchUser, balance, fetchBalance]}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
