export const ContractAddrress = "0xcB39e54C8481458fAD4E1c13837bCe77A2011C01"; //asign your deployed contract address
export const deployerAddrress = "";
export const abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "spyVoter",
        type: "address",
      },
    ],
    name: "InvalidDuplicateVoterError",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "numberAmountVoter",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "NumberCastingVote",
        type: "uint256",
      },
    ],
    name: "InvalidVoteAmmount",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "lasttimeofvote",
        type: "uint256",
      },
    ],
    name: "VotingPeriodError",
    type: "error",
  },
  {
    inputs: [],
    name: "_NoneVotedDuringVotingPeriod",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "candidateId",
        type: "bytes32",
      },
    ],
    name: "VoteEvent",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address[]",
        name: "_votersArray",
        type: "address[]",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_numberOfVoters",
        type: "uint256",
      },
    ],
    name: "VoteStart",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32[]",
        name: "_winners",
        type: "bytes32[]",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "NumberWinner",
        type: "uint256",
      },
    ],
    name: "Winners",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_candidateNumber",
        type: "uint256",
      },
    ],
    name: "CanidateInfo",
    outputs: [
      {
        internalType: "bytes32",
        name: "candidateId",
        type: "bytes32",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "castedNumberVote",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_candidateId",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "_pin",
        type: "bytes32",
      },
    ],
    name: "Vote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "candidates",
    outputs: [
      {
        internalType: "bytes32",
        name: "id",
        type: "bytes32",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "castedVote",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "checkUpkeep",
    outputs: [
      {
        internalType: "bool",
        name: "upkeepNeeded",
        type: "bool",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getStatus",
    outputs: [
      {
        internalType: "string",
        name: "reply",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getVoterPin",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "hasVoted",
    outputs: [
      {
        internalType: "bool",
        name: "isVoter",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "hasVote",
        type: "bool",
      },
      {
        internalType: "bytes32",
        name: "validation",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "hasVotingEnded",
    outputs: [
      {
        internalType: "bool",
        name: "valid",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "numberCandidate",
    outputs: [
      {
        internalType: "uint256",
        name: "lengthNumberCandidate",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "numberVoter",
    outputs: [
      {
        internalType: "uint256",
        name: "lenthOfVotersArray",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "numberWinner",
    outputs: [
      {
        internalType: "uint256",
        name: "winnerLength",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "performUpkeep",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string[]",
        name: "_candidates",
        type: "string[]",
      },
      {
        internalType: "address[]",
        name: "_voters",
        type: "address[]",
      },
      {
        internalType: "uint256",
        name: "_pinNumber",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_interval",
        type: "uint256",
      },
    ],
    name: "startVote",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "state",
    outputs: [
      {
        internalType: "enum Decentralized_Vote.Status",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "validCandidates",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_voterAdd",
        type: "address",
      },
    ],
    name: "voterState",
    outputs: [
      {
        internalType: "bool",
        name: "valid",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "winners",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
