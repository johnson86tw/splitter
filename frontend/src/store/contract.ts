import { markRaw, onMounted, Ref, ref } from "vue";
import { Contract, ethers, Signer } from "ethers";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
import contractABI from "@price-splitter/contracts/artifacts/contracts/Greeter.sol/Greeter.json";
import { JsonRpcSigner } from "../utils/ethers";

const greet = ref("");
const contract = ref<Contract>();

export default function useContract() {
  function initContract(signer: JsonRpcSigner) {
    if (contract.value) return;
    const _contract = new ethers.Contract(contractAddress, contractABI.abi, signer);
    contract.value = markRaw(_contract);
  }

  async function getGreeting() {
    if (!contract.value) return;
    greet.value = await contract.value.greet();
  }

  async function setGreeting(greet: string) {
    if (!contract.value) return;
    const tx = await contract.value.setGreeting(greet);
    await tx.wait();
    getGreeting();
  }

  return {
    greet,
    initContract,
    getGreeting,
    setGreeting,
  };
}
