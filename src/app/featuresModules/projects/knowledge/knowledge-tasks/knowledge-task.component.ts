import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { DataService } from 'src/app/core/services/data.service';
import { NotifyService } from 'src/app/core/services/notify.service';
import { NodeModel } from 'src/app/Models/ontology-model/node';
import { KnowledgeTasksService } from 'src/app/Services/knowledge-tasks.service';
import { OntologyEntitiesService } from 'src/app/Services/Knowlege/ontology-entities.service';
import { OntologyTreeService } from 'src/app/Services/Ontology-Tree/ontology-tree.service';
import { OptionsServiceService } from 'src/app/Services/options-service.service';
import { TestService } from 'src/app/Services/test.service';
import { MagicWordWriteComponent } from 'src/app/shared/components/magic-word-write/magic-word-write.component';
import { CreateOntologyEntityComponent } from '../ontology-entities/parent-ontology-entities/ontology-entities/dialogs/create-ontology-entity/create-ontology-entity.component';
import { isThisSecond } from 'date-fns';
import { LinkedToFactComponent } from './linked-to-fact/linked-to-fact.component';
import { DialogNode, IntentModel } from 'src/app/Models/IntentsModel';

@Component({
  selector: 'vex-knowledge-task',
  templateUrl: './knowledge-task.component.html',
  styleUrls: ['./knowledge-task.component.scss']
})
export class KnowledgeTaskComponent implements OnInit {
  onDestroy$: Subject<void> = new Subject();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: MatTableDataSource<any>;
  DataProperties:NodeModel[] = []
  nodesProperties:NodeModel[] = []
  displayedColumns: string[] = ['position'];
  panelOpenState = false;
  addExampleValue:string
  selectedExampleId:number
  selectedExampletext:string
  extractedEntities

  entities:any[]
  qtools:any[]
  projectId:string
  projectName:string
  activeTap = 'All Tasks'
  createEntityInput:string = ''
  pageNumber = 1
  pageSize = 10
  totalItems
  Intents:IntentModel[] = []
  oldIntents:any[] = [  ]
  _selected_id
  selectedIntent
  constructor( private _knowledgeTasksService: KnowledgeTasksService,
      private _dataService: DataService,
      private _optionsService:OptionsServiceService,
     private _ontologyTreeService: OntologyTreeService,
     private _ontologyEntitiesService:OntologyEntitiesService,
     private _testService: TestService,
      private notify: NotifyService,
     public dialog: MatDialog,

    ) { }
     removeEntity:boolean = false
  ngOnInit(): void {
    this._dataService.$project_bs.pipe(takeUntil(this.onDestroy$)).subscribe((project:any)=>{
      if(project){
        debugger
      this.projectId = project._id
      this.projectName = project.name
      this.GetknowledgeIntent()
      this.getDataProperty()
      this.getPropertiesIndex()
      this.getAllEntities()
  }})
  }

  ngAfterViewInit() {
    this.paginator.page.asObservable().subscribe((pageEvent) => {
      this.pageNumber = pageEvent.pageIndex + 1,
        this.pageSize = pageEvent.pageSize,
        this.GetknowledgeIntent()
    });
  }
  GetknowledgeIntent(){
    this._knowledgeTasksService.GetknowledgeIntent(this.projectId,this.pageNumber,20).subscribe((res:any)=>{
      this.Intents = res.Intents
      this.oldIntents = res.Intents
      this.dataSource = new MatTableDataSource(this.Intents);
      this.totalItems = res.meta.total
    })
  }
  set_id(_id, element){
    debugger
    if(element.dialog_nodes.length < 1){
      var dialog = new DialogNode()
      dialog.type = "standard"; dialog.disable = false; dialog.intentId = element.intentId; dialog.dialog_node = element.intentId ;
      this.Intents[this.Intents.findIndex(x=>x._id == _id)].dialog_nodes.push(dialog)
    }
    this._selected_id = _id
    this.selectedIntent = element
    this.addExampleValue = ""
  }
  getDataProperty(){
    this._ontologyTreeService.getDataPropertyIndex(this.projectId).subscribe((res:any)=>{
      this.DataProperties = res.nodes
    })
  }

  getPropertiesIndex(){
    this._ontologyEntitiesService.propertiesIndex('dataProp').subscribe((res:any)=>{
      this.nodesProperties = res.nodes
    })
  }

