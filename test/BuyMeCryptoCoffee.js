const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BuyMeCryptoCoffee", function () {
    let BuyMeCryptoCoffee, buyMeCryptoCoffee, owner, creator, buyer, otherAccount;
    const ONE_ETH = ethers.parseEther("1.0");
    const SYSTEM_FEE_PERCENTAGE = 5;

    beforeEach(async function () {
        [owner, creator, buyer, otherAccount] = await ethers.getSigners();
        BuyMeCryptoCoffee = await ethers.getContractFactory("BuyMeCryptoCoffee");
        buyMeCryptoCoffee = await BuyMeCryptoCoffee.deploy();
        await buyMeCryptoCoffee.waitForDeployment();
    });

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await buyMeCryptoCoffee.owner()).to.equal(owner.address);
        });
    });

    describe("Buying Coffee", function () {
        it("Should allow buying coffee and update balances correctly", async function () {
            const coffeePrice = ONE_ETH;
            await expect(buyMeCryptoCoffee.connect(buyer).buyCoffee(creator.address, "Thanks!", "Alice", { value: coffeePrice }))
                .to.emit(buyMeCryptoCoffee, "CoffeePurchased")
                .withArgs(creator.address, buyer.address, coffeePrice, "Thanks!", "Alice");

            const systemFee = (coffeePrice * BigInt(SYSTEM_FEE_PERCENTAGE)) / 100n;
            const creatorAmount = coffeePrice - systemFee;

            expect(await buyMeCryptoCoffee.getCreatorBalance(creator.address)).to.equal(creatorAmount);
            expect(await buyMeCryptoCoffee.getSystemFeeBalance()).to.equal(systemFee);
        });

        it("Should revert when trying to buy coffee with 0 ETH", async function () {
            await expect(buyMeCryptoCoffee.connect(buyer).buyCoffee(creator.address, "Thanks!", "Alice", { value: 0 }))
                .to.be.revertedWith("You need to send some ETH");
        });
    });

    describe("Withdrawals", function () {
        beforeEach(async function () {
            await buyMeCryptoCoffee.connect(buyer).buyCoffee(creator.address, "Thanks!", "Alice", { value: ONE_ETH });
        });

        it("Should allow creator to withdraw their earnings", async function () {
            const initialBalance = await ethers.provider.getBalance(creator.address);
            await buyMeCryptoCoffee.connect(creator).creatorWithdraw();
            const finalBalance = await ethers.provider.getBalance(creator.address);

            expect(finalBalance).to.be.gt(initialBalance);
        });

        it("Should allow owner to withdraw system fees", async function () {
            const initialBalance = await ethers.provider.getBalance(owner.address);
            await buyMeCryptoCoffee.connect(owner).withdrawSystemFees();
            const finalBalance = await ethers.provider.getBalance(owner.address);

            expect(finalBalance).to.be.gt(initialBalance);
        });

        it("Should revert when non-creator tries to withdraw creator earnings", async function () {
            await expect(buyMeCryptoCoffee.connect(otherAccount).creatorWithdraw())
                .to.be.revertedWith("No balance to withdraw");
        });

        it("Should revert when non-owner tries to withdraw system fees", async function () {
            const [_, nonOwner] = await ethers.getSigners();
            await expect(buyMeCryptoCoffee.connect(nonOwner).withdrawSystemFees())
                .to.be.revertedWithCustomError(buyMeCryptoCoffee, "OwnableUnauthorizedAccount")
                .withArgs(nonOwner.address);
        });
    });

    describe("Viewing Functions", function () {
        beforeEach(async function () {
            await buyMeCryptoCoffee.connect(buyer).buyCoffee(creator.address, "Thanks!", "Alice", { value: ONE_ETH });
        });

        it("Should return correct creator balance", async function () {
            const creatorAmount = ONE_ETH - (ONE_ETH * BigInt(SYSTEM_FEE_PERCENTAGE)) / 100n;
            expect(await buyMeCryptoCoffee.getCreatorBalance(creator.address)).to.equal(creatorAmount);
        });

        it("Should return correct system fee balance", async function () {
            const systemFee = (ONE_ETH * BigInt(SYSTEM_FEE_PERCENTAGE)) / 100n;
            expect(await buyMeCryptoCoffee.getSystemFeeBalance()).to.equal(systemFee);
        });

        it("Should return correct list of coffees for a creator", async function () {
            const coffees = await buyMeCryptoCoffee.getCreatorCoffees(creator.address);
            expect(coffees.length).to.equal(1);
            expect(coffees[0].buyer).to.equal(buyer.address);
            expect(coffees[0].amount).to.equal(ONE_ETH);
            expect(coffees[0].message).to.equal("Thanks!");
            expect(coffees[0].name).to.equal("Alice");
        });
    });
});
