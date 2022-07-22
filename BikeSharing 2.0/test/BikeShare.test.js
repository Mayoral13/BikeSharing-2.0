const Bike = artifacts.require("BikeShare");
let catchRevert = require("../execption").catchRevert;
contract("bike",(accounts) => {

    let admin = accounts[0];
    let user = accounts[1];
    let user1 = accounts[2];
    let user2 = accounts[3];
    let user3 = accounts[4];

    it("Can Buy tokens",async()=>{
        const alpha = await Bike.deployed();
        const beta = await alpha.BuyTokens({value:1000000000000000,from:admin});
        const gamma  = await alpha.BalanceChecker({from:admin});
        console.log("The balance is:",gamma.toString());
        assert.equal(gamma,25000);
    });

    it("Can Rent a bike",async()=>{
        const alpha = await Bike.deployed();
        const beta = await alpha.BuyTokens({value:1000000000000000,from:user});
        const gamma  = await alpha.Rent({from:user});
        const meta = await alpha.ReturnRenters();
        assert.equal(meta,1);
    });

    it("Escrow Balance should not be zero",async()=>{
        const alpha = await Bike.deployed();
        const gamma = await alpha.EscrowBalance();
        console.log("Escrow Balance:",gamma.toString());
        assert(gamma != 0);
    });

    it("Can Check Balance",async()=>{
        const alpha = await Bike.deployed();
        const gamma = await alpha.BalanceChecker({from:admin});
        console.log("Balance of user is:",gamma.toString());
        assert.equal(gamma,25000);
    });

    it("Owner should be admin account",async()=>{
        const alpha = await Bike.deployed();
        const gamma = await alpha.ReturnOwner();
        console.log("The owner address is:",gamma.toString());
        assert.equal(gamma,admin);
    });

    it("Can Return Amount",async()=>{
        const alpha = await Bike.deployed();
        const gamma = await alpha.ReturnAmount();
        const expected = 5000;
        console.log("The amount is:",gamma.toString());
        assert.equal(gamma,expected);
    });

    it("Can Return EscrowAmount",async()=>{
        const alpha = await Bike.deployed();
        const gamma = await alpha.ReturnEscrowAmount();
        const expected = 15000;
        console.log("The amount is:",gamma.toString());
        assert.equal(gamma,expected);
    });

    it("Can Return Bike",async()=>{
        const alpha = await Bike.deployed();
        const beta = await alpha.BuyTokens({value:1000000000000000,from:user1});
        const gamma  = await alpha.BalanceChecker({from:user1});
        const meta = await alpha.Rent({from:user1});
        const beta1 = await alpha.isBikeOwner({from:user1});
        const buggy = await alpha.ReturnBike({from:user1});
        const beta2 = await alpha.isBikeOwner({from:user1});
        assert(beta1 != beta2);
    });


    it("Should revert if tokens are insufficient to rent a bike",async()=>{
        const alpha = await Bike.deployed();
        await catchRevert(alpha.Rent({from:user2}));
    });


    it("Should revert on return bike if one doesnt own a bike",async()=>{
        const alpha = await Bike.deployed();
        await catchRevert(alpha.ReturnBike({from:user2}));
    });


    it("Can Return rent record",async()=>{
        const alpha = await Bike.deployed();
        const beta = await alpha.BuyTokens({value:1000000000000000,from:user2});
        const meta = await alpha.Rent({from:user2});
        const buggy = await alpha.ReturnBike({from:user2});
        const gamma = await alpha.ReturnRentRecord(1,{from:user2});
        console.log("Rent Record is:",gamma.toString());
        assert(gamma !="");
    });

    it("Can Return Times Rented",async()=>{
        const alpha = await Bike.deployed();
        const beta = await alpha.ReturnTimesRented({from:admin});
        console.log("Times rented is:",beta.toString());
        assert(beta !="");
    });

    it("Can Return Renters",async()=>{
        const alpha = await Bike.deployed();
        const beta = await alpha.ReturnRenters();
        console.log("Renters are:",beta.toString());
        assert(beta !="");
    });


    it("Should revert if user tries to rent a bike while rent is ongoing",async()=>{
        const alpha = await Bike.deployed();
        const beta = await alpha.BuyTokens({value:1000000000000000,from:user3});
        const meta = await alpha.Rent({from:user3});
        await catchRevert(alpha.Rent({from:user3}));
    });
});