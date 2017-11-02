import * as $ from 'jquery';
import { inject, bindable, NewInstance } from 'aurelia-framework';
import { Config, Rest } from 'aurelia-api';
import * as Toastr from 'toastr';
import { UserModel } from '../userModel';
import { ValidationRules, ValidationController } from 'aurelia-validation';
import { BootstrapFormRenderer } from '../../../resources/bootstrap-form-renderer';
import { I18N } from 'aurelia-i18n';

@inject(Config, NewInstance.of(ValidationController), I18N)
export class Adduser {
    api: Rest;
    validationController: ValidationController;
    i18n: I18N;

    newUserModel: UserModel;
    @bindable filterusers;

    roles: any;

    constructor(config: Config, validationController: ValidationController, i18n) {
        this.api = config.getEndpoint('api');
        this.validationController = validationController;
        this.i18n = i18n;
        this.newUserModel = new UserModel();
    }

    attached() {
        this.validationController.addRenderer(new BootstrapFormRenderer());
        this.initRolesAndNewUserModel();
        this.setupValidationRules();
    }

    async initRolesAndNewUserModel() {
        await this.initRoles();
        this.resetModel();
    }

    resetModel() {
        this.newUserModel.Username = '';
        this.newUserModel.DisplayName = '';
        this.newUserModel.Email = '';
        this.newUserModel.Password = '';
        this.newUserModel.ConfirmPassword = '';
        this.newUserModel.Roles = [];
        for (let role of this.roles) {
            this.newUserModel.Roles.push({ Name: role.Name, Id: role.Id, IsMemberOf: false });
        }
    }

    setupValidationRules() {
        this.initializeCustomValidationRules();
        ValidationRules
            .ensure('Username')
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
            .ensure('ConfirmPassword')
            .required()
            .satisfiesRule('matchesProperty', 'Password')
            .on(this.newUserModel);
    }

    initializeCustomValidationRules() {
        ValidationRules.customRule(
            'matchesProperty',
            (value, obj, otherPropertyName) =>
                value === null
                || value === undefined
                || value === ''
                || obj[otherPropertyName] === null
                || obj[otherPropertyName] === undefined
                || obj[otherPropertyName] === ''
                || value === obj[otherPropertyName],
            '${$displayName} must match ${$getDisplayName($config.otherPropertyName)}', otherPropertyName => ({ otherPropertyName })
        );
    }

    async initRoles() {
        this.roles = await this.api.find('/roles');
        console.log();
    }

    async addUser() {
        console.log(this.newUserModel);
        try {
            var res = await this.validationController.validate();
            if (res.valid) {
                $(".dropdown-menu").removeClass("show");
                var resp = await this.api.post('/users', this.newUserModel);
                this.resetModel();
                this.filterusers();
                Toastr.success(this.i18n.tr("addUser.userAdded"));
            }
            else {
                Toastr.error("All fields requested");
            }
        } catch (error) {
            Toastr.error("Failed to add user", error);
            console.log(error);
        }
        finally {
        }
    }

}