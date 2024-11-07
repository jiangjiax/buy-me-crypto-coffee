const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function updateEventServiceEnv(contractAddress, network) {
    // 更新事件处理服务的.env文件
    const envPath = path.join(__dirname, '../../eth-event-service/.env.development');
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // 根据网络设置不同的RPC URL
    const rpcUrl = network === 'localhost' 
        ? 'ws://127.0.0.1:8545'
        : 'wss://eth-sepolia.g.alchemy.com/v2/hy4m6PD3-Inxyi7H1oiWubV_EFy9cYeF';
    
    envContent = envContent.replace(/ETHEREUM_RPC=.*/, `ETHEREUM_RPC=${rpcUrl}`);
    envContent = envContent.replace(/COFFEE_CONTRACT_ADDRESS=.*/, `COFFEE_CONTRACT_ADDRESS=${contractAddress}`);
    
    fs.writeFileSync(envPath, envContent);
    console.log(`Updated eth-event-service/.env for ${network} network`);
}

async function main() {
    const BuyMeCryptoCoffee = await hre.ethers.getContractFactory("BuyMeCryptoCoffee");
    const buyMeCryptoCoffee = await BuyMeCryptoCoffee.deploy();

    await buyMeCryptoCoffee.waitForDeployment();

    const address = await buyMeCryptoCoffee.getAddress();
    console.log("BuyMeCryptoCoffee deployed to:", address);

    // 额外的验证
    const owner = await buyMeCryptoCoffee.owner();
    console.log("Contract owner:", owner);
    console.log("Deployment transaction hash:", buyMeCryptoCoffee.deploymentTransaction().hash);

    // 获取当前网络
    const network = hre.network.name;
    console.log("Deployed on network:", network);

    // 更新事件服务的配置
    await updateEventServiceEnv(address, network);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
