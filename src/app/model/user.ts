import {Declaration} from './declaration';

export class User {
  id: string;
  name: string;
  email: string;
  panNumber: string;
  location: string;
  declarations: Declaration[];
  password: string;
}
