export interface TimeSlot {
  startTime: string;
  endTime: string;
  practice: string;
}

export interface WeeklyAvailability {
  dayOfWeek: string;
  timeSlots: TimeSlot[];
}

export interface Availability {
  timeZone: string;
  weeklyAvailability: WeeklyAvailability[];
}

export interface PractitionerQualification {
  degree: string;
  institution: string;
  yearOfCompletion: number;
}

export interface UpdatePractitionerInfoRequest {
  id: string;
  qualifications?: PractitionerQualification[] | null;
  yearsOfExperience?: number | null;
  bio?: string | null;
  availability?: Availability | null;
}

export interface PractitionerInfoResponse {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  specialization: string;
  practice: string;
  qualifications: PractitionerQualification[];
  yearsOfExperience: number;
  bio: string;
  availability: Availability;
}

export interface UpdateResponse {
  success: boolean;
  message: string;
}
