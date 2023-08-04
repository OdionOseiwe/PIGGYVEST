// pragma solidity ^0.8.19;

// import {IERC20} from  "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// // 
// contract Pool  {

//     IUniswapV2Router02 factory02 = IUniswapV2Router02( 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f);
//     IUniswapV2Router02 router = IUniswapV2Router02( 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D);
//     uint256 amountADesired = 6000;
//     uint256 amountBDesired = 6000;

//     uint256 deadline = block.timestamp + 1 minutes;


//     function createPool(address tokenA, address tokenB, address provider) external  {
//        (bool success, bytes memory data) = address(router).delegatecall(
//         abi.encodeWithSignature(
//         "addLiquidity(address,address,uint256,uint256,uint256,uint256,address,uint256)",
//         tokenA,
//         tokenB,
//         amountADesired,
//         amountBDesired,
//         0,
//         0,
//         provider,
//         deadline
//         )   );
//         require(success, "add liquidity failed");

//         // pair = IUniswapV2Router02(factory02).createPair(tokenA, tokenB);
//     }
    


// }


// //  function addLiquidity() external onlyOwner() {
// //         IPancakeRouter02 _pancakeV2Router = IPancakeRouter02(0x10ED43C718714eb63d5aA57B78B54704E256024E);
// //         pancakeV2Router = _pancakeV2Router;
// //         _approve(address(this), address(pancakeV2Router), _tTotal);
// //         pancakeswapPair = IPancakeFactory(_pancakeV2Router.factory()).createPair(address(this), _pancakeV2Router.WETH());
// //         pancakeV2Router.addLiquidityETH{value: address(this).balance}(address(this),balanceOf(address(this)),0,0,owner(),block.timestamp);
// //         swapEnabled = true;
// //         liquidityAdded = true;
// //         feeEnabled = true;
// //         limitTX = true;
// //         _maxTxAmount = 100000 * 10**18;
// //         _maxBuyAmount = 10000 * 10**18; //1% buy cap
// //         IBEP20(pancakeswapPair).approve(address(pancakeV2Router),type(uint256).max);
// //     }


// interface IUniswapV2Router02{
//     function addLiquidity(
//         address tokenA,
//         address tokenB,
//         uint amountADesired,
//         uint amountBDesired,
//         uint amountAMin,
//         uint amountBMin,
//         address to,
//         uint deadline
//     ) external returns (uint amountA, uint amountB, uint liquidity);

//     function createPair(address tokenA, address tokenB) external returns (address pair);

// }