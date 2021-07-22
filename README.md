# Splitter
Splitter is built on top of PaymentSplitter from Openzeppelin. People can deploy their own Splitter contract in order to split payment from a third party to the members added in this contract with specific shares.

For example of some use cases,
- a hackathon team want to split prizes from sponsors to the team members,
- or a team registed as a Gitcoin Grant want to split funds from contributors to the team members.

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
3. Open a terminal and run hardhat network on http://localhost:8545 with chainID 31337
```
yarn start:node
```
4. Open another terminal and run frontend dev
```
yarn dev
```

## References
This project is heavily inspired by the following awesome projects.

### contracts
- splits: https://github.com/wminshew/splits
- PaymentSplitter: https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/finance/PaymentSplitter.sol
- matching_contracts: https://github.com/gitcoinco/matching_contracts

### frontend
#### vue3 with metamask
- vue-composable: https://github.com/pikax/vue-composable/blob/master/packages/vue-composable/src/web/webSocket.ts
- useDapp: https://limaois.me/archives/293
- web3model-vue: https://github.com/SmallRuralDog/web3modal-vue
- vue-tailwind-ethereum-template: https://github.com/chnejohnson/vue-tailwind-ethereum-template
- vue3-eth: https://github.com/samatechtw/vue3-eth

#### metamask
- docs: https://docs.metamask.io/guide/getting-started.html#basic-considerations
- detect-provider: https://github.com/MetaMask/detect-provider/blob/main/src/index.ts

### Monorepo Architecture
#### Yarn workspaces
- https://classic.yarnpkg.com/en/docs/workspaces/

#### Add dependencies
- `yarn workspace @splitter/frontend add <package> --dev`

#### Project's initial set up
- `npx hardhat`
- `yarn create vite`