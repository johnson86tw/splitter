# Splitter
Splitter is a smart contract as a shared wallet only for receiving funds. It splits funds in proportion among recipients added by the contract owner.

It's built on top of PaymentSplitter from Openzeppelin. People can deploy their own Splitter contract.

For example of some use cases,
- a hackathon team want to split prizes from sponsors to the team members,
- or a recipient project team want to split funds from CLR.

## Rules of the Contract
- Deployer can set the parameters about the owner, initial payees, and the shares.
- Only owner can add recipients, and set the recipients' shares.
- Only owner can finalize the state of the contract. 
- Once finalized, owner cannot add another recipient, so that the payout are fixed.
- Once finalized, recipients can withdraw their payment.

## Tech-stack
- Hardhat
- Typescript
- Vue 3 + Vite + [vue-dapp](https://github.com/chnejohnson/vue-dapp)
- Yarn workspace

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
yarn dev:node
```
4. Deploy contract and run frontend server
```
yarn dev
```


## Resources
This project is heavily inspired by [Splits - Youtube](https://www.youtube.com/watch?v=0Uy2u9mTWSI), and the following awesome projects:

### Contracts
- [Splits - ETHGlobal](https://showcase.ethglobal.co/hackmoney2021/splits)
- [PaymentSplitter - OpenZeppelin](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/finance/PaymentSplitter.sol)
- [matching_contracts - gitcoin](https://github.com/gitcoinco/matching_contracts)

### Frontend

#### vue3
- [vue-tailwind-ethereum-template](https://github.com/chnejohnson/vue-tailwind-ethereum-template)
- [vue-composable](https://github.com/pikax/vue-composable/blob/master/packages/vue-composable/src/web/webSocket.ts)
- [web3model-vue](https://github.com/SmallRuralDog/web3modal-vue)
- [vue3-eth](https://github.com/samatechtw/vue3-eth)

#### react
- [useDapp tutorial-1](https://dev.to/jacobedawson/build-a-web3-dapp-in-react-login-with-metamask-4chp)
- [useDapp tutorial-2](https://dev.to/jacobedawson/send-react-web3-dapp-transactions-via-metamask-2b8n)
- [useDapp - 中文教學](https://limaois.me/archives/293)
- [web3modal](https://github.com/Web3Modal/web3modal)


### Monorepo
#### About yarn workspaces
- https://classic.yarnpkg.com/en/docs/workspaces/

#### Add dependencies
- `yarn workspace @splitter/frontend add <package>`

#### Setup power by
- Hardhat: `npx hardhat`
- Vite: `yarn create vite`

