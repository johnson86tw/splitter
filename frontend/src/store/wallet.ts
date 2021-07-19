import { ref, onMounted, computed, markRaw } from "vue";
import { JsonRpcProvider, JsonRpcSigner, Web3Provider, Network } from "@ethersproject/providers";
import { ethers, providers } from "ethers";

interface MetaMaskProvider {
  isMetaMask: boolean;
  request: (request: { method: string; params?: any[] | undefined }) => Promise<any>;
}

declare global {
  interface Window {
    ethereum?: MetaMaskProvider;
  }
}

const provider = ref<JsonRpcProvider | Web3Provider>();
const signer = ref<JsonRpcSigner>();
const userAddress = ref("");
const network = ref<Network>();

const isConnected = ref(false);

export default function useWallet() {
  async function connectWallet() {
    if (window.ethereum && window.ethereum.isMetaMask) {
      const _provider = new ethers.providers.Web3Provider(window.ethereum);
      const _signer = _provider.getSigner();

      await window.ethereum.request({ method: "eth_requestAccounts" });

      isConnected.value = true;
      network.value = await _provider.getNetwork();
      userAddress.value = await _signer.getAddress();

      provider.value = markRaw(_provider);
      signer.value = markRaw(_signer);
    } else {
      console.error("Please install MetaMask!");
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
