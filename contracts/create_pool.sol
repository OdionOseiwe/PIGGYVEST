pragma solidity ^0.8.19;

contract Pool  {

    IUniswapV2Router02 router = IUniswapV2Router02( 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D);
    uint256 amountADesired = 50000000000000000000;
    uint256 amountBDesired = 60000000000000000000;

    uint256 deadline = block.timestamp + 1 minutes;


    function createPool(address tokenA, address tokenB, address provider) external returns(uint amount_A, uint amount_B, uint liquidity){
        (uint amount_A, uint amount_B, uint liquidity) = router.addLiquidity(tokenA, tokenB,amountADesired, amountBDesired, 0, 0, provider, deadline);
    }
}


interface IUniswapV2Router02{
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
}