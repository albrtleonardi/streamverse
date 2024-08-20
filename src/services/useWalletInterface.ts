import { useContext } from "react";
import { MetamaskContext } from "@/context/MetaMaskContext";
import { metamaskWallet } from "./metamaskClient";

export const useWalletInterface = () => {
  const metamaskCtx = useContext(MetamaskContext);

  if (metamaskCtx.metamaskAccountAddress) {
    return {
      accountId: metamaskCtx.metamaskAccountAddress,
      walletInterface: metamaskWallet,
    };
  } else {
    return {
      accountId: null,
      walletInterface: null,
    };
  }
};
