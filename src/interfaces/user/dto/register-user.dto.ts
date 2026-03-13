import type { PROJECT_TYPES } from "@/interfaces/project/project.interface";
import type { CORPORATION_TYPES, HEARD_ABOUT_SOURCES, ROLES, TEAM_SIZE_BUCKETS, USER_STATUSES } from "../user.interface";

interface AddressDto {
  street: string;
  zipcode: string;
  city: string;
  state: string;
  country: string;
}

interface LicenseDto {
  number: string;
  description: string;
  state: string;
}

interface NotificationPreferencesDto {
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  marketingCommunications?: boolean;
}

interface HeardAboutDto {
  source: typeof HEARD_ABOUT_SOURCES[number];
  otherDetails?: string;
}

interface InsuranceDto {
  provider: string;
  policyNumber: string;
  coverageDetails?: string;
  expiryDate?: Date;
}

interface ContractorDataDto {
  companyName: string;
  businessName?: string;
  licenses: LicenseDto[];
  corporationType: typeof CORPORATION_TYPES[number];
  yearEstablished: number;
  companyLogo: File;
  taxId: string;
  ownerName?: string;
  businessEmail: string;
  businessPhone: string;
  businessWebsite?: string;
  businessAddresses: AddressDto[];
  services: typeof PROJECT_TYPES[number][];
  serviceAreas: string[];
  teamSize?: typeof TEAM_SIZE_BUCKETS[number];
  insurance?: InsuranceDto;
}

export interface RegisterUserDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  profilePicture?: string;
  address: AddressDto;
  notificationPreferences?: NotificationPreferencesDto;
  role?: (typeof ROLES)[number];
  status?: (typeof USER_STATUSES)[number];
  heardAboutRiskfeed?: HeardAboutDto;
  contractorData?: ContractorDataDto;
}

