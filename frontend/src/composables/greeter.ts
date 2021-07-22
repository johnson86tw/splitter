import { markRaw, watch, ref, computed } from "vue";
import { ethers } from "ethers";
import { JsonRpcSigner } from "../utils/ethers";

import contractData from "@splitter/contracts/artifacts/contracts/Greeter.sol/Greeter.json";
import { Greeter } from "@splitter/contracts/typechain/Greeter";
import useMetaMask from "./metamask";
import NETWORK from "../constants";

const greeterAddress: Readonly<Record<string, string>> = {
  localhost: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  rinkeby: "0xBdeC61D40CEA359f92BaC3AEE54F3148e05Ec88B",
};

const greeter = ref<Greeter>();

const greet = ref("");
const errMsg = ref("");

const { getBalance, hasSetupWallet, signer, supportedChainIds, chainId } = useMetaMask();

function clearState() {
  greet.value = "";
  errMsg.value = "";
}

export default function useGreeterContract() {
  watch(hasSetupWallet, async hasSetupWallet => {
    clearState();

    if (hasSetupWallet && signer.value && chainId.value) {
      if (supportedChainIds.includes(chainId.value)) {
        console.log("createContract when setting up new wallet");
        createContract(signer.value, chainId.value);
        await getGreeting();
      }
    }
  });

  // reactive with useMetaMask
  function createContract(signer: JsonRpcSigner, chainId: number) {
    if (supportedChainIds.includes(chainId)) {
      const contractAddress = greeterAddress[NETWORK(chainId)!.name];
      const _contract = new ethers.Contract(contractAddress, contractData.abi, signer) as Greeter;
      greeter.value = markRaw(_contract);
    } else {
      throw new Error("createContract: unsupported chainId");
    }
  }

  async function getGreeting() {
    if (!greeter.value) return;
    try {
      greet.value = await greeter.value.greet();
    } catch (e) {
      errMsg.value = e.message;
    }
  }

  async function setGreeting(greet: string) {
    if (!greeter.value) return;
    try {
      const tx = await greeter.value.setGreeting(greet);
      // @todo add tx pending state
      await tx.wait();
      await getGreeting();
      await getBalance();
    } catch (e) {
      errMsg.value = e.message;
    }
  }

  return {
    errMsg,
    greet,
    greeter,
    contractData,
    greeterAddress: computed(() => greeter.value?.address),
    createContract,
    getGreeting,
    setGreeting,
  };
}
