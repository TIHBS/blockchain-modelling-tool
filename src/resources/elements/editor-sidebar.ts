import { autoinject } from 'aurelia-dependency-injection';
import { EventAggregator, Subscription } from 'aurelia-event-aggregator';
import { connectTo, Store } from 'aurelia-store';

import { pluck } from 'rxjs/operators';

import { v4 as uuidv4 } from 'uuid';

import { State, ActiveProjectState } from '../../state';
import { Node } from '@ustutt/grapheditor-webcomponent/lib/node';
import { ActorComponent, SmartContractComponent, TransactionComponent, RepositoryComponent, NodeComponent, BlockComponent, WalletComponent, BlockchainComponent, GroupComponent } from 'project';

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
            labelPosition: 'below',
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
            labelPosition: 'inside',
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
            labelPosition: 'inside',
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
            labelPosition: 'inside',
            elementId: repositoryComponent.id,
        };
        this.store
            .pipe('addProjectComponent', repositoryComponent)
            .pipe('addNode', node)
            .pipe('selectNode', node)
            .dispatch();
    }

    addNode() {
        const currentView = this.activeProject.activeEditor.currentViewWindow;
        const nodeComponent: NodeComponent = {
            type: 'node',
            id: uuidv4(),
            title: 'Node',
            icon: '',
        };
        const node: Node = {
            id: uuidv4(),
            x: currentView.x + currentView.width/2,
            y: currentView.y + currentView.height/2,
            type: 'node',
            labelPosition: 'inside',
            elementId: nodeComponent.id,
        };
        this.store
            .pipe('addProjectComponent', nodeComponent)
            .pipe('addNode', node)
            .pipe('selectNode', node)
            .dispatch();
    }

    addBlock() {
        const currentView = this.activeProject.activeEditor.currentViewWindow;
        const blockComponent: BlockComponent = {
            type: 'block',
            id: uuidv4(),
            title: 'Block',
        };
        const node: Node = {
            id: uuidv4(),
            x: currentView.x + currentView.width/2,
            y: currentView.y + currentView.height/2,
            type: 'block',
            labelPosition: 'inside',
            elementId: blockComponent.id,
        };
        this.store
            .pipe('addProjectComponent', blockComponent)
            .pipe('addNode', node)
            .pipe('selectNode', node)
            .dispatch();
    }

    addWallet() {
        const currentView = this.activeProject.activeEditor.currentViewWindow;
        const walletComponent: WalletComponent = {
            type: 'wallet',
            id: uuidv4(),
            title: 'Wallet',
        };
        const node: Node = {
            id: uuidv4(),
            x: currentView.x + currentView.width/2,
            y: currentView.y + currentView.height/2,
            type: 'wallet',
            labelPosition: 'below',
            elementId: walletComponent.id,
        };
        this.store
            .pipe('addProjectComponent', walletComponent)
            .pipe('addNode', node)
            .pipe('selectNode', node)
            .dispatch();
    }

    addBlockchain() {
        const currentView = this.activeProject.activeEditor.currentViewWindow;
        const blockchainComponent: BlockchainComponent = {
            type: 'blockchain',
            id: uuidv4(),
            title: 'Blockchain',
        };
        const node: Node = {
            id: uuidv4(),
            x: currentView.x + currentView.width/2,
            y: currentView.y + currentView.height/2,
            type: 'blockchain',
            labelPosition: 'below',
            elementId: blockchainComponent.id,
        };
        this.store
            .pipe('addProjectComponent', blockchainComponent)
            .pipe('addNode', node)
            .pipe('selectNode', node)
            .dispatch();
    }

    addGroup() {
        const currentView = this.activeProject.activeEditor.currentViewWindow;
        const groupComponent: GroupComponent = {
            type: 'group',
            id: uuidv4(),
            title: 'Group',
        };
        const node: Node = {
            id: uuidv4(),
            x: currentView.x + currentView.width/2,
            y: currentView.y + currentView.height/2,
            type: 'group',
            labelPosition: 'hidden',
            dynamicTemplate: 'group',
            width: 100,
            height: 70,
            padding: 20,
            fixSize: false,
            elementId: groupComponent.id,
        };
        this.store
            .pipe('addProjectComponent', groupComponent)
            .pipe('addNode', node)
            .pipe('selectNode', node)
            .dispatch();
    }
}
