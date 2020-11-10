const RewardPool = artifacts.require("RewardPool")
const { default: BigNumber } = require('bignumber.js')

const MONTH = 2628000

module.exports = function (deployer) {
    const rewardToken = await deployer.deploy(Token, owner, 1000000000, { from: owner })

    const rewardPool = await deployer.deploy(
        RewardPool,
        xrdToken.address,
        rewardToken.address,
        1,
        100,
        1,
        1,
        0,
        1,
        { from: owner }
    )

    await xrdToken.increaseAllowance(rewardPool.address, new BigNumber("10000000000000000000000000"), { from: owner })
    await rewardToken.increaseAllowance(rewardPool.address, new BigNumber("10000000000000000000000000"), { from: owner })

    await rewardPool.lockTokens(new BigNumber("100000000000000000000"), MONTH * 3, { from: owner })
};
