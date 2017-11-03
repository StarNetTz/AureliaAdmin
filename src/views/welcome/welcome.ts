import * as Toastr from 'toastr';
import { inject } from 'aurelia-framework';
import {DialogService} from 'aurelia-dialog';
import {Modal} from './modal/modal';
import {I18N} from 'aurelia-i18n';
import { Config, Rest } from 'aurelia-api';

@inject(DialogService, I18N, Config)
export class Welcome {
  dialogService : DialogService;
  i18n:I18N;
  api: Rest;   

  constructor(dialogService : DialogService, i18n:I18N, config: Config) {
    this.dialogService = dialogService;
    this.i18n = i18n;
    this.api = config.getEndpoint('api');    
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
