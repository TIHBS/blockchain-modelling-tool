export const NODE_SELECTION_CHANNEL = 'node-selection';

export class NodeSelectionMessage {
    readonly selectedNode: string | null;

    constructor(selectedNode: string | null) {
        this.selectedNode = selectedNode;
    };
}
