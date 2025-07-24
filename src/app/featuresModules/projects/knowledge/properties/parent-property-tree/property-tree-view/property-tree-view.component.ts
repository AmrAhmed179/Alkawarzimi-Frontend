import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { Router } from '@angular/router';
import { TreeComponent, ITreeOptions } from '@circlon/angular-tree-component';
import { Subject, takeUntil } from 'rxjs';
import { DataService } from 'src/app/core/services/data.service';
import { EntityModel, Frame } from 'src/app/Models/ontology-model/EntityCatogeryModel';
import { NodeModel, ClassInfo } from 'src/app/Models/ontology-model/node';
import { OntologyEntitiesService } from 'src/app/Services/Knowlege/ontology-entities.service';
import { OntologyTreeService } from 'src/app/Services/Ontology-Tree/ontology-tree.service';
import { SelectedVerbService } from 'src/app/Services/Ontology-Tree/selected-verb.service';
import { OptionsServiceService } from 'src/app/Services/options-service.service';
import { AddSibblingAndChildComponent } from '../../../-ontolgyTree/parent-ontolgy-tree/ontolgy-tree-view/add-sibbling-and-child/add-sibbling-and-child.component';
import { AddVerbComponent } from '../../../-ontolgyTree/parent-ontolgy-tree/ontolgy-tree-view/add-verb/add-verb.component';
import { CreateOntologyEntityComponent } from '../../../ontology-entities/parent-ontology-entities/ontology-entities/dialogs/create-ontology-entity/create-ontology-entity.component';
import { AddFrameAttachmentComponent } from '../../../ontology-entities/parent-ontology-entities/ontology-entities/edit-frame/parent-edit-frame/selected-entity-frame/add-frame-attachment/add-frame-attachment.component';
import { NotifyService } from 'src/app/core/services/notify.service';
import { Domain, PropertyNode, SynonmsSet } from 'src/app/Models/ontology-model/property';
import { el } from 'date-fns/locale';
import { AddSynonumComponent } from '../add-synonum/add-synonum.component';
import { MagicWordWriteComponent } from 'src/app/shared/components/magic-word-write/magic-word-write.component';
import { AddDomainPropertyComponent } from '../add-domain-property/add-domain-property.component';
import { SortDomainsComponent } from '../sort-domains/sort-domains.component';
import { AddSibblingAndChildPropertyComponent } from '../add-sibbling-and-child-property/add-sibbling-and-child-property.component';
import { ReplacePropertyComponent } from '../replace-property/replace-property.component';

@Component({
  selector: 'vex-property-tree-view',
  templateUrl: './property-tree-view.component.html',
  styleUrls: ['./property-tree-view.component.scss']
})
export class PropertyTreeViewComponent implements OnInit {

  onDestroy$: Subject<void> = new Subject();
  verbs:any
  TREE_DATA:PropertyNode[]
  treeControl = new NestedTreeControl<PropertyNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<PropertyNode>();
  TreeNodes:PropertyNode[]
  hasChild = (_: number, node: PropertyNode) => !!node.children && node.children.length > 0;
  entityQues_tool:EntityModel[] = []
  entityAction:EntityModel[] = []
  DataProperties:NodeModel[] = []
  propertiesList:NodeModel[]
  @ViewChild('tree') tree: TreeComponent;
  nodes:NodeModel[] = []

