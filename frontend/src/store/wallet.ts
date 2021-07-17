import { ref, onMounted, computed, markRaw } from "vue";
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
const signer = ref<JsonRpcSigner>();
const userAddress = ref("");
const network = ref<Network>();

export default function useWallet() {
  async function connectWallet() {
    if (window.ethereum && window.ethereum.isMetaMask) {
      provider = new ethers.providers.Web3Provider(window.ethereum);
      const _signer = provider.getSigner();
      network.value = await provider.getNetwork();
      userAddress.value = await _signer.getAddress();

      signer.value = markRaw(_signer);
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
