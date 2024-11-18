export interface Address {
  id: string;
  customerID: number;
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  fullAddress: string;
  isPrimary: boolean;
}

export interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    addresses: Address[];
  }