const GameContract = artifacts.require("Game");
const DigitalGolems = artifacts.require("DigitalGolems")
const AssetsContract = artifacts.require("Assets");
const Inventory = artifacts.require("Inventory")
const Psychospheres = artifacts.require("Psychospheres")
const Store = artifacts.require("Store")

const { assert } = require("chai");
const {
    catchRevert,            
    catchOutOfGas,          
    catchInvalidJump,       
    catchInvalidOpcode,     
    catchStackOverflow,     
    catchStackUnderflow,   
    catchStaticStateChange
} = require("../../utils/catch_error.js")


contract('Game Things', async (accounts)=>{
    let game;
    let psycho;
    let inventory;
    let store;
    let DIG;
    let assets;
    let user = accounts[9];
    let owner = accounts[0];
    let things = ["1","2","8","10","110"]
    let resources = ["2","3","1","4"]
    let augment = ["3","2","6","0","8","0","6","9","1"]
    const psychospheres = ["2", "3"]
    before(async () => {
        game = await GameContract.new()
        inventory = await Inventory.new()
        assets = await AssetsContract.new()
        DIG = await DigitalGolems.new()
        store = await Store.new()
        psycho = await Psychospheres.new()
        // await game.setDBT(DBT.address, {from: owner})
        await game.setDIG(DIG.address, {from: owner})
        await game.setInventory(inventory.address, {from: owner})
        await game.setAssets(assets.address, {from: owner})
        await game.setPsycho(psycho.address, {from:owner})
        await assets.setGame(game.address)
        await psycho.setGameContract(game.address)
        await inventory.setGameContract(game.address, {from:owner}) 
        await inventory.setStoreContract(store.address, {from:owner})
        await DIG.setGameAddress(game.address, {from: owner})
        await DIG.ownerMint(
            user,
            "tokenURIs",
            "0",
            "0"
        )
        await game.sessionResult(
            things,
            resources,
            augment,
            psychospheres,
            "1",
            user,
            {from: user}
        )
    })

    it("Should be new things amount", async ()=>{
        let newAmount = "6";
        //changing things amount
        await inventory.changeThingsAmount(newAmount, {from: owner})
        //adding more things, because we changed amount
        let newThings = ["2","3","1","4", "5", "6"]
        await game.sessionResult(
            newThings,
            resources,
            augment,
            psychospheres,
            "1",
            user,
            {from: user}
        )
        //checking
        let getThings = await inventory.getThings(user, {from: user})
        assert.equal(getThings.length, newAmount)
    })

}
)