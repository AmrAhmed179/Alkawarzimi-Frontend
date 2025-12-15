import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MenusService } from 'src/app/Services/Build/menus.service';
import { DataService } from 'src/app/core/services/data.service';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTree, MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { CdkDragDrop, CdkDragStart, moveItemInArray } from '@angular/cdk/drag-drop';
import { NotifyService } from 'src/app/core/services/notify.service';
import { MatDialog } from '@angular/material/dialog';
import { MenuAddComponent } from '../menu-add/menu-add.component';
import { MenuEditComponent } from '../menu-edit/menu-edit.component';
import { MenuDeleteComponent } from '../menu-delete/menu-delete.component';
import { stringify } from 'querystring';
import { ITreeOptions, TreeComponent } from '@circlon/angular-tree-component';
import { OptionsServiceService } from 'src/app/Services/options-service.service';
import { fi } from 'date-fns/locale';
import { lang } from 'moment';

export class Menu {
  menuId!: number;
  name!: string;
  nodes!: MenuNode[]   // Reuse the StoryNode class we made earlier
  problemMeun!: boolean;
  serviceId!: number;
  type!: number;
}
export class NodeLangInfo {
  entityText?: string;
  stemmedEntity?: string | null;
  language?: string;
}

export class Response {
  text?: string | null;
  language?: string;
}

export class Action {
  type?: string;
  goToTaskId?: number | null;
  responses?: Response[];
}

export class MenuNode {
  nodeLangInfo?: NodeLangInfo[];
  entityId?: number;
  root?: boolean;
  action?: Action;
  storyGroups?: any[];
  menuItemId?: number | null;
  iconSrc?: string | null;
  node_id?: string;
  parent?: string | null;
  previous_sibling?: string | null;
  children?:MenuNode[]
}

@Component({
  selector: 'vex-menus-info',
  templateUrl: './menus-info.component.html',
  styleUrls: ['./menus-info.component.scss']
})

export class MenusInfoComponent implements OnInit {
  menu: Menu;
  searchNode
  private projectSubscription: Subscription;
  projectId: number;
  menuId: number;
  nodes: MenuNode[] = [];
  currentNodeId
  selectedLang: string;
  private languageSubscription: Subscription;
  selectedNode:MenuNode
  tasks
  menuName
  searchQuery: string = '';
  filteredNodes: any[] = [];
 @ViewChild('tree') tree: TreeComponent;
 hasChild = (_: number, node: MenuNode) => !!node.children && node.children.length > 0;
   options: ITreeOptions = {
    rtl: false,
    displayField: 'name',
    isExpandedField: 'expanded',
    allowDrag: (node: any) => {
      return true;
    },
    nodeHeight: 50,
    allowDragoverStyling: true,
    levelPadding: 20,
    animateExpand: true,
    animateSpeed: 30,
    animateAcceleration: 1.2,
    scrollOnActivate: true,
    useVirtualScroll: true,
  }

  constructor(
    private _menuService: MenusService,
    private _dataService: DataService,
    private route: ActivatedRoute,
    private notify: NotifyService,
    public dialog: MatDialog,
    private router: Router,
    private _optionsService: OptionsServiceService,
  ) { }

  ngOnInit(): void {
    let firstEnter = true
    this.projectSubscription = this._dataService.$project_bs.subscribe((project) => {
      this.projectId = +project._id;
      this.route.paramMap.subscribe((params: Params) => {
        this.menuId = +params.get('menuId');
        this.languageSubscription = this._optionsService.selectedLang$.subscribe((response) => {
          if (response) {
            if(firstEnter){
            this.getSystemMenu();
            this.getTasks();
            firstEnter = false
            }
           this.selectedLang = response;
           this.handleNodeClick(this.selectedNode)

          }
        });
      });
    });
  }

  getSystemMenu() {
    this._menuService.GetMenus(this.projectId).subscribe((response: any) => {
      const result = response.menus;
      if (result) {
        const filteredMenus = result.find(x => x.menuId === this.menuId);
        if (filteredMenus) {
          this.menu = filteredMenus;
          this.menuName = this.menu.name;
          if(!(this.menu.nodes && this.menu.nodes .length > 0)){
            this.menu.nodes = []
             this.menu.nodes.push(this.rootNode())
          }
          this.nodes = this.constructMenuTree(this.menu.nodes);
          setTimeout(() => {
            this.tree.treeModel.expandAll();
          });
        }
      }
    });
  }

