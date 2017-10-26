import {inject} from 'aurelia-dependency-injection';
import {AuthService} from 'aurelia-authentication';
import {RouteConfig} from 'aurelia-router';

@inject(AuthService)
export class AuthorizedFilterValueConverter {
  authService: AuthService;
  constructor(authService: AuthService) {
    this.authService = authService;
  }

  /**
   * route toView predictator on route.config.auth === (parameter || authService.isAuthenticated())
   * @param  {RouteConfig}  routes            the routes array to convert
   * @return {boolean}      show/hide elements
   */
  toView(routes: RouteConfig): boolean {
    var userRoles = this.getUserRoles();
    return routes.filter(route => this.routeShouldBeVisible(route, userRoles));
  }

  routeShouldBeVisible(route, userRoles) {
    let routeRoles = route.config.roles;
    if (!routeRoles)
      return true;
    return (this.userHasAnyRequiredRole(routeRoles, userRoles))
  }

  getUserRoles(): String[] {
    let payload = <any>this.authService.getTokenPayload();
    if (!payload)
      return [];
    if (!payload.roles)
      return [];
    return payload.roles as String[];
  }

  userHasAnyRequiredRole(requiredRoles: String[], actualRoles: String[]): Boolean {
    if (actualRoles.length == 0)
      return false;
    for (let actualRole of actualRoles) {
      if (requiredRoles.includes(actualRole))
        return true;
    }
    return false;
  }
}
