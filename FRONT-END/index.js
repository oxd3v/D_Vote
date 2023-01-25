//importing required file and project to interact with Voting dapp
import { ethers } from "./Utilities&Tools/ether_web_Library.js";
import {
  abi,
  ContractAddrress,
} from "./Utilities&Tools/ContractInformation.js";

//variable declaration
let D_voteContract;
let voteId = 500;
const voteInfoById = new Map();
let Voters = [];
let Candidates = [];
const candidatesByName = new Map();
var interval;
//blockchain connection variable
var provider;
var signers;
var Account;

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
ConnectButton.innerHTML = `connect your evm based wallet`;
ConnectButton.onclick = connectMetamask;
VotersButton.innerHTML = `${Voters.length} voter added`;
CandidateButton.innerHTML = `${Candidates.length} candidates added`;
VotersButton.onclick = addVoter;
CandidateButton.onclick = addCandidate;
votestartButton.onclick = voteStart;
voteButton.onclick = vote;
winnerButton.onclick = getWinner;

//checking metamask and connection
if (typeof window.ethereum !== "undefined") {
  provider = new ethers.providers.Web3Provider(window.ethereum); //blockchain node provider
  const { name, chainId } = await provider.getNetwork(); //getting network by provider
  signers = provider.getSigner(); // get signer wallet
  D_voteContract = new ethers.Contract(ContractAddrress, abi, signers); // getting contract by contract adress , contract abi, signer of deploye address
  Account = await signers.getAddress(); //getting address of wallet of signer
  ConnectButton.innerHTML = `you are connected with ${name} network`;
  voteStatus.innerHTML = await D_voteContract.getStatus();
}

//connect metamask button
async function connectMetamask() {
  if (typeof window.ethereum !== "undefined") {
    const { name, chainId } = await provider.getNetwork();
    await ethereum.request({ method: "eth_requestAccounts" });
    ConnectButton.innerHTML = `you are connected on ${name} network at ${Account} address`;
  }
}

//voter and candidate authentiction and duplication error checking
//checking duplicate voter
function _duplicatevoter(value) {
  const isAddress = ethers.utils.isAddress(value);
  if (isAddress == true) {
    for (let i = 0; i < Voters.length; i++) {
      if (value == Voters[i]) {
        return false;
      }
    }
  }
  return true;
}

//checking candidates
function _duplicateCandidate(value) {
  for (let i = 0; i < Candidates.length; i++) {
    if (value == Candidates[i]) {
      return false;
    }
  }
  return true;
}

//interating functions ........
async function addVoter() {
  const state = await D_voteContract.getStatus();
  console.log(state);
  if (typeof window.ethereum !== "undefined" && state == "enacting voting ") {
    //have to fix it
    const value = voterInput.value;
    console.log(value);
    const newValidVoter = _duplicatevoter(value);
    console.log(newValidVoter);
    if (newValidVoter == true) {
      Voters.push(value);
      console.log(Voters.length);
    }
  }
  VotersButton.innerHTML = `${Voters.length} voter added`;
}

async function addCandidate() {
  const state = await D_voteContract.getStatus();
  console.log(state);
  if (typeof window.ethereum !== "undefined" && state == "enacting voting ") {
    const value = candidateInput.value;
    console.log(value);
    const newValidCandidate = _duplicateCandidate(value);
    console.log(newValidCandidate);

    if (newValidCandidate == true) {
      Candidates.push(value);
    }
  }
  console.log(Candidates.length);
  CandidateButton.innerHTML = `${Candidates.length} candidate added`;
}

//function for start vote
async function voteStart() {
  const pin = pinInput.value;
  const votingInterval = intervalInput.value;
  console.log(pin);
  console.log(votingInterval);
  interval = votingInterval * 3600;
  console.log(interval);
  const state = await D_voteContract.getStatus();

  if (
    state == "enacting voting " &&
    Voters.length > 1 &&
    Candidates.length > 0 &&
    pin > 0 &&
    interval > 0
  ) {
    try {
      await D_voteContract.startVote(Candidates, Voters, pin, interval);
    } catch (error) {
      console.log(error.message);
    }
  }
  console.log((await D_voteContract.numberCandidate()).toNumber());
  if (
    Candidates.length == (await D_voteContract.numberCandidate()).toNumber()
  ) {
    for (let i = 0; i < Candidates.length; i++) {
      const candidateHash = await D_voteContract.validCandidates(i);
      console.log(candidateHash);
      console.log(Candidates[i]);
      voteId++;
      voteInfoById.set(
        voteId,
        candidatesByName.set(Candidates[i], candidateHash)
      );
    }
  }

  voteStatus.innerHTML = await D_voteContract.getStatus();
  _stateInitializing();
}

//state intializing function
async function _stateInitializing() {
  const timeOut = interval;
  setTimeout(() => {
    for (let i = 0; i < voters.length; i++) {
      Voters.pop();
    }
    for (let i = 0; i < candidates.length; i++) {
      Candidates.pop();
    }
    interval = 0;
  }, timeOut * 3600);
}

//function vote
async function vote() {
  const VotingEnded = await D_voteContract.hasVotingEnded();
  const candidateName = choosenCandiateNameInput.value; //input candidate name
  const ChoosenCandidateNumber = choosenCandidateInput.value; //input value of candidate Number
  console.log(ChoosenCandidateNumber);
  console.log(candidateName);
  // const chosencandidateHash = candidatesByName.get(candidateName); //getting value from map operation
  // console.log(chosencandidateHash);
  const candidateInfo = await D_voteContract.CanidateInfo(
    ChoosenCandidateNumber
  ); // getting candidateInfo by contract
  const VoterPin = await D_voteContract.getVoterPin(); //getting voterPin hash
  console.log(VoterPin);
  const candidateIdHash = candidateInfo[0];
  const name = candidateInfo[1];

  console.log(candidateIdHash);
  console.log(name);
  if (VotingEnded == false && name == candidateName) {
    try {
      await D_voteContract.Vote(candidateIdHash, VoterPin);
    } catch (error) {
      console.log(error.message);
    }
  }
  const aftercandidateInfo = await D_voteContract.CanidateInfo(
    ChoosenCandidateNumber
  );
  console.log(`${aftercandidateInfo[0]} got ${aftercandidateInfo[2]} `);
}

//function getting winner
async function getWinner() {
  const hasVotingEnded = await D_voteContract.hasVotingEnded();
  console.log(hasVotingEnded);
  const state = await D_voteContract.getStatus();
  console.log(state);
  const numberWinner = (await D_voteContract.numberWinner()).toNumber();
  console.log(numberWinner);

  if (hasVotingEnded == true && state == "enacting voting ") {
    let winningString = " the last winner is/are :";
    for (let i = 0; i < numberWinner; i++) {
      var winnerId = await D_voteContract.winners(i);
      console.log(winnerId);
      const winnerinfo = await D_voteContract.candidates(winnerId);
      if (i == numberWinner - 1) {
        winningString += " " + winnerinfo[1];
      } else {
        winningString += " " + winnerinfo[1] + "&";
      }
    }
    winnerMessage.innerHTML = winningString;
  }
}

console.log(voteInfoById.get(voteId));
