const hre = require("hardhat");

async function main() {
    console.log("Deploying LoyaltyNFT contract...");
    
    try {
        const LoyaltyNFT = await hre.ethers.getContractFactory("LoyaltyNFT");
        const loyalty = await LoyaltyNFT.deploy();
        
        await loyalty.waitForDeployment();
        const address = await loyalty.getAddress();
        
        console.log(`LoyaltyNFT deployed to: ${address}`);
        
        // Mint initial NFT for testing
        const [owner] = await hre.ethers.getSigners();
        const mintTx = await loyalty.safeMint(owner.address);
        await mintTx.wait();
        
        console.log("Initial NFT minted to:", owner.address);
        
        // Test loyalty features
        const tokenId = 0;
        
        // Add some points
        await loyalty.addPoints(tokenId, 150, "First Purchase");
        console.log("Added initial points");
        
        // Get loyalty data
        const loyaltyData = await loyalty.getLoyaltyData(tokenId);
        console.log("\nLoyalty Data:");
        console.log("Level:", loyaltyData.level);
        console.log("Points:", loyaltyData.points.toString());
        console.log("Discount:", (await loyalty.getDiscount(tokenId)).toString(), "%");
        
        return address;
    } catch (error) {
        console.error("Deployment failed:", error);
        throw error;
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 