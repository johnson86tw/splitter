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

  it("should release, and split balance evenly", async () => {
    await splitter.addPayee(signers[2].address, 1);
    await signers[0].sendTransaction({ to: splitter.address, value: parseEther("1") });
    expect(await provider.getBalance(splitter.address)).to.equal(parseEther("1"));

    const signer1Contract = splitter.connect(signers[1]);

    const signer1Before = await provider.getBalance(signers[1].address);
    const tx = await signer1Contract.release(signers[1].address);
    const receipt = await tx.wait();

    expect(
      (await provider.getBalance(signers[1].address)).sub(signer1Before).add(receipt.gasUsed.mul(tx.gasPrice!)),
    ).to.equal(parseEther("0.5"));

    // signer0 help release for signer2
    await splitter.release(signers[2].address);

    expect(await provider.getBalance(signers[2].address)).to.equal(parseEther("10000.5"));
  });
});
