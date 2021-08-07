//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./PaymentSplitter.sol";

contract Splitter is PaymentSplitter {
    address public immutable owner;

    enum State {
        Opening,
        Finalized
    }
    State public state = State.Opening;

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

    function addPayee(address account, uint256 shares_) public onlyOwner requireState(State.Opening) {
        _addPayee(account, shares_);
    }

    function addPayees(address[] memory payees, uint256[] memory shares_) public onlyOwner requireState(State.Opening) {
        for (uint256 i = 0; i < payees.length; i++) {
            _addPayee(payees[i], shares_[i]);
        }
    }

    function finalize() public onlyOwner requireState(State.Opening) {
        state = State.Finalized;
        emit Finalized();
    }

    // override: only Finalized state can release
    function release(address payable account) public override requireState(State.Finalized) {
        require(_shares[account] > 0, "Splitter: account has no shares");

        uint256 totalReceived = address(this).balance + _totalReleased;
        uint256 payment = (totalReceived * _shares[account]) / _totalShares - _released[account];

        require(payment != 0, "Splitter: account is not due payment");

        _released[account] = _released[account] + payment;
        _totalReleased = _totalReleased + payment;

        Address.sendValue(account, payment);
        emit PaymentReleased(account, payment);
    }
}
