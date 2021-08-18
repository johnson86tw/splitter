import { useLocalStorage } from "vue-composable";

export type SearchAddress = {
  address: string;
  chainId: number;
};

const key = "splitter_history";

export default function useHistory() {
  const { storage } = useLocalStorage<SearchAddress[]>(key);
  if (!storage.value) storage.value = [];

  const add = (searchAddress: SearchAddress) => {
    if (storage.value.find(s => s.address === searchAddress.address && s.chainId === searchAddress.chainId)) return;
    storage.value.push(searchAddress);
  };

  const remove = (index: number) => {
    storage.value = storage.value.filter((_, i) => i !== index);
  };

  return {
    storage,
    add,
    remove,
  };
}
