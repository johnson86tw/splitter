# Splitter
Splitter is a smart contract for receiving funds, and split them in proportion among recipients added by the contract owner.

It's built on top of PaymentSplitter from Openzeppelin. People can deploy their own Splitter contract in order to split payment from payers to a set of payees' addresses.

For example of some use cases,
- a hackathon team want to split prizes from sponsors to the team members,
- or a team registered as a Gitcoin Grant want to split funds from contributors to the team members.

## Rules of the Contract
- Deployer can decide the owner, initial payees, and the shares.
- Only owner can add payee, and set the shares.
- Only owner can finalize the state of the contract.
- When it comes to be finalized, owner cannot add another payee, so that the number of the payees and the allocation are fixed.
- Only finalized, payees can withdraw their payment.

## Tech-stack
- vite
- hardhat
- typescript
- yarn workspace

## Development
In the project root `./splitter`

1. Install workspaces dependencies
```
yarn
```
2. Compile contracts and typechain
```
yarn build:contracts
```
3. Run hardhat network on http://localhost:8545 with chainID 31337
```
yarn start:node
```

4. Run frontend dev
```
yarn dev
```

5. Deploy default contract to hardhat network
```
yarn deploy:local
```


## References
This project is heavily inspired by [HackMoney 2021 - Splits](https://www.youtube.com/watch?v=0Uy2u9mTWSI), and the following awesome projects.

### contracts
- Splits: https://github.com/wminshew/splits
- PaymentSplitter: https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/finance/PaymentSplitter.sol
- matching_contracts: https://github.com/gitcoinco/matching_contracts

### frontend

#### react
- useDapp tutorial-1: https://dev.to/jacobedawson/build-a-web3-dapp-in-react-login-with-metamask-4chp
- useDapp tutorial-2: https://dev.to/jacobedawson/send-react-web3-dapp-transactions-via-metamask-2b8n
- useDapp: https://limaois.me/archives/293

#### vue3
- vue-tailwind-ethereum-template: https://github.com/chnejohnson/vue-tailwind-ethereum-template
- vue-composable: https://github.com/pikax/vue-composable/blob/master/packages/vue-composable/src/web/webSocket.ts
- web3model-vue: https://github.com/SmallRuralDog/web3modal-vue
- vue3-eth: https://github.com/samatechtw/vue3-eth

#### metamask
- docs: https://docs.metamask.io/guide/getting-started.html#basic-considerations
- json-rpc-api https://metamask.github.io/api-playground/api-documentation/#wallet_addEthereumChain
- detect-provider: https://github.com/MetaMask/detect-provider/blob/main/src/index.ts

## Monorepo Architecture
### Yarn workspaces
- https://classic.yarnpkg.com/en/docs/workspaces/

### Add dependencies
- `yarn workspace @splitter/frontend add <package> --dev`

### Project's initial set up
- `npx hardhat`
- `yarn create vite`