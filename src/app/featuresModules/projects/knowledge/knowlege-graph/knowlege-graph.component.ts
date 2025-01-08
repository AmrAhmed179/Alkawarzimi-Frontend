import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription, map, startWith } from 'rxjs';
import { KnowledgeGraphService } from 'src/app/Services/knowledge-graph.service';
import { DataService } from 'src/app/core/services/data.service';
import { OptionsServiceService } from 'src/app/Services/options-service.service';
import * as vis from 'vis-network';

interface Node {
  id: number;
  Id: number;
  Name: string;
  Project: number;
  Type: string | null;
}

interface NodeResponse {
  status: number;
  nodes: {
    nodes: Node;
    cnt: number;
  }
}

@Component({
  selector: 'vex-knowlege-graph',
  templateUrl: './knowlege-graph.component.html',
  styleUrls: ['./knowlege-graph.component.scss']
})
export class KnowlegeGraphComponent {

  selectedNode: string;
  nodeNames: string[] = [];
  workspaceId;
  selectedLang: string;
  private languageSubscription: Subscription;
  private projectSubscription: Subscription;
  selectedItem = '';

  public network: vis.Network;
  public nodes: any[];
  public edges: any[];
  connectionsNodes: any[];
  connectionsEdge: any[];
  relationsNodes: any[];
  relationsEdge: any[];

  searchControl = new FormControl();
  filteredItems: string[];

  networkInitialized: boolean = false;
  selectedOption: 'nodes' | 'relations' = 'nodes';
  relations: string[];
  parsedData: { nodes: any[]; edges: any[] };

  constructor(
    private _knowledgeGraphService: KnowledgeGraphService,
    private dataService: DataService,
    private optionsService: OptionsServiceService
  ) {

    this.searchControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    ).subscribe(filteredItems => {
      this.filteredItems = filteredItems;
    });

  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    let itemsToFilter: string[] = [];
    if (this.selectedOption === 'nodes') {
      itemsToFilter = this.nodeNames;
    } else if (this.selectedOption === 'relations') {
      itemsToFilter = this.relations;
    }

