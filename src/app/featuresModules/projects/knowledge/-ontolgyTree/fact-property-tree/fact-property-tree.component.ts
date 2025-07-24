import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ITreeOptions, TreeComponent } from '@circlon/angular-tree-component';
import { Subject, takeUntil } from 'rxjs';
import { DataService } from 'src/app/core/services/data.service';
import { NotifyService } from 'src/app/core/services/notify.service';
import { EntityModel } from 'src/app/Models/ontology-model/EntityCatogeryModel';
import { FactProperties, LinkedArg, PropertiesIndex } from 'src/app/Models/ontology-model/fact-property';
import { OntologyEntitiesService } from 'src/app/Services/Knowlege/ontology-entities.service';
import { FactPropertyTreeService } from 'src/app/Services/Ontology-Tree/fact-property-tree.service';
import { OntologyTreeService } from 'src/app/Services/Ontology-Tree/ontology-tree.service';
import { SelectedVerbService } from 'src/app/Services/Ontology-Tree/selected-verb.service';
import { OptionsServiceService } from 'src/app/Services/options-service.service';
import { AddSubCmpObjComponent } from './add-sub-cmp-obj/add-sub-cmp-obj.component';
import { MagicWordWriteComponent } from 'src/app/shared/components/magic-word-write/magic-word-write.component';
import { AddFrameAttchPropertyComponent } from './add-frame-attch-property/add-frame-attch-property.component';
import { NodeModel } from 'src/app/Models/ontology-model/node';
import { ManageAttachedFramesComponent } from './manage-attached-frames/manage-attached-frames.component';
import { AttachedFrameListComponent } from './attached-frame-list/attached-frame-list.component';

