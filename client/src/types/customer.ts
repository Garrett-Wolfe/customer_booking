export interface Address {
  street: string;
  street_line_2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface Customer {
  name: string;
  phone: string;
  address: Address;
  email: string;
  isNew: boolean;
  isTalking: boolean;
}
