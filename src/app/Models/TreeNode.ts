interface OntologyNode {
    entityText: string;
    entityId: number;
    entityType: string;
    errorType: number;
    node_id: string;
    parent: string | null;
    previous_sibling: string | null;
    editable: boolean;
    level: number;
    qTools: any; // Adjust the type according to your data
    extension: boolean;
    artificialParent: boolean;
    children?: OntologyNode[];
  }


export interface NodeResponse {
    nodes: Node[];
}

export class OntologyTreeNode {
  entityText: string
  entityId: number
  entityType: string
  errorType: number
  node_id: string
  parent: string
  previous_sibling: any
  editable: boolean
  level: number
  qTools: any
  extension: boolean
  artificialParent: boolean
  children?:OntologyTreeNode[] = []

}
