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

export type Profile = CreatorProfile | ApplicantProfile | null;