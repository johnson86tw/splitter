import { markRaw, reactive, ref } from "vue";
import artifact from "@splitter/contracts/artifacts/contracts/Splitter.sol/Splitter.json";
import { Splitter } from "@splitter/contracts/typechain/Splitter";
import { SplitterFactory } from "@splitter/contracts/typechain/SplitterFactory";
import { BigNumber, ContractFactory, ethers, Signer } from "ethers";
import useConfig from "@/config";
import { formatEther } from "ethers/lib/utils";

const { rpcURL } = useConfig();

const splitterAddress: Readonly<Record<string, string>> = {
  localhost: "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512",
  goerli: "0x8846C8134Ea3b5ab9e6641837c0B40b51FA4A338",
};

type Payee = {
  address: string;
  share: number;
  available: string;
};

const displayEther = (bn: BigNumber) => (+formatEther(bn)).toFixed(3);

export default function useSplitter() {
  const state = reactive({
    splitter: <Splitter | null>null,
    address: "",
    owner: "",
    totalReceived: "0",
    state: "",
    totalPayees: 0,
    totalShares: 1,
    payees: <Payee[]>[],
  });

  function clearState() {
    state.splitter = null;
    state.address = "";
    state.owner = "";
    state.totalReceived = "0";
    state.state = "";
    state.totalPayees = 0;
    state.totalShares = 1;
    state.payees = <Payee[]>[];
  }

  async function deploy(signer: Signer, owner: string, payees: string[], shares: number[]): Promise<string> {
    const splitterFactory = new ContractFactory(artifact.abi, artifact.bytecode, signer) as SplitterFactory;
    const splitter = (await splitterFactory.deploy(owner, payees, shares)) as Splitter;
    await splitter.deployed();
    return splitter.address;
  }

  async function fetch(address: string) {
    const provider = new ethers.providers.JsonRpcProvider(rpcURL.value);
    const splitter = new ethers.Contract(address, artifact.abi, provider) as Splitter;

    await splitter.deployed();

    const owner = await splitter.owner();
    const totalPayees = await splitter.totalPayees();
    const totalShares = await splitter.totalShares();

    const stateNum = await splitter.state();

    const balance = await provider.getBalance(address);
    const totalReleased = await splitter.totalReleased();
    const totalReceived = balance.add(totalReleased);

    let payees = <Payee[]>[];
    for (let i = 0; i < totalPayees.toNumber(); i++) {
      const address = await splitter.payee(BigNumber.from(i));
      const share = await splitter.shares(address);
      const available = totalReceived.mul(share).div(totalShares);

      const payee: Payee = {
        address,
        share: share.toNumber(),
        available: (+formatEther(available)).toFixed(3),
      };

      payees.push(payee);
    }

    state.splitter = markRaw(splitter);
    state.payees = payees;
    state.address = address;
    state.owner = owner;
    state.totalPayees = totalPayees.toNumber();
    state.totalShares = totalShares.toNumber();
    state.totalReceived = displayEther(totalReceived);
    switch (stateNum) {
      case 0:
        state.state = "Opening";
        break;
      case 1:
        state.state = "Finalized";
        break;
    }
  }

  async function addPayees(signer: Signer, address: string, payees: string[], shares: number[]) {
    const splitter = new ethers.Contract(address, artifact.abi, signer) as Splitter;
    await splitter.addPayees(payees, shares);
  }

  return {
    state,
    fetch,
    clearState,
    deploy,
    addPayees,
  };
}
