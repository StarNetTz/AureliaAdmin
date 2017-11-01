import * as $ from 'jquery';
import { inject, bindable, NewInstance } from 'aurelia-framework'; 
import { Config, Rest } from 'aurelia-api';
import * as Toastr from 'toastr'; 
import { I18N } from 'aurelia-i18n';
import { DialogService } from 'aurelia-dialog';
import { DangerModal } from './dangerModal/dangerModal';

@inject(Config, I18N, DialogService)
export class Users {
    api: Rest;       
    i18n: I18N; 
    dialogService: DialogService;

    @bindable filter: String;
    isFiltering: boolean;
 

    pageSize: number;
    currentPage: number;
    totalItems: number;
    showPagination: boolean;   

    usersModel: any;

    constructor(  config: Config, i18n, dialogService: DialogService) {      
        this.api = config.getEndpoint('api');    
        this.i18n = i18n;       
        this.dialogService = dialogService;

        this.filter = "";

        this.totalItems = 0;
        this.currentPage = 0;
        this.pageSize = 10;
        this.showPagination = false;
    }

    attached() {       
        this.filterUsers();
    }

    async filterUsers() {
        try {
            this.isFiltering = true;
            let qry = { PageSize: this.pageSize, CurrentPage: this.currentPage, Qry: this.filter };
            this.usersModel = await this.api.find('/users', qry);
           
            this.transformUsersModel(this.usersModel.Data);
            console.log(this.usersModel);
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
            user.isEditing = false;
            this.initializeCopyProperty(user);
        }
    }

    setPaginationParameters(usersModel) {
        this.totalItems = usersModel.TotalItems;
        this.currentPage = usersModel.CurrentPage;
        this.showPagination = usersModel.TotalItems > this.pageSize;
    } 

    async refresh(val) {
        this.currentPage = val;
        await this.filterUsers();
    }

    editUser(user) {
        user.isEditing = true;
    }

    showDeleteUserModal(user) {
        this.dialogService.open({ viewModel: DangerModal, model: user, lock: false }).whenClosed(response => {
            if (!response.wasCancelled) {
                this.deleteUser(user);
            } else {
            }
        });
    }

    async deleteUser(user) {
        try {
            if (!this.isAdministrator(user)) {
                // var resp = await this.api.request('DELETE', '/users', user);
                var index = this.usersModel.Data.indexOf(user);
                if (index > -1) {
                    this.usersModel.Data.splice(index, 1);
                }
                //  this.filterUsers();
                Toastr.success(this.i18n.tr("editUser.userDeleted"));
            } else {
                Toastr.error(this.i18n.tr("editUser.cannotDeleteAdmin"));

            }
        }
        catch (error) {
            Toastr.error("Failed to delete user", error);
        }
        finally {
        }
    }

    isAdministrator(user) {
        return user.Email === 'admin@bookmaker.com';
    }

    initializeCopyProperty(user: any) {
        user.copy = undefined;
        let copy = Object.assign({}, user);
        user.copy = copy;
    }

    async filterChanged() {
        await this.filterUsers();
    }

  

}