  getAllEntities(){
    this._testService.getِAllEntities(this.projectId).subscribe((res:any)=>{
      this.entities = res.entities
       this.qtools = res.qtools
    }
    )
  }
  consistencyCheck(){
    this._knowledgeTasksService.consistencyCheck(this.projectId,this.removeEntity,false).subscribe((res:any)=>{

    })
  }
  changeResponseMode(){
    debugger
    let body = {
      "intentId": this.selectedIntent.intentId,
      "responseMode": this.selectedIntent.responseMode,
      "workspace_id": this.projectId
  }
    this._knowledgeTasksService.changeResponseMode(body).subscribe((res:any)=>{
      if(res.status == 1)
        this.notify.openSuccessSnackBar("Document updated successfully")
    })
  }
  openLinkedFact(event, element){
    debugger
    let entityId = element.linkedFact.subjectId
    let predicateId = element.linkedFact.predicateId
    let entityText = this.entities.find(x=>x._id == +entityId)?.entityInfo[0].entityText
    event.stopPropagation()
        const dialogRef = this.dialog.open(LinkedToFactComponent, {
          data: {entityId,predicateId,entityText}},
        );
        dialogRef.afterClosed().subscribe((res:any) => {
          if(res){

          }
        })
  }
  createEntity(){
    let body = { intent:{
      "name": this.createEntityInput,
      "intentId": "NEW_TASK",
      "examples": [],
      "intent": "",
      "knowledge": true,
      "matchingMode": 0,
      "description": "",
      "responseMode": 1
        },
      workspace_id:this.projectId
    }
    this._knowledgeTasksService.createIntent(body).subscribe((res:any)=>{
      if(res.status == 1){
        this.notify.openSuccessSnackBar("New intent is created")
        this.GetknowledgeIntent()
      }
    })
  }
  saveTask(event, mode){
    debugger
    let body
    if(mode == '0'){
      body = {
        intent:this.selectedIntent,
        workspace_id:this.projectId
      }
    }
    else{
      this.selectedIntent.dialog_nodes[0] = event
      this.Intents[this.Intents.findIndex(x=>x._id == this._selected_id)].dialog_nodes[0] = event
      body = {
        intent:this.selectedIntent,
        workspace_id:this.projectId
      }
    }

    this._knowledgeTasksService.editIntent(body).subscribe((res:any)=>{
      if(res.success == 1){
        this.notify.openSuccessSnackBar("Document updated successfully")
      }
    })
  }
  deleteTask(element){
    let body = {
        id: this._selected_id,
        workspace_id: this.projectId
    }

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
          this._knowledgeTasksService.deleteTask(body).subscribe((res:any)=>{
            if(res.success == 1){
              this.notify.openSuccessSnackBar("Deleted Successfully")
              this.GetknowledgeIntent()
            }
          })
        }
      })
  }
  saveExample(example, exampleIndex){
    let oldExample = this.oldIntents[this.oldIntents.findIndex(x=>x._id == this._selected_id)].examples[exampleIndex].text
    let body = {
      example:example,
      intentId:this.selectedIntent.intentId,
      oldExample:oldExample,
      workspace_id:this.projectId
    }
    this._knowledgeTasksService.saveExample(body).subscribe((res:any)=>{
      if(res.status){
        this.notify.openSuccessSnackBar("Example saved successfully")
        this.oldIntents = this.Intents
      }
    })
  }
  deleteExample(example, exampleIndex){
    let body = {
      example:example,
      intentId:this.selectedIntent.intentId,
      workspace_id:this.projectId
    }

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
              this._knowledgeTasksService.deleteExample(body).subscribe((res:any)=>{
                if(res.status){
                  this.notify.openSuccessSnackBar("Example Deleted successfully")
                  this.Intents[this.Intents.findIndex(x=>x._id == this._selected_id)].examples.splice(exampleIndex,1)
                  this.oldIntents = this.Intents
                }
              })
            }
          })
  }

    openAddSyn(pattern){
     let entityId = pattern.entityId
     let entityText = pattern.entityText
      const dialogRef = this.dialog.open(CreateOntologyEntityComponent, {
        data: {entityId:entityId, projectId:this.projectId,mode:'Synonym' , Type:"token", entityTextKnowTask:entityText},},
      );
      dialogRef.afterClosed().subscribe((res:any) => {
       // if(res)

      })
    }
  extractEntities(example, exIndex){
    this._knowledgeTasksService.getExtractEntities(this.projectId, example.text).subscribe((res:any)=>{
      this.extractedEntities = res.Entities
      if(res.Entities.length > 0)
      {
        let pattern:any[] = []
        res.Entities.forEach(element => {
          pattern.push({
            entityId: element._id,
            entityText: element.entityText,
            entityType:element.entityType,
            parentId: element.parentId
          })
        });
        this.Intents[this.Intents.findIndex(x=>x._id == this._selected_id)].examples[exIndex].pattern = pattern
      }
    })
  }
  deletePattern(pattrenIndex, exampleIndex){
    this.Intents[this.Intents.findIndex(x=>x._id == this._selected_id)].examples[exampleIndex].pattern.splice(pattrenIndex,1)
  }

  createExample(){
    if(this.addExampleValue){
      let body = {example:{
        text: this.addExampleValue,
        modePattern: true
      },
      intentId: this.selectedIntent.intentId,
      workspace_id: this.projectId
      }
      this._knowledgeTasksService.createExample(body).subscribe((res:any)=>{
        if(res.status == 1) {
          this.notify.openSuccessSnackBar("Example added Successfully")
          let createdEx = {
            "exId": res.exId,
            "language": "ar",
            "text": this.addExampleValue,
            "pattern": null,
            "inconsistency": false,
            "type": null,
            "state": null,
            "comment": null,
            "answerState": false,
            "initialAnswerState": false,
            "difference": false,
            "flow": false,
            "testedBefore": false
        }
        this.Intents[this.Intents.findIndex(x=>x._id == this._selected_id)].examples.push(createdEx)
        }
      })
    }
  }
  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
