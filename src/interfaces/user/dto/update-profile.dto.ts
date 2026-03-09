import type { PROJECT_TYPES } from "@/interfaces/project/project.interface";
import type { HEARD_ABOUT_SOURCES, OWNERSHIP_TYPES, PROPERTY_TYPES, ROLES, TEAM_SIZE_BUCKETS, USER_STATUSES } from "../user.interface";

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

interface UpdatePropertyDto {
  type?: typeof PROPERTY_TYPES[number];
  name?: string;
  address?: UpdateAddressDto;
  ownershipType?: typeof OWNERSHIP_TYPES[number];
  notes?: string;
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

interface UpdateContractorDataDto {
  companyName?: string;
  businessName?: string;
  licenseNumber?: string;
  yearsInBusiness?: number;
  taxId?: string;
  ownerName?: string;
  businessEmail?: string;
  businessPhone?: string;
  businessWebsite?: string;
  businessAddress?: UpdateAddressDto;
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
  ownershipType?: typeof OWNERSHIP_TYPES[number];
  properties?: UpdatePropertyDto[];
  heardAboutRiskfeed?: UpdateHeardAboutDto;
  contractorData?: UpdateContractorDataDto;
}

