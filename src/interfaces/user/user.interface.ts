import type { PROJECT_TYPES } from "../project/project.interface";

export const USER_STATUSES = ['pending', 'active', 'suspended'] as const;
export const ROLES = ['admin', 'user', 'contractor'] as const;
export const PROPERTY_TYPES = ['single_home', 'condo', 'multi_family', 'commercial'] as const;
export const OWNERSHIP_TYPES = ['owner', 'renter', 'lessee'] as const;
export const HEARD_ABOUT_SOURCES = ['online_search', 'google_search', 'friend_family_referral', 'contractor_referral', 'social_media', 'ad', 'other',] as const;

export const VERIFICATION_STATUSES = ['not_started', 'in_progress', 'verified', 'failed',] as const;
export const TEAM_SIZE_BUCKETS = ['solo', 'one_to_five', 'six_to_ten', 'eleven_to_twenty-five', 'twenty-five_to_fifty', 'fifty_plus'] as const;
export const CONTRACTOR_STATUSES = ['pending', 'active', 'suspended', 'deleted'] as const;
export const CERTIFICATE_STATUSES = ['under review', 'verified', 'expired'] as const;
export const ACCOUNT_ROLES = ['owner', 'member'] as const;
export const CORPORATION_TYPES = ['sole_proprietorship', 'partnership', 'limited_liability_company', 'corporation', 'other'] as const;

interface IAddress {
    street: string;
    zipcode: string;
    city: string;
    state: string;
    country: string;
}
interface IUserWallet {
    balance: number;
    availableBalance: number;
    holdBalance: number;
    totalDeposited: number;
    totalEarned: number;
    totalWithdrawn: number;
}
export interface IUser {
    user: {
        _id: string;
        firstName: string;
        lastName: string;
        profilePicture?: string;
        email: string;
        phoneNumber: string;
        address: IAddress;
        notificationPreferences: {
            emailNotifications: boolean;
            pushNotifications: boolean;
            marketingCommunications: boolean;
        };
        status: typeof USER_STATUSES[number];
        role: typeof ROLES[number];
        heardAboutRiskfeed?: {
            source: typeof HEARD_ABOUT_SOURCES[number];
            otherDetails?: string;
        };
        wallet: IUserWallet;
        hasTransactionPin: boolean;
    };
    contractor?: IContractor;
    accountRole: typeof ACCOUNT_ROLES[number];
}


interface IContractorReview {
    rating: number;
    comment: string;
    reviewer: string;
    date: Date;
}

interface IContractorRatings {
    averageRatings: number;
    totalRatings: number;
    reviews: IContractorReview[];
    totalReviews: number;
}

interface IContractorCertification {
    name: string;
    issuingOrganization: string;
    status: typeof CERTIFICATE_STATUSES[number];
    attachments: string[];
    issueDate: Date;
    expirationDate: Date;
}

interface IContractorPortfolioItem {
    projectTitle: string;
    description: string;
    link?: string;
    images?: string[];
    completionDate?: Date;
}

interface IContractorInsurance {
    provider: string;
    policyNumber: string;
    coverageDetails?: string;
    expiryDate?: Date;
}

interface IContractorVerification {
    businessVerificationStatus: typeof VERIFICATION_STATUSES[number];
    licenseValidationStatus: typeof VERIFICATION_STATUSES[number];
    insuranceCheckStatus: typeof VERIFICATION_STATUSES[number];
    backgroundScreeningStatus: typeof VERIFICATION_STATUSES[number];
    financialHealthStatus: typeof VERIFICATION_STATUSES[number];
    lastVerifiedAt?: Date;
}
interface IContractorLicense {
    number: string;
    description: string;
    state: string;
}
export interface IContractor {
    _id: string;
    companyName: string;
    businessName?: string;
    companyLogo?: string;
    licenses: IContractorLicense[];
    corporationType: typeof CORPORATION_TYPES[number];
    yearEstablished: number;
    taxId: string;
    ownerName?: string;
    businessEmail: string;
    businessPhone: string;
    businessWebsite?: string;
    businessAddresses: IAddress[];
    services: typeof PROJECT_TYPES[number][];
    serviceAreas: string[];
    teamSize?: typeof TEAM_SIZE_BUCKETS[number];
    isBonded?: boolean;
    insurance?: IContractorInsurance;
    verification: IContractorVerification;
    hourlyRate?: number;
    ratings?: IContractorRatings;
    certifications: IContractorCertification[];
    portfolio: IContractorPortfolioItem[];
    savedProjects: string[];
    riskScore?: number;
    activeProjects?: number;
    completedProjects?: number;
    averageBudget?: number;
}