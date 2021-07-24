import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Splitter } from "../typechain/Splitter";
import { SplitterFactory } from "../typechain/SplitterFactory";

let splitterFactory: SplitterFactory;
let splitter: Splitter;

let signers: SignerWithAddress[];

before(async () => {
  splitterFactory = (await ethers.getContractFactory("Splitter")) as SplitterFactory;
  signers = await ethers.getSigners();
});

beforeEach(async function () {
  splitter = await splitterFactory.deploy(signers[0].address, [signers[1].address], [1]);
});

describe("Splitter", () => {
  it("should deploy", async () => {
    expect(await splitter.owner()).to.equal(signers[0].address);
  });

  // @todo should emit event when Splitter receive ether
});
