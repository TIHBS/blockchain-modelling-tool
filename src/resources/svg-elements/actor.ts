import { containerless, bindable } from 'aurelia-framework';

@containerless()
export class Actor {
    @bindable translate;
}
