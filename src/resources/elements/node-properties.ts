import { observable } from 'aurelia-framework';
import { autoinject } from 'aurelia-dependency-injection';
import { EventAggregator, Subscription } from 'aurelia-event-aggregator';
import { connectTo, Store } from 'aurelia-store';

import { pluck } from 'rxjs/operators';

import { State, ProjectComponents, getProjectComponent, SelectedState } from '../../state';

import { Node } from '@ustutt/grapheditor-webcomponent/lib/node';
import { ProjectComponent } from 'project';

@autoinject()
@connectTo<State>((store) => store.state.pipe(pluck('selected')))
export class NodeProperties {

    state: SelectedState;

    nodeEdit: Node;
    componentEdit: ProjectComponent<string>;

    constructor(private store: Store<State>, private eventAggregator: EventAggregator) {}

    stateChanged(newState: SelectedState, oldState: SelectedState) {
        if (oldState?.selectedNode != null && newState?.selectedNode != null) {
            if (oldState.selectedNode.id === newState.selectedNode.id) {
                // selection has not changed (only values in the selected elements have changed)
                return;
            }
        }
        this.nodeEdit = Object.assign({}, newState.selectedNode);
        this.componentEdit = Object.assign({}, newState.selectedComponent);
    }

    nodeEditChanged() {
        console.log('Node Visuals Changed', this.nodeEdit);
    }

    componentEditChanged() {
        console.log('Component properties Changed', this.componentEdit);
    }
}
