DECENTRALISED UPGRADEABLE AUTOMATED E-VOTING DAPP FOR PRIVATE ENTERPRISE

Now a days in the decentralize era To ensure transparancy  voting mechanism , automated calculation and equal voting right for every voter decentralization in voting platform is necessary and unreplacable solution.

D_Vote is a smart contract written by solidity in EVM. which ensuring decentralization transparent automatic voting mechanism for private enterprise.
Tested by mocha framwork in hardhat enviroment 

D_Vote Voting Mechanism
----------------------------------
*Can set voting right to selected addresses
*Secure voting right for selected addressses by providing 
unique cryptographic Id
*Duplicate vote and Invalid Voter interaction blocking by special modifier
*AUTOMATIC vote calculation by chainlink oracle system
*Set TIME INTERVAL for voting period
*wriiten in openzeppelin upgradeable contract
*Can get gas-cost by each function in gas-report.txt file after running hardhat test

Running D_Vote DApp
--------------------------------
1. to deploy run
``` yarn hardhat run scripts/deploy.js --network<network name>```

2. to test run
```yarn hardhat test```

3. set contract info in ContractInformation.js file (set your abi, contractAddress)

4. customize your front end and  js file according your requirements





