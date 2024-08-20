import { Separator } from "./ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { connectToMetamask } from "@/services/metamaskClient";
import MetaMaskLogo from "../assets/metamask-logo.png";
import { useWalletInterface } from "@/services/useWalletInterface";

const ConnectToWalletModal = () => {
  const { accountId, walletInterface } = useWalletInterface();

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant={"secondary"}>Connect Wallet</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {accountId ? "Disconnect Wallet" : "Connect Wallet"}
          </DialogTitle>
          <Separator className="bg-purple-500 h-1 rounded-lg my-2" />
        </DialogHeader>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <button
            onClick={() => connectToMetamask()}
            className="h-24 p-1 hover:border-purple-500 border-2 transition-all duration-300 rounded-md"
          >
            <img
              src={MetaMaskLogo}
              alt="MetaMask Logo"
              className="w-full h-full p-0"
            />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectToWalletModal;
