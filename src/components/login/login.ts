import { inject } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { Config, Rest } from 'aurelia-api';
import { AuthService } from 'aurelia-authentication';
import {EventAggregator} from 'aurelia-event-aggregator';
import * as Toastr from 'toastr';

@inject( I18N, Config, AuthService, EventAggregator)
export class Login { 
  i18n: I18N;
  username: String;
  password: String;
  isAuthenticated: boolean; isBusy: boolean;
  loggedUser: String;
  apiEndpoint: Rest;
  authService: AuthService;
  eventAggregator:EventAggregator;

  constructor( i18n: I18N, config: Config, authService: AuthService, eventAggregator:EventAggregator) {   
    this.i18n = i18n;
    this.apiEndpoint = config.getEndpoint('api');
    this.authService = authService;
    this.isAuthenticated = false;
    this.isBusy = false;
    this.loggedUser= "";
    this.username="";
    this.password="";
    this.eventAggregator= eventAggregator;
  } 

  async logIn() {
    this.isBusy = true;
    try {
      let resp = await this.authService.login({ UserName: this.username, Password: this.password });
      console.log(resp);
      var pl = <any>this.authService.getTokenPayload();  
      this.isAuthenticated = this.authService.authenticated;     
      this.loggedUser = pl.name;
      
    }
    catch (e) {
      console.log(e);
      Toastr.error("Invalid username or password", 'Login');
      this.isAuthenticated = false;    
      this.loggedUser = "";
    }
    finally
    {
      this.isBusy = false;
    }
    this.eventAggregator.publish('isAuthenticated', this.isAuthenticated);    
  }

  async logOut() {
    let resp = await this.authService.logout();   
    this.isAuthenticated = false;
    this.eventAggregator.publish('isAuthenticated', this.isAuthenticated);
    this.loggedUser = "";
  }

}