  constructTree(nodes: any[], nodeId: string, language: string): any {
    let currentNode: any = { ...nodes.find((node) => node.node_id === nodeId) };

    if (!currentNode) {
      return null;
    }

    currentNode.children = nodes
      .filter((node) => node.parent === nodeId && this.hasLanguage(node.nodeLangInfo, language))
      .map((childNode) => this.constructTree(nodes, childNode.node_id, language));

    this.currentNodeId = nodeId;
    return currentNode;
  }

  constructMenuTree(TreeNodes): MenuNode[] {
      const tree: MenuNode[] = [];
      // Create a map to store intents by their intentId
      const map: { [key: string]: MenuNode } = {};

      // Initialize the map with intents
      TreeNodes.forEach(intent => {
        map[intent.node_id] = { ...intent, children: [] };
      });

      // Iterate over the data to construct the tree
      TreeNodes.forEach(intent => {
        if (intent.parent) {
          // If the intent has a parentId, add it as a child to its parent
          const parent = map[intent.parent];
          if (parent) {
            parent.children.push(map[intent.node_id]);
          }
        } else {
          // If the intent does not have a parentId, it is a root node
          tree.push(map[intent.node_id]);
        }
      });
     Object.values(map).forEach(n=>{
      let childern:MenuNode[] = []
        if(n.children.length > 1){
          for (let index = 0; index < n.children.length; index++) {
            if(childern.length == 0){
            let parent = n.children.find(x=>x.previous_sibling == null)
            if(parent){
              childern.push(parent)
            }
          }
            else{
              var nextNode = n.children.find(x=>x.previous_sibling == childern[childern.length-1].node_id)
              if(nextNode)
               childern.push(nextNode)
            }
          }
          if(n.children.length == childern.length)
          n.children = childern
          else{
              const missingItems =  n.children.filter(primaryItem =>
            !childern.some(secondaryItem =>
            primaryItem.node_id === secondaryItem.node_id // or any other comparison logic
            )
            );
          n.children = [...childern, ...missingItems]
        }
        }
      })
      console.log('tree',tree)
      return tree;
    }
  hasLanguage(nodeLangInfo: NodeLangInfo[], language: string): boolean {
    return nodeLangInfo.some(langInfo => langInfo.language === language);
  }

  findMaxNodeId(nodes: any[]): number {
    let maxNodeId = 0;

    function traverse(node: any) {
      const tokens = node.node_id.split('_');

      if (tokens.length < 2) {
        return;
      }

      const curNodeId = parseInt(tokens[1], 10);

      if (maxNodeId < curNodeId) {
        maxNodeId = curNodeId;
      }

      if (node.children && node.children.length > 0) {
        for (const childNode of node.children) {
          traverse(childNode);
        }
      }
    }

    for (const rootNode of nodes) {
      traverse(rootNode);
    }

    return maxNodeId + 1;
  }

  // add new node



  findNodeById(nodes: any, nodeId: string): any {
    for (const node of nodes) {
      if (node.node_id === nodeId) {
        return node;
      }
      if (node.children) {
        const foundNode = this.findNodeById(node.children, nodeId);  // Corrected this line
        if (foundNode) {
          return foundNode;
        }
      }
    }
    return null;
  }

  // Dialog to add new node

  openAddNodeDialog(parentId: string): void {
    const dialogRef = this.dialog.open(MenuAddComponent, {
      width: '400px',
      disableClose: true,
      data: { lang: this.selectedLang }
    });

    dialogRef.afterClosed().subscribe(newNode => {
      if (newNode) {
        this.addNodeToParent(newNode, parentId);
      }
    });
  }

  addNodeToParent(newNodeData: any, parentId: string): void {
    var lastChild = this.getLastChildNode(parentId)
    var previous_sibling
    if (lastChild) {
      console.log("Last child:", lastChild);
      // when adding new node:
      previous_sibling = lastChild.node_id;
    } else {
      previous_sibling = null;
    }

    const newNode = {
      nodeLangInfo: [
         { entityText: newNodeData.entityText, stemmedEntity: newNodeData.stemmedEntity, language: 'ar' },
      ],
      entityId: 0,
      root: false,
      action: { type: 'none', goToTaskId: null, responses: [{ text: null, language: 'ar' }] },
      storyGroups: [],
      menuItemId: null,
      iconSrc: newNodeData.iconSrc,
      node_id:`node_${this.findMaxNodeId(this.nodes)}`,
      parent: parentId,
      previous_sibling: previous_sibling,
      children: []
    };

    this.menu.nodes.push(newNode)
    this.nodes = this.constructMenuTree(this.menu.nodes);
          setTimeout(() => {
            this.tree.treeModel.expandAll();
          });
  }

