import { inject } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';

@inject(DialogController)
export class DangerModal {

    controller: DialogController;
    answer: String;
    user: any;

    constructor(controller: DialogController) {
        this.controller = controller;
        this.answer = null;

        controller.settings.centerHorizontalOnly = true;
    }

    activate(user) {
        this.user = user;
    }
}
