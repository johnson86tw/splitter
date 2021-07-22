import { ref, computed, markRaw } from "vue";
import { JsonRpcProvider, JsonRpcSigner, Web3Provider, Network } from "@ethersproject/providers";
import { BigNumber, ethers, utils } from "ethers";
const isDev = import.meta.env.DEV;

declare global {
  interface Window {
    ethereum?: MetaMaskProvider; // must use "?" for browser without metamask
  }
}

interface MetaMaskProvider {
  isMetaMask: boolean;
  isConnected: () => boolean;
  request: (request: { method: string; params?: any[] | undefined }) => Promise<any>;
  on: (event: string, callback: (param: any) => void) => void;
}

interface ProviderRpcError extends Error {
  message: string;
  code: number;
  data?: unknown;
}

let initailized = false;

// states
const provider = ref<JsonRpcProvider | Web3Provider>();
const signer = ref<JsonRpcSigner>();
const userAddress = ref("");
const network = ref<Network>();
const balance = ref<BigNumber>();

// chain IDs supported by this app
const supportedChainIds = isDev ? [4, 5, 31337] : [4, 5]; // rinkeby, goerli

// watch this so that you can detect signer and chainId changed
const hasSetupWallet = ref(false);

// @todo how about add this state?
const connectError = ref<string>();

function clearState() {
  provider.value = undefined;
  signer.value = undefined;
  userAddress.value = "";
  network.value = undefined;
  balance.value = undefined;

  hasSetupWallet.value = false;
}

// execute every time while component using
export default function useMetaMask() {
  // init useMetaMask just once while creating this app
  if (!initailized && window.ethereum && window.ethereum.isMetaMask) {
    window.ethereum.on("chainChanged", chainId => {
      console.log("chain changed");
      _handleChainChanged(chainId);
    });

    // note: it will emit when metamask locking or unlocking
    window.ethereum.on("accountsChanged", accounts => {
      console.log("accounts changed");
      _handleAccountsChanged(accounts);
    });

    // note: it will emit while changing into unavailable localhost network
    window.ethereum.on("disconnect", error => {
      _handleDisconnect(error);
    });

    // @todo "on" getting metamask tx receipt

    // @dev auto connect if user have been connected to the site,
    // but how to handle async/await error?
    // if (isConnected()) {
    //   console.log("is conneted to MetaMask");
    //   connectWallet();
    // }
    initailized = true;
  }

  function isConnected() {
    return window.ethereum && window.ethereum.isConnected();
  }

  // should get the eth balance with specific chainId and account
  async function connectWallet() {
    connectError.value = "";

    if (window.ethereum && window.ethereum.isMetaMask) {
      hasSetupWallet.value = false;
      console.log("connecting wallet...");

      const _provider = new ethers.providers.Web3Provider(window.ethereum);
      const _signer = _provider.getSigner();

      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
      } catch (e) {
        clearState();
        connectError.value = "fail to request MetaMask";
        return;
      }

      // get provider and signer first
      provider.value = markRaw(_provider);
      signer.value = markRaw(_signer);

      try {
        // and then get network
        network.value = await _provider.getNetwork();

        // check network is supported
        if (!supportedChainIds.includes(network.value.chainId)) {
          console.log("unsupported network");
          return;
        }

        userAddress.value = await _signer.getAddress();
        balance.value = await _signer.getBalance();
      } catch (e) {
        // clearState is important here, let us check if the wallet is set up in component.
        // otherwise, it's hard to detect error in connectWallet.
        clearState();
        connectError.value = "fail to connect wallet";
        return;
      }

      hasSetupWallet.value = true;
      console.log("has set up wallet with signer and network: ", await signer.value.getAddress(), network.value.name);
    } else {
      connectError.value = "Please install MetaMask!";
    }
  }

  async function getBalance() {
    balance.value = await signer.value?.getBalance();
  }
  // event handler
  // provider should reload for new chainId
  function _handleChainChanged(chainId: number) {
    clearState();
    connectWallet();
  }

  // should re-connect wallet
  function _handleAccountsChanged(accounts: Array<string>) {
    clearState();
    connectWallet();
  }

  function _handleDisconnect(error: ProviderRpcError) {
    clearState();
    throw new Error(error.message);
  }

  // computed
  const etherBalance = computed(() => {
    if (balance.value) {
      return utils.formatEther(balance.value);
    }
    return "0.0";
  });

  // assume valid if we have no network information
  const isSupportedNetwork = computed(() => (network.value ? supportedChainIds.includes(network.value.chainId) : true));

  return {
    hasSetupWallet,
    isSupportedNetwork,
    supportedChainIds,
    userAddress,
    provider,
    signer,
    chainId: computed(() => network.value?.chainId),
    balance,
    etherBalance,
    connectError,
    connectWallet,
    getBalance,
    isConnected,
  };
}
