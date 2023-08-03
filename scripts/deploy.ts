import { log } from "console";
import { ethers } from "hardhat";

async function main() {

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

  let router = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
  await OD_testToken.approve(router, amount)
  await ODUSD.approve(router, amount)
  const Piggyvest = await ethers.deployContract("Piggyvest", [ await ODUSD.getAddress(), await OD_testToken.getAddress()]);

  console.log('deploying')

  const piggyvest =await Piggyvest.waitForDeployment();

  console.log("deployed")

  console.log("piggyvest address", await piggyvest.getAddress());
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


//0xc554C7Ad9f03Bc4ba7F364D240c19A880E0C8F04