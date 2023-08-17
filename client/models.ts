export enum ProfileType {
    Creator,
    Applicant
}

export interface CreatorProfile {
    id: number;
    email: string;
    name: string;
    tagline: string;
    description: string;
    creatorAddress: string;
    verified: boolean;
    profileType: ProfileType.Creator;
    jobOfferIDs: number[];
}

export interface ApplicantProfile {
    id: number;
    email: string;
    fullname: string;
    location: string;
    bio: string;
    applicantAddress: string;
    profileType: ProfileType.Applicant;
    applicationIDs: number[];
}

export interface JobOffer {
    id: number;
    title: string;
    description: string;
    compensation: number;
    creator: CreatorProfile;
    applications: JobApplication[];
    status: JobOfferStatus;
    numberOfMaxHires: number;
    numberHired: number;
}

export interface JobApplication {
    id: number;
    jobOfferId: number;
    coverLetter: string;
    applicant: ApplicantProfile;
    status: JobApplicationStatus;
}

export enum JobApplicationStatus {
    Pending,
    Approved,
    Rejected
}

export enum JobOfferStatus {
    Open,
    Filled,
    Closed
}

export type Profile = CreatorProfile | ApplicantProfile | null;