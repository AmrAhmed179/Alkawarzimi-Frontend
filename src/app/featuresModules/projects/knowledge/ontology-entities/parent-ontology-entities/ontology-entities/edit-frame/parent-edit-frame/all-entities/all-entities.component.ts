import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { EntityModel } from 'src/app/Models/ontology-model/EntityCatogeryModel';
import { NodeModel } from 'src/app/Models/ontology-model/node';
import { PrepListModel } from 'src/app/Models/ontology-model/prep-list';
import { VerbModel, ObjectEntitiesValue, FrameFeat, ObjType, SbjType, CmpType, CmpModyfier, ObjModyfier ,Frame} from 'src/app/Models/ontology-model/verb';
import { OntologyEntitiesService } from 'src/app/Services/Knowlege/ontology-entities.service';
import { OptionsServiceService } from 'src/app/Services/options-service.service';
import { DataService } from 'src/app/core/services/data.service';
import { NotifyService } from 'src/app/core/services/notify.service';
import { MagicWordWriteComponent } from 'src/app/shared/components/magic-word-write/magic-word-write.component';

@Component({
  selector: 'vex-all-entities',
  templateUrl: './all-entities.component.html',
  styleUrls: ['./all-entities.component.scss']
})
export class AllEntitiesComponent implements OnInit {
  lang:string
  onDestroy$: Subject<void> = new Subject();
  projectId:string
  entityId:string
  Verb:string
  verbs:VerbModel[]
  frameIndex:number
  currentSenceIndex:number =0
  sense:VerbModel
  entities:EntityModel[]
  entity:EntityModel
  returnPage:string = ''

  constructor(private route: ActivatedRoute,
    private _ontologyEntitiesService:OntologyEntitiesService,
    private _dataService: DataService,
    private fb:FormBuilder,
    private notify: NotifyService,
    public dialog: MatDialog,
    private router: Router,
    private _optionsService:OptionsServiceService,

  ) { }

  ngOnInit(): void {
    this._optionsService.selectedLang$.pipe(takeUntil(this.onDestroy$)).subscribe((res)=>{
      if(res){
        this.lang = res
        this._dataService.$project_bs.pipe(takeUntil(this.onDestroy$)).subscribe((project:any)=>{
          if(project){
          this.projectId = project._id
          debugger
          this.route.parent.paramMap.subscribe(params => {
            this.entityId = params.get('entityId');
            this.Verb = params.get('Verb');
            this.returnPage = params.get('returnPage');
            this.getFrame()
            this.getEntities()
          });
      }}
      )
      }
    })
  }

  getFrame(){
    this._ontologyEntitiesService.getFrame(this.projectId, this.Verb).subscribe((res:any)=>{
      if(res.status == 1){
          this.verbs = res.verbs

          this.sense = this.verbs[0]
          this.frameIndex = this.sense.frames.findIndex(x=>x.entityId == this.entityId)
      }
    })
  }
  getEntities(){
    this._ontologyEntitiesService.getEntities(this.projectId, 'action', 1).subscribe((res:any)=>{
      debugger
      this.entities = res.entities
      this.entity = this.entities.find(x=>x._id == +this.entityId)
      console.log(this.entity)
    })
  }
  getEntityInfo(entityId:string){
    debugger
    let entity = this.entities.find(x=>x._id == +entityId)
    return entity.entityInfo[0].entityText+" " +`(${entity.entityInfo[0].language})`
  }
  SelectCurrentSenceIndex(i){
    this.currentSenceIndex = i
    this.sense = this.verbs[i]
    console.log(this.verbs)
  }

  goToSelectedEntity(sen:Frame){
    this.router.navigate([`/projects/${this.projectId}/EditFrame/${sen.verb}/${sen.entityId}/SelectedFrame`])
  }

  deleteFrame(sen:Frame){
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
        this._ontologyEntitiesService.DeleteFrame(sen.entityId,this.projectId).subscribe((res:any)=>{
          if(res.status == '1'){
            this.notify.openSuccessSnackBar("Frame Deleted Successfuly ")
            this.getFrame()
          }
          else{
            this.notify.openFailureSnackBar("Error")
          }
        })
      }
    })
  }
  close(){
    if(this.returnPage == '1'){
     this.router.navigate([`/projects/${this.projectId}/knowledge/ontologyEntities/Frames`])
    }
    else{
      this.router.navigate([`/projects/${this.projectId}/ontologyTree/ontologyTreeView`])
    }
  }
  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
