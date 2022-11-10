// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
//import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract stuERC721 is ERC721 {

    mapping(address => bool) awardPlayerList;

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {

    }

    function awardPlayer() external {
        require(awardPlayerList[msg.sender] == false, "This user has awarded already");
        _mint(msg.sender, 10);
        awardPlayerList[msg.sender] = true;
    }

}