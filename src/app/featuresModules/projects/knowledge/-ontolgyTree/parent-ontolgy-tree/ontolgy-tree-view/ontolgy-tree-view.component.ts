import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { Subject,  takeUntil } from 'rxjs';
import { OntologyTreeNode } from 'src/app/Models/TreeNode';
import { OntologyTreeService } from 'src/app/Services/Ontology-Tree/ontology-tree.service';
import { OptionsServiceService } from 'src/app/Services/options-service.service';
import { DataService } from 'src/app/core/services/data.service';
import { NotifyService } from 'src/app/core/services/notify.service';
import { SelectedVerbService } from 'src/app/Services/Ontology-Tree/selected-verb.service';
import { OntologyEntitiesService } from 'src/app/Services/Knowlege/ontology-entities.service';
import { EntityModel } from 'src/app/Models/ontology-model/EntityCatogeryModel';
import { AddSibblingAndChildComponent } from './add-sibbling-and-child/add-sibbling-and-child.component';
import { AddVerbComponent } from './add-verb/add-verb.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ITreeOptions, TreeComponent } from '@circlon/angular-tree-component';
import { Console } from 'console';
import { ClassInfo, NodeModel } from 'src/app/Models/ontology-model/node';
import { CreateOntologyEntityComponent } from '../../../ontology-entities/parent-ontology-entities/ontology-entities/dialogs/create-ontology-entity/create-ontology-entity.component';
import { AddFrameAttachmentComponent } from '../../../ontology-entities/parent-ontology-entities/ontology-entities/edit-frame/parent-edit-frame/selected-entity-frame/add-frame-attachment/add-frame-attachment.component';
import { Frame } from 'src/app/Models/ontology-model/verb';
import { Router } from '@angular/router';
import { SetImpliedComponent } from './set-implied/set-implied.component';

@Component({
  selector: 'vex-ontolgy-tree-view',
  templateUrl: './ontolgy-tree-view.component.html',
  styleUrls: ['./ontolgy-tree-view.component.scss']
})
export class OntolgyTreeViewComponent implements OnInit {
  onDestroy$: Subject<void> = new Subject();
  verbs:any
  TREE_DATA:OntologyTreeNode[]
  treeControl = new NestedTreeControl<OntologyTreeNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<OntologyTreeNode>();
  TreeNodes:OntologyTreeNode[]
  hasChild = (_: number, node: OntologyTreeNode) => !!node.children && node.children.length > 0;
  entityQues_tool:EntityModel[] = []
  entityAction:EntityModel[] = []
  DataProperties:NodeModel[] = []
  @ViewChild('tree') tree: TreeComponent;

