// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "./StuERC20.sol";
import "./StuERC721.sol";
// Uncomment this line to use console.log
 //import "hardhat/console.sol";

// vote costs 1
// create costs 3
// pass wins all points
// initial 10 points
// every person limit 3 votes on every proposal
contract StudentSocietyDAO {
    // use a event if you want
    event ProposalInitiated(uint256 proposalIndex);
    event ProposalVote(
        address voter,
        uint256 proposalIndex,
        bool if_agree,
        uint256 times
    );
    uint256 public constant CREATE_AMOUNT = 3;
    uint256 public constant VOTE_AMOUNT = 1;
    struct Proposal {
        uint256 index; // index of this proposal
        address proposer; // who make this proposal
        uint256 endTime; // proposal duration
        string name; // proposal name
        uint256 agree;
        uint256 against;
        bool pass;
        mapping(address => uint16) voteCount;
    }
    uint16 public countProposal;
    stuERC20 public studentERC20;
    stuERC721 public studentERC721;
    mapping(uint256 => Proposal) public proposals;
    mapping(address=>uint256) public passCount;
    constructor() {
        studentERC20 = new stuERC20("ZjuToken", "zt");
        studentERC721 = new stuERC721();
    }

    function createProposal(uint256 end, string memory name) public {
        require(
            studentERC20.balanceOf(msg.sender) >= 3,
            "insufficient balance"
        );
        Proposal storage p = proposals[countProposal];
        p.index = countProposal;
        p.agree = 0;
        p.against = 0;
        p.name = name;
        p.endTime = end;
        p.pass = false;
        p.proposer=msg.sender;
        countProposal++;
        //消耗钱
        studentERC20.transferFrom(msg.sender, address(this), CREATE_AMOUNT);
        emit ProposalInitiated(p.index);
    }

    function vote(uint256 index, uint256 time) public returns (uint256) {
        require(index < countProposal, "invalid proposal index");
        require(proposals[index].endTime >= time, "proposal has expired");
        require(
            proposals[index].endTime >= time,
            "you can only vote on a proposal 3 times"
        );
        require(
            studentERC20.balanceOf(msg.sender) >= 1,
            "insufficient balance"
        );
        proposals[index].agree++;
        proposals[index].voteCount[msg.sender]++;
        studentERC20.transferFrom(msg.sender, address(this), VOTE_AMOUNT);
        emit ProposalVote(
            msg.sender,
            index,
            true,
            proposals[index].voteCount[msg.sender]
        );
        return proposals[index].agree;
    }

    function voteAgainst(uint256 index, uint256 time) public returns (uint256) {
        require(index < countProposal, "invalid proposal index");
        require(proposals[index].endTime >= time, "proposal has expired");
        require(
            proposals[index].voteCount[msg.sender] < 3,
            "you can only vote on a proposal 3 times"
        );
        require(
            studentERC20.balanceOf(msg.sender) >= 1,
            "insufficient balance"
        );
        proposals[index].against++;
        proposals[index].voteCount[msg.sender]++;
        studentERC20.transferFrom(msg.sender, address(this), VOTE_AMOUNT);
        emit ProposalVote(
            msg.sender,
            index,
            false,
            proposals[index].voteCount[msg.sender]
        );
        return proposals[index].against;
    }

    function endTime(uint256 index) public view returns (uint256) {
        return proposals[index].endTime;
    }

    function ifPass(uint256 index) public view returns (bool) {
        return proposals[index].pass;
    }

    function fPassCount(address index) public view returns(uint256){
        return (passCount[index]);
    }
    function expire(uint256 index) public {
        if (
            proposals[index].agree > proposals[index].against &&
            proposals[index].pass == false
        ) {
            studentERC20.transfer(
                proposals[index].proposer,
                proposals[index].agree + CREATE_AMOUNT
            );
            passCount[proposals[index].proposer]++;
        }
        proposals[index].pass = true;
    }
}
