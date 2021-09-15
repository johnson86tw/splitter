import { isAddress } from 'ethers/lib/utils'
import { ref } from 'vue'

type Payee = {
  address: string
  share: number
}

export default function usePayees() {
  const payees = ref<Payee[]>([])
  const address = ref('')
  const share = ref(1)
  const errMsg = ref('')

  const add = () => {
    errMsg.value = ''
    if (!address.value || !share.value || !isAddress(address.value)) {
      errMsg.value = 'invalid parameters'
      return
    }
    payees.value.push({ address: address.value, share: share.value })
    clearState()
  }

  const remove = (address: string) => {
    payees.value = payees.value.filter((payee) => payee.address !== address)
  }

  const clearState = () => {
    address.value = ''
    share.value = 1
  }

  return {
    payees,
    address,
    share,
    errMsg,
    add,
    remove,
    clearState,
  }
}
