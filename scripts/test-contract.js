const hre = require("hardhat");

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS;
  if (!contractAddress) {
    throw new Error("Please set CONTRACT_ADDRESS in .env file");
  }
  console.log("Contract address:", contractAddress);

  try {
    // 获取合约实例
    const BuyMeCryptoCoffee = await hre.ethers.getContractFactory("BuyMeCryptoCoffee");
    const contract = BuyMeCryptoCoffee.attach(contractAddress);
    console.log("Contract instance created successfully");

    // 尝试调用一些基本函数
    console.log("\nTesting contract functions...");
    
    // 1. 测试 owner 函数
    console.log("Testing owner()...");
    try {
      const owner = await contract.owner();
      console.log("Owner call successful:", owner);
    } catch (error) {
      console.error("Owner call failed:", error.message);
    }

    // 2. 测试 getSystemFeeBalance 函数
    console.log("\nTesting getSystemFeeBalance()...");
    try {
      const balance = await contract.getSystemFeeBalance();
      console.log("GetSystemFeeBalance call successful:", hre.ethers.formatEther(balance));
    } catch (error) {
      console.error("GetSystemFeeBalance call failed:", error.message);
    }

    // 3. 测试合约是否有代码
    const code = await hre.ethers.provider.getCode(contractAddress);
    console.log("\nContract code length:", code.length);
    console.log("Has contract code:", code !== '0x');

  } catch (error) {
    console.error("Main error:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 