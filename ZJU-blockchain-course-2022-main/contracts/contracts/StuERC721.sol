// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
//import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
contract stuERC721 is ERC721 {
    using Counters for Counters.Counter;
    mapping(address => bool) awardPlayerList;
    Counters.Counter private tokenIDs;
    constructor() ERC721("GameItem","ITM") {

    }

    function awardPlayer() external {
        tokenIDs.increment();
        require(awardPlayerList[msg.sender] == false, "This user has awarded already");
        uint256 newItemId=tokenIDs.current();
        _mint(msg.sender, newItemId);
        awardPlayerList[msg.sender] = true;
    }

}