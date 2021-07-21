import { markRaw, watch, ref } from "vue";
import { ethers } from "ethers";
import { JsonRpcSigner } from "../utils/ethers";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const contractAddressRinkeby = "0xBdeC61D40CEA359f92BaC3AEE54F3148e05Ec88B";
import contractData from "@price-splitter/contracts/artifacts/contracts/Greeter.sol/Greeter.json";
import { Greeter } from "@price-splitter/contracts/typechain/Greeter";
import useMetaMask from "./metamask";

let initialized = false;

const greeter = ref<Greeter>();

const greet = ref("");
const errMsg = ref("");

const { getBalance, signer } = useMetaMask();

function clearState() {
  greet.value = "";
  errMsg.value = "";
}

export default function useGreeterContract() {
  if (!initialized) {
    watch(signer, async value => {
      clearState();

      if (value) {
        // @todo error when network is not localhost
        console.log("createContract with new signer");
        createContract(value);
        await getGreeting();
      }
    });
    initialized = true;
  }

  // @todo only for hardhat network
  // reactive with useMetaMask
  function createContract(signer: JsonRpcSigner) {
    const _contract = new ethers.Contract(contractAddressRinkeby, contractData.abi, signer) as Greeter;
    greeter.value = markRaw(_contract);
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
    createContract,
    getGreeting,
    setGreeting,
  };
}
