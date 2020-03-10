import GraphEditor from '@ustutt/grapheditor-webcomponent/lib/grapheditor';
import { Node } from '@ustutt/grapheditor-webcomponent/lib/node';
import { LinkHandle } from '@ustutt/grapheditor-webcomponent/lib/link-handle';
import { GroupBehaviour } from '@ustutt/grapheditor-webcomponent/lib/grouping';
import { DynamicNodeTemplate, DynamicTemplateContext } from '@ustutt/grapheditor-webcomponent/lib/dynamic-templates/dynamic-template';
import { Point } from '@ustutt/grapheditor-webcomponent/lib/edge';
import { Rect, calculateBoundingRect } from '@ustutt/grapheditor-webcomponent/lib/util';


export class DynamicGroupTemplate implements DynamicNodeTemplate {

    private withText: boolean;

    constructor(withText: boolean) {
        this.withText = withText;
    }

    renderInitialTemplate(g: any, grapheditor: GraphEditor, context: DynamicTemplateContext<Node>): void {
        g.append('rect')
            .classed('select-outline', true)
            .attr('x', (d) => -(d.width / 2))
            .attr('y', (d) => -(d.height / 2))
            .attr('width', (d) => d.width)
            .attr('height', (d) => d.height)
            .attr('rx', 5)
            .attr('stroke', 'black')
            .attr('fill', 'white')
            .attr('stroke-dasharray', '4');
        if (this.withText) {
            g.append('text')
                .classed('text', true)
                .classed('text, label', true)
                .attr('width', (d) => d.width - 8)
                .attr('data-content', 'element.title');
        }
    }

    updateTemplate(g: any, grapheditor: GraphEditor, context: DynamicTemplateContext<Node>): void {
        g.select('rect')
            .attr('x', (d) => -(d.width / 2))
            .attr('y', (d) => -(d.height / 2))
            .attr('width', (d) => d.width)
            .attr('height', (d) => d.height);
        if (this.withText) {
            g.select('text')
                .attr('x', (d) => 4 - (d.width / 2))
                .attr('y', (d) => {
                    if (d.labelPosition === 'below') {
                        return 8 + (d.height / 2);
                    }
                    if (d.labelPosition === 'above') {
                        return -3 - (d.height / 2);
                    }
                    return 10 - (d.height / 2);
                })
        }
    }

    getLinkHandles(g: any, grapheditor: GraphEditor): LinkHandle[] {
        return [];
    }
}


export class DynamicGroupBehaviour implements GroupBehaviour {
    moveChildrenAlongGoup = true;
    captureDraggedNodes = true;
    allowFreePositioning = true;
    allowDraggedNodesLeavingGroup = true;

    afterNodeJoinedGroup(group: string, childGroup: string, groupNode: Node, childNode: Node, graphEditor: GraphEditor, atPosition?: Point) {
        this.reposition(group, groupNode, graphEditor);
    }

    afterNodeLeftGroup(group: string, childGroup: string, groupNode: Node, childNode: Node, graphEditor: GraphEditor) {
        this.reposition(group, groupNode, graphEditor);
    }

    onNodeMoveEnd(group: string, childGroup: string, groupNode: Node, childNode: Node, graphEditor: GraphEditor) {
        this.reposition(group, groupNode, graphEditor);
    }

    reposition(group: string, groupNode: Node, graphEditor: GraphEditor) {
        if (groupNode.fixSize ?? false) {
            // don't adjust size if requested by node
            return;
        }
        const children = graphEditor.groupingManager.getAllChildrenOf(group);
        const boxes: Rect[] = [];

        children.forEach(childId => {
            const node = graphEditor.getNode(childId);
            const bbox = graphEditor.getNodeBBox(childId);
            if (node == null || bbox == null) {
                return;
            }

            boxes.push({
                x: node.x + bbox.x,
                y: node.y + bbox.y,
                width: bbox.width,
                height: bbox.height,
            });
        });

        if (boxes.length < 1) {
            return;
        }

        const padding = Math.max(0, groupNode.padding ?? 10);

        const minBox = calculateBoundingRect(...boxes);
        minBox.x -= padding / 2;
        minBox.y -= padding / 2;
        minBox.width += padding;
        minBox.height += padding;

        const minSizedBox = {
            ...minBox,
            width: Math.max(100, minBox.width),
            height: Math.max(70, minBox.height),
        }

        const left = groupNode.x - (groupNode.width / 2);
        const top = groupNode.y - (groupNode.height / 2);
        if (minSizedBox.x > left) {
            minSizedBox.x = Math.max(left, minSizedBox.x - (minSizedBox.width - minBox.width));
        }
        if (minSizedBox.y > top) {
            minSizedBox.y = Math.max(top, minSizedBox.y - (minSizedBox.height - minBox.height));
        }

        const center: Point = {
            x: minSizedBox.x + (minSizedBox.width / 2),
            y: minSizedBox.y + (minSizedBox.height / 2),
        };

        groupNode.width = minSizedBox.width;
        groupNode.height = minSizedBox.height;
        groupNode.x = center.x;
        groupNode.y = center.y;
        graphEditor.moveNode(group, center.x, center.y);
        graphEditor.completeRender(); // FIXME remove if no longer needed
    }
}
