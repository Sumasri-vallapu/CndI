export interface FellowDetails {
  full_name: string;
  place: string;
  current_date: string;
}

export interface FellowDetailsResponse {
  status: string;
  data: FellowDetails;
} 