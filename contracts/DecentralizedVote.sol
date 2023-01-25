//SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

//importing required library(customized) and chainlink Automation contract
import "./maxNumberLib.sol";
import "@chainlink/contracts/src/v0.8/AutomationCompatible.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

//customize error Handling
error InvalidDuplicateVoterError(address spyVoter);
error VotingPeriodError(uint lasttimeofvote);
error InvalidVoteAmmount(uint numberAmountVoter, uint NumberCastingVote);
error _NoneVotedDuringVotingPeriod();

/// @custom:oz-upgrades-unsafe-allow external-library-linking

contract Decentralized_Vote is Initializable, AutomationCompatibleInterface {
    /**event handlers..... */
    event VoteEvent(bytes32 candidateId);
    event VoteStart(address[] _votersArray, uint _numberOfVoters);
    event Winners(bytes32[] _winners, uint NumberWinner);

    /**required library
     * @dev library for find out MaxNumber to counting vote
     * @dev function Name max() is used for geting greater number
     * @param uint[] dynamic array of uint input
     * @return uint Maxnumber ..... */
    using MaxNumberLib for uint;

    /**enum declaration  
     * @dev for declaring contract state situtaion 
       @dev 0 for enacting state
       @dev 1 for publicVoting state
      */
    enum Status {
        Enacting,
        publicVoting
    }

    Status public state;
    /**struct variable declaring............
     * @dev candidate for Candidates info.
     * @dev voters  for voters info.
     */
    struct candidate {
        bytes32 id;
        string name;
        uint castedVote;
    }
    struct voter {
        bool isVoter;
        bool hasVote;
        bytes32 validation;
    }

    /**mapping variable declarations...
     * @dev "hasVoted" for setting  voters info  using voters Address
     * @dev  "candidates" for setting candidate info using uinque candidate hash
     */
    mapping(address => voter) public hasVoted;
    mapping(bytes32 => candidate) public candidates;

    /**Array declarations...
     * @dev "voted" array of adding voter address after voted ;
     * @dev  "validCandidates" array of valid candidates
     */
    bytes32[] public validCandidates;
    address[] private voted;

    /**voting period and timestamp declarations
     * @dev votingPeriod using for chainLink automation perform perpose
     * @dev lastTimeStamp for tracking checkUpkeep function to checking voting period
     *  to fired performupkepp function of chainlink automation .... */
    uint private votingPeriod;
    uint private lastTimeStamp;

    /**winners array to store previous winner and initialized before vote start */
    bytes32[] public winners;

    function initialize() public initializer {
        state = Status.Enacting;
    }

    /**@dev adding candidate function
     * @dev private function to contracts use only
     * @dev to adding candidate to  genarate hash of candidate
     * @dev pushing candidate(hashId) to validCandidates Array
     * @dev mapping candidates by  key(bytes32 hasId) => value(struct candidateInfo)
     * @param _name of candidates ( using calldata location to avoid modification and reducing gas fee)
     */
    function _addCandidate(string calldata _name) private {
        bytes32 hash_id = keccak256(
            abi.encodePacked(
                validCandidates.length,
                _name,
                msg.sender,
                block.timestamp
            )
        );
        candidates[hash_id] = candidate(hash_id, _name, 0);
        validCandidates.push(hash_id);
    }

    /**@dev  function startVote to opening vote
     * @dev public function to interact voter to vote
     * @param _candidates who are candidate
     * @param _voters Array who can vote
     * @param _pinNumber to voterId to checking validVoters
     * @param _interval to set voting period(how long they can vote)
     *
     */
    function startVote(
        string[] calldata _candidates,
        address[] calldata _voters,
        uint _pinNumber,
        uint _interval
    ) public returns (bytes32) {
        //checking required state value
        require(state == Status.Enacting, "existing vote isnt ended yet"); //checking valid state to start the vote
        require(
            _candidates.length > 1,
            "candidates not found to occuring vote"
        ); //checking valid candidate ammount
        require(_voters.length > 0, "voters not found to occuring vote"); //checking valid candidate ammount

        //looping through memory input _candidatees array to pushing the each of the candidate into validCandidates array
        for (uint i = 0; i < _candidates.length; i++) {
            _addCandidate(_candidates[i]);
        }

        //looping through _voters array and mapping hasVoted set their validation
        for (uint i = 0; i < _voters.length; i++) {
            hasVoted[_voters[i]].isVoter = true;
            hasVoted[_voters[i]].hasVote = false;
            // generating voterId to set at validVoter
            hasVoted[_voters[i]].validation = keccak256(
                abi.encodePacked(
                    msg.sender,
                    block.timestamp,
                    _voters[i],
                    _pinNumber
                )
            );
        }
        //intializing voting  settings by update state varaible
        votingPeriod = _interval;
        lastTimeStamp = block.timestamp;
        state = Status.publicVoting;
        //initializing previous winners array
        winners = new bytes32[](0);
        emit VoteStart(_voters, _voters.length);
    }

    /**modifier to checking validVoter
     * @dev checking valid -voter
    
     */
    modifier _onlyVoter() {
        require(hasVoted[msg.sender].isVoter == true, "nonValid Voter");
        require(hasVoted[msg.sender].hasVote == false, "already Voted");
        _;
    }

    /**function vote();
     * @dev to vote your chosen candidate
     * @param _candidateId of candidate valid hash-id
     * @param _pin valid pin id of voter
     * @dev _onlyVoter modifier chaecking valid Voter and duplicate voter
     */
    function Vote(bytes32 _candidateId, bytes32 _pin) public _onlyVoter {
        //checking required state varaible to let voter to vote
        require(hasVoted[msg.sender].validation == _pin, "invalid voter");
        //checking valid candidate id
        require(_validCandidate(_candidateId), "candidate isnt valid");
        require(
            state == Status.publicVoting,
            "voting isnt start or voting restriction isnt public"
        );
        if ((block.timestamp - lastTimeStamp) >= votingPeriod) {
            revert VotingPeriodError(lastTimeStamp + votingPeriod);
        }

        // record that voter has voted
        hasVoted[msg.sender].hasVote = true;
        hasVoted[msg.sender].validation = 0;
        voted.push(msg.sender);
        // update candidate vote Count
        candidates[_candidateId].castedVote++;
        emit VoteEvent(_candidateId);
    }

    function _validCandidate(
        bytes32 candidate_id
    ) private view returns (bool exist) {
        bytes32[] memory candidatesArray = validCandidates;
        for (uint i = 0; i < candidatesArray.length; i++) {
            if (candidatesArray[i] == candidate_id) {
                return true;
            }
        }
    }

    /** chainlink checkUpKeep function
     * @dev AutomationCompatibleInterface function to automate checking contract state variable to automate perform
     * @return upkeepNeeded and fire performUpKeep function
     */
    function checkUpkeep(
        bytes calldata /* checkData */
    )
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory /* performData */)
    {
        bool _status = (state == Status.publicVoting);
        //checking voting period
        bool isTimeEnded = ((block.timestamp - lastTimeStamp) >= votingPeriod);
        //creating instance of candidates array in memory location to consume gas costing fee of loop caculation!
        bytes32[] memory candidatesArray = validCandidates;
        //creating voted voter array instance in memory location
        address[] memory votersArray = voted;
        //checking candidate perticipate? and anyone voted?
        bool isThereAnyCandidateperform = (candidatesArray.length > 1);
        bool isThereAnyoneVoted = (votersArray.length > 0);
        upkeepNeeded = (_status &&
            isThereAnyoneVoted &&
            isTimeEnded &&
            isThereAnyCandidateperform);
    }

    /** chainlink performUpKeep function
     * @dev AutomationCompatibleInterface function execute when checkUpKeep returns true
     * @dev counting votes after voting period has ended
     * @dev using customized MaxNumberLib to geting castedMaxVote
     * @dev set winner and multiple winners in winner Array
     * @dev initialized contracts state after succesfful decentralized autonomous voting period
     */
    function performUpkeep(bytes calldata /* performData */) external override {
        //creating instance of candidates array in memory location to consume gas costing fee of loop caculation!
        bytes32[] memory candidatesArray = validCandidates;
        //creating voted voter array instance in memory location
        address[] memory votersArray = voted;
        //checking candidate perticipate? and anyone voted?
        require(candidatesArray.length > 1, "No candidate found");

        //if anyone voted then vote will be casted
        if (votersArray.length > 0) {
            // casting vote......
            uint totalvotes = 0;
            //creating a array to getting castedVote of candidate from struct mapping by id by for loop
            uint[] memory castingvote = new uint[](candidatesArray.length);
            for (uint i = 0; i < candidatesArray.length; i++) {
                //calculating  sum of totalcasting vote
                totalvotes += candidates[candidatesArray[i]].castedVote;
                //pushing the castedvote candidates mapping into temporary memory castingvote Array
                castingvote[i] = (candidates[candidatesArray[i]].castedVote);
            }
            //checking valid number of vote
            if (totalvotes != votersArray.length) {
                revert InvalidVoteAmmount(totalvotes, votersArray.length);
            }
            //calculationg greater number of vote by using customize max func of  maxNumber lib/
            uint maxNumber = MaxNumberLib.max(castingvote);
            // finding similar max voted winner or winner of max casting vote
            for (uint i = 0; i < castingvote.length; i++) {
                if (castingvote[i] == maxNumber) {
                    //pushing winning  candidate id to winners array
                    winners.push(validCandidates[i]);
                }
            }
            //emmiting Winners events
            emit Winners(winners, winners.length);
        } else {
            revert _NoneVotedDuringVotingPeriod();
        }

        //initializing voters array
        for (uint i = 0; i < votersArray.length; i++) {
            delete hasVoted[votersArray[i]];
        }
        //initializing state variable after calculating vote
        validCandidates = new bytes32[](0);
        voted = new address[](0);
        state = Status.Enacting;
        votingPeriod = 0;
        lastTimeStamp = 0;
    }

    /**greater functions........ */
    function getStatus() public view returns (string memory reply) {
        if (state == Status.Enacting) {
            return "enacting voting ";
        }
        if (state == Status.publicVoting) {
            return "Running Public Vote ";
        }
    }

    function getVoterPin() public view _onlyVoter returns (bytes32) {
        return hasVoted[msg.sender].validation;
    }

    function voterState(address _voterAdd) public view returns (bool valid) {
        if (hasVoted[_voterAdd].isVoter == false) {
            revert InvalidDuplicateVoterError(_voterAdd);
        }
        return hasVoted[_voterAdd].hasVote;
    }

    function hasVotingEnded() public view returns (bool valid) {
        return (block.timestamp - lastTimeStamp) > votingPeriod;
    }

    //getting function candidateInfo
    function CanidateInfo(
        uint _candidateNumber
    )
        public
        view
        returns (bytes32 candidateId, string memory name, uint castedNumberVote)
    {
        require(
            _candidateNumber <= validCandidates.length,
            "invalid candidate number"
        );
        bytes32 candidateHash = validCandidates[_candidateNumber];
        return (
            candidates[candidateHash].id,
            candidates[candidateHash].name,
            candidates[candidateHash].castedVote
        );
    }

    function numberCandidate()
        public
        view
        returns (uint lengthNumberCandidate)
    {
        return validCandidates.length;
    }

    function numberVoter() public view returns (uint lenthOfVotersArray) {
        return voted.length;
    }

    function numberWinner() public view returns (uint winnerLength) {
        require(
            (block.timestamp - lastTimeStamp) > votingPeriod,
            "winner not set yet"
        );
        require(state == Status.Enacting);
        require(validCandidates.length == 0);
        return winners.length;
    }
}