@Component({
  selector: 'vex-fact-property-tree',
  templateUrl: './fact-property-tree.component.html',
  styleUrls: ['./fact-property-tree.component.scss']
})
export class FactPropertyTreeComponent implements OnInit {
  projectId:string
  lang:string
  entityId:string
  entityType:string
  TREE_DATA:FactProperties[]
  SeLectedNode:FactProperties
  onDestroy$: Subject<void> = new Subject();
  factsProperty:FactProperties[]
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
    childrenField:'nodes'
  }
  @ViewChild('tree') tree: TreeComponent;
  activeTap:string = 'frame'
  propertyIndex:PropertiesIndex[] = []
  dataProp:PropertiesIndex[] = []
  LinkedArgObj:LinkedArg
  LinkedArgSubj:LinkedArg
  LinkedArgCmp:LinkedArg
  selectedNodeId:string
  saveNodeValueId:number = 0
  filteredProperties:any[] = []
  DataProperties:NodeModel[] = []
  selectedTapProperties:PropertiesIndex[] = []
  constructor(
    private _ontologyTreeService: OntologyTreeService,
    private _dataService: DataService,
    private _optionsService: OptionsServiceService,
    private _factPropertyTreeService: FactPropertyTreeService,
    public dialog: MatDialog,
    private notify: NotifyService,
    private selectedVerbService: SelectedVerbService,
    private _ontologyEntitiesService:OntologyEntitiesService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this._dataService.$project_bs.pipe(takeUntil(this.onDestroy$)).subscribe((project) => {
      if (project) {
        this.projectId = project._id;
    this._optionsService.selectedLang$.pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
          if (response) {
            this.lang = response;
            this.route.paramMap.subscribe(params => {
              debugger
              this.entityId = params.get('entityId');
              this.propertiesIndex()
              this.getDataProperty()
              this.getClassandProp()
            });
          }
        });
      }
    });
  }

  getEntityTye(){
  }
  getFactProperty(type:string, entityId:number){
    this._factPropertyTreeService.getFactProperty(this.projectId,entityId).subscribe((res:any)=>{
      this.factsProperty = JSON.parse(res.factProperty)
      console.log("factPrperty",this.factsProperty)
      if(type == 'frame')
        this.detectObjSubjCmp(JSON.parse(res.linkedArgs))
      this.showTree()
    })
  }

  showTree(){
    this.factsProperty.map(x=>{
      var entity = this.classesAndProps.find(y=>y._id == x.entityId )
      x.entity = entity
      var linkedClassEntity = this.classesAndProps.find(y=>y._id == x.linkedClass )
      if(linkedClassEntity)
        x.linkedClassText = linkedClassEntity.entityInfo[0].entityText
      else
       x.linkedClassText = ''

      x.linkedFramesEntity = []
      x.linkedFrames?.forEach((e:any)=>{
        let entity = this.classesAndProps.find(x=>x._id == e)
        if(entity)
         x.linkedFramesEntity.push(entity)
      })
    })
    this.factsProperty.map(x=>{
      debugger
      var property = this.propertyIndex.find(y=>y.entityId == x.predicateId )
      x.propertyIndex = property
      if(x.type == 'frame'){
        x.treeText = x.entity.entityInfo[0].entityText
      }
      else if(x.type == 'root'){
        x.treeText = x.propertyIndex.entityText
        x.treeText = x.propertyIndex.entityText
      }
      else if (x.type == 'modifiedFrame'){
        x.treeText = `${x.propertyIndex.entityText} => ${x.entity.entityInfo[0].entityText}`
      }

      else if (x.type == 'attachment'){
        let Prop = this.dataProp.find(y=>y.entityId == x.predicateId )
        if(Prop){
        x.propertyIndex = Prop
        x.treeText = `${x.propertyIndex.entityText}`
        }
        else{
          var entity = this.classesAndProps.find(y=>y._id == x.predicateId )
          if(entity)
            x.treeText = `${entity.entityInfo[0].entityText}`
          else{
            this.getProperites()
            var selectedProp = this.selectedTapProperties.find(y=>y.entityId == x.predicateId )
             x.treeText = `${selectedProp.entityText}`
          }
        }
        x.subClassEntityArray = []
        x.propSubClasses?.forEach(element => {
          let entity = this.classesAndProps.find(x=>x._id == element)
          x.subClassEntityArray.push(entity)
        });
      }
      else if (x.type == 'compoundFrame'){
      let Prop = this.dataProp.find(y=>y.entityId == x.predicateId )
      if(Prop){
      x.propertyIndex = Prop
      x.treeText = `${x.propertyIndex.entityText}`
      }
      else{
        var entity = this.classesAndProps.find(y=>y._id == x.predicateId )
        var PropBySourcePredicateId = this.DataProperties.find(y=>y.entityId == x.sourcePredicateId )
        if(PropBySourcePredicateId)
         x.treeText = `${PropBySourcePredicateId.entityText} >>> ${entity.entityInfo[0].entityText}`
        else
         x.treeText = `${entity.entityInfo[0].entityText}`

      }
    }
    })
    this.TREE_DATA = this.buildTree(this.factsProperty)
    setTimeout(() => {
      this.tree.treeModel.expandAll();
    });
    console.log('Tree',this.TREE_DATA)
  }
  detectObjSubjCmp(links:any){
    debugger
    let cmp = links?.LinkedArgs?.find(x=>x.type == 'cmp')
    let obj = links?.LinkedArgs?.find(x=>x.type == 'obj')
    let sbj = links?.LinkedArgs?.find(x=>x.type == 'sbj')
    this.LinkedArgCmp = cmp
    this.LinkedArgObj = obj
    this.LinkedArgSubj = sbj
  }
  getClassandProp(){
    this._ontologyEntitiesService.getClassandProp(this.projectId).subscribe((res:any)=>{
      this.classesAndProps = res.entities
      this.getFactProperty('frame',+this.entityId)
     this.entityType = this.classesAndProps.find(x=>x._id == +this.entityId).entityType
     console.log('entityType', this.entityType)

    })
  }


  propertiesIndex(){
    this._ontologyEntitiesService.propertiesIndex('frameModificationProp').subscribe((res:any)=>{
      this.propertyIndex = res.nodes
      this.propertiesDataProp()
    })
  }

  propertiesDataProp(){
    this._ontologyEntitiesService.propertiesIndex('dataProp').subscribe((res:any)=>{
      this.dataProp = res.nodes
      this.selectedTapProperties = this.dataProp
      this.getClassandProp()
    })
  }

 buildTree(TreeNodes): FactProperties[] {
  debugger
  const tree: FactProperties[] = [];
  // Create a map to store intents by their intentId
  const map: { [key: string]: FactProperties } = {};
  // Initialize the map with intents
  TreeNodes.forEach(intent => {
    map[intent.node_id] = { ...intent, nodes: [] };
  });

  // Iterate over the data to construct the tree
  TreeNodes.forEach(intent => {
    if (intent.parent) {
      // If the intent has a parentId, add it as a child to its parent
      const parent = map[intent.parent];
      if (parent) {
        parent.nodes.push(map[intent.node_id]);
      }
    } else {
      // If the intent does not have a parentId, it is a root node
      tree.push(map[intent.node_id]);
    }
  });
 Object.values(map).forEach(n=>{
  let childern:FactProperties[] = []
    if(n.nodes.length > 1){
      for (let index = 0; index < n.nodes.length; index++) {
        debugger
        if(childern.length == 0){
        let parent = n.nodes.find(x=>x.previous_sibling == null)
        if(parent){
          childern.push(parent)
        }
      }
        else{
          var nextNode = n.nodes.find(x=>x.previous_sibling == childern[childern.length-1].node_id)
          if(nextNode)
            childern.push(nextNode)
        }
      }
      if(n.nodes.length == childern.length)
        n.nodes = childern
      else{
          const missingItems =  n.nodes.filter(primaryItem =>
        !childern.some(secondaryItem =>
        primaryItem.node_id === secondaryItem.node_id // or any other comparison logic
        )
        );
      n.nodes = [...childern, ...missingItems]

      }
    }
  })
  console.log(tree)
  return tree;
}

  selectTap(tapName:string){
    if(tapName =='sbj'){
      if(!this.LinkedArgSubj){
        const dialogRef = this.dialog.open(AddSubCmpObjComponent, {
          data: { entities:this.classesAndProps, type:'sbj'},},
        );
        dialogRef.afterClosed().subscribe((result:any) => {
          if(result){
            let body =   this.LinkArg(tapName, result)
            this._factPropertyTreeService.saveLinkedArg(body).subscribe((res:any)=>{
              this.getFactProperty(tapName,result)
            })
            this.activeTap = tapName
            this.LinkedArgSubj = {attache:false,lId:result,type:tapName}
          }
        })
      }
      else{
        this.getFactProperty(tapName,this.LinkedArgSubj.lId)
        this.activeTap = tapName
      }
      this.getProperites()
    }
    if(tapName =='obj'){
      if(!this.LinkedArgObj){
        const dialogRef = this.dialog.open(AddSubCmpObjComponent, {
          data: { entities:this.classesAndProps, type:'obj'},},
        );
        dialogRef.afterClosed().subscribe((result:any) => {
          if(result){
            let body =  this.LinkArg(tapName, result)
            this._factPropertyTreeService.saveLinkedArg(body).subscribe((res:any)=>{
              this.getFactProperty(tapName,result)
            })
            this.activeTap = tapName
            this.LinkedArgObj = {attache:false,lId:result,type:tapName}
          }
        })
      }
      else{
        this.getFactProperty(tapName,this.LinkedArgObj.lId)
        this.activeTap = tapName
      }
      this.getProperites()
    }
    if(tapName =='cmp'){
      if(!this.LinkedArgCmp){
        const dialogRef = this.dialog.open(AddSubCmpObjComponent, {
          data: { entities:this.classesAndProps, type:'cmp'},},
        );
        dialogRef.afterClosed().subscribe((result:any) => {
          if(result){
            let body =   this.LinkArg(tapName, result)
            this._factPropertyTreeService.saveLinkedArg(body).subscribe((res:any)=>{
              this.getFactProperty(tapName,result)
            })
            this.activeTap = tapName
            this.LinkedArgCmp = {attache:false,lId:result,type:tapName}
          }
        })
      }
      else{
        this.getFactProperty(tapName,this.LinkedArgCmp.lId)
        this.activeTap = tapName
      }
      this.getProperites()
    }
    if(tapName =='frame'){
      this.activeTap = tapName
      this.getFactProperty(tapName,+this.entityId)
      this.selectedTapProperties = this.dataProp
    }
  }

  LinkArg(type:string,lId:number){
    var  body = {
      projectId: this.projectId,
      entityId: this.entityId,
      LinkedArg:[
      ]
    }
    if(type == 'sbj'){
      body.LinkedArg.push({lId: lId,type: type,})

      if(this.LinkedArgObj)
        body.LinkedArg.push({lId: this.LinkedArgObj.lId, type: this.LinkedArgObj.type})

      if(this.LinkedArgCmp)
        body.LinkedArg.push({lId: this.LinkedArgCmp.lId, type: this.LinkedArgCmp.type})
    }

    if(type == 'obj'){
      if(this.LinkedArgSubj)
        body.LinkedArg.push({lId: this.LinkedArgSubj.lId, type: this.LinkedArgSubj.type})

      body.LinkedArg.push({lId: lId,type: type,})

      if(this.LinkedArgCmp)
        body.LinkedArg.push({lId: this.LinkedArgCmp.lId, type: this.LinkedArgCmp.type})
    }

    if(type == 'cmp'){
      if(this.LinkedArgSubj)
        body.LinkedArg.push({lId: this.LinkedArgSubj.lId, type: this.LinkedArgSubj.type})

      if(this.LinkedArgObj)
        body.LinkedArg.push({lId: this.LinkedArgObj.lId, type: this.LinkedArgObj.type})

      body.LinkedArg.push({lId: lId,type: type,})
    }

    return body
  }

  DeleteLinkArg(type:string){
    var  body = {
      projectId: this.projectId,
      entityId: this.entityId,
      LinkedArg:[
      ]
    }
    if(type == 'sbj'){
      if(this.LinkedArgObj)
        body.LinkedArg.push({lId: this.LinkedArgObj.lId, type: this.LinkedArgObj.type})

      if(this.LinkedArgCmp)
        body.LinkedArg.push({lId: this.LinkedArgCmp.lId, type: this.LinkedArgCmp.type})
    }

    if(type == 'obj'){
      if(this.LinkedArgSubj)
        body.LinkedArg.push({lId: this.LinkedArgSubj.lId, type: this.LinkedArgSubj.type})
      if(this.LinkedArgCmp)
        body.LinkedArg.push({lId: this.LinkedArgCmp.lId, type: this.LinkedArgCmp.type})
    }

    if(type == 'cmp'){
      if(this.LinkedArgSubj)
        body.LinkedArg.push({lId: this.LinkedArgSubj.lId, type: this.LinkedArgSubj.type})

      if(this.LinkedArgObj)
        body.LinkedArg.push({lId: this.LinkedArgObj.lId, type: this.LinkedArgObj.type})
    }

    return body
  }
  deleteArg(event, type:string){
    event.stopPropagation()
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
        var body = this.DeleteLinkArg(type)
        this._factPropertyTreeService.saveLinkedArg(body).subscribe((res:any)=>{
          this.activeTap = 'frame'
          this.getFactProperty('frame',+this.entityId)
        })
      }
    })
  }

  seLectedNode(node:FactProperties){
    debugger
    if(!node.response){
      node.response = {value:[{lang:'ar',value:''}]}
    }
    if(!node.response?.value){
      node.response.value = [{lang:'ar',value:''}]
    }
    if(node.response?.value.length == 0){
      node.response.value = [{lang:'ar',value:''}]
    }

    this.selectedNodeId = node.node_id
    this.SeLectedNode = node
    this.saveNodeValueId = 0
  }
  //////when click in save value in tree
  saveNodedetailsValuse(node:FactProperties,event){
    debugger
    event.stopPropagation()
    if(this.selectedNodeId == node.node_id){
      this.saveNodeValueId = this.saveNodeValueId + 1
    }
  }

  deleteFrameFactProperty(node:FactProperties){
    debugger
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
        var firstSiblingBody
        var firstSibling = this.factsProperty.find(x=>x.previous_sibling == node.node_id)
        if(firstSibling){
          firstSiblingBody ={
            entityId: firstSibling.entityId,
            subjectId: firstSibling.subjectId,
            predicateId: firstSibling.predicateId,
            docId: firstSibling.docId,
            type: firstSibling.type,
            node_id: firstSibling.node_id,
            parent: firstSibling.parent,
            previous_sibling: firstSibling.previous_sibling
          }
        }
        else{
          firstSiblingBody = null
        }

        var body ={
          projectId:this.projectId,
          childrenCount:node.nodes.length,
         node: {
            node_id: node.node_id,
            previous_sibling: node.previous_sibling,
            entityId: node.entityId,
            patternIntentId: node.patternIntentId
        },
        firstSiblingNode:firstSiblingBody
        }

        this._factPropertyTreeService.deleteFrameFactProperty(body).subscribe((res:any)=>{
          debugger
            var index = this.factsProperty.findIndex(x=>x.previous_sibling == node.node_id)
            if(index != -1)
              this.factsProperty[index].previous_sibling = node.previous_sibling

            this.factsProperty.splice(this.factsProperty.findIndex(x=>x.node_id == node.node_id),1)
            this.showTree()
        })
      }
    })

  }

  addFrameAttachProperty(node:FactProperties){
    debugger
    if(node.entity.entityType != 'action')
       this.getProperites()

    const dialogRef = this.dialog.open(AddFrameAttchPropertyComponent, {
      data: { dataProps:this.selectedTapProperties},},
    );
    dialogRef.afterClosed().subscribe((result:any) => {
      debugger
      if(result){
       let property = this.selectedTapProperties.find(x=>x.entityId == result)

       let body={
        Property:property,
        projectId:this.projectId,
        factProperty:{
            entityId: node.entityId,
            docId: "",
            subjectId: node.subjectId,
            predicateId: property.entityId,
            type:"attachment",
            "response": {
              "objectEntitiesValues": [
              ],
              "responseType": 1,
              "value": [
                  {
                      "lang": "ar",
                      "value": ""
                  }
              ],
              "vLangIndex": 0
          } ,
            languageIndex: 0,
            predicateType: "factProp",
            parent: node.node_id,
            previous_sibling: node.nodes[node.nodes.length -1]?.node_id ? node.nodes[node.nodes.length -1]?.node_id : null
       }
      }
       this._factPropertyTreeService.setFactProperty(body).subscribe((res:any)=>{
        if(res.status == 1){
          this.factsProperty.push(res.factProperty)
          debugger
          this.showTree()
        }
       })

      }
    })
  }

  addFrameModificationProperty(node:FactProperties){
    const dialogRef = this.dialog.open(AddFrameAttchPropertyComponent, {
      data: { dataProps:this.propertyIndex},},
    );
    dialogRef.afterClosed().subscribe((result:any) => {
      if(result){
        debugger
       let property = this.propertyIndex.find(x=>x.entityId == result)
        let previous_sibling = this.getLastNodeInParent(node)
       let body={
        Property:property,
        projectId:this.projectId,
        factProperty:{
            entityId: node.entityId,
            docId: "",
            subjectId: `${node.subjectId},${property.entityId}` ,
            predicateId: property.entityId,
            type:"modifiedFrame",
            "response": {
              "objectEntitiesValues": [
              ],
              "responseType": 1,
              "value": [
                  {
                      "lang": "ar",
                      "value": ""
                  }
              ],
              "vLangIndex": 0
          } ,
            languageIndex: 0,
            predicateType: "verb",
            parent: node.parent,
            previous_sibling: previous_sibling.node_id
       }
      }
       this._factPropertyTreeService.setFactProperty(body).subscribe((res:any)=>{
        if(res.status == 1){
          this.factsProperty.push(res.factProperty)
          debugger
          this.showTree()
        }
       })
      }
    })
  }

  getLastNodeInParent(node:FactProperties){
    let parent = this.factsProperty.find(x=>x.node_id == node.parent)
    let nodes = this.factsProperty.filter(x=>x.parent == parent.node_id)
    let childern:FactProperties[] = []
    for (let index = 0; index < nodes.length; index++) {
      debugger
      if(childern.length == 0){
      let parent = nodes.find(x=>x.previous_sibling == null)
      if(parent){
        childern.push(parent)
      }
    }
      else{
        var nextNode = nodes.find(x=>x.previous_sibling == childern[childern.length-1].node_id)
        childern.push(nextNode)
      }
    }
    parent.nodes = childern
    return parent.nodes[parent.nodes.length-1]
  }

  linkClass(node:FactProperties){
    const dialogRef = this.dialog.open(AddSubCmpObjComponent, {
      data: { entities:this.classesAndProps, type:this.activeTap},},
    );
    dialogRef.afterClosed().subscribe((result:any) => {
      if(result){
        node.linkedClass = result
        let body = {
          projectId:this.projectId,
          factProperty:node
        }
        this._factPropertyTreeService.updateFactProperty(body).subscribe((res:any)=>{
          if(res.status == 1){
            var index = this.factsProperty.findIndex(x=>x.node_id == node.node_id)
            this.factsProperty[index].linkedClass = result
            this.showTree()
          }
        })
      }
    })
  }
  removeLink(node:FactProperties){
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
        node.linkedClass = 0
        let body = {
          projectId:this.projectId,
          factProperty:node
        }
        this._factPropertyTreeService.updateFactProperty(body).subscribe((res:any)=>{
          if(res.status == 1){
            var index = this.factsProperty.findIndex(x=>x.node_id == node.node_id)
            this.factsProperty[index].linkedClass = 0
            this.showTree()
          }
        })
      }
  })
  }
  addSubProperties(node:FactProperties){
    const dialogRef = this.dialog.open(AddSubCmpObjComponent, {
      data: { entities:this.classesAndProps, type:this.activeTap},},
    );
    dialogRef.afterClosed().subscribe((result:any) => {
      if(result){
        const nodeCopy = JSON.parse(JSON.stringify(node));
            // Add to the copy (not the original)
        nodeCopy.propSubClasses = nodeCopy.propSubClasses ? [...nodeCopy.propSubClasses, result] : [result];
        let body = {
          projectId:this.projectId,
          factProperty:nodeCopy
        }
        this._factPropertyTreeService.updateFactProperty(body).subscribe((res:any)=>{
          if(res.status == 1){
          const index = this.factsProperty.findIndex(x => x.node_id == node.node_id);
          if (index !== -1) {
              this.factsProperty[index] = nodeCopy;
              this.seLectedNode(nodeCopy)
          }
            this.showTree()
          }
        })
      }
    })
  }

  returenEntityId(){
    if(this.activeTap == 'sbj')
      return this.LinkedArgSubj.lId

    if(this.activeTap == 'obj')
      return this.LinkedArgObj.lId

    if(this.activeTap == 'cmp')
      return this.LinkedArgCmp.lId

    if(this.activeTap == 'frame')
      return this.entityId
  }

  deleteSubProp(node:FactProperties, subclass:EntityModel){
    var factIndex = this.factsProperty.findIndex(x=>x.node_id == node.node_id)
    var propIndex =  this.factsProperty[factIndex].propSubClasses.findIndex(x=>x ==subclass._id)
    this.factsProperty[factIndex].propSubClasses.splice(propIndex,1)
    this.factsProperty[factIndex].subClassEntityArray.splice(propIndex,1)
    this.showTree()
  }
  onMoveNode($event: any) {
    debugger
    const movedNode = $event.node;
    movedNode.parent =$event.to.parent.node_id
    delete movedNode.nodes

    const toIndex = $event.to.index
    const toDestIndex = toIndex+1
    const toPreviousNode = $event.to.parent.nodes[toIndex-1]

    let srcSibling
    let destSibling
    let body = {}
    srcSibling = this.factsProperty.find(x=>x.previous_sibling == movedNode.node_id)
    destSibling = $event.to.parent.nodes[toDestIndex]
    if(srcSibling && destSibling){
      delete srcSibling.nodes
      srcSibling.previous_sibling = movedNode.previous_sibling
      delete destSibling.nodes
      movedNode.previous_sibling = destSibling.previous_sibling
      destSibling.previous_sibling = movedNode.node_id
      body ={
        projectId:this.projectId,
        entityId:this.entityId,
        node:movedNode,
        destSibling:destSibling,
        srcSibling:srcSibling
      }
    }

    else if(!srcSibling && destSibling){
      delete destSibling.nodes
      movedNode.previous_sibling = destSibling.previous_sibling
      destSibling.previous_sibling = movedNode.node_id
      body ={
        projectId:this.projectId,
        entityId:this.entityId,
        node:movedNode,
        destSibling:destSibling,
      }
    }

    else if(!destSibling && srcSibling){
      delete srcSibling.nodes
      srcSibling.previous_sibling = movedNode.previous_sibling
      if(toPreviousNode){
        movedNode.previous_sibling = toPreviousNode.node_id
      }
      else{
        movedNode.previous_sibling = null
      }
      body ={
        projectId:this.projectId,
        entityId:this.entityId,
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
        projectId:this.projectId,
        entityId:this.entityId,
        node:movedNode,
      }
    }

    this._factPropertyTreeService.updateFactTree(body).subscribe((res:any)=>{
      if(res.status =='1'){
        this.notify.openSuccessSnackBar("tree updated")
        if(movedNode)
          this.updateTreeNodes(movedNode)
        if(srcSibling)
          this.updateTreeNodes(srcSibling)
        if(destSibling)
          this.updateTreeNodes(destSibling)
      }
    })

  }
  updateTreeNodes(node:FactProperties){
    let index = this.factsProperty.findIndex(x=>x.node_id == node.node_id)
    this.factsProperty[index] = node
  }


   getProperites(){
    debugger
    this.filteredProperties = []
    let entityId = this.returenEntityId()
    for (var i = 0; i < this.DataProperties.length; i++) {

      if (this.DataProperties[i].domains == null ||  this.DataProperties[i].domains.length == 0)
          continue;

      for (var j = 0; j < this.DataProperties[i].domains.length; j++) {
          if (this.DataProperties[i].domains[j].entityId ==  entityId) {
            this.filteredProperties.push(this.DataProperties[i]);
          }
      }
  }
  this.selectedTapProperties = this.filteredProperties

  console.log('properties',this.filteredProperties)
  }
  getDataProperty(){
    this._ontologyTreeService.getDataPropertyIndex(this.projectId).subscribe((res:any)=>{
      this.DataProperties = res.nodes

    })
  }

  linkFrameEntity(node:FactProperties){
    debugger
    const dialogRef = this.dialog.open(ManageAttachedFramesComponent, {
      data: { entities:this.classesAndProps, type:''},},
    );
    dialogRef.afterClosed().subscribe((result:any) => {
      if(result){
        var index = this.factsProperty.findIndex(x=>x.node_id == node.node_id)
        var body = {
            factProperty:node,
            FrameEntityId: result.FrameEntityId,
            arg: result.arg,
            projectId: this.projectId
        }
        this._factPropertyTreeService.attachPropertyToFrame(body).subscribe((res:any)=>{
          if(res.status == '1'){
            this.notify.openSuccessSnackBar("Data Saved");
            (this.factsProperty[index].linkedFrames ??= []).push(result.FrameEntityId);
            var entity = this.classesAndProps.find(x=>x._id == result.FrameEntityId)
            this.factsProperty[index].linkedFramesEntity.push(entity)
          }
          else{
            this.notify.openFailureSnackBar(res.message)
          }
        })
      }
    })
  }

  linkFrameList(node:FactProperties){
    debugger
    const dialogRef = this.dialog.open(AttachedFrameListComponent, {
      data: { FactProperty:node, projectId:this.projectId},},
    );
    dialogRef.afterClosed().subscribe((result:any) => {
      debugger
      if(result){

      }
    })
  }
  ///when data came from child and press save value
  getNodeValueFromChild(factProperty:FactProperties){
    let body = {
      projectId:this.projectId,
      factProperty:factProperty
    }
    this._factPropertyTreeService.updateFactProperty(body).subscribe((res:any)=>{
      if(res.status == 1){
        this.notify.openSuccessSnackBar("Data Saved")
        var index = this.factsProperty.findIndex(x=>x.node_id == factProperty.node_id)
        this.factsProperty[index] = factProperty
        this.showTree()
      }
      else{
        this.notify.openFailureSnackBar(res.message)
      }
    })  }

    addCompoundProperty(entity){

       let previous_sibling =  this.TREE_DATA[0].nodes[this.TREE_DATA[0].nodes.length - 1]
       let body={
        factProperty:
           {
            "entityId": this.entityId,
            "docId": "",
            "subjectId": `${this.entityId},${entity.entityId}`,
            "predicateId": entity.entityId,
            "type": "compoundFrame",
            "objectValue": "",
            "parent": "-1",
            "previous_sibling": previous_sibling.node_id,
            "sourcePredicateId": this.SeLectedNode.predicateId
          },
        projectId:this.projectId
      }
      this._factPropertyTreeService.SetCompoundFact(body).subscribe((res:any)=>{
        if(res.status == 1){
          this.notify.openSuccessSnackBar("Successfully Added")
          this.factsProperty.push(res.factProperty)
          this.showTree()
        }
      })
    }
  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
  close(){
      this.router.navigate([`/projects/${this.projectId}/ontologyTree/ontologyTreeView`])
  }
}
