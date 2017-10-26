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
    roles: any;
    pageSize: number; currentPage: number;
    @bindable filter: String;
    isFiltering: boolean; totalItems: number; showPagination: boolean;
    usersModel: any;
    newUserModel: UserModel;
    validationController = null;
    i18n: I18N;
    editing = null; editObject: any; editModel: any;

    constructor(eventAggregator: EventAggregator, config: Config, validationController: ValidationController, i18n, Roles) {
        this.eventAggregator = eventAggregator;
        this.api = config.getEndpoint('api');
        this.totalItems = 0;
        this.currentPage = 0;
        this.pageSize = 9;
        this.filter = "";
        this.showPagination = false;
        this.newUserModel = new UserModel();
        this.validationController = validationController;
        this.i18n = i18n;
        this.roles = Roles.roles;
    }

    attached() {
        this.validationController.addRenderer(new BootstrapFormRenderer());
        this.resetModel();
        this.setupValidationRules();
        this.initUsers();
    }

    detached() {
        this.validationController.removeRenderer(new BootstrapFormRenderer());
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

    async initUsers() {
        let qry = { PageSize: this.pageSize, CurrentPage: this.currentPage, Qry: "" };
        this.usersModel = await this.api.find('/users', qry);
        this.setPaginationParameters(this.usersModel);
    }

    setPaginationParameters(usersModel) {       
        this.setIsAdminProperty(usersModel.Data);
        this.totalItems = usersModel.TotalItems;
        this.currentPage = usersModel.CurrentPage;
        this.showPagination = usersModel.TotalItems > this.pageSize;
    }

    setIsAdminProperty(users) {
        for (var i = 0; i < users.length; i++) {
            if (users[i].Roles.includes('admin')) {
                users[i].isAdmin = true;
            }
            else {
                users[i].isAdmin = false;
            }
        }      
    }

    async filterChanged() {
        await this.filterUsers();
    }

    async filterUsers() {
        try {
            this.isFiltering = true;
            let qry = { PageSize: this.pageSize, CurrentPage: this.currentPage, Qry: this.filter };
            this.usersModel = await this.api.find('/users', qry);
            this.setPaginationParameters(this.usersModel);
        } catch (error) {
            Toastr.error("Failed to filter users", error);
        }
        finally {
            this.isFiltering = false;
        }
    }

    async refresh(val) {
        let qry = { PageSize: this.pageSize, CurrentPage: val, Qry: this.filter };
        this.usersModel = await this.api.find('/users', qry);
        this.setPaginationParameters(this.usersModel);
    }

    async addUser() {
        $(".dropdown-menu").removeClass("show");
        var resp = await this.api.post('/users', this.newUserModel);
    }

    editUser(user) {
        this.editing = user;
        this.editObject = user;
        this.editModel = Object.assign({}, user);
    }

    async saveChanges() {
        this.editObject.UserId = this.editModel.Id;
        this.editObject.UserName = this.editModel.UserName;
        this.editObject.DisplayName = this.editModel.DisplayName;
        this.editObject.Email = this.editModel.Email;
        this.editObject.Password = this.editModel.Password;
        this.editObject.Roles = this.editModel.Roles;
        this.editObject.isAdmin = this.editModel.Roles.includes('admin');
        var resp = await this.api.request('PUT', '/users', this.editObject);
        this.editing = null;
        this.editObject = null;
        this.editModel = null;
    }

    cancel() {
        this.editing = null;
    }

}
