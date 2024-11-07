const hre = require("hardhat");

async function main() {
  // 获取部署的合约地址
  const contractAddress = process.env.CONTRACT_ADDRESS;
  if (!contractAddress) {
    throw new Error("Please set CONTRACT_ADDRESS in .env file");
  }
  console.log("Contract address:", contractAddress);

  // 验证合约地址是否有代码
  const code = await hre.ethers.provider.getCode(contractAddress);
  if (code === '0x') {
    console.error("No contract found at this address!");
    return;
  }

  // 获取当前钱包地址
  const [signer] = await hre.ethers.getSigners();
  const currentAddress = await signer.getAddress();
  console.log("Current wallet address:", currentAddress);

  try {
    // 获取合约实例
    const BuyMeCryptoCoffee = await hre.ethers.getContractFactory("BuyMeCryptoCoffee");
    const contract = BuyMeCryptoCoffee.attach(contractAddress);
    console.log("Contract instance created successfully");

    // 获取合约owner
    console.log("Attempting to call owner()...");
    const owner = await contract.owner();
    console.log("Contract owner:", owner);

    if (currentAddress.toLowerCase() !== owner.toLowerCase()) {
      console.log("Warning: Your current wallet is not the contract owner!");
      return;
    }

    // 获取系统费用余额
    const balance = await contract.getSystemFeeBalance();
    console.log("System fee balance:", hre.ethers.formatEther(balance), "ETH");
  } catch (error) {
    console.error("Detailed error:", {
      message: error.message,
      code: error.code,
      value: error.value,
      info: error.info
    });
    
    if (error.code === 'BAD_DATA') {
      console.log("\nPossible issues:");
      console.log("1. Contract address might be incorrect");
      console.log("2. Contract might not be properly deployed");
      console.log("3. Contract ABI might not match the deployed contract");
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 