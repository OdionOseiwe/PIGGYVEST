// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import {IERC20} from  "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract Piggyvest is Ownable{
    IERC20 public token;

    uint32 public timeLock;

    mapping(address => uint32) UserTokens;

    mapping(address => uint256) etherAmount;

    event TransferTokenIn(address user, uint32 tokenId);

    event TransferEtherIn(address user, uint32 amount);

    event withdrawal(address user, uint32 amount);
    
    constructor(IERC20 _token){
        token = _token;
    }

    modifier TimeLock() {
        require(block.timestamp > timeLock, "lock not reached");
        _;
    }

    ///@dev deposite ERC20 tokens into this contract
    function depositeERC20Tokens(uint32 amountTokens) public {
        bool sent = token.transferFrom(msg.sender, address(this), amountTokens);
        require(sent,'error while transfering token');
        UserTokens[msg.sender] += amountTokens;
        emit TransferTokenIn(msg.sender, amountTokens);  
    }

    ///@dev deposite Ether into the contract
    function depositeEther() payable public {
        require(msg.value > 0, "zero amount");
        etherAmount[msg.sender] += msg.value;
        emit TransferEtherIn(msg.sender, uint32(msg.value));
    }

    ///@dev timelock for a specific time 
    function changeTimeLock(uint32 _newtime) public onlyOwner{
        timeLock = _newtime;
    }

    ///@dev withdraw funds 
    function withdrawToken () public TimeLock(){
        uint32 tokens = UserTokens[msg.sender];
        bool sent = token.transfer(address(this), tokens); 
        require(sent, 'failed to send tokens out');
        UserTokens[msg.sender] = 0;
        emit withdrawal(msg.sender,tokens );
    }

    function withdrawEther() public TimeLock(){
        uint256 amount = etherAmount[msg.sender];
        (bool sent,) = payable(msg.sender).call{value: amount}("");
        require(sent, "failed to send ether Out");
        etherAmount[msg.sender] = 0;
        emit withdrawal(msg.sender, uint32(amount));
    }
}
