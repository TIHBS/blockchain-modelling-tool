import { autoinject } from 'aurelia-dependency-injection';
import { connectTo, Store } from 'aurelia-store';

import { pluck } from 'rxjs/operators';

import { State, ActiveProjectState } from '../../state';
import { Node } from '@ustutt/grapheditor-webcomponent/lib/node';

@autoinject()
@connectTo<State>((store) => store.state.pipe(pluck('active')))
export class EditorSidebar {

    state: ActiveProjectState;

    constructor(private store: Store<State>) {}

    stateChanged(newState: ActiveProjectState, oldState: ActiveProjectState) {
        console.log('The state has changed', newState);
    }

    addActor() {
        const node: Node = {
            id: 'actor',
            x: 0,
            y: 0,
            type: 'actor',
            element: {
                id: 'actor',
                title: 'Actor',
            }
        };
        this.store.dispatch('addNode', node);
    }

    addSmartContract() {
        const node: Node = {
            id: 'smart-contract',
            x: 100,
            y: 0,
            type: 'smart-contract',
            element: {
                id: 'smart-contract',
                title: 'Smart Contract',
            }
        };
        this.store.dispatch('addNode', node);
    }

    addTransaction() {
        const node: Node = {
            id: 'transaction',
            x: 50,
            y: 70,
            type: 'transaction',
            element: {
                id: 'transaction',
                title: 'Transaction',
            }
        };
        this.store.dispatch('addNode', node);
    }

}
