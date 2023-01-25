//importing required dependencies
const { expect } = require("chai");
const { ethers, network, upgrades } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");
//unit testing only for localhost or hardhat network
const chainId = network.config.chainId;
if (chainId != 31337) {
  describe.skip;
}

//wrtting test by mocha framwork
describe("Decentralize_voting_dapp_unit_testing", async () => {
  //state variables
  let D_vote;
  let voters = [];
  let CandidateIds = [];
  let VotingInterval;
  let nonVoter;
  let signers;
  // beforeEach hook for doing same operation for each test
  beforeEach(async () => {
    signers = await ethers.getSigners(); //getting signers object in signers Array
    //looping through signers Array assigning signer Addrress to voters Array as voter
    for (let i = 0; i < 5; i++) {
      voters[i] = signers[i].address;
    }
    nonVoter = signers[6].address; // creating nonvoter by signers object
    const maxNumberLIb = await ethers.getContractFactory("MaxNumberLib"); //library addrress
    const lib = await maxNumberLIb.deploy(); //deploy the dependent library
    console.log(
      ` D_vote contract dependent MaxNumberLib deployed at ${lib.address} address`
    );
    const D_Vote = await ethers.getContractFactory("Decentralized_Vote", {
      libraries: {
        MaxNumberLib: lib.address /**lib address of maxNumberLib.sol */,
      },
      unsafeAllow:
        "external-library-linking" /**ignoring unsafe external library linking in upgreadable contract */,
    });
    //deploying upgreadable Decentralize_Voting contract
    D_vote = await upgrades.deployProxy(D_Vote, []);
    await D_vote.deployed();
    console.log("DencentralizeVote deployed to ", D_vote.address);
  });
  describe("Voting enacting position test", () => {
    it("Voting initial state test", async () => {
      const D_vote_state = await D_vote.state();
      expect(D_vote_state).to.equal(0);
    });
  });
  describe("starting vote testing", function () {
    let D_voter1;
    let D_vote_nonVoter;

    beforeEach(async () => {
      //starting vote with specified candidates , voters, pin, votingPeriod interval
      VotingInterval = 300;
      await D_vote.startVote(
        ["rahim", "karim", "rahman"],
        voters,
        6850,
        VotingInterval
      );
      //connecting to a voter address with vote dapp;
      D_voter1 = await D_vote.connect(signers[0]);
      //connecting nonvoter with vote dapp
      D_vote_nonVoter = await D_vote.connect(nonVoter);
      //getting candidates id hash and pushing in candidatesIds array
      for (let i = 0; i < 3; i++) {
        CandidateIds[i] = await D_vote.validCandidates(i);
      }
      // const voter_n = await D_vote.validCandidates(0);
      // console.log(voter_n);
    });
    it("checking vote state after vote has start", async () => {
      expect(await D_vote.state()).to.equal(1);
    });
    it("checking candidates", async () => {
      const NumberOfCandidates = CandidateIds.length;
      expect(NumberOfCandidates).to.equal(3);
    });
    it("non-voter cant vote", async () => {
      await expect(D_vote_nonVoter.getVoterPin()).to.be.reverted;
    });
    it("voter can vote", async () => {
      const voter1 = voters[0];

      const voterPin = await D_voter1.getVoterPin();
      //getting candidate info
      const previousVoteCandidateInfo = await D_voter1.CanidateInfo(2); // 2 for rahman included voter
      //getting candidateHash from candidateInfo function
      const candidateId = previousVoteCandidateInfo[0];
      expect(await D_voter1.voterState(voter1)).to.equal(false);
      expect(await D_voter1.hasVotingEnded()).to.equal(false);
      //start voting
      await D_voter1.Vote(candidateId, voterPin);

      expect(await D_voter1.state()).to.equal(1);
      expect(await D_voter1.voterState(voter1)).to.equal(true);
      const afterVoteCandidateInfo = await D_voter1.CanidateInfo(2); // 2 for rahman included voter
      expect(afterVoteCandidateInfo[2].toNumber()).to.equal(
        previousVoteCandidateInfo[2].toNumber() + 1
      );
    });
  });
  describe("testting after vote ended", () => {
    let D_voter_contracts = [];
    let latestTime;
    beforeEach(async () => {
      D_voter_contracts[0] = await D_vote.connect(signers[1]);
      D_voter_contracts[1] = await D_vote.connect(signers[2]);
      D_voter_contracts[2] = await D_vote.connect(signers[3]);
      //starting vote with specified candidates , voters, pin, votingPeriod interval
      VotingInterval = 300;
      await D_vote.startVote(
        ["rahim", "karim", "rahman"],
        voters,
        6850,
        VotingInterval
      );
      //getting candidates id hash and pushing in candidatesIds array
      for (let i = 0; i < 3; i++) {
        CandidateIds[i] = await D_vote.validCandidates(i);
      }
      //vote by voter
      for (let i = 0; i < D_voter_contracts.length - 1; i++) {
        const pinHash = await D_voter_contracts[i].getVoterPin();
        await D_voter_contracts[i].Vote(CandidateIds[2], pinHash);
      }
      //increase the time to interval period
      await time.increase(VotingInterval + 1);
    });
    it("new voter cant vote after vote ended", async () => {
      console.log(await time.latest());
      const voterContract = await D_vote.connect(signers[4]);
      const pin = await voterContract.getVoterPin();
      await expect(voterContract.Vote(CandidateIds[1], pin)).to.be.reverted; // to test this custom error u need to install ethereum waffle along with harhat-waffle
    });
    it("chainlink Automate checkUpKeep function return true for upKeepNeeded", async () => {
      // const { upKeepNeeded } = await D_vote.callStatic.checkUpKeep("0x");
      const { upkeepNeeded } = await D_vote.callStatic.checkUpkeep("0x");
      expect(upkeepNeeded).to.equal(true);
    });
  });
  describe("counting vote after vote ended and initialize the state", () => {
    let D_voter_contracts = [];
    let latestTime;
    let choosenCandidate;
    beforeEach(async () => {
      latestTime = await time.latest();
      console.log(latestTime);
      D_voter_contracts[0] = await D_vote.connect(signers[1]);
      D_voter_contracts[1] = await D_vote.connect(signers[2]);
      D_voter_contracts[2] = await D_vote.connect(signers[3]);
      //starting vote with specified candidates , voters, pin, votingPeriod interval
      VotingInterval = 300;
      await D_vote.startVote(
        ["rahim", "karim", "rahman"],
        voters,
        6850,
        VotingInterval
      );
      //getting candidates id hash and pushing in candidatesIds array
      for (let i = 0; i < 3; i++) {
        CandidateIds[i] = await D_vote.validCandidates(i);
      }
      //vote by voter
      choosenCandidate = CandidateIds[2]; // rahman
      for (let i = 0; i < D_voter_contracts.length - 1; i++) {
        const pinHash = await D_voter_contracts[i].getVoterPin();
        await D_voter_contracts[i].Vote(choosenCandidate, pinHash);
      }
      //increase the time to interval period
      await time.increase(VotingInterval + 1);
      const { upkeepNeeded } = await D_vote.callStatic.checkUpkeep("0x");
      if (upkeepNeeded == true) {
        await D_vote.performUpkeep("0x");
      }
    });
    it("checking state of the vote equal to enacting position", async () => {
      const D_vote_state = await D_vote.state();
      expect(D_vote_state).to.equal(0);
    });
    it("got the winner from winners Array", async () => {
      const winner = await D_vote.winners(0);
      expect(winner).to.equal(choosenCandidate);
    });
    it("validCandidates array will be zero after counted Vote", async () => {
      const NumberCandidate = await D_vote.numberCandidate();
      expect(NumberCandidate).to.equal(0);
    });
    it("voted array will be zero after counted Vote", async () => {
      const NumberVoter = await D_vote.numberVoter();
      expect(NumberVoter).to.equal(0);
    });
  });
});
