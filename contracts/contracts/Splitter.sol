//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./PaymentSplitter.sol";

contract Splitter is PaymentSplitter {
    address public immutable owner;

    enum State {
        Waiting,
        Finalized
    }
    State public state = State.Waiting;

    event Finalized();

    constructor(
        address _owner,
        address[] memory _payees,
        uint256[] memory _shares
    ) PaymentSplitter(_payees, _shares) {
        owner = _owner;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Splitter: caller is not the owner");
        _;
    }

    modifier requireState(State _state) {
        require(state == _state, "Splitter: not in required state");
        _;
    }

    function totalPayees() public view returns (uint256) {
        return _payees.length;
    }

    function isPayee(address account) public view returns (bool) {
        return _shares[account] > 0;
    }

    function addPayee(address account, uint256 shares_) public onlyOwner requireState(State.Waiting) {
        _addPayee(account, shares_);
    }

    function finalize() public onlyOwner requireState(State.Waiting) {
        state = State.Finalized;
        emit Finalized();
    }
}