  workspace_id: string;
  lang: any;
  currentNodeId: string;
  nodeLength: any;
  actualizedLength: any;
  searchNode:string
  classesAndProps:EntityModel[]
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
  SelectedNode:NodeModel = new NodeModel()
  classInfo:ClassInfo = new ClassInfo()
  Synonyms:EntityModel[] = []
  showSyn:boolean = false
  showProp:boolean = false
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
    this._ontologyEntitiesService.getEntities(this.workspace_id, 'ques_tool', 1).subscribe((res:any)=>{
      this.entityQues_tool = res.entities
    })
  }
  getActionEntities(){
    this._ontologyEntitiesService.getEntities(this.workspace_id, 'action', 1).subscribe((res:any)=>{
      this.entityAction = res.entities
    })
  }

  getDataProperty(){
    this._ontologyTreeService.getDataPropertyIndex(this.workspace_id).subscribe((res:any)=>{
      this.DataProperties = res.nodes
    })
  }
  getTreeNodes(): void {
    this._ontologyTreeService.getOntologyTree(this.workspace_id).subscribe((response: any) => {
      if (response && response.nodes) {
        this.nodeLength = response.nodes.length;
        this.TreeNodes = response.nodes
        var treeNodes =  this.TreeNodes

        this.constractAndViewTree(treeNodes)
        this.getClassandProp()
        this.getVerbs()
        this.getActionEntities()
        this.getQues_toolEntities()
        this.getDataProperty()
      }
    });
  }
  serach(){
    debugger
    let treeNodeFilter:OntologyTreeNode[] = this.TreeNodes.filter(x=>x.entityText.trim().includes(this.searchNode.trim()))
    let treeNodes:OntologyTreeNode[] = []
    treeNodeFilter.forEach((e:OntologyTreeNode)=>{
      treeNodes = this.getSearchedNode(e, treeNodes)
    })
    let uniquetreeNodes = Array.from(new Set(treeNodes.map(obj => JSON.stringify(obj))))
    .map(str => JSON.parse(str));

    this.constractAndViewTree(uniquetreeNodes)
  }

  getSearchedNode(treeNode:OntologyTreeNode, treeNodes:OntologyTreeNode[]){
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
  constructTree(TreeNodes): OntologyTreeNode[] {
    const tree: OntologyTreeNode[] = [];
    // Create a map to store intents by their intentId
    const map: { [key: string]: OntologyTreeNode } = {};

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
    let childern:OntologyTreeNode[] = []
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

  deleteNode(node:OntologyTreeNode){
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
    this._ontologyTreeService.deleteNode(request).subscribe((res:any)=>{
      if(res.status == '1'){
        this.notify.openSuccessSnackBar("Node successfully deleted")
        this.getTreeNodes()
      }
    })
  }
  getClassandProp(){
    this._ontologyEntitiesService.getClassandProp(this.workspace_id).subscribe((res:any)=>{
      this.classesAndProps = res.entities
    })
  }

  getVerbs() {
    this._ontologyTreeService.getVerbs(this.workspace_id).subscribe((response: any) => {
      if (response) {
        this.verbs = response.verbs.filter((verb: any) => verb.generated === false);
      }
    });
  }
  openAddSibblingAndChild(type:string, node:OntologyTreeNode){
    debugger
    let entities
    if(type =='v'){
      entities = this.verbs
    }else{
      entities = this.classesAndProps
    }
    const dialogRef = this.dialog.open(AddSibblingAndChildComponent, {
      data: { entities:entities, type:type},},
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
        }else{
          parent = node.node_id
          if(node.children.length > 0){
            previous_sibling = node.children[node.children.length -1].node_id
          }
          else{
            previous_sibling = null
          }
        }
        let entity:EntityModel = this.classesAndProps.find(x=>x._id == res)
        let payload ={
          nextSiblingNode:nextSiblingNode,
          projectId:this.workspace_id,
          node:{
            editable: true,
            entityId: entity._id,
            entityText:entity.entityInfo[0].entityText,
            entityType:entity.entityType,
            level: 0,
            node_id: "",
            parent:parent,
            previous_sibling: previous_sibling
          }
        }
        this._ontologyTreeService.CreateChildAndSibbling(payload).subscribe((res:any)=>{
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

  openAddVerb(type:string, node:OntologyTreeNode){
    debugger
    const dialogRef = this.dialog.open(AddVerbComponent, {
      data: { entities: this.verbs},},
    );
    dialogRef.afterClosed().subscribe((res:any) => {
      if(res){
        debugger
        let parent = node.node_id
        let previous_sibling = null

        let entity:EntityModel = this.verbs.find(x=>x.senseId == res)
        let payload ={
          nextSiblingNode:null,
          projectId:this.workspace_id,
          node:{
            editable: true,
            entityId: entity.senseId,
            entityText:entity.verb,
            entityType:'action',
            level: 0,
            node_id: "",
            parent:parent,
            previous_sibling: previous_sibling
          }
        }
        this._ontologyTreeService.CreateChildAndSibbling(payload).subscribe((res:any)=>{
          if(res.status == '1'){
            this.TreeNodes.push(res.node)
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

    this._ontologyTreeService.updateOntlolgyTree(body).subscribe((res:any)=>{
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

  updateTreeNodes(node:OntologyTreeNode){
    let index = this.TreeNodes.findIndex(x=>x.node_id == node.node_id)
    this.TreeNodes[index] = node
  }

  constractAndViewTree(treeNodes:OntologyTreeNode[]){
    this.TREE_DATA = this.constructTree(treeNodes)
    this.dataSource.data = this.TREE_DATA
    this.actualizedLength =this.treeCount(this.TREE_DATA);
    setTimeout(() => {
      this.tree.treeModel.expandAll();
    });
    console.log("treee" ,this.TREE_DATA )
  }
  seLectedNode(node){
    debugger
    this.showFrameSyn = false

    if(this.SelectedNode?.node_id == node.node_id)
      return
    this.showSyn = false
    debugger
    if(node.entityType !== 'action'){
      this._ontologyTreeService.getClassInfo(this.workspace_id,node.entityId).subscribe((res:any)=>{
        if(res.status == 1){
          this.classInfo = res.classInfo
          this.senseDescription = res.senseDescription
          this.getIndividuals()
          this.getObjects()
        }
      })
      this._ontologyTreeService.getSynonyms(this.workspace_id,node.entityId,node.type).subscribe((res:any)=>{
        this.Synonyms = res.synonyms
      })
    }
    else{
      let verb = this.verbs.find(x=>x.verb == node.entityText)
      this.verbSynonyms = verb.synonyms
      this.senseDescription = verb.description
      this.senseId = verb.senseId
      this.getVerbInfo()
      // this._ontologyTreeService.GetVerbInfo({projectId:this.workspace_id,senseId:verb.senseId}).subscribe((res:any)=>{

      //   this.Synonyms = res.synonyms
      //   this.frames = res.verbs.frames
      //   this.frames?.map((e:Frame)=>{
      //     debugger
      //     let entity = this.classesAndProps.find(x=>x._id == +e.parentId)
      //     if(entity)
      //       e.entity = entity
      //   })
      //   this.framesFilter = this.frames
      // })
    }
    this.SelectedNode =  node
    this.getProperites()
  }

  getVerbInfo(){
    this._ontologyTreeService.GetVerbInfo({projectId:this.workspace_id,senseId:this.senseId}).subscribe((res:any)=>{

      this.Synonyms = res.synonyms
      this.frames = res.verbs.frames
      this.frames?.map((e:Frame)=>{
        debugger
        let entity = this.classesAndProps.find(x=>x._id == +e.parentId)
        if(entity)
          e.entity = entity
      })
      this.framesFilter = this.frames
    })
  }
  getProperites(){
    this.properties = []
    for (var i = 0; i < this.DataProperties.length; i++) {

      if (this.DataProperties[i].domains == null || this.DataProperties[i].domains.length == 0)
          continue;

      for (var j = 0; j < this.DataProperties[i].domains.length; j++) {
          if (this.DataProperties[i].domains[j].entityId == this.SelectedNode.entityId) {
            this.properties.push(this.DataProperties[i]);
          }
      }
  }
  }
  getIndividuals(){
    this.individuals = []
    this.classInfo.individuals.forEach(element => {
      let entity = this.classesAndProps.find(x=>x._id == element)
      if(entity)
        this.individuals.push(entity)
    });
  }

  getObjects(){
    this.objects = []
    this.classInfo.objects.forEach(element => {
      let entity = this.classesAndProps.find(x=>x._id == element)
      if(entity)
        this.objects.push(entity)
    });
  }
  clickOnSynonum(){
    this.showSyn = true
    this.showProp = false
  }
  clickOnProperty(){
    this.showProp = true
    this.showSyn = false
  }

  updateAmbClass(){
    debugger
    this._ontologyEntitiesService.setAmbClass(this.workspace_id,this.SelectedNode.entityId,this.classInfo.ambClass).subscribe((res:any)=>{
      if(res.status == 1){
        this.notify.openSuccessSnackBar("Successfylly Edited")
      }
    })
  }
  openCreateEntity(){
    let node = this.SelectedNode
     const dialogRef = this.dialog.open(CreateOntologyEntityComponent, {
       data: {entityId:node.entityId, projectId:this.workspace_id,mode:'Synonym' , Type:''},},
     );
     dialogRef.afterClosed().subscribe((res:any) => {
      if(res){
        this._ontologyTreeService.getSynonyms(this.workspace_id,node.entityId,node.type).subscribe((res:any)=>{
          this.Synonyms = res.synonyms
        })
      }
     })
   }

   updateExtention(){
    let request ={
      extension:this.SelectedNode.extension,
      nodeId:this.SelectedNode.node_id,
      projectId:this.workspace_id,
    }
    this._ontologyTreeService.updateExtention(request).subscribe((res:any)=>{
      if(res.status == 1){
        this.notify.openSuccessSnackBar('Data Updated')
      }
    })
   }
   UpdateArtificialParent(){
    let request ={
      artificialParent:this.SelectedNode.artificialParent,
      nodeId:this.SelectedNode.node_id,
      projectId:this.workspace_id,
    }
    this._ontologyTreeService.UpdateArtificialParent(request).subscribe((res:any)=>{
      if(res.status == 1){
        this.notify.openSuccessSnackBar('Data Updated')
      }
    })
   }

   openAddProperty(){
    const dialogRef = this.dialog.open(AddFrameAttachmentComponent, {
      data: { nodes:this.DataProperties,dataProperty:true},},
    );
    dialogRef.afterClosed().subscribe((res:any) => {
      debugger
      if(res){
        let prop =  this.DataProperties.find(x=>x.entityId == res)
        let requestBody = {
          domain:{
            entityText: this.SelectedNode.entityText,
            node_id: this.SelectedNode.node_id,
            entityId: this.SelectedNode.entityId,
            entityType: this.SelectedNode.type
          },
          node_id: prop.node_id,
          entityText: prop.entityText,
          projectId: this.workspace_id
        }
        this._ontologyTreeService.addDomainProperty(requestBody).subscribe((res:any)=>{
          if(res.status == 1){
            debugger
            let index  = this.DataProperties.findIndex(x=>x.node_id == prop.node_id)
            this.DataProperties[index].domains.push(res.domain)
            this.getProperites()
          }
        })
      }
    })
  }
  deleteDomainProperty(prop:any){
    let requestBody = {
      domain:{
        entityText: this.SelectedNode.entityText,
        node_id: this.SelectedNode.node_id,
        entityId: this.SelectedNode.entityId,
        entityType: this.SelectedNode.type
      },
      node_id: prop.node_id,
      entityText: prop.entityText,
      projectId: this.workspace_id
    }
    this._ontologyTreeService.deleteDomainProperty(requestBody).subscribe((res:any)=>{
      if(res.status == 1){
        let index  = this.DataProperties.findIndex(x=>x.node_id == prop.node_id)
        this.DataProperties[index].domains.push(res.domain)
        this.DataProperties.splice(index,1)
        this.getProperites()
      }
    })
  }

  deleteSynonym(synonyem:EntityModel){
    this._ontologyTreeService.DeleteSyn({id:synonyem._id, projectId:this.workspace_id}).subscribe((res:any)=>{
      if(res.status == 1){
        this.Synonyms.splice(this.Synonyms.findIndex(x=>x._id ==synonyem._id ),1)
      }
    })
  }
  openAddIndividual(){
    const dialogRef = this.dialog.open(AddSibblingAndChildComponent, {
      data: { entities:this.classesAndProps, type:'individual'},},
    );
    dialogRef.afterClosed().subscribe((result:any) => {
    if(result){
      let body = {
        projectId: this.workspace_id,
        classId: this.SelectedNode.entityId,
        IndividualId: result
    }
    this._ontologyTreeService.pushIndividual(body).subscribe((res:any)=>{
      if(res.status == 1){
        this.classInfo.individuals.push(result)
        this.getIndividuals()
      }
    })
    }
    })
  }

  deleteIndividual(individual:EntityModel){
    let body = {
      projectId: this.workspace_id,
      classId: this.SelectedNode.entityId,
      IndividualId: individual._id
  }
  this._ontologyTreeService.pullIndividual(body).subscribe((res:any)=>{
    if(res.status == 1){
      this.notify.openSuccessSnackBar('Successfully Deleted')
      debugger
      let index = this.classInfo.individuals.findIndex(x=> x == individual._id)
      this.classInfo.individuals.splice(index,1)
      this.getIndividuals()
    }
  })
  }
  showEditFrame(frame:any, type:string){
    debugger
    if(frame.frame == null && type != '1'){
      this.notify.openFailureSnackBar('No frame Founded')
      return
    }

    if(type == '1'){
      this.router.navigate([`/projects/${this.workspace_id}/EditFrame/${frame.verb}/${frame.entity._id}/2`])
    }
    else{
      this.router.navigate([`/projects/${this.workspace_id}/EditFrame/${frame.frame.verb}/${frame._id}/2`])
    }
  }
  searchFacts(){
    this.frames = this.framesFilter.filter(x=>x.entity.entityInfo[0].entityText.trim().includes(this.searchFact.trim()))
  }

  getFrameSynonms(frame:Frame){
    this.showFrameSyn = true
    this._ontologyTreeService.getFrameSynonyms(this.workspace_id,frame.parentId, frame.entity.entityType).subscribe((res:any)=>{
      this.frameSynonyms = res.synonyms
    })
  }

  openAddFact(){
    debugger
      const dialogRef = this.dialog.open(CreateOntologyEntityComponent, {
        data: {entityId:0, projectId:this.workspace_id,mode:'Entity' , Type:'action'},},
      );
      dialogRef.afterClosed().subscribe((res:any) => {
        if(res){

        }
      })
    }

    openSetImplied(frame:Frame){
    debugger
    var impliedEntity = this.classesAndProps.filter(x=>x._id == frame.impliedFrameId)
      const dialogRef = this.dialog.open(SetImpliedComponent, {
        data: {entities:this.classesAndProps,impliedEntity:impliedEntity},},
      );
      dialogRef.afterClosed().subscribe((res:any) => {
        debugger
        if(res){
          this._ontologyTreeService.setImplied({entityId:frame.entityId,impliedFrameId:res,projectId:this.workspace_id}).subscribe((res:any)=>{
            this.getVerbInfo()
          })
        }
      })
    }

  GoToFactProperties(frame){
    debugger
    this.router.navigate([`/projects/${this.workspace_id}/FactTree/${frame.entityId}`])
  }
  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
