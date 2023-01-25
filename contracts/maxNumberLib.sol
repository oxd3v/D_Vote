//SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

library MaxNumberLib {
    function max(uint256[] memory numbers) external pure returns (uint) {
        require(numbers.length > 0); // throw an exception if the condition is not met
        uint256 maxNumber; // default 0, the lowest value of `uint256`
        //looping through inputsArray to iterate every indexed value to findout greater value
        for (uint i = 0; i < numbers.length; i++) {
            if (numbers[i] > maxNumber) {
                maxNumber = numbers[i];
            }
        }
        return maxNumber;
    }
}
