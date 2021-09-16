import { computed, ref } from 'vue'
import { useEthers, ChainId, CHAIN_NAMES, displayChainName } from 'vue-dapp'
import { updateChainId, urlParams } from './utils/url'

const isDev = import.meta.env.DEV
const infuraApiKey = import.meta.env.VITE_INFURA_API_KEY

type SupportedChainId = keyof typeof CHAIN_NAMES

// chain IDs supported by this app
const supportedChainIds = isDev ? [4, 5, 31337] : [4, 5] // rinkeby, goerli
const appChainId = ref<number | SupportedChainId>(isDev ? 31337 : 4)

const urlChainId = Number(urlParams.get('chainId'))
if (urlParams.has('chainId')) {
  if (urlChainId in ChainId) {
    appChainId.value = urlChainId
  } else {
    throw new Error('Unsupported chainId in the browser url.')
  }
}

!urlParams.has('chainId') && updateChainId(appChainId.value)
isDev && console.log('appChainId: ', appChainId.value)

const { network, isActivated } = useEthers()

export default function useConfig() {
  function changeAppChainId(chainId: number) {
    if (isDev) console.log('app chain id changed to ', chainId)
    appChainId.value = chainId
    updateChainId(appChainId.value)
  }

  const rpcURL = computed(() => {
    return appChainId.value === 31337
      ? 'http://127.0.0.1:8545/'
      : `https://${displayChainName(
          appChainId.value,
        )}.infura.io/v3/${infuraApiKey}`
  })

  // assume valid if we have no network information
  const isSupportedNetwork = computed(() =>
    network.value ? supportedChainIds.includes(network.value.chainId) : true,
  )

  const unmatchedNetwork = computed(
    () => isActivated.value && network.value?.chainId !== appChainId.value,
  )

  const supportedChainNames = computed(() => {
    return supportedChainIds.map((id) => displayChainName(id))
  })

  const supportedChainName = computed(() => {
    let names: string[] = []
    supportedChainIds.forEach((id) => {
      names.push(displayChainName(id))
    })
    return names.join(', ')
  })

  return {
    isDev,
    infuraApiKey,
    supportedChainIds,
    rpcURL,
    appChainId,
    isSupportedNetwork,
    unmatchedNetwork,
    supportedChainNames,
    supportedChainName,
    changeAppChainId,
  }
}
