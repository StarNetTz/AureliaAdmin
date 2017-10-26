import {inject} from 'aurelia-framework';
import {DialogController} from 'aurelia-dialog';

@inject(DialogController)
export class Modal {
  
  controller : DialogController;
  answer:String;
  message:String;

  constructor(controller : DialogController) {
    this.controller = controller;
    this.answer = null;

    controller.settings.centerHorizontalOnly = true;
 }

 activate(message) {
    this.message = message;
 }
}
