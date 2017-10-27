import * as $ from 'jquery';
import { inject, bindable, NewInstance } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { Config, Rest } from 'aurelia-api';
import * as Toastr from 'toastr';
import { UserModel } from './userModel';
import { Roles } from './roles';
import { ValidationRules, ValidationController } from 'aurelia-validation';
import { BootstrapFormRenderer } from '../../resources/bootstrap-form-renderer';
import { I18N } from 'aurelia-i18n';

@inject(EventAggregator, Config, NewInstance.of(ValidationController), I18N, Roles)
export class Users {
  api: Rest;
  eventAggregator: EventAggregator;
  isAddingUserSubscriber: any;
  validationController: ValidationController;
  i18n: I18N;
  roles: any;

  @bindable filter: String;
  isFiltering: boolean;

  newUserModel: UserModel;

  pageSize: number;
  currentPage: number;
  totalItems: number;
  showPagination: boolean;

  usersModel: any;

  constructor(eventAggregator: EventAggregator, config: Config, validationController: ValidationController, i18n, Roles) {
    this.eventAggregator = eventAggregator;
    this.api = config.getEndpoint('api');
    this.validationController = validationController;
    this.i18n = i18n;
    this.roles = Roles.roles;

    this.filter = "";

    this.totalItems = 0;
    this.currentPage = 0;
    this.pageSize = 9;
    this.showPagination = false;

    this.newUserModel = new UserModel();


  }

  attached() {
    this.validationController.addRenderer(new BootstrapFormRenderer());
    this.resetModel();
    this.setupValidationRules();
    this.filterUsers();
  }


  resetModel() {
    this.newUserModel.UserName = '';
    this.newUserModel.DisplayName = '';
    this.newUserModel.Email = '';
    this.newUserModel.Password = '';
    this.newUserModel.Roles = [];
  }

  setupValidationRules() {
    ValidationRules
      .ensure('UserName')
      .displayName(this.i18n.tr("addUser.userName"))
      .required()
      .minLength(3)
      .maxLength(100)
      .ensure('DisplayName')
      .displayName(this.i18n.tr("addUser.displayName"))
      .required()
      .ensure('Email')
      .displayName(this.i18n.tr("addUser.email"))
      .required()
      .email()
      .ensure('Password')
      .displayName(this.i18n.tr("addUser.password"))
      .required()
      .on(this.newUserModel);
  }

  async filterUsers() {
    try {
      this.isFiltering = true;
      let qry = { PageSize: this.pageSize, CurrentPage: this.currentPage, Qry: this.filter };
      this.usersModel = await this.api.find('/users', qry);
  
      this.transformUsersModel(this.usersModel.Data);
      this.setPaginationParameters(this.usersModel);
    } catch (error) {
      Toastr.error("Failed to filter users", error);
    }
    finally {
      this.isFiltering = false;
    }
  }

    transformUsersModel(users) {
      for (let user of users) {
        if (user.Roles.includes('admin'))
          user.isAdmin = true;
        user.isEditing = false;
        this.initializeCopyProperty(user);
      }
    }
  
    setPaginationParameters(usersModel) {
      this.totalItems = usersModel.TotalItems;
      this.currentPage = usersModel.CurrentPage;
      this.showPagination = usersModel.TotalItems > this.pageSize;
    }

  async addUser() {
    var res = await this.validationController.validate();
    console.log(res);
    if (res.valid) {
      $(".dropdown-menu").removeClass("show");
      var resp = await this.api.post('/users', this.newUserModel);
      this.filterUsers();
      this.notifyUserOfSuccess();
    }
    else {
      this.notifyUserOfException();
    }
  }

  notifyUserOfSuccess() {
    Toastr.success(this.i18n.tr("addUser.userAdded"));
  }

  notifyUserOfException() {
    Toastr.error(this.i18n.tr("addUser.fieldsRequested"));
  }

  editUser(user) { 
    user.isEditing = true;
  }

  async saveChanges(user) {
    var resp = await this.api.request('PUT', '/users', user);
    user.isEditing = false;
  }

  initializeCopyProperty(user : any) {
    user.copy = undefined;
    let copy = Object.assign({}, user);
    user.copy = copy;
  }

  cancel(user) {
    let original = user.copy;
    this.initializeCopyProperty(original);
    user =  Object.assign(user, original);
  }

  async filterChanged() {
    await this.filterUsers();
  }

  detached() {
    this.validationController.removeRenderer(new BootstrapFormRenderer());
  }

}
