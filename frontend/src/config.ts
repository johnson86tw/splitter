import { watch } from "vue";

const isDev = import.meta.env.DEV;
const infuraApiKey = import.meta.env.VITE_INFURA_API_KEY;
// chain IDs supported by this app
const supportedChainIds = isDev ? [4, 5, 31337] : [4, 5]; // rinkeby, goerli

const rpcURL = isDev ? "http://127.0.0.1:8545/" : "";

export default function useConfig() {
  return {
    isDev,
    infuraApiKey,
    supportedChainIds,
    rpcURL,
  };
}
