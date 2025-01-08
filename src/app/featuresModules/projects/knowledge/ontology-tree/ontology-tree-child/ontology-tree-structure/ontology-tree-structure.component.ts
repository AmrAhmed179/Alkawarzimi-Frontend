  import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
  import { MatDialog } from '@angular/material/dialog';
  import { TreeComponent, TreeNode } from '@circlon/angular-tree-component';
  import { Subscription } from 'rxjs';
  import { OntologyTreeService } from 'src/app/Services/Ontology-Tree/ontology-tree.service';
  import { OptionsServiceService } from 'src/app/Services/options-service.service';
  import { DataService } from 'src/app/core/services/data.service';
  import { AddVerbsDialogComponent } from './add-verbs-dialog/add-verbs-dialog.component';
  import { AddChildDialogComponent } from './add-child-dialog/add-child-dialog.component';
  import { AddNodeSiblingComponent } from './add-node-sibling/add-node-sibling.component';
  import { MagicWordWriteComponent } from 'src/app/shared/components/magic-word-write/magic-word-write.component';
  import { NotifyService } from 'src/app/core/services/notify.service';
  import { SelectedVerbService } from 'src/app/Services/Ontology-Tree/selected-verb.service';
import { OntologyTreeNode } from 'src/app/Models/TreeNode';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';

  @Component({
    selector: 'vex-ontology-tree-structure',
    templateUrl: './ontology-tree-structure.component.html',
    styleUrls: ['./ontology-tree-structure.component.scss']
  })
  export class OntologyTreeStructureComponent implements OnInit {

    TREE_DATA:OntologyTreeNode[]

    treeControl = new NestedTreeControl<OntologyTreeNode>(node => node.children);

    dataSource = new MatTreeNestedDataSource<OntologyTreeNode>();
    @Output() selectedVerbChange: EventEmitter<any> = new EventEmitter<any>();

    TreeNodes:OntologyTreeNode[]
    hasChild = (_: number, node: OntologyTreeNode) => !!node.children && node.children.length > 0;

    workspace_id: string;
    selectedLang: any;
    currentNodeId: string;
    private languageSubscription: Subscription;
    private projectSubscription: Subscription;
    nodes: any[] = [];
    treeOptions: any = {};
    selectedNode: any;
    //siblingNode: any[];
    selectedNodeIndex: number;
    selectedVerb: any;
    nodeLength: any;
    actualizedLength: any;

    constructor(
      private _ontologyTree: OntologyTreeService,
      private _dataService: DataService,
      private _optionsService: OptionsServiceService,
      public dialog: MatDialog,
      private notify: NotifyService,
      private SelectedVerbService: SelectedVerbService
    ) { }

    ngOnInit(): void {
      this.projectSubscription = this._dataService.$project_bs.subscribe((project) => {
        if (project) {
          this.workspace_id = project._id;
          this.languageSubscription = this._optionsService.selectedLang$.subscribe((response) => {
            if (response) {
              this.selectedLang = response;
              this.getTreeNodes();
            }
          });
        }
      });
    }

    ngAfterViewInit() {
      this.tree.treeModel.expandAll();
    }

    ngOnDestroy(): void {
      this.projectSubscription.unsubscribe();
      this.languageSubscription.unsubscribe();
    }

    getTreeNodes(): void {
      this._ontologyTree.getOntologyTree(this.workspace_id).subscribe((response: any) => {
        if (response && response.nodes) {
          this.nodeLength = response.nodes.length;
          this.TreeNodes = response.nodes
          this.TREE_DATA = this.constructTree()
          console.log("treee" ,this.TREE_DATA )
          this.dataSource.data = this.TREE_DATA
          this.expandAllNodes()

          this.actualizedLength = response.nodes.filter(node => node.entityType === "class").length;
          const nodeMap = new Map<string, any>();
          const rootNodeIds: Set<string> = new Set();

          response.nodes.forEach(node => {
            nodeMap.set(node.node_id, {
              node_id: node.node_id,
              name: node.entityText,
              entityId: node.entityId,
              entityType: node.entityType,
              errorType: node.errorType,
              parent: node.parent,
              previous_sibling: node.previous_sibling,
              editable: node.editable,
              level: node.level,
              qTools: node.qTools,
              extension: node.extension,
              artificialParent: node.artificialParent,
              children: []
            });

            if (!node.parent) {
              rootNodeIds.add(node.node_id);
            }
          });

          // Iterate through nodes to build the tree structure
          response.nodes.forEach(node => {
            if (node.parent) {
              const parent = nodeMap.get(node.parent);
              const currentNode = nodeMap.get(node.node_id);
              if (parent && currentNode) {
                parent.children.push(currentNode);
              }
            }
          });

          // Create nodes array from root nodes
          this.nodes = Array.from(rootNodeIds).map(rootNodeId => nodeMap.get(rootNodeId));

        }
      });
    }


    getParentNode(selectedNode: any, nodes: any[]): any | null {
      for (const node of nodes) {
        if (node.children.includes(selectedNode)) {
          return node;
        } else {
          const parent = this.getParentNode(selectedNode, node.children);
          if (parent) {
            return parent;
          }
        }
      }
      return null;
    }

    getSiblingNodes(selectedNode: any, nodes: any[]): any[] {
      const parentNode = this.getParentNode(selectedNode, nodes);
      if (parentNode) {
        return parentNode.children.filter(node => node.node_id !== selectedNode.node_id || node === selectedNode);
      } else {
        return [];
      }
    }


    dialogIsOpen: boolean = false;

    async openAddVerbDialog(node: any): Promise<void> {


      if (this.dialogIsOpen) {
        return;
      }
      const parentNode = await this.getParentNode(node, this.nodes);
      const siblingNodes = await this.getSiblingNodes(node, this.nodes);
      const selectedIndex = siblingNodes.indexOf(node);


      // Open dialog
      const dialogRef = this.dialog.open(AddVerbsDialogComponent, {
        width: '50%',
        height: '50%',
        data: { selectedNode: node, parentNode: parentNode, siblingNodes: siblingNodes, selectedIndex: selectedIndex }
      });

      // Handle dialog close
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.success) {
          // If the node was successfully added, push it to the nodes array
          if (result.newNode) {
            this.nodes.push(result.newNode);
          }
          // Refresh the tree after adding sibling node
          this.getTreeNodes();
          this.notify.openSuccessSnackBar("Verb Added Successfully");
        }
      });


    }


    async openAddChildDialog(node: any) {

      const parentNode = await this.getParentNode(node, this.nodes);
      const siblingNodes = await this.getSiblingNodes(node, this.nodes);
      const selectedIndex = siblingNodes.indexOf(node);

      // Open dialog
      const dialogRef = this.dialog.open(AddChildDialogComponent, {
        width: '50%',
        height: '55%',
        data: { selectedNode: node, parentNode: parentNode, siblingNodes: siblingNodes, selectedIndex: selectedIndex }
      });

      // Handle dialog close
      dialogRef.afterClosed().subscribe((result) => {
        if (result && result.success) {
          // If the node was successfully added, push it to the nodes array
          if (result.newNode) {
            this.nodes.push(result.newNode);
          }
          // Refresh the tree after adding sibling node
          this.getTreeNodes();
          this.notify.openSuccessSnackBar("Child Added Successfully");

        }
      });
    }



    async openAddSiblingDialog(node: any) {

      const parentNode = await this.getParentNode(node, this.nodes);
      const siblingNodes = await this.getSiblingNodes(node, this.nodes);
      const selectedIndex = siblingNodes.indexOf(node);

      const dialogRef = this.dialog.open(AddNodeSiblingComponent, {
        width: '50%',
        height: '55%',
        data: { selectedNode: node, parentNode: parentNode, siblingNodes: siblingNodes, selectedIndex: selectedIndex }
      });


      dialogRef.afterClosed().subscribe((result) => {
        if (result && result.success) {
          // If the node was successfully added, push it to the nodes array
          if (result.newNode) {
            this.nodes.push(result.newNode);
          }
          this.getTreeNodes();
          this.notify.openSuccessSnackBar("Sibling Added Successfully");
        }
      });
    }



    async deleteTask(node) {

      const parentNode = await this.getParentNode(node, this.nodes);
      const siblingNodes = await this.getSiblingNodes(node, this.nodes);

      const selectedIndex = siblingNodes.indexOf(node);
      let previousSiblingNode = selectedIndex > 0 ? siblingNodes[selectedIndex - 1] : null;

      let payload = {
        "node": {
          "node_id": node.node_id,
          "previous_sibling": previousSiblingNode
        },
        "childrenCount": 0,
        "firstSiblingNode": null,
        "projectId": this.workspace_id
      }

      let QuestionTitle = "Are you sure you want to delete this ?";
      let pleasWriteMagic = "Please write the **Magic** word to delete";
      let actionName = "delete";
      const dialogRef = this.dialog.open(MagicWordWriteComponent, {
        data: { QuestionTitle: QuestionTitle, pleasWriteMagic: pleasWriteMagic, actionName: actionName },
        maxHeight: '760px',
        width: '600px',
      });

      dialogRef.afterClosed().subscribe(response => {
        if (response) {
          // this._ontologyTree.deleteOntologyNode(payload).subscribe((response: any) => {
          //   if (response) {
          //     this.getTreeNodes();
          //     this.notify.openSuccessSnackBar("Successfully Deleted Node");
          //   }
          // });
        }
      });
    }

    logSelectedNode(nodeData: any) {
      this.selectedVerb = nodeData;
      this.SelectedVerbService.setSelectedVerb(nodeData);

    }

    @ViewChild(TreeComponent)
    private tree: TreeComponent;

    // expandAllNodes(): void {
    //   this.tree.treeModel.expandAll();
    // }

    // collapseAllNodes(): void {
    //   this.tree.treeModel.collapseAll();
    // }

    searchQuery: string = ''; // Variable to store the search query
    filteredNodes: any[] = [];

    performSearch(): void {
      if (this.searchQuery.trim() === '') {
        this.filteredNodes = [];
        return;
      }

      // Call a recursive search method to search for nodes
      this.filteredNodes = this.searchTree(this.nodes, this.searchQuery.toLowerCase());
    }

    // Recursive method to search for nodes
    searchTree(nodes: any[], query: string): any[] {
      let results: any[] = [];

      // Iterate through each node
      for (const node of nodes) {
        // Check if the node matches the search query
        if (node.name.toLowerCase().includes(query)) {
          results.push(node); // Add matching node to results
        }

        // Recursively search child nodes if they exist
        if (node.children && node.children.length > 0) {
          const childResults = this.searchTree(node.children, query);
          results = results.concat(childResults); // Concatenate child results with current results
        }
      }

      return results;
    }

    clearSearch(): void {
      this.searchQuery = '';
      this.filteredNodes = [];
    }

    constructTree(): OntologyTreeNode[] {
      const tree: OntologyTreeNode[] = [];
      // Create a map to store intents by their intentId
      const map: { [key: string]: OntologyTreeNode } = {};

      // Initialize the map with intents
      this.TreeNodes.forEach(intent => {
        map[intent.node_id] = { ...intent, children: [] };
      });

      // Iterate over the data to construct the tree
      this.TreeNodes.forEach(intent => {
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
      console.log(tree)
      return tree;
    }

    expandTree(node: OntologyTreeNode): void {
      this.treeControl.expand(node);
      if (node.children) {
        node.children.forEach(child => {
          this.expandTree(child);
        });
      }
    }

    expandAllNodes(): void {
      this.dataSource.data.forEach(node => {
        this.expandTree(node);
      });
    }

    collapseTree(node: OntologyTreeNode): void {
      this.treeControl.collapse(node);
      if (node.children) {
        node.children.forEach(child => {
          this.collapseTree(child);
        });
      }
    }

    collapseAllNodes(): void {
      this.dataSource.data.forEach(node => {
        this.collapseTree(node);
      });
    }
  }
