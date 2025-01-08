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
import { ITreeOptions } from '@circlon/angular-tree-component';
import { OptionsServiceService } from 'src/app/Services/options-service.service';
import { fi } from 'date-fns/locale';

export interface MenuNode {
  nodeLangInfo: NodeLangInfo[];
  entityId: number;
  root: boolean;
  action: NodeAction;
  storyGroups: any[]; // Change to an array instead of null
  menuItemId: string | null;
  iconSrc: string | null;
  node_id: string;
  parent: string | null;
  previous_sibling: string | null;
  children?: MenuNode[]; // Change to an optional array
}


interface TreeNode {
  node_id: string;
  parent: string | null;
  children: TreeNode[];
  root: boolean;
  isExpanded?: boolean;
  // Add other properties as needed
}

export interface NodeLangInfo {
  entityText: string;
  stemmedEntity?: any;
  language: string;
}

export interface NodeAction {
  type: string;
  goToTaskId?: any;
  responses: NodeResponse[];
}

export interface NodeResponse {
  text: string | null;
  language: string;
}

interface FlatNode {
  expandable: boolean;
  entityText: string;
  level: number;
}

@Component({
  selector: 'vex-menus-info',
  templateUrl: './menus-info.component.html',
  styleUrls: ['./menus-info.component.scss']
})

export class MenusInfoComponent implements OnInit {
  menu: any;
  private projectSubscription: Subscription;
  projectId: number;
  menuId: number;
  nodes: any[] = [];
  currentNodeId
  selectedLang: string;
  private languageSubscription: Subscription;
  selectedNode
  tasks
  menuName
  searchQuery: string = '';
  filteredNodes: any[] = [];

  options: ITreeOptions = {
    // rtl: true,
    allowDrag: true,
    allowDrop: true,
  };

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
    this.projectSubscription = this._dataService.$project_bs.subscribe((project) => {
      this.projectId = +project._id;
      this.route.paramMap.subscribe((params: Params) => {
        this.menuId = +params.get('menuId');
        this.languageSubscription = this._optionsService.selectedLang$.subscribe((response) => {
          if (response) {
            this.selectedLang = response;
            this.getSystemMenu();
            this.getTasks();
          }
        });
      });
    });
  }

  getSystemMenu() {
    this._menuService.GetMenus(this.projectId).subscribe((response: any) => {
      const result = response.menus;
      if (result) {
        const filteredMenus = result.filter(x => x.menuId === this.menuId);
        if (filteredMenus.length > 0) {
          this.menu = filteredMenus[0];
          this.menuName = this.menu.name;
          this.nodes = [this.constructTree(this.menu.nodes, "node_0", this.selectedLang)];

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

  addNode(parentId: string) {
    const parentNode = this.findNodeById(this.nodes, parentId);

    if (parentNode) {
      const newNodeId = `node_${this.findMaxNodeId(this.nodes)}`;

      const newNode = {
        nodeLangInfo: [{ language: 'ar', entityText: 'New Node' }],
        entityText: 'New Node',
        node_id: newNodeId,
        parent: parentId,
        children: [],  // Initialize children array for the new node
      };

      if (!parentNode.children) {
        parentNode.children = [];
      }

      parentNode.children.push(newNode);

      this.nodes = [...this.nodes];
    }
  }

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
      data: { parentId: parentId }
    });

    dialogRef.afterClosed().subscribe(newNode => {
      if (newNode) {
        this.addNodeToParent(newNode, parentId);
      }
    });
  }

  addNodeToParent(newNodeData: any, parentId: string): void {

    const newNode = {
      nodeLangInfo: [
        { entityText: newNodeData.entityText, stemmedEntity: null, language: 'en' },
        { entityText: newNodeData.entityText, stemmedEntity: null, language: 'ar' }
      ],
      entityId: 0,
      root: false,
      action: { type: 'none', goToTaskId: null, responses: [{ text: null, language: 'ar' }] },
      storyGroups: [],
      menuItemId: null,
      iconSrc: null,
      node_id: '',
      parent: parentId,
      previous_sibling: null,
      children: []
    };

    newNode.node_id = `node_${this.findMaxNodeId(this.nodes)}`;

    const parentNode = this.findNodeById(this.nodes, parentId);
    if (parentNode) {
      if (!parentNode.children) {
        parentNode.children = [];
      }
      parentNode.children.push(newNode);
      this.nodes = [...this.nodes];
    }
  }

  // Dialog to edit new node

  openEditNodeDialog(node: any): void {
    const dialogRef = this.dialog.open(MenuEditComponent, {
      data: { node },
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(updatedNode => {
      if (updatedNode) {
        this.updateNodeInTree(updatedNode);
      }
    });
  }

  updateNodeInTree(updatedNode: any): void {
    this.updateNodeRecursively(this.nodes, updatedNode);
  }

  private updateNodeRecursively(nodes: any[], updatedNode: any): boolean {
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].node_id === updatedNode.node_id) {
        Object.assign(nodes[i], updatedNode);
        return true;
      }
      if (nodes[i].children && nodes[i].children.length > 0) {
        const nodeUpdated = this.updateNodeRecursively(nodes[i].children, updatedNode);
        if (nodeUpdated) {
          return true;
        }
      }
    }
    return false;
  }


  // delete node


  openDeleteNodeDialog(node) {
    const QuestionTitle = 'Are you sure you want to delete this Menu?';
    const pleasWriteMagic = 'Please write the **Magic** word to delete';
    const actionName = 'delete';

    this.dialog.open(MenuDeleteComponent, {
      data: {
        QuestionTitle: QuestionTitle,
        pleasWriteMagic: pleasWriteMagic,
        actionName: actionName,
        item: node
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

  deleteNode(nodeId: string) {

    const parentNode = this.findParentNode(this.nodes, nodeId);

    if (parentNode) {
      parentNode.children = parentNode.children.filter(child => child.node_id !== nodeId);
      this.nodes = [...this.nodes];
    }
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


  drop(event: CdkDragDrop<any[]>) {

    const droppedNode = event.item.data.node;
    const destinationIndex = event.currentIndex;

    const destParentNode = this.findParentNodeTwo(this.nodes, destinationIndex);

    if (destParentNode) {

      this.removeNodeFromParent(droppedNode);

      droppedNode.parent = destParentNode.node_id;

      destParentNode.children.push(droppedNode);

      this.nodes = [...this.nodes];

    }
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

  @ViewChild('tree') tree: any;

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

  handleNodeClick(node: any): void {
    this.selectedNode = node;
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
        nodes: this.flattenNodes(this.nodes, this.selectedLang)
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
}




