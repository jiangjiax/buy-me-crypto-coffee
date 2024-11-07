const { ethers } = require("hardhat");

async function main() {
  const [owner, buyer] = await ethers.getSigners();
  
  const deployedAddress = "0x7Ea3643C4FBD297A0E1119187C90c09BA7238b4d";
  console.log("Using contract at:", deployedAddress);
  
  const Coffee = await ethers.getContractFactory("BuyMeCryptoCoffee");
  const coffee = await Coffee.attach(deployedAddress);
  
  // 买3杯咖啡
  for(let i = 0; i < 3; i++) {
    console.log(`\nBuying coffee ${i + 1}...`);
    console.log("Sending transaction from:", buyer.address, "to creator:", owner.address);
    
    const tx = await coffee.connect(buyer).buyCoffee(
      owner.address,
      `Test message ${i + 1}`,
      { value: ethers.parseEther("0.01") }
    );
    
    console.log("Transaction sent:", tx.hash);
    const receipt = await tx.wait();
    console.log("Transaction confirmed in block:", receipt.blockNumber);
  }
  
  // 打印最终余额
  const balance = await coffee.getCreatorBalance(owner.address);
  console.log("\nFinal creator balance:", ethers.formatEther(balance), "ETH");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 