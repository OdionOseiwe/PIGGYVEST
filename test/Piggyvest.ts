import {time,loadFixture,} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
const IUniswapV2Router02 = require('@uniswap/v2-periphery/build/IUniswapV2Router02.json')
import { expect } from "chai";
import { ethers } from "hardhat";
import { log } from "console";

describe("Piggyvest", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployPiggyvest() {
    const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
    const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const OD_testToken = await ethers.getContractFactory("OD_testToken");
    const od_testToken = await OD_testToken.deploy();

    const ODUSD = await ethers.getContractFactory("ODUSD");
    const odUSD = await ODUSD.deploy();

    const uRouter = new ethers.Contract('0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', IUniswapV2Router02.abi, owner);

    const Piggyvest = await ethers.getContractFactory("Piggyvest");
    const piggyvest = await Piggyvest.deploy(await od_testToken.getAddress(), await odUSD.getAddress());

    const Create_pool = await ethers.getContractFactory("Pool");
    const create_pool = await Create_pool.deploy();

    return { piggyvest, owner, otherAccount, odUSD, od_testToken, unlockTime, create_pool, uRouter};
    
  }

  describe("Deployment", function () {

    it("create a pool and liquidity", async function () {

      const { owner, create_pool, odUSD, od_testToken, uRouter } = await loadFixture(deployPiggyvest);
      const amount =  ethers.parseUnits("50","ether");
      const amount2 =  ethers.parseUnits("60","ether");

      owner.call( await od_testToken.approve(await uRouter.getAddress(), amount))
      owner.call(await odUSD.approve(await uRouter.getAddress(), amount2))
      owner.call( await create_pool.createPool(await od_testToken.getAddress(), await odUSD.getAddress(), owner )  ) 
   
    })

    // it("Should deploy Piggyvest and set timelock", async function () {
    //   const { piggyvest, owner, unlockTime } = await loadFixture(deployPiggyvest);
    //   owner.call( await piggyvest.changeTimeLock(unlockTime));      
    // });

    // it("Should revert when called with another address ", async function () {
    //   const { piggyvest, unlockTime, otherAccount } = await loadFixture(deployPiggyvest);

    //   await expect(otherAccount.call((await piggyvest.changeTimeLock(unlockTime))))
    //   .to.be.rejected
    // });

    // it("expect the timelock ro be set" , async function  () {
    //   const { piggyvest, unlockTime,otherAccount  } = await loadFixture(deployPiggyvest);
    //   otherAccount.call( await piggyvest.changeTimeLock(unlockTime));
    //   expect(await piggyvest.timeLock()).to.equal(unlockTime);
    // });
  });

  //describe("Transfers", function () {
  //     it("Should transfer the ether into the contract", async function () {
  //       const { piggyvest,otherAccount  } = await loadFixture(deployPiggyvest);

  //      otherAccount.call(await piggyvest.depositeEther( {value: ethers.parseUnits("1.0", 18)}));

  //     });

  //     it("Should transfer the ERC20 into the contract", async function () {
  //       const { piggyvest,otherAccount, testToken  } = await loadFixture(deployPiggyvest);
  //       await testToken.transfer(otherAccount, ethers.parseUnits("1.0", 18));

  //       expect(await testToken.balanceOf(otherAccount.address)).to.be.equal(ethers.parseUnits("1.0", 18));
  //       await testToken.approve(piggyvest.getAddress(),ethers.parseUnits("1.0", 18));
  //       otherAccount.call( await testToken.approve(piggyvest.getAddress(),ethers.parseUnits("1.0", 18)));

  //       await piggyvest.depositeERC20Tokens('1');
  //       otherAccount.call(await piggyvest.depositeERC20Tokens('1'))

  //       const bal =  await testToken.balanceOf(piggyvest.getAddress())
  //       console.log(`it is the balance of the piggyvest ${bal}`)
  //     });
  //   });

  // describe("Withdrawals", function () {
  //   describe("Events", function () {
  //     it("Should emit an event on withdrawals Ether", async function () {
  //       const { piggyvest, owner, unlockTime } = await loadFixture(deployPiggyvest);

  //       await time.increaseTo(unlockTime);

  //       await expect(piggyvest.withdrawEther())
  //         .to.emit(piggyvest, "withdrawal")
  //         .withArgs(owner.address,0 ) // We accept any value as `when` arg
  //     });

  //     it("Should emit an event on withdrawals ", async function () {
  //       const { piggyvest, owner, unlockTime } = await loadFixture(deployPiggyvest);

  //       await time.increaseTo(unlockTime);

  //       await expect(piggyvest.withdrawToken())
  //         .to.emit(piggyvest, "withdrawal")
  //         .withArgs(owner.address,0 ) // We accept any value as `when` arg
  //     });
  //   });
  // });
  
});
