import { isAddress } from "ethers/lib/utils";

export const shortenAddress = (address: string): string => {
  if (isAddress(address)) {
    return address.slice(0, 6) + "..." + address.slice(-4);
  } else {
    return "";
  }
};
