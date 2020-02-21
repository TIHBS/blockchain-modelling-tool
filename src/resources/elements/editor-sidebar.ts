import { autoinject } from 'aurelia-dependency-injection';
import { EventAggregator, Subscription } from 'aurelia-event-aggregator';
import { connectTo, Store } from 'aurelia-store';

import { pluck } from 'rxjs/operators';

import uuidv4 from 'uuid/v4';

import { State, ActiveProjectState } from '../../state';
import { Node } from '@ustutt/grapheditor-webcomponent/lib/node';
import { ActorComponent, SmartContractComponent, TransactionComponent, RepositoryComponent } from 'project';

@autoinject()
@connectTo<State>({
    selector: {
        activeProject: (store) => store.state.pipe(pluck('active')),
        selectedNode: (store) => store.state.pipe(pluck('selected', 'selectedNode')),
    }
})
export class EditorSidebar {

    activeProject: ActiveProjectState;

    selectedNode: Node;

    eventSubscription: Subscription;

    constructor(private store: Store<State>, private eventAggregator: EventAggregator) {}

    bind() {
        //this.eventSubscription = this.eventAggregator.subscribe(NodeSelectionMessage, (message: NodeSelectionMessage) => {
        //    this.selectedNode = message.selectedNode;
        //    console.log(message)
        //});
    }

    unbind() {
        //this.eventSubscription?.dispose();
    }

    addActor() {
        const zoom = this.activeProject.activeEditor.currentZoomTransform;
        const actorComponent: ActorComponent = {
            type: 'actor',
            id: uuidv4(),
            title: 'Actor',
        };
        const node: Node = {
            id: uuidv4(),
            x: zoom.invertX(0),
            y: zoom.invertY(0),
            type: 'actor',
            elementId: actorComponent.id,
        };
        this.store
            .pipe('addProjectComponent', actorComponent)
            .pipe('addNode', node)
            .dispatch();
    }

    addSmartContract() {
        const zoom = this.activeProject.activeEditor.currentZoomTransform;
        const smartContractComponent: SmartContractComponent = {
            type: 'smart-contract',
            id: uuidv4(),
            title: 'Smart Contract',
        };
        const node: Node = {
            id: uuidv4(),
            x: zoom.invertX(0),
            y: zoom.invertY(0),
            type: 'smart-contract',
            elementId: smartContractComponent.id,
        };
        this.store
            .pipe('addProjectComponent', smartContractComponent)
            .pipe('addNode', node)
            .dispatch();
    }

    addTransaction() {
        const zoom = this.activeProject.activeEditor.currentZoomTransform;
        const transactionComponent: TransactionComponent = {
            type: 'transaction',
            id: uuidv4(),
            title: 'Transaction',
        };
        const node: Node = {
            id: uuidv4(),
            x: zoom.invertX(0),
            y: zoom.invertY(0),
            type: 'transaction',
            elementId: transactionComponent.id,
        };
        this.store
            .pipe('addProjectComponent', transactionComponent)
            .pipe('addNode', node)
            .dispatch();
    }

    addDatabase() {
        const zoom = this.activeProject.activeEditor.currentZoomTransform;
        const repositoryComponent: RepositoryComponent = {
            type: 'repository',
            id: uuidv4(),
            title: 'Database',
        };
        const node: Node = {
            id: uuidv4(),
            x: zoom.invertX(0),
            y: zoom.invertY(0),
            type: 'database',
            elementId: repositoryComponent.id,
        };
        this.store
            .pipe('addProjectComponent', repositoryComponent)
            .pipe('addNode', node)
            .dispatch();
    }

}
