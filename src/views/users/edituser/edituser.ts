import * as $ from 'jquery';
import { inject, bindable, NewInstance } from 'aurelia-framework';
import { Config, Rest } from 'aurelia-api';
import * as Toastr from 'toastr';
import { ValidationRules, ValidationController } from 'aurelia-validation';
import { BootstrapFormRenderer } from '../../../resources/bootstrap-form-renderer';
import { I18N } from 'aurelia-i18n';
import { UserModel } from '../userModel';

@inject(Config, NewInstance.of(ValidationController), I18N)
export class Edituser {

    @bindable user;
    api: Rest;
    parent: any;
    validationController: ValidationController;
    i18n: I18N;  

    constructor(config: Config, validationController: ValidationController, i18n) {
        this.api = config.getEndpoint('api');
        this.validationController = validationController;
        this.i18n = i18n;      
    }

    attached() {
        this.validationController.addRenderer(new BootstrapFormRenderer());
        this.setupValidationRules();     
        this.initializeCopyProperty(this.user);
        console.log(this.user);
    }

    setupValidationRules() {      
        this.initializeCustomValidationRules();
        ValidationRules
            .ensure('DisplayName')
            .displayName(this.i18n.tr("addUser.displayName"))
            .required()
            .minLength(3)
            .maxLength(100)
            .ensure('Username')
            .displayName(this.i18n.tr("addUser.userName"))
            .required()
            .ensure('Email')
            .displayName(this.i18n.tr("addUser.email"))
            .required()
            .email()
            .ensure('Password')
            .displayName(this.i18n.tr("addUser.password"))
            .minLength(4)          
            .ensure('ConfirmPassword')
            .displayName(this.i18n.tr("addUser.confirmPassword"))                  
            .satisfiesRule('matchesProperty', 'Password') 
            .when(Password => Password!==null)                 
            .on(this.user);
    }

    initializeCustomValidationRules() {     
        ValidationRules.customRule(
            'matchesProperty',
            (value, obj, otherPropertyName) => { 
                if (obj[otherPropertyName] === undefined || obj[otherPropertyName] === null || obj[otherPropertyName] === '')
                return true;
                return value === obj[otherPropertyName]; 
            },
            '${$displayName} must match ${$getDisplayName($config.otherPropertyName)}', otherPropertyName => ({ otherPropertyName })
        );       
    }

    async saveChanges(user) {
        try {
            if (user.Roles[0].IsMemberOf===true) {
                user.IsAdmin = true;
            }
            else {
                user.IsAdmin = false;
            }
            var res = await this.validationController.validate();
            if (res.valid) {
                var resp = await this.api.request('PUT', '/users', user);
                user.isEditing = false;
                Toastr.success(this.i18n.tr("editUser.userChanged"));
            }
            else {
               // Toastr.error("Popuniti sva polja");
               Toastr.success("<br /><br /><button type='button' class='btn clear'>Yes</button>",'delete item?',
               {
                   closeButton: false,
                   allowHtml: true
                   
               })
            }
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
        console.log(user);
        let original = user.copy;
        this.initializeCopyProperty(original);
        user = Object.assign(user, original);
        user.isEditing = false;
    }

    detached() {
        this.validationController.removeRenderer(new BootstrapFormRenderer());
    }


}