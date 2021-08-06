import { reactive, ref } from "vue";
import contractData from "@splitter/contracts/artifacts/contracts/Splitter.sol/Splitter.json";

const splitterAddress: Readonly<Record<string, string>> = {
  localhost: "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512",
};

const state = reactive({
  address: "",
  owner: "",
  totalReceived: 0,
  state: "",
  totalPayees: 0,
  payees: [
    {
      address: "efwef",
      share: 1,
      available: 0,
    },
    {
      address: "dff",
      share: 1,
      available: 0,
    },
  ],
});

export default function useSplitter() {
  return {
    state,
  };
}
