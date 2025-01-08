export class TaskTreeResponse {
  status: number
  tasks: Task[]
  mainTaskId: string
}

export class TaskTree {
  _id: number
  intentId: string
  intent: string
  description: any
  parentId?: string
  previousSiblingId: any
  expanded:Boolean = true
  children?:TaskTree[] = []
}

export interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}
