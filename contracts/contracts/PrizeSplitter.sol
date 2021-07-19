//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract PriceSplitter {
    using EnumerableSet for EnumerableSet.AddressSet;

    // ======================================= STATE VARIABLES =======================================

    address public immutable owner;

    EnumerableSet.AddressSet private payees;
    mapping(address => bool) public isSpent;

    enum State {
        Waiting,
        Finalized,
        Withdrawable
    }
    State public state = State.Waiting;

    uint256 public division = 0;

    // ======================================= EVENTS =======================================

    event Finalized();
    event Withdrawable();
    event PrizeReceived(address, uint256);
    event PrizeWithdrawn(address, uint256);

    // ======================================= CONSTRUCTOR AND MODIFIERS =======================================

    constructor(address _owner, address[] memory _payees) {
        owner = _owner;
        for (uint256 i = 0; i < _payees.length; i++) {
            require(_payees[i] != address(0), "PrizeSplitter: account is the zero address");
            payees.add(_payees[i]);
        }
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "PrizeSplitter: caller is not the owner");
        _;
    }

    modifier requireState(State _state) {
        require(state == _state, "PrizeSplitter: not in required state");
        _;
    }

    // ======================================= METHODS =======================================

    // @todo how to emit event while receiving ERC20 token?
    receive() external payable {
        emit PrizeReceived(msg.sender, msg.value);
    }

    function totalPayees() public view returns (uint256) {
        return payees.length();
    }

    function checkPayee(uint256 _index) public view returns (address) {
        return payees.at(_index);
    }

    function isPayee(address _payee) public view returns (bool) {
        return payees.contains(_payee);
    }

    // @todo add check payee with address

    function addPayee(address _payee) public onlyOwner requireState(State.Waiting) {
        require(_payee != address(0), "PrizeSplitter: account is the zero address");
        bool success = payees.add(_payee);
        require(success, "PrizeSplitter: fail to add payee");
    }

    function removePayee(address _payee) public onlyOwner requireState(State.Waiting) {
        require(_payee != address(0), "PrizeSplitter: account is the zero address");
        bool success = payees.remove(_payee);
        require(success, "PrizeSplitter: fail to remove the payee");
    }

    function finalize() public onlyOwner requireState(State.Waiting) {
        state = State.Finalized;
        emit Finalized();
    }

    function enableWithdraw() public onlyOwner requireState(State.Finalized) {
        require(!isSpent[msg.sender], "PrizeSplitter: account is spent");
        (, division) = SafeMath.tryDiv(address(this).balance, payees.length());
        state = State.Withdrawable;
        emit Withdrawable();
    }

    function withdrawPrize(address payable _recipient) public requireState(State.Withdrawable) {
        require(division > 0, "PrizeSplitter: division is zero");
        require(payees.contains(_recipient), "PrizeSplitter: caller is not payee");

        (bool success, ) = _recipient.call{value: division}("");
        require(success, "PrizeSplitter: payment to _recipient did not go thru");
        isSpent[_recipient] = true;
        emit PrizeWithdrawn(_recipient, division);
    }

    function withdrawAll() public onlyOwner requireState(State.Withdrawable) {
        require(isLiquidated(), "PrizeSplitter: not yet liquidation");
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success, "PrizeSplitter: payment to owner did not go thru");
    }

    function isLiquidated() public view requireState(State.Withdrawable) returns (bool) {
        for (uint256 i = 0; i < payees.length(); i++) {
            if (!isSpent[payees.at(i)]) {
                return false;
            }
        }
        return true;
    }
}