  getLastChildNode(parentId: string): MenuNode | undefined {
  const children = this.menu.nodes.filter(x => x.parent === parentId);

  if (!children.length) {
    return undefined; // no children yet
  }

  // find the one that has no next sibling (i.e., no node points to it as previous_sibling)
  return children.find(c =>
    !children.some(other => other.previous_sibling === c.node_id)
  );
}
  // Dialog to edit new node

  openEditNodeDialog(node: any): void {
    const dialogRef = this.dialog.open(MenuEditComponent, {
      data: { node:node,lang:this.selectedLang  },
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(updatedNode => {
      if (updatedNode) {
        this.menu.nodes[this.menu.nodes.findIndex(x=>x.node_id == node.node_id)] = updatedNode
        this.nodes = this.constructMenuTree(this.menu.nodes);
          setTimeout(() => {
            this.tree.treeModel.expandAll();
          });
      }
    });
  }

  getEntityTextByLang(node: MenuNode): string | null {
    const infos = node.nodeLangInfo;

    // 1. Try preferred language
    const match = infos.find(x => x.language === this.selectedLang);
    if (match) {
      return match.entityText;
    }

    // 2. If not found, fallback to first available language
    return infos.length > 0 ? infos[0].entityText : null;
  }
  // delete node


  openDeleteNodeDialog(node:MenuNode) {
    const QuestionTitle = 'Are you sure you want to delete this Menu?';
    const pleasWriteMagic = 'Please write the **Magic** word to delete';
    const actionName = 'delete';

    this.dialog.open(MenuDeleteComponent, {
      data: {
        QuestionTitle: QuestionTitle,
        pleasWriteMagic: pleasWriteMagic,
        actionName: actionName,
        item: node.node_id
      },
      maxHeight: '760px',
      width: '600px',
      position: { top: '100px', left: '400px' }
    })
      .afterClosed()
      .subscribe(response => {
        if (response === 'success') {
          this.deleteNode(node);
        }
      });
  }

  deleteNode(node: MenuNode) {
    let currentNodeIndex = this.menu.nodes.findIndex(x=>x.node_id == node.node_id)

    let previousNode = this.menu.nodes.find(x=>x.node_id == node.previous_sibling)
    let previousNodeIndex = this.menu.nodes.findIndex(x=>x.node_id == node.previous_sibling)

    let NextNode = this.menu.nodes.find(x=>x.previous_sibling == node.node_id)
    let NextNodeIndex = this.menu.nodes.findIndex(x=>x.previous_sibling == node.node_id)
    if(previousNode && NextNode){
      this.menu.nodes[NextNodeIndex].previous_sibling = this.menu.nodes[previousNodeIndex].node_id
    }
    if(!previousNode && NextNode){
      this.menu.nodes[NextNodeIndex].previous_sibling = this.menu.nodes[currentNodeIndex].node_id
    }
    this.menu.nodes.splice(currentNodeIndex, 1)
    this.nodes = this.constructMenuTree(this.menu.nodes);
        setTimeout(() => {
          this.tree.treeModel.expandAll();
     });
  }

  findParentNode(nodes: any[], nodeId: string): any {
    for (const node of nodes) {
      if (node.children && node.children.length > 0) {
        const childIndex = node.children.findIndex(child => child.node_id === nodeId);
        if (childIndex !== -1) {
          return node;
        } else {
          const parent = this.findParentNode(node.children, nodeId);
          if (parent) {
            return parent;
          }
        }
      }
    }
    return null;
  }




  findParentNodeTwo(nodes: any[], destinationIndex: number): any {
    for (const node of nodes) {
      if (destinationIndex === 0) {
        return node;
      }
      if (node.children && node.children.length > 0) {
        const parent = this.findParentNodeTwo(node.children, destinationIndex - 1);
        if (parent) {
          return parent;
        }
      }
      destinationIndex--;
    }
    return null;
  }

  removeNodeFromParent(nodeToRemove: any): void {
    this.nodes = this.removeNodeRecursively(this.nodes, nodeToRemove);
  }

  private removeNodeRecursively(nodes: any[], nodeToRemove: any): any[] {
    for (const node of nodes) {
      const index = node.children.findIndex(child => child.node_id === nodeToRemove.node_id);
      if (index !== -1) {
        node.children.splice(index, 1);
        return nodes;
      }
      if (node.children && node.children.length > 0) {
        const updatedChildren = this.removeNodeRecursively(node.children, nodeToRemove);
        if (updatedChildren) {
          node.children = updatedChildren;
          return nodes;
        }
      }
    }
    return null;
  }


  findParentNodeThree(nodes: any[], nodeToRemove: any): any {
    for (const node of nodes) {

      const index = node.children.findIndex(child => child.node_id === nodeToRemove.node_id);
      if (index !== -1) {
        return node;
      }
      const parent = this.findParentNode(node.children, nodeToRemove);
      if (parent) {
        return parent;
      }
    }
    return null;
  }

  expandAllNodes(): void {
    if (this.tree) {
      this.tree.treeModel.expandAll();
    }
  }

  collapseAllNodes() {

    if (this.tree) {
      this.tree.treeModel.collapseAll();
    }
  }

  navigateBack() {
    this.router.navigate([`/projects/${this.projectId}/dataTypes/menus`]);
  }

  handleNodeClick(node: MenuNode): void {
    if(!node)
      return
    this.selectedNode = node;
      if(this.selectedNode.action.type == 'text'){
        if(!this.selectedNode.action.responses)
          this.selectedNode.action.responses = []
        if(this.selectedNode.action.responses.length == 0){
          this.selectedNode.action.responses.push({text:'', language:'ar'})
        }
        if(this.selectedLang == 'en' && !this.selectedNode.action.responses.some(x=>x.language == 'en')){
        this.selectedNode.action.responses.push({ text: '', language: 'en'})
          }
      if(this.selectedLang == 'ar' && !this.selectedNode.action.responses.some(x=>x.language == 'ar')){
        this.selectedNode.action.responses.push({ text: '', language: 'ar'})
    }
    }
  }


  updateActionType(actionType: string): void {
    if (this.selectedNode) {
      this.selectedNode.action.type = actionType;
    }
  }

  getTasks(): void {
    this._menuService.GetTasks(this.projectId).subscribe((response: any) => {
      if (response) {
        this.tasks = response.tasks;
      }
    });
  }

  @ViewChild('editor') editor;

  modules = {
    formula: true,
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      ['formula'],
      ['image', 'code-block']
    ]
  };

  updateMenu() {
    let payload = {
      projectId: this.projectId,
      menuInfo: {
        name: this.menuName,
        menuId: this.menu.menuId,
        problemMeun: this.menu.problemMeun,
        type: this.menu.type,
        serviceId: this.menu.serviceId,
        nodes: this.menu.nodes
      }
    };


    this._menuService.updateMenu(payload).subscribe((response: any) => {
      if (response.status == '1') {
        this.notify.openSuccessSnackBar('Menu updated successfully');
      }
    });
  }



  flattenNodes(nodes: any[], language: string): any[] {
    let flatNodes = [];
    nodes.forEach(node => {
      flatNodes.push({
        nodeLangInfo: node.nodeLangInfo.filter(info => info.language === language),
        entityId: node.entityId,
        root: node.root,
        action: node.action,
        storyGroups: node.storyGroups,
        menuItemId: node.menuItemId,
        iconSrc: node.iconSrc,
        node_id: node.node_id,
        parent: node.parent,
        previous_sibling: node.previous_sibling
      });
      if (node.children && node.children.length > 0) {
        flatNodes = flatNodes.concat(this.flattenNodes(node.children, language));
      }
    });
    return flatNodes;
  }


  performSearch(): void {
    if (this.searchQuery.trim() === '') {
      this.filteredNodes = [];
      return;
    }

    this.filteredNodes = this.searchTree(this.nodes, this.searchQuery.toLowerCase());
    console.log(this.filteredNodes);
  }

  getUniqueNodes(nodes: any[]): any[] {
    return nodes.reduce((unique, current) => {
      const existingNode = unique.find(node => node.node_id === current.node_id);
      if (!existingNode) {
        unique.push(current);
      }
      return unique;
    }, []);
  }

  searchTree(nodes: any[], query: string): any[] {
    let result: any[] = [];
    let visitedNodeIds = new Set();

    function search(node, visitedNodeIds) {
      if (!visitedNodeIds.has(node.node_id)) {
        visitedNodeIds.add(node.node_id);

        if (node.nodeLangInfo[0].entityText.toLowerCase().includes(query.toLowerCase())) {
          result.push(node);
        }

        if (node.children && node.children.length > 0) {
          const parentIncluded = result.some(parent => parent.node_id === node.node_id);
          if (!parentIncluded) {
            node.children.forEach(child => search(child, visitedNodeIds));
          }
        }
      }
    }

    nodes.forEach(node => search(node, visitedNodeIds));

    return this.getUniqueNodes(result);
  }
  clearSearch(): void {
    this.searchQuery = '';
    this.filteredNodes = [];
  }


onMoveNode(event: any) {
  debugger;
  const movedNode = event.node;              // node being moved
  const fromParent = event.from.parent;      // old parent
  const toParent = event.to.parent;          // new parent
  const toIndex = event.to.index;            // new index position

  if (!movedNode || !toParent) return;

  // --- 1. Update parent in flat list ---
  movedNode.parent = toParent.node_id;

  // --- 2. Get all children of new parent from flat list ---
  const newSiblings = this.menu.nodes
    .filter(n => n.parent === toParent.node_id && n.node_id !== movedNode.node_id)
    .sort((a, b) => {
      // sort siblings according to previous_sibling chain
      if (a.previous_sibling === b.node_id) return 1;
      if (b.previous_sibling === a.node_id) return -1;
      return 0;
    });

  // insert moved node into the correct position
  newSiblings.splice(toIndex, 0, movedNode);

  // --- 3. Recalculate previous_sibling for new siblings ---
  newSiblings.forEach((sibling, idx) => {
    sibling.previous_sibling = idx === 0 ? null : newSiblings[idx - 1].node_id;
    this.updateNodeInMenu(sibling);
  });

  // --- 4. If moved from a different parent: fix old siblings ---
  if (fromParent && fromParent.node_id !== toParent.node_id) {
    const oldSiblings = this.menu.nodes
      .filter(n => n.parent === fromParent.node_id && n.node_id !== movedNode.node_id)
      .sort((a, b) => {
        if (a.previous_sibling === b.node_id) return 1;
        if (b.previous_sibling === a.node_id) return -1;
        return 0;
      });

    oldSiblings.forEach((sibling, idx) => {
      sibling.previous_sibling = idx === 0 ? null : oldSiblings[idx - 1].node_id;
      this.updateNodeInMenu(sibling);
    });
  }

  // --- 5. Save moved node ---
  this.updateNodeInMenu(movedNode);

  // --- 6. Reconstruct tree from flat list ---
  this.nodes = this.constructMenuTree(this.menu.nodes);
  setTimeout(() => this.tree.treeModel.expandAll());
}

private updateNodeInMenu(node: any) {
  const index = this.menu.nodes.findIndex(n => n.node_id === node.node_id);
  if (index > -1) {
    this.menu.nodes[index] = { ...node };
  }
}
    serach(){
      debugger
      let treeNodeFilter:MenuNode[] = this.menu.nodes.filter(x=>x.nodeLangInfo.some(s=>s.entityText.trim().includes(this.searchNode.trim())))
      let treeNodes:MenuNode[] = []
      treeNodeFilter.forEach((e:MenuNode)=>{
        treeNodes = this.getSearchedNode(e, treeNodes)
      })
      let uniquetreeNodes = Array.from(new Set(treeNodes.map(obj => JSON.stringify(obj))))
      .map(str => JSON.parse(str));

        this.nodes = this.constructMenuTree(uniquetreeNodes);
        setTimeout(() => {
          this.tree.treeModel.expandAll();
        });
    }
    getSearchedNode(treeNode:MenuNode, treeNodes:MenuNode[]){
      debugger
      treeNodes.push(treeNode)
      if(treeNode.parent == null){
        return treeNodes
      }
      else{
        let parentNode =  this.nodes.find(x=>x.node_id == treeNode.parent)
        if(parentNode)
          this.getSearchedNode(parentNode,treeNodes)
      }
      return treeNodes
    }

    reset(){
      debugger
      this.searchNode =''
      this.nodes = this.constructMenuTree(this.menu.nodes);
      setTimeout(() => {
        this.tree.treeModel.expandAll();
      });
    }



  rootNode(){
          return {
        "nodeLangInfo": [
        {
            "entityText": "Root",
            "language": "en"
        },
        {
            "entityText": "Root",
            "language": "ar"
        }
          ],
          "menuId": 0,
          "node_id": "node_0",
          "parent": null,
          "previous_sibling": null,
          "root": true,
          "action": {
        "type": "none",
        "response": "",
        "responses": [
            {
                "text": "",
                "language": "ar"
            }
        ]
          },
        "nodes": null,
        "languageIndex": 1,
        "responseLangIndex": 0,
        "entityText": "Root",
        "templateObj": null,
        "type": "item",
        "selected": false
          }
   }

}




