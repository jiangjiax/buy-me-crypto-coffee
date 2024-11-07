// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract BuyMeCryptoCoffee is Ownable, ReentrancyGuard {
    // Event emitted when a coffee is purchased
    event CoffeePurchased(
        address indexed creator, 
        address indexed buyer, 
        uint256 amount, 
        string message, 
        uint256 timestamp
    );

    // Event emitted when the creator withdraws funds
    event CreatorWithdraw(address indexed creator, uint256 amount);

    // Event emitted when the system fee is withdrawn
    event SystemFeeWithdraw(uint256 amount);

    // Event emitted when the creator withdraws funds with a record
    event CreatorWithdrawRecord(
        address indexed creator,
        uint256 amount,
        uint256 timestamp
    );

    uint256 private constant SYSTEM_FEE_PERCENTAGE = 5;
    mapping(address => uint256) private creatorBalances;
    uint256 private systemFeeBalance;

    constructor() Ownable(msg.sender) {}

    function buyCoffee(address _creator, string calldata _message) public payable nonReentrant {
        require(msg.value > 0, "You need to send some ETH");
        require(_creator != address(0), "Invalid creator address");
        require(_creator != msg.sender, "Cannot buy coffee for yourself");
        
        uint256 systemFee = msg.value / 20; // 5% = 1/20
        uint256 creatorAmount = msg.value - systemFee;

        systemFeeBalance += systemFee;
        creatorBalances[_creator] += creatorAmount;
        
        emit CoffeePurchased(
            _creator, 
            msg.sender, 
            msg.value, 
            _message, 
            block.timestamp
        );
    }

    function creatorWithdraw() public nonReentrant {
        uint256 amount = creatorBalances[msg.sender];
        require(amount > 0, "No balance to withdraw");

        creatorBalances[msg.sender] = 0;
        (bool sent, ) = payable(msg.sender).call{value: amount}("");
        require(sent, "Failed to send ETH");

        emit CreatorWithdrawRecord(
            msg.sender,
            amount,
            block.timestamp
        );

        emit CreatorWithdraw(msg.sender, amount);
    }

    function withdrawSystemFees() public onlyOwner nonReentrant {
        uint256 amount = systemFeeBalance;
        require(amount > 0, "No system fees to withdraw");

        systemFeeBalance = 0;
        (bool sent, ) = owner().call{value: amount}("");
        require(sent, "Failed to send ETH");

        emit SystemFeeWithdraw(amount);
    }

    function getCreatorBalance(address _creator) public view returns (uint256) {
        return creatorBalances[_creator];
    }

    function getSystemFeeBalance() public view onlyOwner returns (uint256) {
        return systemFeeBalance;
    }
}
