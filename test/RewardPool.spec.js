const { default: BigNumber } = require("bignumber.js")
const { assert } = require("chai")
const { advanceTimeAndBlock, advanceBlock } = require("./_utils")
const RewardPool = artifacts.require('RewardPool')
const eXRD = artifacts.require("eXRD")

const MONTH = 8035200

contract('RewardPool', accounts => {
    const owner = accounts[0]
    let rewardPool
    let xrdToken
    let rewardToken

    before(async () => {
        xrdToken = await eXRD.new(owner, 1000000000, { from: owner })
        rewardToken = await eXRD.new(owner, 1000000000, { from: owner })

        const startBonus = 1000
        const bonusPeriodSec = 1
        const growthParamX = 1
        const growthParamY = 0


        rewardPool = await RewardPool.new(
            xrdToken.address,
            rewardToken.address,
            10,
            startBonus,
            bonusPeriodSec,
            growthParamX,
            growthParamY,
            1,
            { from: owner }
        )

        await rewardToken.increaseAllowance(rewardPool.address, new BigNumber("10000000000000000000000000"), { from: owner })
    })

    it.skip('', async () => {
        await xrdToken.transfer(accounts[1], 1, { from: accounts[0] })

        const amount = new BigNumber("100000000000000000000") // 100 tokens
        await rewardPool.lockTokens(amount, 1, { from: accounts[0] })

        await xrdToken.increaseAllowance(rewardPool.address, 1, { from: accounts[1] })
        await rewardPool.stake(1, [], { from: accounts[1] })

        await advanceTimeAndBlock(9)


        let query
        // await advanceBlock()

        // query = await rewardPool.unstakeQuery({ from: accounts[1] })

        await rewardPool.unstake(1, [], { from: accounts[1] })

        const balance = await rewardToken.balanceOf(accounts[1])

        // assert.equal(query.toString(), '100000000000000000000')
        assert.equal(balance.toString(), amount.times(0.1802).toFixed())
    }).timeout(20000000)

    it('', async () => {
        const oneDaySeconds = 86400

        const account1 = accounts[1]
        const account2 = accounts[2]

        await xrdToken.transfer(account1, 1, { from: accounts[0] })
        await xrdToken.transfer(account2, 1, { from: accounts[0] })

        const amount = new BigNumber("2000000000000000000000") // 2000 tokens
        await rewardPool.lockTokens(amount, oneDaySeconds * 20, { from: accounts[0] })


        await xrdToken.increaseAllowance(rewardPool.address, 1, { from: account1 })
        await xrdToken.increaseAllowance(rewardPool.address, 1, { from: account2 })

        await rewardPool.stake(1, [], { from: account1 })
        await advanceTimeAndBlock(oneDaySeconds*10)
        await rewardPool.stake(1, [], { from: account2 })
        await advanceTimeAndBlock(oneDaySeconds*3)

        await rewardPool.updateAccounting({ from: account1 })
        await rewardPool.updateAccounting({ from: account2 })

        const account1Totals = await rewardPool._userTotals(account1)
        const account2Totals = await rewardPool._userTotals(account2)
        console.log('account1 stakingShareSeconds', account1Totals.stakingShareSeconds.toString())
        console.log('account2 stakingShareSeconds', account2Totals.stakingShareSeconds.toString())
        console.log('account1 stakingShares', account1Totals.stakingShares.toString())
        console.log('account2 stakingShares', account2Totals.stakingShares.toString())

        const totalStakingShareSeconds = await rewardPool._totalStakingShareSeconds()
        console.log('totalStakingShareSeconds ', totalStakingShareSeconds.toString())

        await rewardPool.unstake(1, [], { from: account1 })
        await rewardPool.unstake(1, [], { from: account2 })

        const balanceAccount1 = await rewardToken.balanceOf(account1)
        const balanceAccount2 = await rewardToken.balanceOf(account2)

        console.log(balanceAccount1.toString())
        console.log(balanceAccount2.toString())
    })
})