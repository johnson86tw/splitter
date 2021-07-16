import { computed, ref, readonly, markRaw } from "vue";
import Onboard from "bnc-onboard";
import { API as OnboardAPI } from "bnc-onboard/dist/src/interfaces";
import { JsonRpcProvider, JsonRpcSigner, Web3Provider, Network } from "@ethersproject/providers";
import { getAddress } from "@ethersproject/address";

const infuraApiKey = import.meta.env.VITE_INFURA_API_KEY;
const RPC_URL = `https://mainnet.infura.io/v3/${infuraApiKey}`;

const defaultProvider = new JsonRpcProvider(RPC_URL);

let onboard: OnboardAPI; // instance of Blocknative's onboard.js library
const supportedChainIds = [1, 4]; // chain IDs supported by this app
const rawProvider = ref<any>(); // raw provider from the user's wallet, e.g. EIP-1193 provider
const provider = ref<Web3Provider | JsonRpcProvider>(defaultProvider); // ethers provider
const signer = ref<JsonRpcSigner>(); // ethers signer
const userAddress = ref<string>(); // user's wallet address
const userEns = ref<string>(); // user's ENS name
const network = ref<Network>(); // connected network, derived from provider

const walletChecks = [{ checkName: "connect" }];

const wallets = [
  { walletName: "metamask", preferred: true },
  { walletName: "walletConnect", infuraKey: infuraApiKey, preferred: true },
  { walletName: "torus", preferred: true },
  { walletName: "ledger", rpcUrl: RPC_URL, preferred: true },
  { walletName: "lattice", rpcUrl: RPC_URL, appName: "Umbra" },
];

function formatAddress(address: string) {
  if (address.length !== 42) return null;
  return `${address.slice(0, 6)}...${address.slice(38)}`;
}

export default function useWalletStore() {
  // Initialize the onboard.js module
  function initializeOnboard() {
    onboard = Onboard({
      dappId: import.meta.env.VITE_BLOCKNATIVE_API_KEY as string | undefined,
      darkMode: false,
      networkId: 1,
      walletSelect: { wallets },
      walletCheck: walletChecks,
      subscriptions: {
        // On wallet connection, save wallet in local storage and set provider
        wallet: wallet => {
          setProvider(wallet.provider);
        },
        // On address or network change, re-run configureProvider
        address: async address => {
          console.log("address change");
          if (userAddress.value && userAddress.value !== getAddress(address)) {
            console.log("re-run configureProvider");
          }
        },
        network: async chainId => {
          console.log("network change");
          if (network.value?.chainId && network.value.chainId !== chainId) {
            console.log("re-run configureProvider");
          }
        },
      },
    });
  }

  /**
   * @notice Prompt user to connect wallet, or attempt to connect to wallet specified by `name`
   * @param name Wallet name to connect, or undefined to prompt user to select a wallet
   */
  async function connectWallet(name: string | undefined | MouseEvent = undefined) {
    // If user already connected wallet, return
    if (userAddress.value) return;

    // If input type is MouseEvent, this method was ran from clicking a DOM element, so set name to undefined
    if (name && typeof name !== "string" && "pageX" in name) name = undefined;

    // Otherwise, prompt them for connection / wallet change
    if (!onboard) initializeOnboard(); // instantiate Onboard instance
    onboard.walletReset(); // clear existing wallet selection
    await onboard.walletSelect(name); // wait for user to select wallet
    await onboard.walletCheck(); // run any specified checks
  }

  // ----------------------------------------------------- Actions -----------------------------------------------------

  // When user connects their wallet, we call this method to update the provider
  function setProvider(p: any) {
    rawProvider.value = p;
  }

  // ---------------------------------------------------- Exports ----------------------------------------------------
  // Define parts of the store to expose. Only expose computed properties or methods to avoid direct mutation of state
  return {
    connectWallet,
    setProvider,
    isSupportedNetwork: computed(() => (network.value ? supportedChainIds.includes(network.value.chainId) : true)), // assume valid if we have no network information
    network: computed(() => network.value),
    provider: computed(() => provider.value),
    signer: computed(() => signer.value),
    userAddress: computed(() => userAddress.value),
    userDisplayName: computed(() => userEns.value || formatAddress(userAddress.value || "")),
  };
}
