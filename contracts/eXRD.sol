pragma solidity 0.5.1;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract eXRD is ERC20 {
    constructor(address depositAddress, uint256 amount)
        public
        ERC20()
    { 
        require(depositAddress != address(0));

        _mint(depositAddress, amount.mul((10**uint256(18))));
    }
}