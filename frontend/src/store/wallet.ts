import { ref, onMounted, computed, nextTick } from "vue";
import { JsonRpcProvider, JsonRpcSigner, Web3Provider, Network } from "@ethersproject/providers";
import { ethers } from "ethers";

interface EthereumProvider {
  isMetaMask?: boolean;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

let provider: JsonRpcProvider;
let signer: JsonRpcSigner;
const userAddress = ref("");
const network = ref<Network>();

export default function useWallet() {
  async function connectWallet() {
    if (window.ethereum && window.ethereum.isMetaMask) {
      provider = new ethers.providers.Web3Provider(window.ethereum);
      signer = provider.getSigner();

      network.value = await provider.getNetwork();
      userAddress.value = await signer.getAddress();
    }
  }

  return {
    connectWallet,
    userAddress,
    provider,
    signer,
    chainId: computed(() => network.value?.chainId),
  };
}
