import * as $ from 'jquery';
import 'bootstrap';
import { Router, RouterConfiguration } from 'aurelia-router';
import { PLATFORM } from 'aurelia-pal';
import { AuthenticateStep } from 'aurelia-authentication';
import { AuthorizeStep } from './resources/pipelineSteps/authorizeStep';

export class Shell {
  router: Router;
  constructor() {

  }

  configureRouter(config: RouterConfiguration, router: Router) {
    config.title = 'Aurelia Admin Skeleton';
    config.addPipelineStep('authorize', AuthenticateStep);
    config.addPipelineStep('authorize', AuthorizeStep);
    config.map([
      { route: ['', 'welcome', 'login'], name: 'welcome', title: "topNavBar.welcome", moduleId: PLATFORM.moduleName('./views/welcome/welcome'), nav: true },
      { route: 'dashboard', name: 'dashboard', title: "topNavBar.dashboard", moduleId: PLATFORM.moduleName('./views/dashboard/dashboard'), nav: true, auth: true },
      { route: 'users', name: 'users', title: "topNavBar.userManagement", moduleId: PLATFORM.moduleName('./views/users/users'), nav: true, auth: true, roles: ["admin"] }
    ]);
    this.router = router;
  }
 
}
