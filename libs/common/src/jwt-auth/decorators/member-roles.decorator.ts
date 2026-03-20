import { SetMetadata } from "@nestjs/common";
import { MemberRole } from "../../enums/member-role.enum";

export const MEMBER_ROLES_KEY = "memberRoles";

export const MemberRoles = (...roles: MemberRole[]) => SetMetadata(MEMBER_ROLES_KEY, roles);
