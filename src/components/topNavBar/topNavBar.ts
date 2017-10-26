import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { I18N } from 'aurelia-i18n';
import { EventAggregator } from 'aurelia-event-aggregator';

@inject(Router, I18N, EventAggregator)
export class TopNavBar {
  router: Router;
  i18n: I18N;
  eventAggregator: EventAggregator;
  isAuthenticatedSubscriber: any; isAuthenticated: boolean;

  constructor(router: Router, i18n: I18N, eventAggregator: EventAggregator) {
    this.router = router;
    this.i18n = i18n;
    this.eventAggregator = eventAggregator;
  }

  setLocale(lang: string) {
    this.i18n.setLocale(lang);
  }

  attached() {
    this.isAuthenticatedSubscriber = this.eventAggregator.subscribe('isAuthenticated', isAuthenticated => {
      this.isAuthenticated = isAuthenticated;     
    });
  }

  detached() {
    this.isAuthenticatedSubscriber.dispose();
  }

}
