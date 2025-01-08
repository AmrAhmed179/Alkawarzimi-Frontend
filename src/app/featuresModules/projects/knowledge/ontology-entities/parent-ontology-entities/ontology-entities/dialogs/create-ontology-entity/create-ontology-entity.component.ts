import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { OntologyEntitiesService } from 'src/app/Services/Knowlege/ontology-entities.service';
import { DataService } from 'src/app/core/services/data.service';
import { NotifyService } from 'src/app/core/services/notify.service';
import { DeconstructClassComponent } from '../deconstruct-class/deconstruct-class.component';
import { OptionsServiceService } from 'src/app/Services/options-service.service';
import { Subject, takeUntil } from 'rxjs';

export class ArPostList{
  _id:number
  name:string
}
@Component({
  selector: 'vex-create-ontology-entity',
  templateUrl: './create-ontology-entity.component.html',
  styleUrls: ['./create-ontology-entity.component.scss']
})


export class CreateOntologyEntityComponent implements OnInit {
  senses:any = []
  showAnalysis:boolean = false
  showSenses:boolean = false
  arPostList:ArPostList[]
  tokens:any
  currentIndex:number
  getStems:boolean = false
  form:FormGroup
  lang:any
  onDestroy$: Subject<void> = new Subject();
  currentStemId:number
  token:any
  constructor( private _ontologyEntitiesService:OntologyEntitiesService,
    private route: ActivatedRoute,
    private _dataService: DataService,
    private fb:FormBuilder,
    private notify: NotifyService,
    private _optionsService:OptionsServiceService,

    @Inject(DIALOG_DATA) public data: { entityId:any, projectId:any, mode:string, Type:string, entityTextKnowTask:string},
   public dialogRef: MatDialogRef<CreateOntologyEntityComponent>) { }

   ngOnInit(): void {
    this._optionsService.selectedLang$.pipe(takeUntil(this.onDestroy$)).subscribe((res)=>{
      if(res){
        this.lang = res
        this.getPOSList()
        this.intiateForm()
      }
    })

  }
  intiateForm(){
    this.form = this.fb.group({
      'entityText':['',Validators.required],
      'stemmedEntity':['', Validators.required],
      'Type':[this.data.Type],
    })
  }

  getStem(){
    this._ontologyEntitiesService.AnalyzeText(this.form.controls['entityText'].value,this.data.projectId).subscribe((res:any)=>{
       this.tokens = JSON.parse(res.tokens)?.tokens
      this.getStems =true

      debugger
    })
  }
  getAnalysis(Token){
   this.showAnalysis =true
   this.showSenses = false
   this.token = Token
  }
  getSense(anlys, index){
  debugger
    this.currentIndex = index
    this.form.controls['stemmedEntity'].setValue(anlys.stem)
  }
  getPOSList(){
    this._ontologyEntitiesService.getPOSList(this.lang).subscribe((res:any)=>{
      if(res.status == 1)
       this.arPostList = res.posList
    })
  }

  getArPost(stemPos:number){
    return this.arPostList.find(x=>x._id == stemPos)?.name
  }

  getSenses(stemId:number){
    this._ontologyEntitiesService.getSense(stemId).subscribe((res:any)=>{
      if(res.status == 1){
        this.senses = res.senses
        this.showAnalysis = false
        this.showSenses = true
      }
    })
  }

  creatOntoloyEntity(){
    debugger
   let entityText = this.form.controls['entityText'].value
   let stemmedEntity = this.form.controls['stemmedEntity'].value
   let  Type = this.form.controls['Type'].value
   if(Type == 'action' &&  this.currentStemId != 1)
      {
        this.notify.openFailureSnackBar("First word must be Masder")
        return
      }
    this._ontologyEntitiesService.creatOntoloyEntity(this.data.projectId,stemmedEntity,entityText, this.lang, this.data.Type,this.data.entityId, this.data.entityTextKnowTask).subscribe((res:any)=>{
      if(res.status == 1){
        this.notify.openSuccessSnackBar("New Entity has been Added")
        this.dialogRef.close('success')
      }
      else{
        this.notify.openFailureSnackBar("Entity Add Faild")
      }
    })
  }
  changeSenceAppearance(){
    this.showAnalysis = true
    this.showSenses = false
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
