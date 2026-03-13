import type { PROJECT_TYPES } from "@/interfaces/project/project.interface";
import type { CORPORATION_TYPES, HEARD_ABOUT_SOURCES, ROLES, TEAM_SIZE_BUCKETS, USER_STATUSES } from "../user.interface";

interface UpdateAddressDto {
  street?: string;
  zipcode?: string;
  city?: string;
  state?: string;
  country?: string;
}

interface UpdateNotificationPreferencesDto {
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  marketingCommunications?: boolean;
}

interface UpdateHeardAboutDto {
  source?: typeof HEARD_ABOUT_SOURCES[number];
  otherDetails?: string;
}

interface UpdateInsuranceDto {
  provider?: string;
  policyNumber?: string;
  coverageDetails?: string;
  expiryDate?: Date;
}
interface LicenseDto {
  number: string;
  description: string;
  state: string;
}
interface UpdateContractorDataDto {
  companyName?: string;
  businessName?: string;
  licenses?: LicenseDto[];
  corporationType?: typeof CORPORATION_TYPES[number];
  yearEstablished?: number;
  companyLogo?: File;
  taxId?: string;
  ownerName?: string;
  businessEmail?: string;
  businessPhone?: string;
  businessWebsite?: string;
  businessAddresses?: UpdateAddressDto[];
  services?: typeof PROJECT_TYPES[number][];
  serviceAreas?: string[];
  teamSize?: typeof TEAM_SIZE_BUCKETS[number];
  insurance?: UpdateInsuranceDto;
}

export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  profilePicture?: string;
  address?: UpdateAddressDto;
  notificationPreferences?: UpdateNotificationPreferencesDto;
  role?: (typeof ROLES)[number];
  status?: (typeof USER_STATUSES)[number];
  heardAboutRiskfeed?: UpdateHeardAboutDto;
  contractorData?: UpdateContractorDataDto;
}

