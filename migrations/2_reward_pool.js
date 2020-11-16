const RewardPool = artifacts.require("RewardPool")

module.exports = function (deployer) {
    const stakingTokenAddress = ''
    const rewardTokenAddress = ''
    const maxUnlockSchedules = 1
    const startBonus = 0
    const bonusPeriodSec = 100
    const growthParamX = 1 
    const growthParamY = 0
    const initialSharesPerToken = 1

    await deployer.deploy(
        RewardPool,
        stakingTokenAddress,
        rewardTokenAddress,
        maxUnlockSchedules,
        startBonus,
        bonusPeriodSec,
        growthParamX,
        growthParamY,
        initialSharesPerToken,
        { from: owner }
    )
};
