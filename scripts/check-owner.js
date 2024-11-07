const hre = require("hardhat");

async function main() {
  // 获取与私钥对应的钱包地址
  const [signer] = await hre.ethers.getSigners();
  console.log("Your wallet address:", await signer.getAddress());

  // 获取合约实例
  const contractAddress = process.env.CONTRACT_ADDRESS;
  const BuyMeCryptoCoffee = await hre.ethers.getContractFactory("BuyMeCryptoCoffee");
  const contract = BuyMeCryptoCoffee.attach(contractAddress);

  // 获取合约owner
  const owner = await contract.owner();
  console.log("Contract owner:", owner);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 