  workspace_id: string;
  lang: any;
  currentNodeId: string;
  nodeLength: any;
  actualizedLength: any;
  searchNode:string
  classesAndProps:EntityModel[]
  classesOnly:EntityModel[]
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
  SelectedNode:PropertyNode = new PropertyNode()
  classInfo:ClassInfo = new ClassInfo()
  Synonyms:SynonmsSet[] = []
  showSyn:boolean = false
  showProp:boolean = false
  showRange:boolean = false
  showQtool:boolean = false
  senseDescription:string =''
  properties:any[] = []
  individuals:EntityModel[] = []
  objects:EntityModel[] = []
  currentIndividualIndex = -1
  currentObjectIndex = -1
  currentFramectIndex = -1
  currentframeSyn = -1
  searchFact:string = ''
  verbSynonyms:string[] = []
  frames:Frame[] = []
  framesFilter:Frame[] = []
  frameSynonyms:any[] = []
  showFrameSyn:boolean = false
  senseId:any
  activeTap:string = 'Domains'
  domains:Domain[] = []
  addRangeValue:string = 'String'
  addQtoolValue:any
  entitiesTreeClasses:any[]
  constructor(
    private _ontologyTreeService: OntologyTreeService,
    private _dataService: DataService,
    private _optionsService: OptionsServiceService,
    public dialog: MatDialog,
    private notify: NotifyService,
    private selectedVerbService: SelectedVerbService,
    private _ontologyEntitiesService:OntologyEntitiesService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this._dataService.$project_bs.pipe(takeUntil(this.onDestroy$)).subscribe((project) => {
      if (project) {
        this.workspace_id = project._id;
    this._optionsService.selectedLang$.pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
          if (response) {
            this.lang = response;
            this.getTreeNodes();
          }
        });
      }
    });
  }
  getQues_toolEntities(){
    this._ontologyEntitiesService.getEntities(this.workspace_id, 'ques_tool', 0).subscribe((res:any)=>{
      this.entityQues_tool = res.entities
    })
  }
  getActionEntities(){
    this._ontologyEntitiesService.getEntities(this.workspace_id, 'action', 1).subscribe((res:any)=>{
      this.entityAction = res.entities
    })
  }
  getPropertiesList(){
    this._ontologyEntitiesService.propertiesIndex('dataProp').subscribe((res:any)=>{
      this.propertiesList = res.nodes
    })
  }
  GetPropertyTreeEntities(){
    this._ontologyTreeService.GetPropertyTreeEntities(this.workspace_id).subscribe((res:any)=>{
      this.entitiesTreeClasses = res.nodes.nodes
    })
  }

  getClassandProp(){
    this._ontologyEntitiesService.getClassandProp(this.workspace_id).subscribe((res:any)=>{
      this.classesAndProps = res.entities
    })
  }
  getClassesOnly(){
    this._ontologyEntitiesService.getClasessOnly(this.workspace_id, 'class', 0).subscribe((res:any)=>{
      this.classesOnly = res.entities
    })
  }
  getTreeNodes(): void {
    this._ontologyTreeService.getDataPropertyIndex(this.workspace_id).subscribe((response: any) => {
      if (response && response.nodes) {
        this.nodeLength = response.nodes.length;
        this.TreeNodes = response.nodes
        this.DataProperties = response.nodes
        var treeNodes =  this.TreeNodes

        this.constractAndViewTree(treeNodes)
        this.getClassandProp()
        this.getClassesOnly()
        this.getActionEntities()
        this.getQues_toolEntities()
        this.getPropertiesList()
        this.GetPropertyTreeEntities()
      }
    });
  }
  serach(){
    debugger
    let treeNodeFilter:PropertyNode[] = this.TreeNodes.filter(x=>x.entityText.trim().includes(this.searchNode.trim()))
    let treeNodes:PropertyNode[] = []
    treeNodeFilter.forEach((e:PropertyNode)=>{
      treeNodes = this.getSearchedNode(e, treeNodes)
    })
    let uniquetreeNodes = Array.from(new Set(treeNodes.map(obj => JSON.stringify(obj))))
    .map(str => JSON.parse(str));

    this.constractAndViewTree(uniquetreeNodes)
  }

  getSearchedNode(treeNode:PropertyNode, treeNodes:PropertyNode[]){
    debugger
    treeNodes.push(treeNode)
    if(treeNode.parent == null){
      return treeNodes
    }
    else{
      let parentNode =  this.TreeNodes.find(x=>x.node_id == treeNode.parent)
      if(parentNode)
        this.getSearchedNode(parentNode,treeNodes)
    }
    return treeNodes
  }

  reset(){
    this.searchNode =''
    var treeNodes =  this.TreeNodes
    this.constractAndViewTree(treeNodes)
  }
  //#region treeCollapseAndExpand
  treeCount(Nodes){

    if(!Array.isArray(Nodes)){
      return 0
    }
    let count = 0

    for (const node of Nodes ) {
      count += 1
      if(node.children){
        count += this.treeCount(node.children)
      }
    }
    return count
  }
  constructTree(TreeNodes): PropertyNode[] {
    const tree: PropertyNode[] = [];
    // Create a map to store intents by their intentId
    const map: { [key: string]: PropertyNode } = {};

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
    let childern:PropertyNode[] = []
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
            childern.push(nextNode)
          }
        }
        n.children = childern
      }
    })
    console.log(tree)
    return tree;
  }

  deleteNode(node:PropertyNode){
    let QuestionTitle = "Are you sure you want to delete this ?"
    let pleasWriteMagic = "Please write the **Magic** word to delete"
    let actionName = "delete"
    const dialogRef = this.dialog.open(MagicWordWriteComponent,
      {
        data: { QuestionTitle: QuestionTitle, pleasWriteMagic: pleasWriteMagic, actionName: actionName }, maxHeight: '760px',
        width: '600px',
        position: { top: '100px', left: '400px' }
      });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        var firstSiblingNode
        let searchForFirstSibling =  this.TreeNodes.find(x=>x.previous_sibling == node.node_id)
        if(searchForFirstSibling){
          firstSiblingNode = searchForFirstSibling
        }
        else{
          firstSiblingNode = null
        }
        let request ={
          node:{
            node_id: node.node_id,
            previous_sibling: node.previous_sibling
          },
          childrenCount:node.children?.length,
          firstSiblingNode:firstSiblingNode,
          projectId:this.workspace_id,
        }
        this._ontologyTreeService.deletePropertyNode(request).subscribe((res:any)=>{
          if(res.status == '1'){
            this.notify.openSuccessSnackBar("Node successfully deleted")
            this.getTreeNodes()
          }
          else{
            this.notify.openFailureSnackBar(res.message)
          }
        })
      }
  })
  }

  openReplaceProperty(node:PropertyNode){
    debugger
    let entities = this.classesAndProps
    const dialogRef = this.dialog.open(ReplacePropertyComponent, {
      data: { entities:entities},},
    );
    dialogRef.afterClosed().subscribe((res:any) => {
      if(res){
        debugger

        var payload
        let entity:EntityModel = this.classesAndProps.find(x=>x._id == res)
        if(entity){
          payload ={
            node:node,
            projectId:this.workspace_id,
            classId:res
          }}

        this._ontologyTreeService.replaceProperty(payload).subscribe((result:any)=>{
          if(result.status == '1'){
            let nodeIndex = this.TreeNodes.findIndex(x=>x.node_id == node.node_id)
           this.TreeNodes[nodeIndex].entityId = res
           this.TreeNodes[nodeIndex].entityText = null
            this.constractAndViewTree(this.TreeNodes)
          }
        })
      }
    })
  }

  getEntityText(id:any){
    return this.classesAndProps.find(x=>x._id == id ).entityInfo[0].entityText
  }
  openAddSibblingAndChild(type:string, node:PropertyNode){
    debugger
    let entities = this.classesAndProps
    const dialogRef = this.dialog.open(AddSibblingAndChildPropertyComponent, {
      data: { entities:entities,propertiesList:this.propertiesList, type:type},},
    );
    dialogRef.afterClosed().subscribe((res:any) => {
      if(res){
        debugger
        let parent
        let previous_sibling
        let nextSiblingNode = null
        if(type =='s'){
          parent = node.parent
          previous_sibling = node.node_id
          nextSiblingNode = this.TreeNodes.find(x=>x.previous_sibling == node.node_id)
          if(!nextSiblingNode)
            nextSiblingNode = null
        }else{
          parent = node.node_id
          if(node.children.length > 0){
            previous_sibling = node.children[node.children.length -1].node_id
          }
          else{
            previous_sibling = null
          }
        }

        var payload
        let entity:EntityModel = this.classesAndProps.find(x=>x._id == res)
        if(entity){
          payload ={
            nextSiblingNode:nextSiblingNode,
            projectId:this.workspace_id,
            node: {
              entityText: entity.entityInfo[0].entityText,
              entityId: entity._id,
              type: entity.entityType,
              parent: parent,
              previous_sibling: previous_sibling,
              frq: 0,
              editable: true
          }}

        }else{
          let prop:NodeModel = this.propertiesList.find(x=>x.node_id == res)
          payload ={
            nextSiblingNode:nextSiblingNode,
            projectId:this.workspace_id,
            node:{
              editable: true,
              entityId: prop.entityId,
              entityText:prop.entityText,
              type:"DP",
              frq: 0,
              node_id: prop.node_id,
              parent:parent,
              qTools:null,
              previous_sibling: previous_sibling
            }
          }
        }

        this._ontologyTreeService.CreateFromGD(payload).subscribe((res:any)=>{
          if(res.status == '1'){
            this.TreeNodes.push(res.node)
            let nextNodeindex = this.TreeNodes.findIndex(x=>x.previous_sibling == node.node_id)
            this.TreeNodes[nextNodeindex].previous_sibling = res.node.node_id
            this.constractAndViewTree(this.TreeNodes)
          }
        })
      }
    })
  }

  onMoveNode($event: any) {
    debugger
    const movedNode = $event.node;
    movedNode.parent =$event.to.parent.node_id
    delete movedNode.children

    const toIndex = $event.to.index
    const toDestIndex = toIndex+1
    const toPreviousNode = $event.to.parent.children[toIndex-1]

    let srcSibling
    let destSibling
    let body = {}
    srcSibling = this.TreeNodes.find(x=>x.previous_sibling == movedNode.node_id)
    destSibling = $event.to.parent.children[toDestIndex]
    if(srcSibling && destSibling){
      delete srcSibling.children
      srcSibling.previous_sibling = movedNode.previous_sibling
      delete destSibling.children
      movedNode.previous_sibling = destSibling.previous_sibling
      destSibling.previous_sibling = movedNode.node_id
      body ={
        projectId:this.workspace_id,
        node:movedNode,
        destSibling:destSibling,
        srcSibling:srcSibling
      }
    }

    else if(!srcSibling && destSibling){
      delete destSibling.children
      movedNode.previous_sibling = destSibling.previous_sibling
      destSibling.previous_sibling = movedNode.node_id
      body ={
        projectId:this.workspace_id,
        node:movedNode,
        destSibling:destSibling,
      }
    }

    else if(!destSibling && srcSibling){
      delete srcSibling.children
      srcSibling.previous_sibling = movedNode.previous_sibling
      if(toPreviousNode){
        movedNode.previous_sibling = toPreviousNode.node_id
      }
      else{
        movedNode.previous_sibling = null
      }
      body ={
        projectId:this.workspace_id,
        node:movedNode,
        srcSibling:srcSibling
      }
    }
    else{
      if(toPreviousNode){
        movedNode.previous_sibling = toPreviousNode.node_id
      }
      else{
        movedNode.previous_sibling = null
      }
      body ={
        projectId:this.workspace_id,
        node:movedNode,
      }
    }

    this._ontologyTreeService.updatePropertyTree(body).subscribe((res:any)=>{
      if(res.status =='1'){
        this.notify.openSuccessSnackBar("tree updated")
      }
    })
    if(movedNode)
      this.updateTreeNodes(movedNode)
    if(srcSibling)
      this.updateTreeNodes(srcSibling)
    if(destSibling)
      this.updateTreeNodes(destSibling)
  }

  updateTreeNodes(node:PropertyNode){
    let index = this.TreeNodes.findIndex(x=>x.node_id == node.node_id)
    this.TreeNodes[index] = node
  }

  constractAndViewTree(TreeNodes:PropertyNode[]){
    this.TREE_DATA = this.constructTree(TreeNodes)
    this.dataSource.data = this.TREE_DATA
    this.actualizedLength =this.treeCount(this.TREE_DATA);
    setTimeout(() => {
      this.tree.treeModel.expandAll();
    });
    console.log("treee" ,this.TREE_DATA )
  }
  ////when click on node
  seLectedNode(node:PropertyNode){
    this.SelectedNode = node
    this.domains = node.domains
    this.Synonyms = node.synonmsSet?.filter(x=>x.lang == this.lang)
  }
  clickOnDomains(){
    this.showProp = true
    this.showSyn = false
    this.showRange = false
    this.showQtool = false

  }

  clickOnRange(){
    this.showSyn = false
    this.showProp = false
    this.showRange = true
    this.showQtool = false
  }
  clickOnSynonum(){
    this.showSyn = true
    this.showProp = false
    this.showRange = false
    this.showQtool = false
  }
  clickOnQtools(){
    this.showSyn = false
    this.showProp = false
    this.showRange = false
    this.showQtool = true
  }

  deleteQtool(qtool:any){
    let QuestionTitle = "Are you sure you want to delete this ?"
    let pleasWriteMagic = "Please write the **Magic** word to delete"
    let actionName = "delete"
    const dialogRef = this.dialog.open(MagicWordWriteComponent,
      {
        data: { QuestionTitle: QuestionTitle, pleasWriteMagic: pleasWriteMagic, actionName: actionName }, maxHeight: '760px',
        width: '600px',
        position: { top: '100px', left: '400px' }
      });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.SelectedNode.qTools.splice(this.SelectedNode.rang.findIndex(x=>x == qtool ),1)
        let payload = {
          QTools: this.SelectedNode.qTools,
          projectId:this.workspace_id,
          nodeId:this.SelectedNode.node_id
        }
        this._ontologyTreeService.updateQTools(payload).subscribe((res:any)=>{
          if(res.status == 1){
            let index =  this.TreeNodes.findIndex(x=>x.node_id == this.SelectedNode.node_id)
            this.TreeNodes[index] = this.SelectedNode
          }
        })
      }
  })
  }
  deleteRange(range:string){
    let QuestionTitle = "Are you sure you want to delete this ?"
    let pleasWriteMagic = "Please write the **Magic** word to delete"
    let actionName = "delete"
    const dialogRef = this.dialog.open(MagicWordWriteComponent,
      {
        data: { QuestionTitle: QuestionTitle, pleasWriteMagic: pleasWriteMagic, actionName: actionName }, maxHeight: '760px',
        width: '600px',
        position: { top: '100px', left: '400px' }
      });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.SelectedNode.rang.splice(this.SelectedNode.rang.findIndex(x=>x == range ),1)
        let payload = {
          rang: range,
          projectId:this.workspace_id,
          node_id:this.SelectedNode.node_id
        }
        this._ontologyTreeService.deleteRang(payload).subscribe((res:any)=>{
          if(res.status == 1){
            let index =  this.TreeNodes.findIndex(x=>x.node_id == this.SelectedNode.node_id)
            this.TreeNodes[index] = this.SelectedNode
          }
        })
      }
  })
  }
  deleteSynonym(synonyem:SynonmsSet){
    let QuestionTitle = "Are you sure you want to delete this ?"
    let pleasWriteMagic = "Please write the **Magic** word to delete"
    let actionName = "delete"
    const dialogRef = this.dialog.open(MagicWordWriteComponent,
      {
        data: { QuestionTitle: QuestionTitle, pleasWriteMagic: pleasWriteMagic, actionName: actionName }, maxHeight: '760px',
        width: '600px',
        position: { top: '100px', left: '400px' }
      });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.Synonyms.splice(this.Synonyms.findIndex(x=>x.entityText ==synonyem.entityText ),1)
        let payload = {
          Synonyms: this.Synonyms,
          projectId:this.workspace_id,
          nodeId:this.SelectedNode.node_id
        }
        this._ontologyTreeService.updateSynonyms(payload).subscribe((res:any)=>{
          if(res.status == 1){
            this.SelectedNode.synonmsSet.splice(this.Synonyms.findIndex(x=>x.entityText ==synonyem.entityText ),1)
            let index =  this.TreeNodes.findIndex(x=>x.node_id == this.SelectedNode.node_id)
            this.TreeNodes[index] = this.SelectedNode
          }
        })
      }
  })
  }
  deleteDomainProperty(domain){
    let QuestionTitle = "Are you sure you want to delete this ?"
    let pleasWriteMagic = "Please write the **Magic** word to delete"
    let actionName = "delete"
    const dialogRef = this.dialog.open(MagicWordWriteComponent,
      {
        data: { QuestionTitle: QuestionTitle, pleasWriteMagic: pleasWriteMagic, actionName: actionName }, maxHeight: '760px',
        width: '600px',
        position: { top: '100px', left: '400px' }
      });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        let payload = {
          entityText: this.SelectedNode.entityText,
          projectId:this.workspace_id,
          node_id:this.SelectedNode.node_id,
          domain:domain
        }
        this._ontologyTreeService.deleteDomain(payload).subscribe((res:any)=>{
          if(res.status == 1){
            this.SelectedNode.domains.splice(this.SelectedNode.domains.findIndex(x=>x.node_id ==domain.node_id ),1)
            let index =  this.TreeNodes.findIndex(x=>x.node_id == this.SelectedNode.node_id)
            this.TreeNodes[index] = this.SelectedNode
          }
        })
      }
  })
  }
  openAddSyn(){
    const dialogRef = this.dialog.open(AddSynonumComponent, {},
    );
    dialogRef.afterClosed().subscribe((res:any) => {
      if(res){
        let synonyem = {entityText:res,lang:this.lang}
         this.Synonyms.push(synonyem)
        let payload = {
          Synonyms: this.Synonyms,
          projectId:this.workspace_id,
          nodeId:this.SelectedNode.node_id
        }
        this._ontologyTreeService.updateSynonyms(payload).subscribe((res:any)=>{
          if(res.status == 1){
            this.SelectedNode.synonmsSet.push(synonyem)
            let index =  this.TreeNodes.findIndex(x=>x.node_id == this.SelectedNode.node_id)
            this.TreeNodes[index] = this.SelectedNode
          }
        })
      }}
    )
  }

  openAddDomain(){
    debugger
    const dialogRef = this.dialog.open(AddDomainPropertyComponent, {data:{entities:this.entitiesTreeClasses}},
    );
    dialogRef.afterClosed().subscribe((res:any) => {
      if(res){
        let payload = {
          entityText: this.SelectedNode.entityText,
          projectId:this.workspace_id,
          node_id:this.SelectedNode.node_id,
          domain:res
        }
        this._ontologyTreeService.addDomain(payload).subscribe((res:any)=>{
          if(res.status == 1){
            this.SelectedNode.domains.push(res.domain)
            let index =  this.TreeNodes.findIndex(x=>x.node_id == this.SelectedNode.node_id)
            this.TreeNodes[index] = this.SelectedNode
          }
          else{
            this.notify.openFailureSnackBar(res.Message)
          }
        })
      }}
    )
  }
  sortDomain(){
    const dialogRef = this.dialog.open(SortDomainsComponent, {data:{Domains:this.SelectedNode.domains}},
    );
    dialogRef.afterClosed().subscribe((res:any) => {
      if(res){
        let payload = {
          entityText: this.SelectedNode.entityText,
          projectId:this.workspace_id,
          node_id:this.SelectedNode.node_id,
          domains:res
        }
        this._ontologyTreeService.updateDomains(payload).subscribe((res:any)=>{
          if(res.status == 1){
            let index =  this.TreeNodes.findIndex(x=>x.node_id == this.SelectedNode.node_id)
            this.TreeNodes[index] = this.SelectedNode
          }
          else{
            this.notify.openFailureSnackBar(res.Message)
          }
        })
      }}
    )
  }
  addRange(){
   let payload = {
    rang: this.addRangeValue,
     projectId:this.workspace_id,
     node_id:this.SelectedNode.node_id
   }
   this._ontologyTreeService.addRang(payload).subscribe((res:any)=>{
     if(res.status == 1){
       this.SelectedNode.rang.push(this.addRangeValue)
       let index =  this.TreeNodes.findIndex(x=>x.node_id == this.SelectedNode.node_id)
       this.TreeNodes[index] = this.SelectedNode
     }
   })
  }
  addQtool(){
    var  QTools =  this.SelectedNode.qTools.slice()
    QTools.push(this.addQtoolValue)
    let payload = {
      QTools: QTools,
       projectId:this.workspace_id,
       nodeId:this.SelectedNode.node_id
     }
     this._ontologyTreeService.updateQTools(payload).subscribe((res:any)=>{
       if(res.status == 1){
         this.SelectedNode.qTools.push(this.addQtoolValue)
         let index =  this.TreeNodes.findIndex(x=>x.node_id == this.SelectedNode.node_id)
         this.TreeNodes[index] = this.SelectedNode
       }
     })
  }
  getQtoolText(qtool){
    return this.entityQues_tool.find(x=>x._id == qtool).entityInfo[0].entityText
  }
  updatePropertiesfromGD(){
    this._ontologyTreeService.updatePropertiesfromGD({projectId:this.workspace_id}).subscribe((res:any)=>{
      if(res.status == 1){
        this.notify.openSuccessSnackBar('Update Count :'+`${res.UpdateCount}`)
      }
      else{
        this.notify.openFailureSnackBar(res.message)
      }
    })
  }

  cleanDomains(){
    this._ontologyTreeService.cleanDomains({projectId:this.workspace_id}).subscribe((res:any)=>{
      if(res.status == 1){
        this.notify.openSuccessSnackBar('UpdateCount :'+`${res.UpdateCount}`)
      }
      else{
        this.notify.openFailureSnackBar(res.message)
      }
    })
  }
  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

}
