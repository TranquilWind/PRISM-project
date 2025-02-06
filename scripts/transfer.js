const hre = require("hardhat");

async function main() {
  const contractAddress = "0x89372b32b8AF3F1272e2efb3088616318D2834cA";

  // Attach to the deployed contract
  const MyNFT = await hre.ethers.getContractFactory("MyNFT");
  const myNFT = MyNFT.attach(contractAddress);

  // Get signers
  const signers = await hre.ethers.getSigners();
console.log("Signers:", signers);

  const [owner, addr1] = await hre.ethers.getSigners();

  console.log("Owner address:", owner.address);
  console.log("Recipient address:", addr1.address);

  // Transfer token #0 to addr1
  console.log(`Transferring token #0 from ${owner.address} to ${addr1.address}...`);
  const tx = await myNFT.transferFrom(owner.address, addr1.address, 0);

  console.log("Waiting for transaction to be mined...");
  await tx.wait();

  console.log(`Transferred token #0 from ${owner.address} to ${addr1.address}`);

  // Verify new ownership
  const newOwner = await myNFT.ownerOf(0);
  console.log(`New owner of token #0: ${newOwner}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error occurred:", error);
    process.exit(1);
  });
