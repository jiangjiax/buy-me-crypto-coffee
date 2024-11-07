const { ethers } = require("hardhat");

async function main() {
  const [owner] = await ethers.getSigners();
  
  const deployedAddress = "0x7Ea3643C4FBD297A0E1119187C90c09BA7238b4d";
  console.log("Using contract at:", deployedAddress);
  
  const Coffee = await ethers.getContractFactory("BuyMeCryptoCoffee");
  const coffee = await Coffee.attach(deployedAddress);
  
  console.log("Owner address:", owner.address);
  
  try {
    // 获取系统费用余额
    const systemFeeBalance = await coffee.getSystemFeeBalance();
    console.log("System fee balance:", ethers.formatEther(systemFeeBalance), "ETH");

    if (systemFeeBalance.toString() === "0") {
      console.log("No system fees to withdraw");
      return;
    }

    // 执行提取系统费用
    console.log("Withdrawing system fees...");
    const tx = await coffee.withdrawSystemFees();
    
    console.log("Transaction sent:", tx.hash);
    const receipt = await tx.wait();
    console.log("Transaction confirmed in block:", receipt.blockNumber);
    
    // 检查事件是否被发出
    const events = receipt.logs.map(log => {
      try {
        const parsedLog = Coffee.interface.parseLog(log);
        if (parsedLog.name === "SystemFeeWithdraw") {
          console.log("SystemFeeWithdraw event details:");
          console.log("- Amount:", ethers.formatEther(parsedLog.args.amount), "ETH");
        }
        return parsedLog;
      } catch (e) {
        return null;
      }
    }).filter(Boolean);
    
    // 获取提取后的余额
    const balanceAfter = await coffee.getSystemFeeBalance();
    console.log("\nSystem fee balance after withdrawal:", ethers.formatEther(balanceAfter), "ETH");
    
    console.log("\nTotal events emitted:", events.length);

  } catch (error) {
    if (error.message.includes("caller is not the owner")) {
      console.error("Error: Only the contract owner can check system fee balance and withdraw");
    } else {
      console.error("Error:", error);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 