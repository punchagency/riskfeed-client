export const USER_STATUSES = ['pending', 'active', 'suspended'] as const;
export const ROLES = ['admin', 'user', 'contractor'] as const;
export const PROPERTY_TYPES = ['single_home', 'condo', 'multi_family', 'commercial'] as const;
export const OWNERSHIP_TYPES = ['owner', 'renter', 'lessee'] as const;
export const HEARD_ABOUT_SOURCES = ['online_search', 'google_search', 'friend_family_referral', 'contractor_referral', 'social_media', 'ad', 'other',] as const;

export const CONTRACTOR_SERVICES = ['kitchen_remodeling',  'bathroom_remodeling',  'roofing',  'flooring',  'painting',  'electrical',  'plumbing',  'hvac',  'landscaping',  'deck_patio',  'basement_finishing',  'windows_doors',] as const;
export const VERIFICATION_STATUSES = ['not_started', 'in_progress', 'verified', 'failed',] as const;
export const TEAM_SIZE_BUCKETS = ['solo', 'one_to_five', 'six_to_ten', 'eleven_to_twenty-five', 'twenty-five_to_fifty', 'fifty_plus'] as const;
export const CONTRACTOR_STATUSES = ['pending', 'active', 'suspended', 'deleted'] as const;
export const CERTIFICATE_STATUSES = ['under review', 'verified', 'expired'] as const;

interface IUserAddress {
    street: string;
    zipcode: string;
    city: string;
    state: string;
    country: string;
}

interface IUserProperty {
    type: typeof PROPERTY_TYPES[number];
    name?: string;
    address: IUserAddress;
    ownershipType?: typeof OWNERSHIP_TYPES[number];
    notes?: string;
}

export interface IUser {
    _id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
    email: string;
    phoneNumber: string;
    address: IUserAddress;
    notificationPreferences: {
        emailNotifications: boolean;
        pushNotifications: boolean;
        marketingCommunications: boolean;
    };
    status: typeof USER_STATUSES[number];
    role: typeof ROLES[number];
    ownershipType?: typeof OWNERSHIP_TYPES[number];
    properties?: IUserProperty[];
    heardAboutRiskfeed?: {
        source: typeof HEARD_ABOUT_SOURCES[number];
        otherDetails?: string;
    };
    contractor?: IContractor;
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

export interface IContractor {
    companyName: string;
    businessName?: string;
    licenseNumber: string;
    yearsInBusiness: number;
    taxId: string;
    ownerName?: string;
    businessEmail: string;
    businessPhone: string;
    businessWebsite?: string;
    businessAddress: {
        street: string;
        zipcode: string;
        city: string;
        state: string;
        country: string;
    };
    services: typeof CONTRACTOR_SERVICES[number][];
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
}