// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Escrow {
    enum State { AWAITING_PAYMENT, AWAITING_DELIVERY, COMPLETE }
    
    address public employer;
    address public freelancer;
    uint256 public amount;
    State public state;

    event PaymentDeposited(address indexed employer, uint256 amount);
    event JobDelivered(address indexed freelancer);
    event PaymentReleased(address indexed freelancer, uint256 amount);
    event EscrowCancelled(address indexed employer);

    modifier onlyEmployer() {
        require(msg.sender == employer, "Only employer can call this");
        _;
    }

    modifier onlyFreelancer() {
        require(msg.sender == freelancer, "Only freelancer can call this");
        _;
    }

    modifier inState(State _state) {
        require(state == _state, "Invalid state");
        _;
    }

    constructor(address _freelancer) payable {
        employer = msg.sender;
        freelancer = _freelancer;
        amount = msg.value; // The initial deposit made by the employer
        state = State.AWAITING_PAYMENT;

        emit PaymentDeposited(employer, amount);
    }

    // Function to confirm the job delivery
    function deliverJob() public onlyFreelancer inState(State.AWAITING_PAYMENT) {
        state = State.AWAITING_DELIVERY;
        emit JobDelivered(freelancer);
    }

    // Function to release payment to the freelancer
    function releasePayment() public onlyEmployer inState(State.AWAITING_DELIVERY) {
        state = State.COMPLETE;
        payable(freelancer).transfer(amount);
        emit PaymentReleased(freelancer, amount);
    }

    // Function to cancel the escrow
    function cancelEscrow() public onlyEmployer inState(State.AWAITING_PAYMENT) {
        state = State.COMPLETE;
        payable(employer).transfer(amount);
        emit EscrowCancelled(employer);
    }
}
