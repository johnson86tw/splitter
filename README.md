# Prize Splitter
The contract is for hackathon team to evenly split prize from sponsors.

## contracts
- https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/finance/PaymentSplitter.sol
- https://github.com/gitcoinco/matching_contracts

## frontend
### vue3 with metamask
- https://limaois.me/archives/293
- https://github.com/SmallRuralDog/web3modal-vue
- https://github.com/chnejohnson/vue-tailwind-ethereum-template
- https://github.com/samatechtw/vue3-eth
- https://docs.metamask.io/guide/getting-started.html#basic-considerations

## monorepo architecture

### yarn workspaces
- `yarn install` for install all dependencies
- `yarn test:contracts` for testing contract
- `yarn dev:vue` for running vite localhost

ref: https://classic.yarnpkg.com/en/docs/workspaces/

### add dependencies
- `yarn workspace @prize-splitter/frontend add <package> --dev`

### initial set up
- `npx hardhat`
- `yarn create vite`