import * as Toastr from 'toastr';
import { inject } from 'aurelia-framework';
import {DialogService} from 'aurelia-dialog';
import {Modal} from './modal/modal';
import {I18N} from 'aurelia-i18n';

@inject(DialogService, I18N)
export class Welcome {
  dialogService : DialogService;
  i18n:I18N;

  constructor(dialogService : DialogService, i18n:I18N) {
    this.dialogService = dialogService;
    this.i18n = i18n;
  }
  
  showModal(){
    this.dialogService.open({ viewModel: Modal, model: this.i18n.tr("welcomeScreen.modalMsg"), lock: false }).whenClosed(response => {
      if (!response.wasCancelled) {
        console.log('good - ', response.output);
      } else {
        console.log('bad');
      }
      console.log(response.output);
    });
  }

  showInfoNotification() {
    Toastr.info('This works!');
  }

  showSuccessNotification() {
    Toastr.success('It is OK!');
  }

  showErrorNotification() {
    Toastr.error('Damn!', 'WTF');
  }

}
