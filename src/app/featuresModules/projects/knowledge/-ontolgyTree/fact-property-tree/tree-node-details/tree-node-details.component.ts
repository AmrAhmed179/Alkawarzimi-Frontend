import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FactProperties, MediaResponse, ObjectEntitiesValue } from 'src/app/Models/ontology-model/fact-property';
import { AddIndividualClassFrameComponent } from './add-individual-class-frame/add-individual-class-frame.component';
import { MatDialog } from '@angular/material/dialog';
import { EntityModel } from 'src/app/Models/ontology-model/EntityCatogeryModel';
import { NotifyService } from 'src/app/core/services/notify.service';
import { FactPropertyTreeService } from 'src/app/Services/Ontology-Tree/fact-property-tree.service';
import { Example } from 'src/app/Models/build-model/intent-model';
import { MagicWordWriteComponent } from 'src/app/shared/components/magic-word-write/magic-word-write.component';
import { TasksService } from 'src/app/Services/Build/tasks.service';

@Component({
  selector: 'vex-tree-node-details',
  templateUrl: './tree-node-details.component.html',
  styleUrls: ['./tree-node-details.component.scss']
})
export class TreeNodeDetailsComponent implements OnInit {

  openExampleFlag:boolean = false
  constructor(    public dialog: MatDialog,
    private notify: NotifyService,
    private _factPropertyTreeService: FactPropertyTreeService,
    private _tasksService: TasksService,


  ) { }
    listInput:string
    exampleInput:string
    detetctedExampleInput:string
    examples:Example[]
    detectedIntents:any[]
  @Input() SeLectedNode:FactProperties
  @Input() saveNodeValueId:string
  @Input() projectId:string
  @Input() propertyId:string
  @Input() entities:EntityModel[]
  @Input() selectActiveTap:string
  @Output() saveNodeValue = new EventEmitter<FactProperties>();
  activeTap:string = 'response'
  responseOrDiagram = '1'
  panelOpenState = false
  isPanelOpen:Boolean = false
  @ViewChild('editor') editor;
  currentIndex:number
  currentItemIndex:number
  currentexampleIndex:number
  currentDetectExampleIndex:number
  name = 'Angular';
  modules = {
    formula: true,
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      ['formula'],
      ['image','link', 'code-block']
    ]
  };

  ngOnInit(): void {
  }

  ngOnChanges(){
    debugger
    if(this.SeLectedNode.node_id == this.saveNodeValueId){
      this.saveNodeValue.emit(this.SeLectedNode)
    }
    this.activeTap = this.selectActiveTap
    this.exampleInput = ''
    this.detetctedExampleInput = ''
    if(!this.SeLectedNode.patternIntentId)
      this.getExamples()
  }
  disablePanel(event: MouseEvent): void {
    event.stopPropagation();
  }
  clickOnList( index){
    this.currentIndex = index
  }

  deteteFact(entity:ObjectEntitiesValue){
    var index =  this.SeLectedNode.response.objectEntitiesValues.findIndex(x=>x.value[0].value == entity.value[0].value)
    this.SeLectedNode.response.objectEntitiesValues.splice(index,1)
  }

addListItem(){
    var objectEntuty = {
      entityId: -1,
      entityType: "value",
      value: [
          {
              lang: "ar",
              value: this.listInput
          }
      ],
      nValue: 0,
      negative: false
  }
  this.SeLectedNode.response.objectEntitiesValues.push(objectEntuty)
  }

  updateListItem(){

  this.SeLectedNode.response.objectEntitiesValues[this.currentItemIndex].value[0].value = this.listInput
  }
  addEntity(type:string){
    debugger
    const dialogRef = this.dialog.open(AddIndividualClassFrameComponent, {
      data: { entities: this.entities, type:type},},
    );
    dialogRef.afterClosed().subscribe((res:any) => {
      if(res){
        debugger
        let entity:EntityModel = this.entities.find(x=>x._id == res)
       var objectEntuty = {
          entityId: entity._id,
          entityType: entity.entityType,
          value: [
              {
                  lang: "ar",
                  value: entity.entityInfo[0].entityText
              }
          ],
          nValue: 0,
          negative: false
      }
      this.SeLectedNode.response.objectEntitiesValues.push(objectEntuty)
      }
    })
  }
  addMediaRespone(){
    var mediaresponse:MediaResponse = new MediaResponse()

    mediaresponse.src =""
    mediaresponse.type ='3'
    mediaresponse.link =""
    mediaresponse.title.push({
      lang: "ar",
      value: ""
    })
    this.SeLectedNode.response.mediaResponse = mediaresponse
  }
  deleteMediaResponse(){
    this.SeLectedNode.response.mediaResponse = null
  }
  openExample(){
    this.activeTap = 'example'
    if(this.openExampleFlag == false){
      this.openExampleFlag = true
    }
    if(this.SeLectedNode.patternIntentId != null){
      this.getExamples()
    }
  }

  addExample(){
    if(this.SeLectedNode.patternIntentId == null){
      let body ={
        example:this.exampleInput,
        factProperty:this.SeLectedNode,
        workspace_id:this.projectId
      }
      this._factPropertyTreeService.setWithExample(body).subscribe((res:any)=>{
        if(res.status == 1){
          this.SeLectedNode.patternIntentId = res.intentId
          this.getExamples()
        }
      })
    }
    else{
      let body ={
        example: {text:this.exampleInput},
        intentId:this.SeLectedNode.patternIntentId,
        workspace_id:this.projectId
      }
      this._factPropertyTreeService.createExample(body).subscribe((res:any)=>{
        if(res.status == 1){
          this.getExamples()
        }
      })
    }
  }

  getExamples(){
    this._factPropertyTreeService.getExamples(this.SeLectedNode.patternIntentId, this.projectId).subscribe((res:any)=>{
        debugger
        if(res == null){
          this.examples = []
        }else{
          this.examples = res.examples
        }

    })
  }

  deteteExample(example){
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
        let body ={
          example:example,
          intentId:this.SeLectedNode.patternIntentId,
          workspace_id:this.projectId
        }
        this._factPropertyTreeService.deleteExampleFact(body).subscribe((res:any)=>{
          if(res.status == 1){
            this.getExamples()
          }
        })
      }
    })
  }

  deleteLinkExample(event){
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
        let body ={
          factProperty:this.SeLectedNode,
          projectId:this.projectId
        }
        this._factPropertyTreeService.delinkIntent(body).subscribe((res:any)=>{
          if(res.status == 1){
            this.examples = []
            this.SeLectedNode.patternIntentId = null
          }
        })
      }
    })
  }

  linkIntent(intent){
    let body ={
      factProperty:this.SeLectedNode,
      projectId:this.projectId,
      intentId:intent.intentId,
      Conflict:0
    }
    this._factPropertyTreeService.linkIntent(body).subscribe((res:any)=>{
      if(res.status == 1){
        this.SeLectedNode.patternIntentId = intent.intentId
        this.getExamples()
      }
    })
  }
  detectedExampleIntent(){
    this._tasksService.matchPattern(this.detetctedExampleInput,this.projectId).subscribe((res:any)=>{
        debugger
        this.detectedIntents = res.intents.intents
    })
  }
}
