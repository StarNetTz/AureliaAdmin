import { inject } from 'aurelia-dependency-injection';
import { Redirect } from 'aurelia-router';
import { AuthService } from 'aurelia-authentication';
import { RouterConfiguration, Router, NavigationInstruction, Next } from 'aurelia-router';

@inject(AuthService)
export class AuthorizeStep {
  authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  run(navigationInstruction: NavigationInstruction, next: Next) {
    const requiredRoles = this.getRequiredRoles(navigationInstruction);
    if (this.routeDoesNotRequireAnyRoles(requiredRoles))
      return next();

    let userRoles = this.getUserRoles();
    if (this.userHasNoRolesAssigned(userRoles))
      return this.cancelRoute(next);

    if (!this.userHasAnyRequiredRole(requiredRoles, userRoles))
      return this.cancelRoute(next);
    return next();
  }

  getRequiredRoles(instruction: any): String[] {
    let requiredRoles = instruction.config.roles;
    if (!requiredRoles)
      return [];
    return requiredRoles as String[];
  }

  routeDoesNotRequireAnyRoles(roles: String[]): Boolean {
    return roles.length == 0;
  }

  getUserRoles(): String[] {
    let payload = <any>this.authService.getTokenPayload();
    if (!payload)
      return [];
    if (!payload.roles)
      return [];
    return payload.roles as String[];
  }

  userHasNoRolesAssigned(roles: String[]): Boolean {
    return roles.length == 0;
  }

  cancelRoute(next: Next) {
    const loginRoute = this.authService.config.loginRoute;
    return next.cancel(new Redirect(loginRoute));
  }

  userHasAnyRequiredRole(requiredRoles: String[], actualRoles: String[]): Boolean {
    for (let actualRole of actualRoles) {
      if (requiredRoles.includes(actualRole))
        return true;
    }
    return false;
  }
}
