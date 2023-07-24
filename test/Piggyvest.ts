import {time,loadFixture,} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
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

    const TestToken = await ethers.getContractFactory("TestToken");
    const testToken = await TestToken.deploy();

    const Piggyvest = await ethers.getContractFactory("Piggyvest");
    const piggyvest = await Piggyvest.deploy(testToken.getAddress());

    return { piggyvest, owner, otherAccount, testToken, unlockTime};
    
  }

  describe("Deployment", function () {

    it("Should deploy Piggyvest and set timelock", async function () {
      const { piggyvest, owner, unlockTime } = await loadFixture(deployPiggyvest);
      owner.call( await piggyvest.changeTimeLock(unlockTime));      
    });

    it("Should revert when called with another address ", async function () {
      const { piggyvest, unlockTime, otherAccount } = await loadFixture(deployPiggyvest);

      await expect(otherAccount.call((await piggyvest.changeTimeLock(unlockTime))))
      .to.be.revertedWith
    });

    it("expect the timelock ro be set" , async function  () {
      const { piggyvest, unlockTime,otherAccount  } = await loadFixture(deployPiggyvest);
      otherAccount.call( await piggyvest.changeTimeLock(unlockTime));
      expect(await piggyvest.timeLock()).to.equal(unlockTime);
    });
  });

      describe("Transfers", function () {
      it("Should transfer the ether into the contract", async function () {
        const { piggyvest,otherAccount  } = await loadFixture(deployPiggyvest);

       otherAccount.call(await piggyvest.depositeEther( {value: ethers.parseUnits("1.0", 18)}));

      });
    });

  // describe("Withdrawals", function () {
  //   describe("Events", function () {
  //     it("Should emit an event on withdrawals", async function () {
  //       const { piggyvest, owner, unlockTime } = await loadFixture(deployPiggyvest);

  //       await time.increaseTo(unlockTime);

  //       await expect(lock.withdraw())
  //         .to.emit(lock, "Withdrawal")
  //         .withArgs(lockedAmount, anyValue); // We accept any value as `when` arg
  //     });
  //   });
  // });
  
});
