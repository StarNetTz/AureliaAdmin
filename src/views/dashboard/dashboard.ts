import { inject } from 'aurelia-framework';
import { ValidationControllerFactory, ValidationRules, ValidationController } from 'aurelia-validation';


@inject(ValidationControllerFactory)
export class Dashboard {
  controller:ValidationController;
  title:string;
  
    constructor(controllerFactory : ValidationControllerFactory) {
      this.title = "";
        this.controller = controllerFactory.createForCurrentScope();
        ValidationRules
            .ensure('title').required()
            .on(this);
    }

    attached() {
      this.controller.validate().then(result=>{console.log(result)});
    }
}
