/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
} from "ethers";
import {
  Contract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "@ethersproject/contracts";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";

interface PriceSplitterInterface extends ethers.utils.Interface {
  functions: {
    "addPayee(address)": FunctionFragment;
    "checkPayee(uint256)": FunctionFragment;
    "division()": FunctionFragment;
    "enableWithdraw()": FunctionFragment;
    "finalize()": FunctionFragment;
    "isLiquidated()": FunctionFragment;
    "isPayee(address)": FunctionFragment;
    "isSpent(address)": FunctionFragment;
    "owner()": FunctionFragment;
    "removePayee(address)": FunctionFragment;
    "state()": FunctionFragment;
    "totalPayees()": FunctionFragment;
    "withdrawAll()": FunctionFragment;
    "withdrawPrize(address)": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "addPayee", values: [string]): string;
  encodeFunctionData(
    functionFragment: "checkPayee",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "division", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "enableWithdraw",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "finalize", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "isLiquidated",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "isPayee", values: [string]): string;
  encodeFunctionData(functionFragment: "isSpent", values: [string]): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(functionFragment: "removePayee", values: [string]): string;
  encodeFunctionData(functionFragment: "state", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "totalPayees",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawAll",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawPrize",
    values: [string]
  ): string;

  decodeFunctionResult(functionFragment: "addPayee", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "checkPayee", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "division", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "enableWithdraw",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "finalize", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "isLiquidated",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "isPayee", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "isSpent", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "removePayee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "state", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "totalPayees",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "withdrawAll",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "withdrawPrize",
    data: BytesLike
  ): Result;

  events: {
    "Finalized()": EventFragment;
    "PrizeReceived(address,uint256)": EventFragment;
    "PrizeWithdrawn(address,uint256)": EventFragment;
    "Withdrawable()": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Finalized"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "PrizeReceived"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "PrizeWithdrawn"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Withdrawable"): EventFragment;
}

export class PriceSplitter extends Contract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  on(event: EventFilter | string, listener: Listener): this;
  once(event: EventFilter | string, listener: Listener): this;
  addListener(eventName: EventFilter | string, listener: Listener): this;
  removeAllListeners(eventName: EventFilter | string): this;
  removeListener(eventName: any, listener: Listener): this;

  interface: PriceSplitterInterface;

  functions: {
    addPayee(
      _payee: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "addPayee(address)"(
      _payee: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    checkPayee(
      _index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<{
      0: string;
    }>;

    "checkPayee(uint256)"(
      _index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<{
      0: string;
    }>;

    division(overrides?: CallOverrides): Promise<{
      0: BigNumber;
    }>;

    "division()"(overrides?: CallOverrides): Promise<{
      0: BigNumber;
    }>;

    enableWithdraw(overrides?: Overrides): Promise<ContractTransaction>;

    "enableWithdraw()"(overrides?: Overrides): Promise<ContractTransaction>;

    finalize(overrides?: Overrides): Promise<ContractTransaction>;

    "finalize()"(overrides?: Overrides): Promise<ContractTransaction>;

    isLiquidated(overrides?: CallOverrides): Promise<{
      0: boolean;
    }>;

    "isLiquidated()"(overrides?: CallOverrides): Promise<{
      0: boolean;
    }>;

    isPayee(
      _payee: string,
      overrides?: CallOverrides
    ): Promise<{
      0: boolean;
    }>;

    "isPayee(address)"(
      _payee: string,
      overrides?: CallOverrides
    ): Promise<{
      0: boolean;
    }>;

    isSpent(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<{
      0: boolean;
    }>;

    "isSpent(address)"(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<{
      0: boolean;
    }>;

    owner(overrides?: CallOverrides): Promise<{
      0: string;
    }>;

    "owner()"(overrides?: CallOverrides): Promise<{
      0: string;
    }>;

    removePayee(
      _payee: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "removePayee(address)"(
      _payee: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    state(overrides?: CallOverrides): Promise<{
      0: number;
    }>;

    "state()"(overrides?: CallOverrides): Promise<{
      0: number;
    }>;

    totalPayees(overrides?: CallOverrides): Promise<{
      0: BigNumber;
    }>;

    "totalPayees()"(overrides?: CallOverrides): Promise<{
      0: BigNumber;
    }>;

    withdrawAll(overrides?: Overrides): Promise<ContractTransaction>;

    "withdrawAll()"(overrides?: Overrides): Promise<ContractTransaction>;

    withdrawPrize(
      _recipient: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;

    "withdrawPrize(address)"(
      _recipient: string,
      overrides?: Overrides
    ): Promise<ContractTransaction>;
  };

  addPayee(_payee: string, overrides?: Overrides): Promise<ContractTransaction>;

  "addPayee(address)"(
    _payee: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  checkPayee(_index: BigNumberish, overrides?: CallOverrides): Promise<string>;

  "checkPayee(uint256)"(
    _index: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  division(overrides?: CallOverrides): Promise<BigNumber>;

  "division()"(overrides?: CallOverrides): Promise<BigNumber>;

  enableWithdraw(overrides?: Overrides): Promise<ContractTransaction>;

  "enableWithdraw()"(overrides?: Overrides): Promise<ContractTransaction>;

  finalize(overrides?: Overrides): Promise<ContractTransaction>;

  "finalize()"(overrides?: Overrides): Promise<ContractTransaction>;

  isLiquidated(overrides?: CallOverrides): Promise<boolean>;

  "isLiquidated()"(overrides?: CallOverrides): Promise<boolean>;

  isPayee(_payee: string, overrides?: CallOverrides): Promise<boolean>;

  "isPayee(address)"(
    _payee: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  isSpent(arg0: string, overrides?: CallOverrides): Promise<boolean>;

  "isSpent(address)"(arg0: string, overrides?: CallOverrides): Promise<boolean>;

  owner(overrides?: CallOverrides): Promise<string>;

  "owner()"(overrides?: CallOverrides): Promise<string>;

  removePayee(
    _payee: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "removePayee(address)"(
    _payee: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  state(overrides?: CallOverrides): Promise<number>;

  "state()"(overrides?: CallOverrides): Promise<number>;

  totalPayees(overrides?: CallOverrides): Promise<BigNumber>;

  "totalPayees()"(overrides?: CallOverrides): Promise<BigNumber>;

  withdrawAll(overrides?: Overrides): Promise<ContractTransaction>;

  "withdrawAll()"(overrides?: Overrides): Promise<ContractTransaction>;

  withdrawPrize(
    _recipient: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  "withdrawPrize(address)"(
    _recipient: string,
    overrides?: Overrides
  ): Promise<ContractTransaction>;

  callStatic: {
    addPayee(_payee: string, overrides?: CallOverrides): Promise<void>;

    "addPayee(address)"(
      _payee: string,
      overrides?: CallOverrides
    ): Promise<void>;

    checkPayee(
      _index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    "checkPayee(uint256)"(
      _index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    division(overrides?: CallOverrides): Promise<BigNumber>;

    "division()"(overrides?: CallOverrides): Promise<BigNumber>;

    enableWithdraw(overrides?: CallOverrides): Promise<void>;

    "enableWithdraw()"(overrides?: CallOverrides): Promise<void>;

    finalize(overrides?: CallOverrides): Promise<void>;

    "finalize()"(overrides?: CallOverrides): Promise<void>;

    isLiquidated(overrides?: CallOverrides): Promise<boolean>;

    "isLiquidated()"(overrides?: CallOverrides): Promise<boolean>;

    isPayee(_payee: string, overrides?: CallOverrides): Promise<boolean>;

    "isPayee(address)"(
      _payee: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    isSpent(arg0: string, overrides?: CallOverrides): Promise<boolean>;

    "isSpent(address)"(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    owner(overrides?: CallOverrides): Promise<string>;

    "owner()"(overrides?: CallOverrides): Promise<string>;

    removePayee(_payee: string, overrides?: CallOverrides): Promise<void>;

    "removePayee(address)"(
      _payee: string,
      overrides?: CallOverrides
    ): Promise<void>;

    state(overrides?: CallOverrides): Promise<number>;

    "state()"(overrides?: CallOverrides): Promise<number>;

    totalPayees(overrides?: CallOverrides): Promise<BigNumber>;

    "totalPayees()"(overrides?: CallOverrides): Promise<BigNumber>;

    withdrawAll(overrides?: CallOverrides): Promise<void>;

    "withdrawAll()"(overrides?: CallOverrides): Promise<void>;

    withdrawPrize(_recipient: string, overrides?: CallOverrides): Promise<void>;

    "withdrawPrize(address)"(
      _recipient: string,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    Finalized(): EventFilter;

    PrizeReceived(undefined: null, undefined: null): EventFilter;

    PrizeWithdrawn(undefined: null, undefined: null): EventFilter;

    Withdrawable(): EventFilter;
  };

  estimateGas: {
    addPayee(_payee: string, overrides?: Overrides): Promise<BigNumber>;

    "addPayee(address)"(
      _payee: string,
      overrides?: Overrides
    ): Promise<BigNumber>;

    checkPayee(
      _index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "checkPayee(uint256)"(
      _index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    division(overrides?: CallOverrides): Promise<BigNumber>;

    "division()"(overrides?: CallOverrides): Promise<BigNumber>;

    enableWithdraw(overrides?: Overrides): Promise<BigNumber>;

    "enableWithdraw()"(overrides?: Overrides): Promise<BigNumber>;

    finalize(overrides?: Overrides): Promise<BigNumber>;

    "finalize()"(overrides?: Overrides): Promise<BigNumber>;

    isLiquidated(overrides?: CallOverrides): Promise<BigNumber>;

    "isLiquidated()"(overrides?: CallOverrides): Promise<BigNumber>;

    isPayee(_payee: string, overrides?: CallOverrides): Promise<BigNumber>;

    "isPayee(address)"(
      _payee: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isSpent(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    "isSpent(address)"(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    "owner()"(overrides?: CallOverrides): Promise<BigNumber>;

    removePayee(_payee: string, overrides?: Overrides): Promise<BigNumber>;

    "removePayee(address)"(
      _payee: string,
      overrides?: Overrides
    ): Promise<BigNumber>;

    state(overrides?: CallOverrides): Promise<BigNumber>;

    "state()"(overrides?: CallOverrides): Promise<BigNumber>;

    totalPayees(overrides?: CallOverrides): Promise<BigNumber>;

    "totalPayees()"(overrides?: CallOverrides): Promise<BigNumber>;

    withdrawAll(overrides?: Overrides): Promise<BigNumber>;

    "withdrawAll()"(overrides?: Overrides): Promise<BigNumber>;

    withdrawPrize(
      _recipient: string,
      overrides?: Overrides
    ): Promise<BigNumber>;

    "withdrawPrize(address)"(
      _recipient: string,
      overrides?: Overrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    addPayee(
      _payee: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "addPayee(address)"(
      _payee: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    checkPayee(
      _index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "checkPayee(uint256)"(
      _index: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    division(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "division()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    enableWithdraw(overrides?: Overrides): Promise<PopulatedTransaction>;

    "enableWithdraw()"(overrides?: Overrides): Promise<PopulatedTransaction>;

    finalize(overrides?: Overrides): Promise<PopulatedTransaction>;

    "finalize()"(overrides?: Overrides): Promise<PopulatedTransaction>;

    isLiquidated(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "isLiquidated()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    isPayee(
      _payee: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "isPayee(address)"(
      _payee: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isSpent(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "isSpent(address)"(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "owner()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    removePayee(
      _payee: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "removePayee(address)"(
      _payee: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    state(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "state()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    totalPayees(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    "totalPayees()"(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    withdrawAll(overrides?: Overrides): Promise<PopulatedTransaction>;

    "withdrawAll()"(overrides?: Overrides): Promise<PopulatedTransaction>;

    withdrawPrize(
      _recipient: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;

    "withdrawPrize(address)"(
      _recipient: string,
      overrides?: Overrides
    ): Promise<PopulatedTransaction>;
  };
}