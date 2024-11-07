const { ethers } = require("hardhat");

async function main() {
  const [creator] = await ethers.getSigners();
  
  const deployedAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  console.log("Using contract at:", deployedAddress);
  
  const Coffee = await ethers.getContractFactory("BuyMeCryptoCoffee");
  const coffee = await Coffee.attach(deployedAddress);
  
  console.log("Creator address:", creator.address);
  
  // 获取当前余额
  const balanceBefore = await coffee.getCreatorBalance(creator.address);
  console.log("Balance before withdrawal:", ethers.formatEther(balanceBefore), "ETH");
  
  if (balanceBefore.toString() === "0") {
    console.log("No balance to withdraw");
    return;
  }

  // 执行提款
  console.log("Withdrawing funds...");
  const tx = await coffee.connect(creator).creatorWithdraw();
  
  console.log("Transaction sent:", tx.hash);
  const receipt = await tx.wait();
  console.log("Transaction confirmed in block:", receipt.blockNumber);
  
  // 检查事件是否被发出
  const events = receipt.logs.map(log => {
    try {
      const parsedLog = Coffee.interface.parseLog(log);
      if (parsedLog.name === "CreatorWithdrawRecord") {
        console.log("CreatorWithdrawRecord event details:");
        console.log("- Creator:", parsedLog.args.creator);
        console.log("- Amount:", ethers.formatEther(parsedLog.args.amount), "ETH");
        console.log("- Timestamp:", parsedLog.args.timestamp.toString());
      }
      return parsedLog;
    } catch (e) {
      return null;
    }
  }).filter(Boolean);
  
  // 获取提款后余额
  const balanceAfter = await coffee.getCreatorBalance(creator.address);
  console.log("\nBalance after withdrawal:", ethers.formatEther(balanceAfter), "ETH");
  
  console.log("\nTotal events emitted:", events.length);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 