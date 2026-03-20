import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { MEMBER_ROLES_KEY } from "../decorators/member-roles.decorator";
import { MemberRole } from "../../enums/member-role.enum";
import { StokvelMembershipService } from "src/stokvel-membership/stokvel-membership.service";

@Injectable()
export class MemberRoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private stokvelMembershipService: StokvelMembershipService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<MemberRole[]>(MEMBER_ROLES_KEY, context.getHandler());

    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const stokvelId = request.params.stokvelId || request.body.stokvelId || request.query.stokvelId;

    if (!stokvelId) {
      throw new ForbiddenException("Stokvel ID is required");
    }

    const membership = await this.stokvelMembershipService.findOne({
      userId: user._id,
      stokvelId
    });

    if (!membership) {
      throw new ForbiddenException("You are not a member of this stokvel");
    }

    request.membership = membership;

    if (!requiredRoles.includes(membership.role)) {
      throw new ForbiddenException("Insufficient permissions");
    }

    return true;
  }
}
