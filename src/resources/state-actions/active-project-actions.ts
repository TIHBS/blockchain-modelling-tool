import { State } from "state";
import GraphEditor from "@ustutt/grapheditor-webcomponent/lib/grapheditor";

export const changeActiveProject = (state: State, projectName: string, editor: GraphEditor) => {
    const newState = Object.assign({}, state);
    newState.active = {
        ... state.active,
        activeProject: projectName,
        activeEditor: editor,
        activeDiagram: {
            nodes: {},
            edges: {},
        }
    }

    return newState;
}
