# Prize Splitter
The contract is for hackathon team to evenly split prize from sponsors.

## Tech-stack
- vite
- hardhat
- typescript
- yarn workspace

## References
This project is heavily inspired by the following awesome projects.

### contracts
- https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/finance/PaymentSplitter.sol
- https://github.com/gitcoinco/matching_contracts

### frontend
#### vue3 with metamask
- vue-composable https://github.com/pikax/vue-composable/blob/master/packages/vue-composable/src/web/webSocket.ts
- useDapp: https://limaois.me/archives/293
- web3model-vue: https://github.com/SmallRuralDog/web3modal-vue
- vue-tailwind-ethereum-template: https://github.com/chnejohnson/vue-tailwind-ethereum-template
- vue3-eth: https://github.com/samatechtw/vue3-eth

#### metamask
- docs: https://docs.metamask.io/guide/getting-started.html#basic-considerations
- detect-provider: https://github.com/MetaMask/detect-provider/blob/main/src/index.ts

### monorepo architecture
#### yarn workspaces
- `yarn install` for install all dependencies
- `yarn test:contracts` for testing contract
- `yarn dev:vue` for running vite localhost

ref: https://classic.yarnpkg.com/en/docs/workspaces/

#### add dependencies
- `yarn workspace @prize-splitter/frontend add <package> --dev`

#### initial set up
- `npx hardhat`
- `yarn create vite`