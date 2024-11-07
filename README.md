# Buy Me a Crypto Coffee

A blockchain-based creator support platform that allows supporters to directly support their favorite creators using cryptocurrency by buying virtual coffees.

## Key Features

### Global Support
- Borderless Payments: Support creators worldwide using cryptocurrency
- Cross-border Transfers: Eliminate traditional payment restrictions
- Multi-language Support: Available in English and Chinese

### Instant Delivery
- Blockchain-based: Instant fund transfers
- Smart Contracts: Automated fund distribution
- Transparency: All transactions are traceable

### Security & Transparency
- Smart Contracts: Ensure transaction security and fund allocation
- Blockchain Records: Permanent transparent transaction history
- Decentralization: No need for third-party trust

### Community Interaction
- Personalized Messages: Supporters can leave messages
- Support History: Complete support records
- Creator Profile: Customizable personal pages

## Technical Architecture

### Smart Contract (Solidity)
- `BuyMeCryptoCoffee.sol`: Core contract
  - Coffee purchase functionality
  - Creator withdrawal functionality
  - System fee management
  - Event logging and notifications

### Backend Service (Golang)
- Event Listening Service
  - Contract event monitoring
  - Firebase data synchronization
  - Statistics updates
- Data Storage
  - Firebase Firestore database
  - User data management
  - Transaction record storage

### Frontend Application (Next.js)
- Page Components
  - Homepage: Project introduction and feature showcase
  - Creator Page: Personal profile and support interface
  - Dashboard: Data statistics and management
- Web3 Integration
  - MetaMask wallet connection
  - Transaction processing
  - Balance queries

## Process Flow

### Support Flow
1. Connect Wallet: User connects via MetaMask
2. Select Amount: Choose ETH amount to support
3. Send Message: Optional support message
4. Confirm Transaction: Confirm via MetaMask
5. Auto Distribution: 95% to creator, 5% platform fee

### Withdrawal Flow
1. Check Balance: Creator checks withdrawable amount
2. Initiate Withdrawal: Click withdraw button
3. Confirm Transaction: Pay gas fee
4. Complete Withdrawal: Funds transferred to creator's wallet

## Development Guide

### Environment Setup
```bash
# Install dependencies
npm install

# Compile contract
npx hardhat compile

# Run tests
npx hardhat test

# Deploy contract
npx hardhat run scripts/deploy.js --network <network>
```

### Test Scripts
- test-buy-coffee.js: Test purchase functionality
- test-withdraw.js: Test withdrawal functionality
- test-system-fee.js: Test system fee functionality

## Future Plans

1. Multi-chain Support
   - Support for BSC, Polygon, and other major chains
   - Cross-chain asset management

2. Feature Extensions
   - Subscription support
   - NFT membership cards
   - DAO governance

3. Social Features
   - Creator community
   - Fan interaction
   - Event system

## Contribution Guide

Welcome to submit Pull Requests or raise Issues. Please ensure:
1. Follow existing code style
2. Add appropriate tests
3. Update relevant documentation

## License

MIT License
