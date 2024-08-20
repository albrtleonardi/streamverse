import { createContext, ReactNode, useState } from "react";
import { MetaMaskClient } from "@/services/metamaskClient";

const initValue = {
  metamaskAccountAddress: "",
  setMetamaskAccountAddress: (newValue: string) => {},
};

export const MetamaskContext = createContext(initValue);

export const MetamaskContextProvider = (props: {
  children: ReactNode | undefined;
}) => {
  const [metamaskAccountAddress, setMetamaskAccountAddress] = useState("");

  return (
    <MetamaskContext.Provider
      value={{
        metamaskAccountAddress,
        setMetamaskAccountAddress,
      }}
    >
      <MetaMaskClient />
      {props.children}
    </MetamaskContext.Provider>
  );
};
