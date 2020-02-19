import {bindable} from 'aurelia-framework';
import { autoinject } from 'aurelia-dependency-injection';
import { EventAggregator, Subscription } from 'aurelia-event-aggregator';
import { connectTo, Store } from 'aurelia-store';

import { pluck } from 'rxjs/operators';

import { State } from '../../state';

import { Node } from '@ustutt/grapheditor-webcomponent/lib/node';

@autoinject()
@connectTo<State>((store) => store.state.pipe(pluck('active', 'activeDiagram', 'nodes')))
export class NodeProperties {
    @bindable node: string;

    state: {[prop: string]: Node};

    nodeContent: Node;

    constructor(private store: Store<State>, private eventAggregator: EventAggregator) {}

    nodeChanged(newValue, oldValue) {
        console.log(newValue, this.state, this.state[newValue])
        if (newValue != null) {
            this.nodeContent = this.state[newValue];
        } else {
            this.nodeContent = null;
        }
    }
}
