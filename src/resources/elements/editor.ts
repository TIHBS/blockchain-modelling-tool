import { autoinject } from 'aurelia-dependency-injection';
import { EventAggregator, Subscription } from 'aurelia-event-aggregator';
import { connectTo, Store } from 'aurelia-store';
import { pluck } from 'rxjs/operators';

import { State, ActiveDiagramState, ActiveProjectState, getProjectComponent, SelectedState } from '../../state';

import GraphEditor from '@ustutt/grapheditor-webcomponent/lib/grapheditor'
import { Node } from '@ustutt/grapheditor-webcomponent/lib/node';
import { Edge } from '@ustutt/grapheditor-webcomponent/lib/edge';
import { NodeChangedMessage, ProjectComponentChangedMessage, NodePositionChangedMessage } from 'resources/messages/messages';
import { Rect } from '@ustutt/grapheditor-webcomponent/lib/util';

@autoinject()
@connectTo<State>({
    selector: {
        activeProject: (store) => store.state.pipe(pluck('active')),
        selectedNode: (store) => store.state.pipe(pluck('selected', 'selectedNode')),
    }
})
export class Editor {

    private nodeChangedSubscription: Subscription;
    private componentChangedSubscription: Subscription;

    public activeProject: ActiveProjectState;
    public selectedNode: Node;

    grapheditor: GraphEditor;
    minimap: GraphEditor;

    currentVisibleArea: Rect = {x: 0, y: 0, width: 1, height: 1};

    private componentToNode: Map<string, Set<string>> = new Map<string, Set<string>>();

    constructor(private store: Store<State>, private eventAggregator: EventAggregator) {}

    bind() {
        this.nodeChangedSubscription = this.eventAggregator.subscribe(NodeChangedMessage, (msg) => this.nodeChanged(msg));
        this.componentChangedSubscription = this.eventAggregator.subscribe(ProjectComponentChangedMessage, (msg) => this.componentChanged(msg));
    }

    attached() {
        this.store.dispatch('changeActiveProject', 'Playground', this.grapheditor);


        this.grapheditor.onCreateDraggedEdge = (edge) => {
            if (edge.createdFrom == null || edge.createdFrom == undefined) {
                edge.markerEnd = {template: 'arrow', positionOnLine: 1, scale: 0.5, relativeRotation: 0};
            }
            return edge
        }

        this.grapheditor.addEventListener('nodeclick', (event: CustomEvent) => {
            const node = event.detail.node;
            if (this.grapheditor.selected.has(node.id)) {
                return;
            }
            event.preventDefault();
            if (this.selectedNode?.id === node.id) {
                // unselect on selecting again
                this.store.dispatch('selectNode', null);
            } else {
                this.store.dispatch('selectNode', node);
            }
        });

        this.grapheditor.addEventListener('nodedragend', (event: CustomEvent) => {
            const node = event.detail.node;
            if (event.detail.eventSource !== 'USER_INTERACTION') {
                return;
            }
            const oldNode = this.activeProject.activeDiagram.nodes[node.id];
            const newNode = {
                ...oldNode,
                x: node.x,
                y: node.y,
            };
            this.store.pipe('updateNode', newNode).dispatch();
            this.eventAggregator.publish(new NodePositionChangedMessage(newNode, oldNode, 'graph'));
        });

        // bind minimap
        this.grapheditor.addEventListener('nodeadd', (event: CustomEvent) => {
            this.minimap.addNode(event.detail.node);
        });
        this.grapheditor.addEventListener('noderemove', (event: CustomEvent) => {
            this.minimap.removeNode(event.detail.node);
        });
        this.grapheditor.addEventListener('render', (event: CustomEvent) => {
            if (event.detail.rendered === 'complete') {
                this.minimap.completeRender();
                this.minimap.zoomToBoundingBox();
            } else if (event.detail.rendered === 'text') {
                // ignore for minimap
            } else if (event.detail.rendered === 'classes') {
                this.minimap.updateNodeClasses();
            } else if (event.detail.rendered === 'positions') {
                this.minimap.completeRender();
                this.minimap.zoomToBoundingBox();
            }
        });
        this.grapheditor.addEventListener('zoomchange', (event: CustomEvent) => {
            this.currentVisibleArea = event.detail.currentViewWindow;
        });
    }

    unbind() {
        this.store.dispatch('changeActiveProject', null, null);
        this.nodeChangedSubscription?.dispose();
        this.componentChangedSubscription?.dispose();
    }

    activeProjectChanged(newState: ActiveProjectState, oldState: ActiveProjectState) {
        if (this.grapheditor == null || oldState == null) {
            return;
        }

        const oldGraph: ActiveDiagramState = oldState.activeDiagram;
        const newGraph: ActiveDiagramState = newState.activeDiagram;

        let hasChanged = false;

        Object.keys(oldGraph.nodes).forEach(id => {
            if (newGraph.nodes[id] == null) {
                const node = oldGraph.nodes[id];
                this.componentToNode.get(node.elementId).delete(node.id.toString());
                this.grapheditor.removeNode(oldGraph.nodes[id]);
                hasChanged = true;
            }
        });
        Object.keys(newGraph.nodes).forEach(id => {
            if (oldGraph.nodes[id] == null) {

                const node: Node = Object.assign({}, newGraph.nodes[id]);

                node.element = getProjectComponent(newState.activeProjectComponents, node.elementId);
                if (node.element == null) {
                    console.error('Could not create node!', node);
                }

                if (!this.componentToNode.has(node.elementId)) {
                    this.componentToNode.set(node.elementId, new Set<string>());
                }
                this.componentToNode.get(node.elementId).add(node.id.toString());
                this.grapheditor.addNode(node);
                hasChanged = true;
            }
        });
        Object.keys(oldGraph.edges).forEach(id => {
            if (newGraph.edges[id] == null) {
                this.grapheditor.removeEdge(oldGraph.edges[id]);
                hasChanged = true;
            }
        });
        Object.keys(newGraph.edges).forEach(id => {
            if (oldGraph.edges[id] == null) {
                this.grapheditor.addEdge(newGraph.edges[id]);
                hasChanged = true;
            }
        });

        if (hasChanged) {
            this.grapheditor.completeRender();
            this.grapheditor.zoomToBoundingBox();
        }
    }

    selectedNodeChanged(newSelected: Node, oldSelected: Node) {
        if (newSelected?.id === oldSelected?.id) {
            return;
        }
        if (newSelected == null) {
            this.grapheditor.changeSelected(new Set());
        } else {
            this.grapheditor.changeSelected(new Set([newSelected.id as string]));
        }
    }

    nodeChanged(msg: NodeChangedMessage) {
        if (msg.source === 'graph') {
            return;
        }
        const node = this.grapheditor.getNode(msg.newNode.id);
        Object.keys(msg.newNode).forEach(key => {
            if (key === 'id' || key === 'x' || key === 'y') {
                return;
            }
            node[key] = msg.newNode[key];
        });
        this.grapheditor.completeRender();
        if (msg.newNode.x !== msg.oldNode.x || msg.newNode.y !== msg.oldNode.y) {
            this.grapheditor.moveNode(node.id, msg.newNode.x, msg.newNode.y, true);
        }
    }

    componentChanged(msg: ProjectComponentChangedMessage) {
        if (msg.source === 'graph') {
            return;
        }
        const nodes = this.componentToNode.get(msg.newComponent.id);
        nodes?.forEach(nodeId => {
            const node = this.grapheditor.getNode(nodeId);
            node.element = msg.newComponent;
        });
        this.grapheditor.completeRender();
    }
}
