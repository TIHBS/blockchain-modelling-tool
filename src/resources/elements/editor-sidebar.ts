import { autoinject } from 'aurelia-dependency-injection';
import { EventAggregator, Subscription } from 'aurelia-event-aggregator';
import { connectTo, Store } from 'aurelia-store';

import { pluck } from 'rxjs/operators';

import uuidv4 from 'uuid/v4';

import { State, ActiveProjectState } from '../../state';
import { Node } from '@ustutt/grapheditor-webcomponent/lib/node';
import { NodeSelectionMessage } from 'resources/messages/messages';

@autoinject()
@connectTo<State>((store) => store.state.pipe(pluck('active')))
export class EditorSidebar {

    state: ActiveProjectState;

    selectedNode: string;

    eventSubscription: Subscription;

    constructor(private store: Store<State>, private eventAggregator: EventAggregator) {}

    stateChanged(newState: ActiveProjectState, oldState: ActiveProjectState) {
        console.log('The state has changed', newState);
    }

    bind() {
        this.eventSubscription = this.eventAggregator.subscribe(NodeSelectionMessage, (message: NodeSelectionMessage) => {
            this.selectedNode = message.selectedNode;
            console.log(message)
        });
    }

    unbind() {
        this.eventSubscription?.dispose();
    }

    addActor() {
        const zoom = this.state.activeEditor.currentZoomTransform;
        const node: Node = {
            id: uuidv4(),
            x: zoom.invertX(0),
            y: zoom.invertY(0),
            type: 'actor',
            element: {
                id: uuidv4(),
                title: 'Actor',
            }
        };
        console.log(this.state.activeEditor)
        this.store.dispatch('addNode', node);
    }

    addSmartContract() {
        const zoom = this.state.activeEditor.currentZoomTransform;
        const node: Node = {
            id: uuidv4(),
            x: zoom.invertX(0),
            y: zoom.invertY(0),
            type: 'smart-contract',
            element: {
                id: uuidv4(),
                title: 'Smart Contract',
            }
        };
        this.store.dispatch('addNode', node);
    }

    addTransaction() {
        const zoom = this.state.activeEditor.currentZoomTransform;
        const node: Node = {
            id: uuidv4(),
            x: zoom.invertX(0),
            y: zoom.invertY(0),
            type: 'transaction',
            element: {
                id: uuidv4(),
                title: 'Transaction',
            }
        };
        this.store.dispatch('addNode', node);
    }

    addDatabase() {
        const zoom = this.state.activeEditor.currentZoomTransform;
        const node: Node = {
            id: uuidv4(),
            x: zoom.invertX(0),
            y: zoom.invertY(0),
            type: 'database',
            element: {
                id: uuidv4(),
                title: 'Database',
            }
        };
        this.store.dispatch('addNode', node);
    }

}
