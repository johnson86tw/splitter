import { markRaw, watch, ref, computed } from "vue";
import { ethers } from "ethers";
import { JsonRpcSigner } from "../utils/ethers";
import contractData from "@splitter/contracts/artifacts/contracts/Greeter.sol/Greeter.json";
import { Greeter } from "@splitter/contracts/typechain/Greeter";
import useMetaMask from "./metamask";
import NETWORK from "../constants";
import { isAddress } from "ethers/lib/utils";
import useConfig from "@/config";

const { supportedChainIds } = useConfig();
const { getBalance, hasSetupWallet, signer, chainId } = useMetaMask();

const greeterAddress: Readonly<Record<string, string>> = {
  localhost: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  rinkeby: "0xBdeC61D40CEA359f92BaC3AEE54F3148e05Ec88B",
  goerli: "0xa1c2109014EB3093cdcE1896e1c2A2cB082Ea97a",
};

const greeter = ref<Greeter>();

const greet = ref("");
const errMsg = ref("");

function clearState() {
  greet.value = "";
  errMsg.value = "";
}

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

function connectContractAt(address: string) {
  let contract;
  if (!isAddress(address)) throw new Error("address is invalid");
  if (hasSetupWallet.value && signer.value && chainId.value) {
    // @issue: throw Error can't be handled when address is not valid.
    contract = new ethers.Contract(address, contractData.abi, signer.value) as Greeter;
  }
  return contract;
}

async function getGreeting() {
  if (!greeter.value) return;
  errMsg.value = "";
  try {
    greet.value = await greeter.value.greet();
  } catch (e) {
    errMsg.value = e.message;
  }
}

async function setGreeting(greet: string) {
  if (!greeter.value) return;
  errMsg.value = "";
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

export default function useGreeterContract() {
  return {
    errMsg,
    greet,
    greeter,
    contractData,
    greeterAddress: computed(() => greeter.value?.address),
    createContract,
    connectContractAt,
    getGreeting,
    setGreeting,
  };
}
