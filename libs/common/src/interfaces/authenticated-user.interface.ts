import { SystemRole } from "../enums/system-role.enum";

export interface AuthenticatedUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: SystemRole;
}
