import { defineStore } from 'pinia'
import { updateChainId, urlParams } from '../utils/url'
import { useVueDapp } from '@vue-dapp/core'
import { Signer, ethers } from 'ethers'

export const isDev = import.meta.env.DEV
export const infuraApiKey = import.meta.env.VITE_INFURA_API_KEY

type SupportedChainId = number

// chain IDs supported by this app
export const supportedChainIds: SupportedChainId[] = isDev
  ? [4, 5, 31337]
  : [4, 5] // rinkeby, goerli
export const supportedChainNames: { [key: SupportedChainId]: string } = {
  4: 'rinkeby',
  5: 'goerli',
  31337: 'localhost',
}

export const useDappStore = defineStore('DappStore', {
  state: (): {
    isConnectModalOpen: boolean
    appChainId: number | SupportedChainId
    provider: ethers.providers.Web3Provider | null
    signer: Signer | null
  } => ({
    isConnectModalOpen: false,
    appChainId: isDev ? 31337 : 4,
    provider: null,
    signer: null,
  }),
  getters: {
    currentChainName(): string {
      return supportedChainNames[this.appChainId]
    },
    rpcURL(): string {
      return this.appChainId === 31337
        ? 'http://127.0.0.1:8545/'
        : `https://${
            supportedChainNames[this.appChainId]
          }.infura.io/v3/${infuraApiKey}`
    },
    isSupportedNetwork(): boolean {
      const { chainId } = useVueDapp()
      return chainId.value ? supportedChainIds.includes(chainId.value) : true
    },
    unmatchedNetwork(): boolean {
      const { isConnected, chainId } = useVueDapp()
      return isConnected.value && chainId.value !== this.appChainId
    },
    supportedChainNames(): string[] {
      return supportedChainIds.map((id) => supportedChainNames[id])
    },
    supportedChainName(): string {
      let names: string[] = []
      supportedChainIds.forEach((id) => {
        names.push(supportedChainNames[id])
      })
      return names.join(', ')
    },
  },
  actions: {
    openConnectModal() {
      this.isConnectModalOpen = true
    },
    init() {
      const urlChainId = Number(urlParams.get('chainId'))
      if (urlParams.has('chainId')) {
        if (supportedChainIds.includes(urlChainId)) {
          this.appChainId = urlChainId
        } else {
          throw new Error('Unsupported chainId in the browser url.')
        }
      }

      !urlParams.has('chainId') && updateChainId(this.appChainId)
      isDev && console.log('appChainId: ', this.appChainId)
    },
    changeAppChainId(chainId: number) {
      if (isDev) console.log('app chain id changed to ', chainId)
      this.appChainId = chainId
      updateChainId(this.appChainId)
    },
  },
})
