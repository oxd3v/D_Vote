import { ethers } from "./Utilities&Tools/ether_web_Library.js";
// import { ethers } from "https://cdn.ethers.io/lib/ethers-5.2.esm.min.js";
import {
  abi,
  ContractAddrress,
} from "./Utilities&Tools/ContractInformation.js";
let VoteContract;
let voters = [];
let candidates = [];
let _VoteStatus;
let interval;
let getCandidate = new Map();
//HTML elements
const ConnectButton = document.getElementById("connectButton");
const voteStatus = document.getElementById("voteStatus");
const voterInput = document.getElementById("voters");
const VotersButton = document.getElementById("voterAddButton");
const CandidateButton = document.getElementById("candidateAddButton");
const candidateInput = document.getElementById("candidates");
const pinInput = document.getElementById("pinNumber");
const intervalInput = document.getElementById("interval");
const votestartButton = document.getElementById("startVoteButton");
const choosenCandidateInput = document.getElementById("choosenCandidate");
const choosenCandiateNameInput = document.getElementById("candidateName");
const voteButton = document.getElementById("voteButton");
const winnerButton = document.getElementById("winnerButton");
const winnerMessage = document.getElementById("winner");

//DOM operation
ConnectButton.onclick = connectMetamask;
VotersButton.onclick = addVoter;
CandidateButton.onclick = addCandidate;
votestartButton.onclick = voteStart;
voteButton.onclick = vote;
// voteStatus.innerHTML = await VoteContract.getStatus();
// winnerButton.onclick = getWinner;
/
//checking network and connection
if (typeof window.ethereum !== "undefined") {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const { name, chainId } = await provider.getNetwork();
  if (name) {
    console.log(name);
    console.log(await provider.getNetwork());
    await ethereum.request({ method: "eth_requestAccounts" });
    const signers = provider.getSigner();
    const Accounts = await signers.getAddress();
    console.log(Accounts);
    VoteContract = new ethers.Contract(ContractAddrress, abi, signers);
    _VoteStatus = await VoteContract.getStatus();

    VotersButton.innerHTML = `${voters.length} voter added`;
    CandidateButton.innerHTML = `${candidates.length} candidate added`;
  }
}
async function connectMetamask() {
  if (typeof window.ethereum !== "undefined") {
    await ethereum.request({ method: "eth_requestAccounts" });
  }
}

//checking duplicate voter
function _duplicatevoter(value) {
  const isAddress = ethers.utils.isAddress(value);
  if (isAddress == true) {
    for (let i = 0; i < voters.length; i++) {
      if (value == voters[i]) {
        return false;
      }
    }
  }
  return true;
}
voters.push("0x3Caf97F5Bd858B0D6B8c2135BB7781319d6B91ae");
candidates.push("rahim");

//checking candidates
function _duplicateCandidate(value) {
  for (let i = 0; i < candidates.length; i++) {
    if (value == candidates[i]) {
      return false;
    }
  }
  return true;
}

//addVoter function to interact with voterInput HTML Element
async function addVoter() {
  const state = await VoteContract.getStatus();
  console.log(state);
  const value = voterInput.value;
  console.log(value);
  const newValidVoter = _duplicatevoter(value);

  console.log(newValidVoter);
  if (newValidVoter == true && state == "enacting voting") {
    voters.push(value);
  }
  VotersButton.innerHTML = `${voters.length} voter added`;
  console.log(voters.length);
}
const stateNow = await VoteContract.getStatus();
console.log(stateNow);
//addCandidates function to interact with candidateINput HTML Element
async function addCandidate() {
  const state = await VoteContract.getStatus();
  console.log(state);
  const value = candidateInput.value;
  console.log(value);
  const newValidCandidate = _duplicateCandidate(value);
  console.log(newValidCandidate);

  if (newValidCandidate == true && state == "enacting voting") {
    candidates.push(value);
  }
  CandidateButton.innerHTML = `${candidates.length} candidate added`;
}

//function for start vote
async function voteStart() {
  const pin = pinInput.value;
  const votingInterval = intervalInput.value;
  console.log(pin);
  console.log(votingInterval);
  interval = votingInterval * 3600;
  console.log(interval);

  if (
    _VoteStatus == "enacting voting " &&
    voters.length > 1 &&
    candidates.length > 0 &&
    pin > 0 &&
    interval > 0
  ) {
    try {
      await VoteContract.startVote(candidates, voters, pin, interval);
      console.log("im from try scope");
    } catch (error) {
      console.log(error);
    }
  }
  for (let i = 0; i < candidates.length; i++) {
    getCandidate.set(candidates[i], await VoteContract.validCandidates(i));
  }
  voteStatus.innerHTML = await VoteContract.getStatus();
  _stateInitializing();
}

//stating intializing function
async function _stateInitializing() {
  setTimeout(() => {
    for (let i = 0; i < voters.length; i++) {
      voters.pop();
    }
    for (let i = 0; i < candidates.length; i++) {
      candidates.pop();
    }
  }, interval * 3600);
  interval = 0;
}

//function vote
async function vote() {
  const VotingEnded = await VoteContract.hasVotingEnded();
  const ChoosenCandidate = choosenCandidateInput.value; //input value of candidate Number
  console.log(ChoosenCandidate);
  const faw = await VoteContract.numberCandidate();
  console.log(faw.toNumber());
  const candidateName = choosenCandiateNameInput.value; //input candidate name
  const chosencandidateHash = getCandidate.get(candidateName); //getting value from map operation
  const { id, name, castedVote } = await VoteContract.CanidateInfo(
    ChoosenCandidate
  ); // getting candidateInfo by contract
  const VoterPin = await VoteContract.getVoterPin(); //getting voterPin hash
  console.log(VoterPin);
  console.log(id);
  console.log(name);
  if (
    VotingEnded == false &&
    chosencandidateHash == id &&
    name == candidateName
  ) {
    try {
      await VoteContract.Vote(id, VoterPin);
    } catch (error) {
      console.log(error);
    }
  }
  console.log(`successfully voted`);
}

//function getting winner
async function getWinner() {
  const hasVotingEnded = await VoteContract.hasVotingEnded();
  const state = await VoteContract.getStatus();
  const numberWinner = await VoteContract.numberWinner();

  if (hasVotingEnded == true && state == "enacting voting") {
    var winnerList = `winners are/is :`;
    for (let i = 0; i < numberWinner; i++) {
      winnerList.concat(` `, await VoteContract.winners(i));
    }
  }
  winnerMessage.innerHTML = winnerList;
}
