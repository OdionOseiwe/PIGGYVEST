import { log } from "console";
import { ethers } from "hardhat";

async function main() {

  const Testtoken = await ethers.deployContract("TestToken");

  console.log('deploying')

  await Testtoken.waitForDeployment();

  console.log('deployed', await Testtoken.getAddress());
  //////////////////////////////////////////////////

  const Piggyvest = await ethers.deployContract("Piggyvest", [ await Testtoken.getAddress()]);

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