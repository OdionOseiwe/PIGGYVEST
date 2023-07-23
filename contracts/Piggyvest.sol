// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import {IERC20} from  "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Piggyvest {
    address token;

    uint32 timeLock;

    mapping(address => uint32) UserTokenId;

    mapping(address => uint256) amount;

    event TransferTokenIn(address user, uint32 tokenId);

    event TransferetherIn(address user, uint32 amount);

    modifier timeLock() {
        require(block.timestamp)
    }
    
    constructor(address _token, uint32 _timeLock){
        token = _token;
        timeLock = _timeLock;
    }

    ///@dev deposite ERC20 tokens into this contract
    function depositeERC20Tokens(uint32 tokenId)  {
        bool sent = IERC20(token).transferFrom(msg.sender, address(this), tokenId);
        require(sent,'error while transfering token');
        UserTokenId[msg.sender] = tokenId;
        emit TransferTokenIn(msg.sender, tokenId);  
    }

    ///@dev deposite Ether into the contract
    function depositeEther() payable public {
        require(msg.value > 0, "zero amount");
        amount[msg.sender] =+ msg.value;
        emit TransferetherIn(msg.sender, msg.value);
    }

    ///@dev timelock for a specific time 
    function changeTimeLock() public{

    }

    ///@dev withdraw funds 
    function withdraw () public {
        
    }
}
