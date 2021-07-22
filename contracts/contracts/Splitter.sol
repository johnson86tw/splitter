//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "./PaymentSplitter.sol";

contract Splitter is PaymentSplitter {
    constructor(address[] memory _payees, uint256[] memory _shares) PaymentSplitter(_payees, _shares) {}

    function isPayee(address account) public view returns (bool) {
        return _shares[account] > 0;
    }

    function addPayee(address account, uint256 shares_) public {
        require(isPayee(account), "Splitter: only payee can add another payee");
        _addPayee(account, shares_);
    }
}
