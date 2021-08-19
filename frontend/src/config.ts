import { computed, ref, watch } from "vue";
import NETWORK from "./constants";
import { updateChainId, urlParams } from "./utils/url";

const isDev = import.meta.env.DEV;
const infuraApiKey = import.meta.env.VITE_INFURA_API_KEY;
// chain IDs supported by this app
const supportedChainIds = isDev ? [4, 5, 31337] : [4, 5]; // rinkeby, goerli

const appChainId = ref<number>(Number(urlParams.get("chainId")) || (isDev ? 31337 : 4));
if (isDev) console.log("appChainId: ", appChainId.value);

// init urlParams
if (!urlParams.has("chainId")) {
  updateChainId(appChainId.value);
  console.log("init url params");
}

const rpcURL = computed(() => {
  return appChainId.value === 31337
    ? "http://127.0.0.1:8545/"
    : `https://${NETWORK(appChainId.value)!.name}.infura.io/v3/${infuraApiKey}`;
});

const changeAppChainId = (chainId: number) => {
  if (isDev) console.log("app chain id changed to ", chainId);
  appChainId.value = chainId;
  updateChainId(appChainId.value);
};

export default function useConfig() {
  return {
    isDev,
    infuraApiKey,
    supportedChainIds,
    rpcURL,
    appChainId,
    changeAppChainId,
  };
}
