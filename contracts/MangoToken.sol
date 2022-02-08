// SPDX-License-Identifier: MIT

pragma solidity 0.7.3;

import './libs/ERC20.sol';

// Mango Token
contract MangoToken is ERC20('Mango Token', 'MANGO') {
    /// @notice Creates `_amount` token to `_to`. Must only be called by the owner (LaFincaStakingContract).
    function mint(address _to, uint256 _amount) public onlyOwner {
        _mint(_to, _amount);
    }
}
