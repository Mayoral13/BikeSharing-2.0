pragma solidity ^0.8.11;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
contract OGG is ERC20{
    constructor(uint _supply)
    ERC20("Mayoral","OGG"){
        _mint(msg.sender, _supply*(10**(18)));
}
}