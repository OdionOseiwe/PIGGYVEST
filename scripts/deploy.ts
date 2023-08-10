import { log } from "console";
import { ethers } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";

async function main() {
  const [owner, otherAccount] = await ethers.getSigners();

  const OD_testToken = await ethers.deployContract("OD_testToken");

  console.log('deploying')

  await OD_testToken.waitForDeployment();

  console.log('deployed', await OD_testToken.getAddress());

  //////token USD

  const ODUSD = await ethers.deployContract("ODUSD");

  console.log('deploying')

  await ODUSD.waitForDeployment();

  console.log('deployed', await ODUSD.getAddress());


  ////////////////////////piggvest//////////////////////////

  const amount = ethers.parseUnits("20", 18);
  const tokensAmount = 100000000

  const Piggyvest = await ethers.deployContract("Piggyvest",[await OD_testToken.getAddress(),  await ODUSD.getAddress()]);

  console.log('deploying')

  const piggyvest =await Piggyvest.waitForDeployment();

  console.log("deployed")

  console.log("piggyvest address", await piggyvest.getAddress());

  ///add liquidity
  const uRouter = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';

  const amountIn = 100;
  const amountOutMin = 1;
  const deadline = Math.floor(Date.now() / 1000);

  const ROUTER = await ethers.getContractAt(
    "IUniswap",
    uRouter,
);

console.log("approving");


      await OD_testToken.approve(uRouter, amount);
      await ODUSD.approve(uRouter, amount);
      console.log("adding liquidity");

      const bal12 =await OD_testToken.balanceOf(owner.address)

      console.log("before adding liquidity for OD_testToken", bal12);

      const bal14 =await ODUSD.balanceOf(owner.address)

      console.log("before adding liquidity for ODUSD", bal14);

      await ROUTER.addLiquidity(await OD_testToken.getAddress(), await ODUSD.getAddress(),amount, amount, 0,0,await owner.getAddress(), deadline)

      console.log("finishing adding liquidity");

       ////////checking the balances/////////////////////

      const bal1 =await ODUSD.balanceOf(owner.address)

      console.log("after adding liquidity for ODUSD", bal1);

      const bal2 =await OD_testToken.balanceOf(owner.address)

      console.log("after adding liquidity OD_testToken", bal2);


      ///////////////depositing tokens/////////////////

      console.log("depositing ");

      await OD_testToken.approve(await piggyvest.getAddress(), tokensAmount);

      await piggyvest.depositeERC20Tokens(tokensAmount);

      ////////checking the balances/////////////////////

      const bal4 =await ODUSD.balanceOf(owner.address)

      console.log("after depositing into piggyvest ODUSD", bal4);

      const bal5 =await OD_testToken.balanceOf(owner.address)

      console.log("after depositing into piggyvest OD_testToken", bal5);

      const bal10 =await ODUSD.balanceOf(await piggyvest.getAddress())

      console.log("balance of piggyvest and withdrawing of ODUSD", bal10);

      console.log("setting changeTimeLock");

      const currentTime = await time.latest()

      console.log(currentTime, "current time now");
      
      await piggyvest.changeTimeLock(1881019824);

      //////////////////increasing time/////////////////////

      await time.increaseTo( 1881019824 + currentTime);

      const newCurrentTime = await time.latest()
      console.log(newCurrentTime, "latest time");
      
      //////////////withdrawing tokens////////////////////

      console.log("withdrawing");

      await piggyvest.withdrawToken();

      ////////checking the balances/////////////////////

      const bal =await ODUSD.balanceOf(owner.address)

      console.log("balance of owner after withdrawing of ODUSD", bal);

      const bal8 =await OD_testToken.balanceOf(owner.address)

      console.log("balance of owner and withdrawing of OD_testToken", bal8);

      console.log("finished withdrawing");   
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


//0xc554C7Ad9f03Bc4ba7F364D240c19A880E0C8F04