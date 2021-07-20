import { ref, computed, markRaw } from "vue";
import { JsonRpcProvider, JsonRpcSigner, Web3Provider, Network } from "@ethersproject/providers";
import { BigNumber, ethers, utils } from "ethers";

declare global {
  interface Window {
    ethereum: MetaMaskProvider;
  }
}

let initailized = false;

// states
const provider = ref<JsonRpcProvider | Web3Provider>();
const signer = ref<JsonRpcSigner>();
const userAddress = ref("");
const network = ref<Network>();
const balance = ref<BigNumber>();

// @todo how about add this state?
const errorMsg = ref<string>();

// events
const chainChangedEvent = ref<number>();
const accountsChangedEvent = ref<Array<string>>();

function clearState() {
  provider.value = undefined;
  signer.value = undefined;
  userAddress.value = "";
  network.value = undefined;
  balance.value = undefined;
}

// execute every time while component using
export default function useWallet() {
  // init useWallet
  if (!initailized) {
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

    if (isConnected()) {
      console.log("is conneted to MetaMask");
      connectWallet();
    }
    initailized = true;
  }

  function isConnected() {
    return window.ethereum && window.ethereum.isConnected();
  }

  // should get the eth balance with specific chainId and account
  async function connectWallet() {
    if (window.ethereum && window.ethereum.isMetaMask) {
      const _provider = new ethers.providers.Web3Provider(window.ethereum);
      const _signer = _provider.getSigner();

      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
      } catch (e) {
        clearState();
        throw new Error("fail to request MetaMask");
      }

      try {
        network.value = await _provider.getNetwork();
        userAddress.value = await _signer.getAddress();
        balance.value = await _signer.getBalance();
      } catch (e) {
        clearState();
        throw new Error("fail to connect wallet");
      }

      provider.value = markRaw(_provider);
      signer.value = markRaw(_signer);
    } else {
      throw new Error("Please install MetaMask!");
    }
  }
  // event handler
  // provider should reload for new chainId
  function _handleChainChanged(chainId: number) {
    chainChangedEvent.value = chainId;
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }

  // should re-connect wallet
  function _handleAccountsChanged(accounts: Array<string>) {
    accountsChangedEvent.value = accounts;
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

  const changedChainId = computed(() => {
    if (chainChangedEvent.value) {
      return parseInt(chainChangedEvent.value.toString(), 16);
    }
    return 0;
  });

  return {
    isConnected,
    connectWallet,
    userAddress,
    provider,
    signer,
    chainId: computed(() => network.value?.chainId),
    balance,
    chainChangedEvent,
    etherBalance,
    changedChainId,
  };
}
