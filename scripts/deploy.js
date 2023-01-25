const { upgrades, ethers } = require("hardhat");

async function main() {
  const maxNumberLIb = await ethers.getContractFactory("MaxNumberLib");
  const lib = await maxNumberLIb.deploy();
  console.log(lib.address);
  const D_Vote = await ethers.getContractFactory("Decentralized_Vote", {
    libraries: {
      MaxNumberLib: lib.address,
    },
    unsafeAllow: "external-library-linking",
  });
  let D_vote = await upgrades.deployProxy(D_Vote, []);
  await D_vote.deployed();
  console.log("DencentralizeVote deployed to ", D_vote.address);
  const stat = await D_vote.getStatus();
  console.log(stat);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
