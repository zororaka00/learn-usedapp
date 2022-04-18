// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Tes {
    uint256 public index;

    mapping(uint256 => string) public names;

    function addNames(string memory _name) external {
        names[index] = _name;
        index++;
    }
}