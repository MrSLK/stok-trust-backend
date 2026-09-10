import { SystemRole } from "./../enums/system-role.enum";
import { MemberRole } from "./../enums/";
import { SetMetadata } from "@nestjs/common";

export const ROLES_KEY = "roles";

export const Roles = (...roles: (SystemRole | MemberRole)[]) => SetMetadata(ROLES_KEY, roles);
