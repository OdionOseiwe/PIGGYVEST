
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TestToken is ERC20 {
    address owner;
    constructor() ERC20("TestToken", "TT") {
        owner = msg.sender;
        _mint(owner, 10000000000000000000000);
    }
}
