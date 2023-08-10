// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import {IERC20} from  "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract Piggyvest is Ownable{
    IERC20 public  token_A;
    IERC20 public  token_B;

    uint32 public timeLock;

    address router = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;

    mapping(address => uint32) public userTokens;

    mapping(address => uint256) public etherAmount;

    event TransferTokenIn(address user, uint32 tokenId);

    event TransferEtherIn(address user, uint32 amount);

    event withdrawal(address user, uint32 amount);
    
    constructor( IERC20 _tokenA, IERC20 _tokenB){
        require(address(_tokenA) !=  address(0) , "Invalid address");
        require( address(_tokenB) !=  address(0), "invalid address");
        token_A = _tokenA;
        token_B = _tokenB;
    }

    modifier TimeLock() {
        require(block.timestamp > timeLock, "lock not reached");
        _;
    }

    ///@dev deposite ERC20 tokens into this contract
    function depositeERC20Tokens(uint32 amountTokens) public {
        bool sent = token_A.transferFrom(msg.sender, address(this), amountTokens);
        require(sent,'error while transfering token');
        userTokens[msg.sender] += amountTokens;
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
        uint32 amountIn = userTokens[msg.sender];
        require(amountIn > 0, "Did not deposit");
        address[] memory path = new address [](2);
        path[0] = address( token_A);
        path[1] = address( token_B);
        uint256 deadline = block.timestamp  + 100000 hours;
        uint256[] memory amountsOut = IUniswapV2Router02(router).getAmountsOut(amountIn, path);
        uint256  amountOutMin = amountsOut[1];
        IERC20(token_A).approve(address(router), amountIn);
        IUniswapV2Router02(router).swapExactTokensForTokens(amountIn,amountOutMin,path, msg.sender, deadline);
        userTokens[msg.sender] = 0;
        emit withdrawal(msg.sender,amountIn );
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


interface IUniswapV2Router02 {
    function factory() external pure returns (address);
    function WETH() external pure returns (address);

    function addLiquidity(
        address tokenA,
        address tokenB,
        uint amountADesired,
        uint amountBDesired,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external returns (uint amountA, uint amountB, uint liquidity);
    function addLiquidityETH(
        address token,
        uint amountTokenDesired,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external payable returns (uint amountToken, uint amountETH, uint liquidity);
    function removeLiquidity(
        address tokenA,
        address tokenB,
        uint liquidity,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external returns (uint amountA, uint amountB);
    function removeLiquidityETH(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external returns (uint amountToken, uint amountETH);
    function removeLiquidityWithPermit(
        address tokenA,
        address tokenB,
        uint liquidity,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline,
        bool approveMax, uint8 v, bytes32 r, bytes32 s
    ) external returns (uint amountA, uint amountB);
    function removeLiquidityETHWithPermit(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline,
        bool approveMax, uint8 v, bytes32 r, bytes32 s
    ) external returns (uint amountToken, uint amountETH);
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);
    function swapTokensForExactTokens(
        uint amountOut,
        uint amountInMax,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);
    function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline)
        external
        payable
        returns (uint[] memory amounts);
    function swapTokensForExactETH(uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline)
        external
        returns (uint[] memory amounts);
    function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)
        external
        returns (uint[] memory amounts);
    function swapETHForExactTokens(uint amountOut, address[] calldata path, address to, uint deadline)
        external
        payable
        returns (uint[] memory amounts);

    function quote(uint amountA, uint reserveA, uint reserveB) external pure returns (uint amountB);
    function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) external pure returns (uint amountOut);
    function getAmountIn(uint amountOut, uint reserveIn, uint reserveOut) external pure returns (uint amountIn);
    function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts);
    function getAmountsIn(uint amountOut, address[] calldata path) external view returns (uint[] memory amounts);
}
