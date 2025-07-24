import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { el } from 'date-fns/locale';
import { Subject, takeUntil } from 'rxjs';
import { DataService } from 'src/app/core/services/data.service';
import { NotifyService } from 'src/app/core/services/notify.service';
import { addedEntityAI, ClassAndIndivResponse, EntityAI, FrameAi } from 'src/app/Models/ai-entity-models/ai-entity';
import { EntityAiService } from 'src/app/Services/entity-ai.service';
import { OptionsServiceService } from 'src/app/Services/options-service.service';

@Component({
  selector: 'vex-extract-entities-by-ai',
  templateUrl: './extract-entities-by-ai.component.html',
  styleUrls: ['./extract-entities-by-ai.component.scss']
})
export class ExtractEntitiesByAiComponent implements OnInit {
  onDestroy$: Subject<void> = new Subject();
  lang:string
  addEnitiesFlage = false
  constructor(private _entityAiService:EntityAiService,
      private _optionsService:OptionsServiceService,
      private _dataService: DataService,
      private notify: NotifyService,
      public dialogRef: MatDialogRef<ExtractEntitiesByAiComponent>

  ) { }
  classesAndIndividual:ClassAndIndivResponse
  frames:FrameAi[]
  text
  projectId
  semantic
  mode:string = "entity"
  entityAI:EntityAI[] = []
  selectAll:boolean = false
  displayedColumns: string[] = ['select','entitytype', 'EntityText',  'addEntities'];
  displayedColumnsframes: string[] = ['select','entitytype', 'EntityText', 'frameType', 'addEntities'];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataSource:MatTableDataSource<EntityAI>
  ngOnInit(): void {
        this._optionsService.selectedLang$.pipe(takeUntil(this.onDestroy$)).subscribe((res)=>{
          debugger
          if(res){
            this.lang = res
          }
          this._dataService.$project_bs.pipe(takeUntil(this.onDestroy$)).subscribe((project:any)=>{
            if(project){
            this.projectId = project._id
            }
          })
        })
  }

  getClassesAndIndividual(){
    this.entityAI = []
    this.mode = "entity"

    this._entityAiService.getClassesAndIndividual(this.text).subscribe((res:any)=>{
      this.classesAndIndividual = res.response
      this.classesAndIndividual.Classes.forEach(element => {
        this.entityAI.push({entityText:element,entityType:"class", select:false })
      });

      this.classesAndIndividual.Individuals.forEach(element => {
        this.entityAI.push({entityText:element,entityType:"individual",  select:false })
      });
      this.dataSource = new MatTableDataSource<EntityAI>(this.entityAI);
      this.dataSource.paginator = this.paginator;
    })
  }

  getFrames(){
    this.entityAI = []
    this.mode = "frame"
    this._entityAiService.getFrames(this.text).subscribe((res:any)=>{

      this.frames = res.response.frames
      this.frames.forEach(element=>{
        this.entityAI.push({entityText:`${element.verbal_noun} ${element.subject} ${element.object} ${element.adverb}`,entityType:"action",  select:false,frameType:"xxd" ,frame:element })
      })
      console.log("entities",this.entityAI)
      this.dataSource = new MatTableDataSource<EntityAI>(this.entityAI);
      this.dataSource.paginator = this.paginator;

    })
  }
  selectAllChange(){
    this.entityAI.forEach((item) => {
      item.select = this.selectAll;
    });
  }

  addEntities(){
    debugger
    let entities = this.entityAI.filter(x=>x.select == true)
    var addedEntites:addedEntityAI[] = []
    entities.forEach(element => {
      let addedEntity = new addedEntityAI()
      addedEntity._id = 0
      addedEntity.parentId = 0
      addedEntity.languageIndex = 0
      addedEntity.entityType = element.entityType
      if(this.mode == "frame"){
        if(element.frameType == 'x'){
          addedEntity.entityInfo[0].entityText = element.frame.verbal_noun + ' ' + element.frame.subject
          addedEntity.entityInfo[0].stemmedEntity = element.frame.verbal_noun +' ' +  element.frame.subject
        }
        if(element.frameType == 'xx'){
          addedEntity.entityInfo[0].entityText = element.frame.verbal_noun +' ' +  element.frame.subject +' ' +  element.frame.object
          addedEntity.entityInfo[0].stemmedEntity = element.frame.verbal_noun +' ' +  element.frame.subject +' ' +  element.frame.object
        }
        if(element.frameType == 'xxd'){
          addedEntity.entityInfo[0].entityText = element.frame.verbal_noun + ' ' + element.frame.subject +' ' +  element.frame.object +' ' +  element.frame.adverb
          addedEntity.entityInfo[0].stemmedEntity = element.frame.verbal_noun + ' ' + element.frame.subject +' ' +  element.frame.object +' ' +  element.frame.adverb
        }
      }
      else{
        addedEntity.entityInfo[0].entityText = element.entityText
        addedEntity.entityInfo[0].stemmedEntity = element.entityText
      }
      addedEntity.entityInfo[0].language = this.lang
      addedEntites.push(addedEntity)
    });
    this._entityAiService.addEntitiesAi(addedEntites,this.projectId).subscribe((res:any)=>{
      if(res.status == 1){
        this.addEnitiesFlage = true
        this.notify.openSuccessSnackBar('Entities Added Successfully')
      }
    })
   console.log("AddedEnitiesAI",addedEntites )
  }
  closeDialog(){
    if(this.addEnitiesFlage == true){
      this.dialogRef.close('success')
    }
    else{
      this.dialogRef.close()
    }
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
