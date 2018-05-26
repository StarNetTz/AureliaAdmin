/// <reference types="aurelia-loader-webpack/src/webpack-hot-interface"/>
// we want font-awesome to load as soon as possible to show the fa-spinner
import {Aurelia} from 'aurelia-framework'
import environment from './environment';
import {PLATFORM} from 'aurelia-pal';
import * as Bluebird from 'bluebird';
import Backend from 'i18next-xhr-backend';
import {AuthConfig} from './authConfig';
import * as Toastr from 'toastr';
import { ValidationMessageProvider, ValidationController } from 'aurelia-validation';
import { I18N } from 'aurelia-i18n';
import { Container } from 'aurelia-dependency-injection';
import {AureliaConfiguration} from "aurelia-configuration";


Toastr.options = {
  "closeButton": false,
  "debug": false,
  "newestOnTop": false,
  "progressBar": false,
  "positionClass": "toast-top-right",
  "preventDuplicates": false,
  "onclick": null,
  "showDuration": "500",
  "hideDuration": "1000",
  "timeOut": "3000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}

// remove out if you don't want a Promise polyfill (remove also from webpack.config.js)
Bluebird.config({ warnings: { wForgottenReturn: false } });

export function configure(aurelia: Aurelia) {
  aurelia.use
    .standardConfiguration()
    .globalResources([
      PLATFORM.moduleName('aurelia-authentication/authFilterValueConverter'),
      PLATFORM.moduleName('resources/value-converters/authorizedFilterValueConverter')
    ])
    .feature(PLATFORM.moduleName('resources/index'))
    .plugin(PLATFORM.moduleName('aurelia-validation'))
    .plugin(PLATFORM.moduleName('aurelia-dialog'))
    .plugin(PLATFORM.moduleName('aurelia-configuration'))
    .plugin(PLATFORM.moduleName('aurelia-i18n'), (instance) => {
      instance.i18next.use(Backend);
      return instance.setup({
        backend: {
          loadPath: './locale/{{lng}}/{{ns}}.json',
        },
        ns: ['translation'],
        defaultNS: 'translation',
        lng: 'en',
        attributes: ['i18n', 't'],
        fallbackLng: 'en',
        debug: false
      });
    })
    .plugin(PLATFORM.moduleName('aurelia-api'), config => {
      let configInstance = aurelia.container.get(AureliaConfiguration);
      config.registerEndpoint('api', configInstance.get('api.backend'));
      config.registerEndpoint('auth', configInstance.get('api.auth'));
    })
    .plugin(PLATFORM.moduleName('aurelia-authentication'), baseConfig => {
      baseConfig.configure(AuthConfig);
    });

  // Uncomment the line below to enable animation.
  // aurelia.use.plugin(PLATFORM.moduleName('aurelia-animator-css'));
  // if the css animator is enabled, add swap-order="after" to all router-view elements

  // Anyone wanting to use HTMLImports to load views, will need to install the following plugin.
  // aurelia.use.plugin(PLATFORM.moduleName('aurelia-html-import-template-loader'));

  if (environment.debug) {
    aurelia.use.developmentLogging();
  }

  if (environment.testing) {
    aurelia.use.plugin(PLATFORM.moduleName('aurelia-testing'));
  }

  aurelia.start().then(() => {
    localizeValidation(Container.instance.get(I18N));
    aurelia.setRoot(PLATFORM.moduleName('shell'))
  });
}

function localizeValidation(i18n) {
  ValidationMessageProvider.prototype.getMessage = function (key) {
    const translation = i18n.tr(`errorMessages.${key}`);
    return this.parser.parse(translation);
  };

  ValidationMessageProvider.prototype.getDisplayName = function (propertyName) {
    return i18n.tr(propertyName);
  };
}
