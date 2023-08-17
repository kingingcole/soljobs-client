// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./structs.sol";
import "./constants.sol";

/**
 * @title SolJobs
 * @dev Create, apply and award remote jobs on the blockchain
 */

contract SolJobs {
    address private manager;

    mapping (address => CreatorProfile) public creatorProfiles;
    mapping (address => ApplicantProfile) public applicantProfiles;

    uint internal numberOfCreatorProfiles;
    uint internal numberOfApplicantProfiles;

    mapping (string => bool) private creatorEmails;
    mapping (string => bool) private applicantEmails;

    mapping (address => bool) private creatorAddresses;
    mapping (address => bool) private applicantAddresses;

    JobOffer[] private jobOffers;
    JobApplication[] private jobApplications;

    mapping (address => JobOffer[]) private profileToJobsMapping;
    mapping (address => JobApplication[]) private profileToApplicationsMapping;

    constructor() {
        manager = msg.sender;
    }

    modifier accountIsUnique(string calldata _email) {
        require(creatorEmails[_email] == false && applicantEmails[_email] == false, emailAlreadyExistsMsg);
        require(creatorAddresses[tx.origin] == false && applicantAddresses[tx.origin] == false, addressAlreadyExistsMsg);

        _;
    }

    modifier callerHasCreatorProfile(address _address) {
        require(creatorAddresses[_address] == true, callerHasNoCreatorProfile);

        _;
    }

    modifier callerHasApplicantProfile(address _address) {
        require(applicantAddresses[_address] == true, callerHasNoApplicantProfile);

        _;
    }

    event CreatorProfileCreated(uint newCreatorID);
    event ApplicantProfileCreated(uint newApplicantID);
    event JobCreated(uint newJobID);
    event ApplicationSubmitted(uint applicationID);

    function createCreatorProfile(
        string calldata _name,
        string calldata _email,
        string calldata _description,
        string calldata _tagline
    ) accountIsUnique(_email) external {
        uint creatorID = ++numberOfCreatorProfiles;

        CreatorProfile storage profile = creatorProfiles[tx.origin];
        profile.id = creatorID;
        profile.name = _name;
        profile.email = _email;
        profile.description = _description;
        profile.tagline = _tagline;

        // add to emails and addresses list
        creatorEmails[_email] = true;
        creatorAddresses[tx.origin] = true;

        // defaults
        profile.verified = false;
        profile.profileType = ProfileType.Creator;
        profile.creatorAddress = tx.origin;

        emit CreatorProfileCreated(creatorID);
    }

    function createApplicantProfile(
        string calldata _fullname,
        string calldata _email,
        string calldata _location,
        string calldata _bio
    ) external accountIsUnique(_email) {
        uint applicantID = ++numberOfApplicantProfiles;

        ApplicantProfile storage profile = applicantProfiles[tx.origin];
        profile.id = applicantID;
        profile.fullname = _fullname;
        profile.email = _email;
        profile.location = _location;
        profile.bio = _bio;
        
        // add to emails and addresses list
        applicantEmails[_email] = true;
        applicantAddresses[tx.origin] = true;

        // defaults
        profile.profileType = ProfileType.Applicant;
        profile.applicantAddress = tx.origin;

        emit ApplicantProfileCreated(applicantID);
    }

    function createJobOffer(
        string calldata title,
        string calldata description,
        uint compensation,
        uint numberOfMaxHires
    ) external callerHasCreatorProfile(tx.origin) {
        uint jobID = jobOffers.length + 1;

        JobOffer storage jobOffer = jobOffers.push();
        jobOffer.id = jobID;
        jobOffer.title = title;
        jobOffer.description = description;
        jobOffer.compensation = compensation;
        jobOffer.numberOfMaxHires = numberOfMaxHires;

        // defaults
        CreatorProfile memory creator = creatorProfiles[tx.origin];
        jobOffer.creator = creator;
        jobOffer.status = JobOfferStatus.Open;
        jobOffer.numberHired = 0;

        profileToJobsMapping[tx.origin].push(jobOffer);

        emit JobCreated(jobID);
    }

    function applyForJob(
        uint jobID,
        string calldata coverLetter
    ) external callerHasApplicantProfile(tx.origin) {
        require(jobID > 0 && jobID <= jobOffers.length, "Invalid job ID");

        uint applicationID = jobApplications.length + 1;

        JobOffer storage jobOffer = jobOffers[jobID - 1];
        require(jobOffer.status == JobOfferStatus.Open, jobIsNoLongerOpen);

        JobApplication storage jobApplication = jobApplications.push();
        jobApplication.id = applicationID;
        jobApplication.jobOfferId = jobID;
        jobApplication.coverLetter = coverLetter;

        // defaults
        jobApplication.applicant = applicantProfiles[tx.origin];
        jobApplication.status = JobApplicationStatus.Pending;
        jobOffer.applications.push(jobApplication);

        profileToApplicationsMapping[tx.origin].push(jobApplication);

        emit ApplicationSubmitted(applicationID);
    }

    function approveApplication(uint applicationID) external callerHasCreatorProfile(tx.origin) {
        // fetch application and the parent job
        JobApplication storage jobApplication = jobApplications[applicationID - 1];
        JobOffer storage jobOffer = jobOffers[jobApplication.jobOfferId - 1];

        require(jobOffer.numberHired < jobOffer.numberOfMaxHires, jobMaxedOutHires);
        require(jobOffer.status == JobOfferStatus.Open, jobIsNoLongerOpen);
        require(jobApplication.status == JobApplicationStatus.Pending, applicationNotOpen);

        // change application status to approved
        jobApplication.status = JobApplicationStatus.Approved;
        jobOffer.numberHired++;

        // close job offer is max number of hires reached
        if (jobOffer.numberHired == jobOffer.numberOfMaxHires) {
            jobOffer.status = JobOfferStatus.Filled;
        }
    }

    function rejectApplication(uint applicationID) external callerHasCreatorProfile(tx.origin) {
        JobApplication storage jobApplication = jobApplications[applicationID - 1];

        // reject the application
        jobApplication.status = JobApplicationStatus.Rejected;
    }

    function getCreatedJobsForProfile(address profile) public view returns(JobOffer[] memory) {
        return profileToJobsMapping[profile];
    }

    function getApplicationsForProfile(address profile) public view returns(JobApplication[] memory) {
        return profileToApplicationsMapping[profile];
    }

    function getAllJobsCreated() public view returns(JobOffer[] memory) {
        return jobOffers;
    }

    function getJob(uint id) public view returns(JobOffer memory) {
        require(id > 0 && id <= jobOffers.length, "Invalid job ID");
        return jobOffers[id - 1];
    }

    function test() public pure returns(string memory) {
        return "hello";
    }

    // getter methods

    function getNumberOfCreatorProfiles() public view returns(uint) {
        return numberOfCreatorProfiles;
    }

    function getNumberOfApplicantProfiles() public view returns(uint) {
        return numberOfApplicantProfiles;
    }

    function getnumberOfJobsCreated() public view returns(uint) {
        return jobOffers.length;
    }

    function getNumberOfApplications() public view returns(uint) {
        return jobApplications.length;
    }
}