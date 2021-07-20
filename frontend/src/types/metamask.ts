interface MetaMaskProvider {
  isMetaMask: boolean;
  isConnected: () => boolean;
  request: (request: { method: string; params?: any[] | undefined }) => Promise<any>;
  on: (event: string, callback: (param: any) => void) => void;
}

interface ProviderRpcError extends Error {
  message: string;
  code: number;
  data?: unknown;
}
