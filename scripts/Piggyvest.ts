import { log } from "console";
import { ethers } from "hardhat";

async function main() {

  const Testtoken = await ethers.deployContract("TestToken");

  console.log('deploying')

  await Testtoken.waitForDeployment();

  console.log('deployed');

  const Piggyvest = await ethers.deployContract("Piggyvest", [Testtoken.getAddress()]);

  console.log('deploying')

  const piggyvest =await Piggyvest.waitForDeployment();

  console.log(piggyvest);

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
})};
