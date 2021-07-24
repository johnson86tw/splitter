import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { formatEther, parseEther } from "ethers/lib/utils";
import { ethers } from "hardhat";
const { provider, utils } = ethers;
import { Splitter } from "../typechain/Splitter";
import { SplitterFactory } from "../typechain/SplitterFactory";

let splitterFactory: SplitterFactory;
let splitter: Splitter;

let signers: SignerWithAddress[];

const getBalance = async (address: string) => await provider.getBalance(address);

before(async () => {
  splitterFactory = (await ethers.getContractFactory("Splitter")) as SplitterFactory;
});

beforeEach(async function () {
  signers = await ethers.getSigners();
  splitter = await splitterFactory.deploy(signers[0].address, [signers[1].address], [1]);
});

describe("Splitter", () => {
  it("should have owner", async () => {
    expect(await splitter.owner()).to.equal(signers[0].address);
  });

  it("should emit event when Spitter receive ether", async () => {
    await signers[1].sendTransaction({ to: splitter.address, value: 10000 });
    const eventFilter = splitter.filters.PaymentReceived(null, null);
    const event = await splitter.queryFilter(eventFilter);
    expect(event[0].args!["amount"]).to.equal(10000);
  });

  it("should release, and split balance by shares", async () => {
    const A = signers[1].address;
    const B = signers[2].address;

    await splitter.addPayee(B, 3);

    // send 1 ETH into contract
    await signers[0].sendTransaction({ to: splitter.address, value: parseEther("1") });
    expect(await provider.getBalance(splitter.address)).to.equal(parseEther("1"));

    await splitter.finalize();

    const signer1Contract = splitter.connect(signers[1]);
    const before = await getBalance(A);
    // release A: 1 * (1/4) = 0.25
    const tx = await signer1Contract.release(A);
    const receipt = await tx.wait();

    expect((await provider.getBalance(A)).sub(before).add(receipt.gasUsed.mul(tx.gasPrice!))).to.equal(
      parseEther("0.25"),
    );

    // release B: 1 * (3/4) = 0.75
    await splitter.release(B);
    expect(await getBalance(B)).to.equal(parseEther("10000.75"));
  });

  it("should not add a new payee when state is finalized", async () => {
    const A = signers[3].address;
    const B = signers[4].address;
    const C = signers[5].address;
    const deployer = signers[0].address;

    expect(await getBalance(A)).to.equal(parseEther("10000"));
    expect(await getBalance(B)).to.equal(parseEther("10000"));
    expect(await getBalance(C)).to.equal(parseEther("10000"));

    // deploy new contract with initial shares
    splitter = await splitterFactory.deploy(deployer, [A, B], [1, 1]);

    // send 100 into contract
    await signers[0].sendTransaction({ to: splitter.address, value: parseEther("100") });
    expect(await getBalance(splitter.address)).to.equal(parseEther("100"));

    await splitter.finalize();

    // release B at first
    await splitter.release(B);
    expect(await getBalance(B)).to.equal(parseEther("10050"));

    // C added with shares 2
    await expect(splitter.addPayee(C, 2)).revertedWith("Splitter: not in required state");

    // release A, C
    await splitter.release(A);
    expect(await getBalance(A)).to.equal(parseEther("10050"));
  });
});
