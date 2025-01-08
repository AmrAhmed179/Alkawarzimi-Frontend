export interface Menus {
    name: string;
    menuId: number;
    problemMeun: boolean;
    type: number;
    serviceId: number;
    nodes: MenuNodes[];
}

export interface MenuNodes {
    nodeLangInfo: MenuNodeLangInfo[];
    entityId: number;
    root: boolean;
    action: MenuAction;
    storyGroups: StoryGroup[];
    menuItemId: string;
    iconSrc: string;
    node_id: string;
    parent: string;
    previous_sibling: string;
}

export interface MenuNodeLangInfo {
    entityText: string;
    stemmedEntity: string;
    language: string;
}

export interface MenuAction {
    type: string;
    goToTaskId: string;
    responses: MenuLangResponse[];
}

export interface MenuLangResponse {
    text: string;
    language: string;
}

export interface StoryGroup {
    storyEntities: storyEnitites[];
}

export interface storyEnitites {
    entityId: number;
    text: string;
}

export interface RealtedProblems {
    nodeId: string;
    mainDoc: string;
    docs: ProblemDoc[];
}

export interface ProblemDoc {
    userInput: string;
    similarity: number;
}