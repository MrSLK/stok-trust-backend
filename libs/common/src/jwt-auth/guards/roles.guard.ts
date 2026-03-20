/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/roles.decorator";
import { SystemRole } from "../../enums/system-role.enum";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<SystemRole[]>(ROLES_KEY, context.getHandler());
    console.log("requiredRoles =>", requiredRoles);
    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    console.log("user =>", user);

    return requiredRoles.includes(user.role);
  }
}
