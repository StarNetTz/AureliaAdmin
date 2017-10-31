import * as $ from 'jquery';
import { inject, bindable, NewInstance } from 'aurelia-framework';
import { Config, Rest } from 'aurelia-api';
import * as Toastr from 'toastr';
import { ValidationRules, ValidationController } from 'aurelia-validation';
import { BootstrapFormRenderer } from '../../../resources/bootstrap-form-renderer';
import { I18N } from 'aurelia-i18n';
import { UserModel } from '../userModel';
import { Roles } from '../roles';


@inject(Config, NewInstance.of(ValidationController), I18N, Roles)
export class Edit {
    @bindable user;
    api: Rest;
    parent: any;
    validationController: ValidationController;
    i18n: I18N;
    roles: any;

    constructor(config: Config, validationController: ValidationController, i18n, Roles) {
        this.api = config.getEndpoint('api');
        this.validationController = validationController;
        this.i18n = i18n;
        this.roles = Roles.roles;
    }

    attached() {
        this.validationController.addRenderer(new BootstrapFormRenderer());
        this.setupValidationRules();
        console.log(this.user);
        this.initializeCopyProperty(this.user);
    }

    setupValidationRules() {
        console.log("validation rules");
        this.initializeCustomValidationRules();
        ValidationRules
            .ensure('DisplayName')
            .displayName(this.i18n.tr("addUser.displayName"))
            .required()
            .minLength(3)
            .maxLength(100)
            .ensure('UserName')
            .displayName(this.i18n.tr("addUser.userName"))
            .required()
            .ensure('Email')
            .displayName(this.i18n.tr("addUser.email"))
            .required()
            .email()
            .ensure('Password')
            .displayName(this.i18n.tr("addUser.password"))
            .required()
            .ensure('ConfirmPassword')
            .displayName(this.i18n.tr("addUser.password"))
            .required()
            .satisfiesRule('matchesProperty', 'Password')
            .on(this.user);
    }

    initializeCustomValidationRules() {
        console.log("custom rule");
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

    async saveChanges(user) {
        try {
            if (user.Roles.includes('admin')) {
                user.isAdmin = true;
            }
            else {
                user.isAdmin = false;
            }
            var resp = await this.api.request('PUT', '/users', user);
            user.isEditing = false;
            Toastr.success(this.i18n.tr("editUser.userChanged"));
        }
        catch (error) {
            Toastr.error("Failed to edit user", error);
        }
        finally {
        }


    }

    initializeCopyProperty(user: any) {
        user.copy = undefined;
        let copy = Object.assign({}, user);
        user.copy = copy;
    }

    cancel(user) {
        let original = user.copy;
        this.initializeCopyProperty(original);
        user = Object.assign(user, original);
        user.isEditing=false;
    }

    detached() {
        this.validationController.removeRenderer(new BootstrapFormRenderer());
    }


}