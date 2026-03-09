import type { PROJECT_TYPES } from "@/interfaces/project/project.interface";
import type { HEARD_ABOUT_SOURCES, OWNERSHIP_TYPES, PROPERTY_TYPES, ROLES, TEAM_SIZE_BUCKETS, USER_STATUSES } from "../user.interface";

interface AddressDto {
  street: string;
  zipcode: string;
  city: string;
  state: string;
  country: string;
}

interface NotificationPreferencesDto {
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  marketingCommunications?: boolean;
}

interface PropertyDto {
  type: typeof PROPERTY_TYPES[number];
  name?: string;
  address: AddressDto;
  ownershipType?: typeof OWNERSHIP_TYPES[number];
  notes?: string;
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
  licenseNumber: string;
  yearsInBusiness: number;
  taxId: string;
  ownerName?: string;
  businessEmail: string;
  businessPhone: string;
  businessWebsite?: string;
  businessAddress: AddressDto;
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
  ownershipType?: typeof OWNERSHIP_TYPES[number];
  properties?: PropertyDto[];
  heardAboutRiskfeed?: HeardAboutDto;
  contractorData?: ContractorDataDto;
}

