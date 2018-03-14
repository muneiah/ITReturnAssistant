import {Declaration} from './declaration';

export class User {
  id: string;
  password: string;
  email: string;
  name: string;
  pan: string;
  location: string;
  declaration: Declaration[];
}
