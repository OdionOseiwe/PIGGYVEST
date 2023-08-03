
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract OD_testToken is ERC20 {
    address owner;
    constructor() ERC20("TestToken", "TT") {
        owner = msg.sender;
        _mint(owner, 1000000000000000000000000000);
    }
}
