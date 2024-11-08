# Buy Me a Crypto Coffee - 加密咖啡赞赏平台

一个基于区块链的创作者支持平台，让支持者可以通过购买虚拟咖啡的方式，直接用加密货币支持他们喜欢的创作者。

## 项目特点

### 全球支持
- 无国界支付：使用加密货币实现全球范围的创作者支持
- 跨境转账：消除传统支付的地域限制
- 多语言支持：支持中英文界面

### 即时到账
- 基于区块链：支持资金实时到账
- 智能合约：自动化资金分配
- 透明公开：所有交易记录可查

### 安全透明
- 智能合约：确保交易安全和资金分配
- 区块链记录：所有交易永久透明记录
- 去中心化：无需信任第三方

### 社区互动
- 个性化消息：支持者可以留言
- 支持历史：完整的支持记录
- 创作者主页：可定制的个人页面

## 技术架构

### 智能合约 (Solidity)
- `BuyMeCryptoCoffee.sol`：核心合约
  - 咖啡购买功能
  - 创作者提现功能
  - 系统费用管理
  - 事件记录和通知

### 后端服务 (Golang)
- 事件监听服务
  - 监听合约事件
  - 数据同步到 Firebase
  - 统计数据更新
- 数据存储
  - Firebase Firestore 数据库
  - 用户数据管理
  - 交易记录存储

### 前端应用 (Next.js)
- 页面组件
  - 首页：项目介绍和功能展示
  - 创作者页面：个人资料和支持界面
  - 仪表盘：数据统计和管理功能
- Web3 集成
  - MetaMask 钱包连接
  - 交易处理
  - 余额查询

## 功能流程

### 支持流程
1. 连接钱包：用户通过 MetaMask 连接
2. 选择金额：选择要支持的 ETH 数量
3. 发送消息：可以附带支持消息
4. 确认交易：通过 MetaMask 确认
5. 自动分配：95% 给创作者，5% 平台费用

### 提现流程
1. 查看余额：创作者查看可提现金额
2. 发起提现：点击提现按钮
3. 确认交易：支付 gas 费用
4. 完成提现：资金转入创作者钱包

## 开发指南

### 环境配置
```bash
# 安装依赖
npm install

# 编译合约
npx hardhat compile

# 运行测试
npx hardhat test

# 部署合约
npx hardhat run scripts/deploy.js --network <network>
```

### 测试脚本
- test-buy-coffee.js：测试购买功能
- test-withdraw.js：测试提现功能
- test-system-fee.js：测试系统费用

## 未来规划

1. 多链支持
   - 支持 BSC、Polygon 等主流公链
   - 跨链资产管理

2. 功能扩展
   - 订阅制支持
   - NFT 会员卡
   - DAO 治理

3. 社交功能
   - 创作者社区
   - 粉丝互动
   - 活动系统

## 贡献指南

欢迎提交 Pull Request 或提出 Issue。请确保：
1. 遵循现有代码风格
2. 添加适当的测试
3. 更新相关文档

## 许可证

MIT License
