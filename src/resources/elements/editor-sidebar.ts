import { autoinject } from 'aurelia-dependency-injection';
import { EventAggregator, Subscription } from 'aurelia-event-aggregator';
import { connectTo, Store } from 'aurelia-store';

import { pluck } from 'rxjs/operators';

import { v4 as uuidv4 } from 'uuid';

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
        const currentView = this.activeProject.activeEditor.currentViewWindow;
        const actorComponent: ActorComponent = {
            type: 'actor',
            id: uuidv4(),
            title: 'Actor',
        };
        const node: Node = {
            id: uuidv4(),
            x: currentView.x + currentView.width/2,
            y: currentView.y + currentView.height/2,
            type: 'actor',
            elementId: actorComponent.id,
        };
        this.store
            .pipe('addProjectComponent', actorComponent)
            .pipe('addNode', node)
            .pipe('selectNode', node)
            .dispatch();
    }

    addSmartContract() {
        const currentView = this.activeProject.activeEditor.currentViewWindow;
        const smartContractComponent: SmartContractComponent = {
            type: 'smart-contract',
            id: uuidv4(),
            title: 'Smart Contract',
        };
        const node: Node = {
            id: uuidv4(),
            x: currentView.x + currentView.width/2,
            y: currentView.y + currentView.height/2,
            type: 'smart-contract',
            elementId: smartContractComponent.id,
        };
        this.store
            .pipe('addProjectComponent', smartContractComponent)
            .pipe('addNode', node)
            .pipe('selectNode', node)
            .dispatch();
    }

    addTransaction() {
        const currentView = this.activeProject.activeEditor.currentViewWindow;
        const transactionComponent: TransactionComponent = {
            type: 'transaction',
            id: uuidv4(),
            title: 'Transaction',
        };
        const node: Node = {
            id: uuidv4(),
            x: currentView.x + currentView.width/2,
            y: currentView.y + currentView.height/2,
            type: 'transaction',
            elementId: transactionComponent.id,
        };
        this.store
            .pipe('addProjectComponent', transactionComponent)
            .pipe('addNode', node)
            .pipe('selectNode', node)
            .dispatch();
    }

    addDatabase() {
        const currentView = this.activeProject.activeEditor.currentViewWindow;
        const repositoryComponent: RepositoryComponent = {
            type: 'repository',
            id: uuidv4(),
            title: 'Database',
        };
        const node: Node = {
            id: uuidv4(),
            x: currentView.x + currentView.width/2,
            y: currentView.y + currentView.height/2,
            type: 'database',
            elementId: repositoryComponent.id,
        };
        this.store
            .pipe('addProjectComponent', repositoryComponent)
            .pipe('addNode', node)
            .pipe('selectNode', node)
            .dispatch();
    }

}