    return itemsToFilter.filter(item => item.toLowerCase().includes(filterValue));
  }

  displayFn(item: string): string {
    return item ? item : '';
  }

  ngOnInit(): void {
    this.projectSubscription = this.dataService.$project_bs.subscribe((project) => {
      if (project) {
        this.workspaceId = project._id;
        this.languageSubscription = this.optionsService.selectedLang$.subscribe(
          (response) => {
            if (response) {
              this.selectedLang = response;
              this.getProjectNodes();
            }
          }
        );
      }
    });

  }

  ngOnDestroy(): void {
    this.projectSubscription.unsubscribe();
    this.languageSubscription.unsubscribe();
  }


  getProjectNodes(): void {
    this._knowledgeGraphService.getProjectNodesAndRelations(this.workspaceId)
      .subscribe((response: any) => {
        if (response && response.nodes) {
          this.nodeNames = response.nodes.map(nodeItem => nodeItem.nodes.Name);
        }
      });
  }

  async getNodeByConnections(): Promise<void> {
    try {
      const response: any = await this._knowledgeGraphService
        .GetNodeConnections(this.workspaceId, this.selectedNode)
        .toPromise();
      if (response) {
        const data = this.parseDataConnection(response);
        this.setupNetworkConnection(data);
      }
    } catch (error) {
      console.error('Error fetching node connections:', error);
    }
  }

  private addNodeConnection(nodes: any, data: any, id: number, name: string, type: string): void {
    if (!nodes[id]) {
      nodes[id] = { id, label: name, group: type }; // Assign type as group
      data.nodes.push(nodes[id]);
    }
  }

  private parseDataConnection(responseData: any): any {
    const nodes = {};
    const edges = [];
    const data = { nodes: [], edges: [] };

    responseData.nodes.forEach((connection) => {
      const sourceNode = connection.nodesrc;
      const destinationNode = connection.nodedst;

      const sourceId = sourceNode.Id;
      const destId = destinationNode.Id;

      // Assign types to source and destination nodes
      sourceNode.type = 'subject';
      destinationNode.type = 'object';

      this.addNodeConnection(nodes, data, sourceId, sourceNode.Name, sourceNode.type);
      this.addNodeConnection(nodes, data, destId, destinationNode.Name, destinationNode.type);

      edges.push({
        from: sourceId,
        to: destId,
        label: connection.cnt.toString(), // Convert cnt to string for label
      });
    });

    data.edges = edges;
    this.parsedData = data;
    return data;
  }


  private setupNetworkConnection(data: any): void {
    const container = document.getElementById('network');
    if (!container) {
      return;
    }

    var optionsConnection = {
      nodes: {
        shape: 'circle',
        size: 70,
        font: {
          size: 20,

        }
      },
      edges: {
        width: 2,
        shadow: true,
        font: {
          size: 20,

        }
      },
      groups: {
        object: {
          color: { background: 'greenyellow', border: 'darkgreen' }
        },
        subject: {
          color: { background: 'skyblue', border: 'darkblue' }
        },
        mix: {
          color: { background: 'orange', border: 'darkorange' }
        }
      },
      physics: {
        stabilization: false,
        barnesHut: {
          //gravitationalConstant: -80000,
          springConstant: 0.04,
          springLength: 150
        }
      },
      interaction: {
        tooltipDelay: 200,
        hideEdgesOnDrag: true
      }
    };

    this.network = new vis.Network(container, data, optionsConnection);
    this.network.fit();
  }

  getNodeRelations(): void {
    this._knowledgeGraphService.GetNodeRelations(this.workspaceId)
      .subscribe((response: any) => {
        if (response && response.status === 1 && response.relations) {
          console.log('Relations:', response.relations);
          this.relations = response.relations;

        } else {
          console.error('Error fetching relations:', response);
        }
      });
  }

  async getNodeByRelation(): Promise<void> {
    try {
      const response: any = await this._knowledgeGraphService
        .GetRelationConnectedNodes(this.workspaceId, this.selectedNode)
        .toPromise();
      debugger
      if (response) {
        const data = this.parseDataRelation(response);
        this.setupNetworkRelation(data);
      } else {
        console.error('Error fetching node connections:', response);
      }
    } catch (error) {
      console.error('Error fetching node connections:', error);
    }
  }



  private parseDataRelation(responseData: any): any {
    const nodes = {};
    const edges = [];
    const data = { nodes: [], edges: [] };

    responseData.nodes.forEach((item) => {
      const sourceId = item.nodesrc.Id;
      const destId = item.nodedst.Id;

      // Assign types to source and destination nodes
      item.nodesrc.type = 'subject';
      item.nodedst.type = 'object';

      this.addNodeRelation(nodes, data, sourceId, item.nodesrc.Name, item.nodesrc.type);
      this.addNodeRelation(nodes, data, destId, item.nodedst.Name, item.nodedst.type);

      edges.push({
        from: sourceId,
        to: destId,
        label: this.selectedNode,
        arrows: item.nodesrc.type === 'subject' ? 'to' : 'from' // Adjust arrows based on node type
      });
    });

    data.edges = edges;
    this.parsedData = data;
    return data;
  }

  private addNodeRelation(nodes: any, data: any, id: number, name: string, type: string): void {
    if (!nodes[id]) {
      nodes[id] = { id, label: name, group: type }; // Assign type as group
      data.nodes.push(nodes[id]);
    }
  }


  private setupNetworkRelation(data: any): void {
    const container = document.getElementById('network');
    if (!container) {
      return;
    }

    var optionsRelation = {
      nodes: {
        shape: 'circle',
        size: 70,
        font: {
          size: 20
        }
      },
      edges: {
        width: 2,
        shadow: true,
        font: {
          size: 20
        }
      },
      groups: {
        object: {
          color: { background: 'greenyellow', border: 'darkgreen' }
        },
        subject: {
          color: { background: 'skyblue', border: 'darkblue' }
        },
        mix: {
          color: { background: 'orange', border: 'darkorange' }
        }
      },
      physics: {
        stabilization: false,
        barnesHut: {
          //gravitationalConstant: -80000,
          springConstant: 0.04,
          springLength: 150
        }
      },
      interaction: {
        tooltipDelay: 200,
        hideEdgesOnDrag: true
      }
    };

    this.network = new vis.Network(container, data, optionsRelation);
    this.network.fit();
  }

  async GetProjectNodesAndRelations(): Promise<void> {
    const response: any = await this._knowledgeGraphService
      .GetProjectNodesAndRelations(this.workspaceId)
      .toPromise();
    if (response) {
      const data = this.parseData(response);
      this.connectionsNodes = data.nodes;
      this.connectionsEdge = data.edges;
      this.setupNetworkTree(); // Call setupNetwork after parsing data
    }
  }

  private parseData(responseData: any): any {
    const nodes = {};
    const edges = [];
    const data = { nodes: [], edges: [] };

    responseData.nodes.forEach((connection) => {
      const sourceNode = connection.nodesrc;
      const destinationNode = connection.nodedst;

      const sourceId = sourceNode.Id;
      const destId = destinationNode.Id;

      this.addNode(nodes, data, sourceId, sourceNode.Name, 'subject'); // Assign 'subject' type
      this.addNode(nodes, data, destId, destinationNode.Name, 'object'); // Assign 'object' type

      edges.push({
        from: sourceId,
        to: destId,
        label: connection.cnt.toString(), // Convert cnt to string for label
      });
    });

    // Identify nodes that act as both 'subject' and 'object' and assign them the 'mix' type
    Object.values(nodes).forEach((node: any) => {
      const connectedNodes = edges.filter((edge) => edge.from === node.id || edge.to === node.id);
      const connectedTypes = connectedNodes.map((edge) => {
        if (edge.from === node.id) {
          return nodes[edge.to].type;
        } else {
          return nodes[edge.from].type;
        }
      });

      if (connectedTypes.includes('subject') && connectedTypes.includes('object')) {
        node.type = 'mix';
      }
    });

    console.log(nodes); // Log nodes to check their categorization

    data.edges = edges;
    this.parsedData = data;
    return data;
  }



  private addNode(nodes: any, data: any, id: number, name: string, type: string): void {
    if (!nodes[id]) {
      nodes[id] = { id, label: name, title: name, group: type }; // Change 'type' to 'group'
      data.nodes.push(nodes[id]);
    }
  }


  private setupNetwork(): void {
    if (!this.parsedData) {
      return;
    }

    const container = document.getElementById('network');
    if (!container) {
      return;
    }

    const options = this.getNetworkOptions();
    this.network = new vis.Network(container, this.parsedData, options);

  }

  private getNetworkOptions(): any {
    return {
      nodes: {
        shape: 'circle',
        size: 70,
        font: {
          family: 'arial',
          size: 20,
          bold: true
      }
      },
      edges: {
        width: 2,
        shadow: true,
        font: {
          size: 20
        }
      },
      groups: {
        object: {
          color: { background: 'greenyellow', border: 'darkgreen' }
        },
        subject: {
          color: { background: 'skyblue', border: 'darkblue' }
        },
        mix: {
          color: { background: 'orange', border: 'darkorange' }
        }
      },
      physics: {
        stabilization: {
          iterations: 10
        },
        barnesHut: {
          gravitationalConstant: -10000,
          springConstant: 0.04,
          springLength: 150
        }
      },

      interaction: {
        tooltipDelay: 200,
        hideEdgesOnDrag: true
      }
    };
  }


  private setupNetworkTree(): void {
    if (!this.parsedData) {
      return;
    }

    const container = document.getElementById('network');
    if (!container) {
      return;
    }

    const options = this.getNetworkOptions();
    this.network = new vis.Network(container, this.parsedData, options);

  }
  // if (connectedTypes.includes('subject') && connectedTypes.includes('object')) {
  //   node.type = 'mix';


  toggleContent(option: 'nodes' | 'relations'): void {
    this.selectedOption = option;
    if (option === 'nodes') {
      this.getNodeByConnections()
    } else if (option === 'relations') {
      this.getNodeRelations();
    }
  }

  loadChoice(): void {
    const treeData = this.getTreeData();
    this.setupNetwork();
  }

  private getTreeData(): any {
    return this.parsedData;
  }

  async handleClick(item: string): Promise<void> {
    try {
      this.selectedNode = item;
      if (this.selectedOption === 'nodes') {
        await this.getNodeByConnections();
      } else if (this.selectedOption === 'relations') {
        await this.getNodeByRelation();
      }
      this.loadChoice();
    } catch (error) {
      console.error('Error while handling click:', error);
    }
  }

}
