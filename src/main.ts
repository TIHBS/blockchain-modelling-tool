import { Aurelia } from 'aurelia-framework'
import * as environment from '../config/environment.json';
import { PLATFORM } from 'aurelia-pal';

import '@ustutt/grapheditor-webcomponent';

import { initialState } from './state';

export function configure(aurelia: Aurelia) {
    aurelia.use
        .standardConfiguration()
        .feature(PLATFORM.moduleName('resources/index'));

    aurelia.use.developmentLogging(environment.debug ? 'debug' : 'warn');

    if (environment.testing) {
        aurelia.use.plugin(PLATFORM.moduleName('aurelia-testing'));
    }

    aurelia.use.plugin(PLATFORM.moduleName('aurelia-store'), { initialState });

    aurelia.use.plugin(PLATFORM.moduleName('aurelia-event-aggregator'));

    // global resources
    aurelia.use.globalResources(PLATFORM.moduleName('resources/value-converters/json'));

    aurelia.start().then(() => aurelia.setRoot(PLATFORM.moduleName('app')));
}
