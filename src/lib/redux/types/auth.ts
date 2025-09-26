export interface BusinessRegisterRequest {
  business_name: string;
  business_type: string;
  business_address: string;
  business_logo: string; 
  cac: string;
  business_email: string;
  password: string;
}

export interface BusinessRegisterResponse {
  message: string;
  data: {
    email: string;
    phone: string;
    name: string;
    address: string;
    staff: {
      firstName: string;
      lastName: string;
      gender: string;
      email: string;
    }[];
    owner: {
      firstName: string;
      lastName: string;
      gender: string;
      email: string;
    };
  };
}
