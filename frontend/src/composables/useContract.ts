import { Interface } from '@ethersproject/abi'
import { ref } from 'vue'
import useConfig from '@/config'
import { Contract } from '@ethersproject/contracts'
import { Transaction } from '@ethersproject/transactions'
import { TransactionReceipt } from '@ethersproject/abstract-provider'
import { JsonRpcSigner } from '@ethersproject/providers'

const { isDev } = useConfig()

type State = {
  status: 'None' | 'Exception' | 'Mining' | 'Success' | 'Fail'
  transaction: Transaction
  receipt: TransactionReceipt
}

const signer = ref<JsonRpcSigner>()

function useContractCall(
  abi: Interface,
  address: string,
  method: string,
  args: any[] = [],
) {
  if (isDev) console.log('useContractCall')

  const errMsg = ref('')

  if (!signer.value) {
    errMsg.value = 'signer not found'
  }
  const contract = new Contract(address, abi, signer.value)

  const data = contract[method](...args)

  return {
    errMsg,
    data,
  }
}

function useContractFunction(contract: Contract, method: string, args?: []) {
  if (isDev) console.log('useContractFunction')
}
