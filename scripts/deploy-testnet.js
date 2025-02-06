// scripts/deploy-testnet.js
const hre = require("hardhat");

async function main() {
    console.log("Starting deployment process...");
    console.log("=".repeat(50));

    try {
        // First, verify our network connection
        const provider = await hre.ethers.provider;
        const network = await provider.getNetwork();
        console.log("Network Information:");
        console.log(`Chain ID: ${network.chainId}`);
        console.log(`Network Name: ${network.name}`);
        
        // Get and display current block information
        const blockNumber = await provider.getBlockNumber();
        const block = await provider.getBlock(blockNumber);
        console.log("\nBlock Information:");
        console.log(`Current Block Number: ${blockNumber}`);
        console.log(`Block Timestamp: ${new Date(block.timestamp * 1000).toLocaleString()}`);
        
        // Get deployer information
        const [deployer] = await hre.ethers.getSigners();
        const balance = await provider.getBalance(deployer.address);
        console.log("\nDeployer Information:");
        console.log(`Address: ${deployer.address}`);
        console.log(`Balance: ${hre.ethers.formatEther(balance)} ETH`);
        
        console.log("\nDeploying MyNFT contract...");
        const EnhancedNFT = await hre.ethers.getContractFactory("MyNFT");
        const nft = await EnhancedNFT.deploy();
        
        console.log("Waiting for deployment transaction to be mined...");
        await nft.waitForDeployment();
        
        const address = await nft.getAddress();
        console.log("\nDeployment Successful!");
        console.log(`Contract Address: ${address}`);
        
        // Verify the contract is working
        console.log("\nVerifying contract functionality...");
        console.log("Attempting to mint first NFT...");
        const [owner] = await ethers.getSigners();
        // const mintTx = await nft.safeMint({ 
        //     value: hre.ethers.parseEther("0.01"),
        //     gasLimit: 2000000 // Explicit gas limit for minting
        // });
        const mintTx = await nft.safeMint(owner.address);
        
        console.log(`Mint transaction hash: ${mintTx.hash}`);
        console.log("Waiting for mint transaction confirmation...");
        
        await mintTx.wait();
        console.log("First NFT minted successfully!");
        
        return address;
    } catch (error) {
        console.error("\nError occurred during deployment:");
        console.error("-".repeat(50));
        console.error("Error message:", error.message);
        if (error.error) {
            console.error("\nAdditional error details:", error.error);
        }
        console.error("-".repeat(50));
        throw error;
    }
}

main()
    .then((address) => {
        console.log("\nDeployment process completed!");
        console.log("=".repeat(50));
        process.exit(0);
    })
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });