// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import {IERC20} from  "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IUniswapV2Factory} from "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import {IUniswapV2Router02} from "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";


contract Piggyvest is Ownable{
    IERC20 public token;

    uint32 public timeLock;

    address public router;

    mapping(address => uint32) UserTokens;

    mapping(address => uint256) etherAmount;

    event TransferTokenIn(address user, uint32 tokenId);

    event TransferEtherIn(address user, uint32 amount);

    event withdrawal(address user, uint32 amount);
    
    constructor(IERC20 _token, address _tokenA, address _tokenB, uint256 _tokenAamount, uint256 _tokenBamount){
        require(address(_token) !=  address(0), "Invalid address");
        token = _token;
        IUniswapV2Router02(router).addLiquidity(_tokenA,_tokenB,_tokenAamount,_tokenBamount, 0, 0, owner(), 10);
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
        require(_newtime > block.timestamp, "invalid time");
        timeLock = _newtime;
    }

    ///@dev withdraw tokens
    function withdrawToken () public TimeLock(){
        address  token_A; 
        address  token_B;
        uint32 tokens = UserTokens[msg.sender];
        require(tokens > 0, "Did not deposit");
        address[] memory path = new address [](2);
        path[0] = token_A;
        path[1] = token_B;
        IUniswapV2Router02(router).swapExactTokensForTokens(tokens,(tokens - 1 ** 18),path, msg.sender, (block.timestamp + 60));
        UserTokens[msg.sender] = 0;
        emit withdrawal(msg.sender,tokens );
    }

    ///@dev withdraw ether
    function withdrawEther() public TimeLock(){
        uint256 amount = etherAmount[msg.sender];
        require(amount > 0, "did not deposit");
        etherAmount[msg.sender] = 0;
        (bool sent,) = payable(msg.sender).call{value: amount}("");
        require(sent, "failed to send ether Out");
        emit withdrawal(msg.sender, uint32(amount));
    }


}
