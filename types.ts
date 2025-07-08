export interface VCardData {
  firstName: string;
  lastName: string;
  title: string;
  company: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  photo?: string;
  companyLogo?: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}