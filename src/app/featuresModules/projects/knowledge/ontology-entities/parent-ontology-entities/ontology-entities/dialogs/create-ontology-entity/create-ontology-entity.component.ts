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
import { EntityModel } from 'src/app/Models/ontology-model/EntityCatogeryModel';

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
  tokens:any[] = []
  currentIndex:number
  getStems:boolean = false
  form:FormGroup
  lang:any
  onDestroy$: Subject<void> = new Subject();
  currentStemId:number
  token:any
  currentTokenIndex:number
  stemValue:string = ""
  constructor( private _ontologyEntitiesService:OntologyEntitiesService,
    private route: ActivatedRoute,
    private _dataService: DataService,
    private fb:FormBuilder,
    private notify: NotifyService,
    private _optionsService:OptionsServiceService,

    @Inject(DIALOG_DATA) public data: { entityId:any, projectId:any, mode:string, Type:string, entityTextKnowTask:string, entity:EntityModel, _id, translationFlag, lang},
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
    if(this.data.mode == "edit" && !this.data.translationFlag){
this.form = this.fb.group({
  entityText: [
    (this.data.entity.entityInfo.find(e => e.language === this.data.lang)
      ?? this.data.entity.entityInfo[0]
    ).entityText,
    Validators.required
  ],
  stemmedEntity: [
    (this.data.entity.entityInfo.find(e => e.language === this.data.lang)
      ?? this.data.entity.entityInfo[0]
    ).stemmedEntity,
    Validators.required
  ],
  Type: [this.data.Type],
});
      this.getStem()
    }
    if(this.data.mode == 'edit' && this.data.translationFlag){
      this.form = this.fb.group({
        'entityText':['',Validators.required],
        'stemmedEntity':['', Validators.required],
        'Type':[this.data.Type],
      })
    }
    if(this.data.mode == 'Entity'){
      this.form = this.fb.group({
        'entityText':['',Validators.required],
        'stemmedEntity':['', Validators.required],
        'Type':[this.data.Type],
      })
    }
     if(this.data.mode == 'Synonym'){
      this.form = this.fb.group({
        'entityText':['',Validators.required],
        'stemmedEntity':['', Validators.required],
        'Type':[this.data.Type],
      })
    }
  }

  getStem(){
    debugger
    this._ontologyEntitiesService.AnalyzeText(this.form.controls['entityText'].value,this.data.projectId).subscribe((res:any)=>{
       this.tokens = JSON.parse(res.tokens)?.tokens
           this.stemValue = ""

       for (let index = 0; index < this.tokens.length; index++) {
             this.stemValue +=  this.removeArabicFormation( this.tokens[index].analysis[0].stem + " ");
         }

       this.form.controls['stemmedEntity'].setValue(this.stemValue)
      this.getStems =true

      debugger
    })
  }
  getAnalysis(Token, index){
    debugger

   this.showAnalysis =true
   this.showSenses = false
   this.token = Token
   this.currentTokenIndex = index
   //this.currentIndex = 0
  }
  getSense(anlys, index){
    this.tokens[this.currentTokenIndex].anlysIndex =  index
    var stemList = this.stemValue.split(' ')
    stemList[this.currentTokenIndex] = this.token.analysis[index].stem
    this.stemValue = ""
    for (let i = 0; i < stemList.length; i++) {
      this.stemValue +=  this.removeArabicFormation( stemList[i] + " ");
  }
  this.form.controls['stemmedEntity'].setValue(this.stemValue)

    this.currentIndex = index
    this.currentStemId = anlys.stemPos
   // this.form.controls['stemmedEntity'].setValue(anlys.stem)
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
   let stemmedEntity = this.form.controls['stemmedEntity'].value.trim()
   let  Type = this.form.controls['Type'].value
   let actionStemId =this.tokens[0].analysis[this.tokens[0]?.anlysIndex]?.stemPos
   if(Type == 'action' && (actionStemId != 1 && actionStemId != 6 ))
      {
        this.notify.openFailureSnackBar("First word must be Masder")
        return
      }

    this._ontologyEntitiesService.creatOntoloyEntity(this.data.projectId,stemmedEntity,entityText, this.lang, Type,this.data.entityId, this.data.entityTextKnowTask,this.data._id).subscribe((res:any)=>{
      if(res.status == 1){
        this.notify.openSuccessSnackBar(`New Entity has been Added ${res?.Message}`)
        this.dialogRef.close('success')
      }
      else{
        this.notify.openFailureSnackBar("Entity Add Faild")
      }
    })
  }
EditOntoloyEntity() {
  debugger;
  const entityText = this.form.controls['entityText'].value;
  const stemmedEntity = this.form.controls['stemmedEntity'].value;
  const Type = this.form.controls['Type'].value;
  const actionStemId = this.tokens[0].analysis[this.tokens[0]?.anlysIndex]?.stemPos;

  if (Type == 'action' && actionStemId != 1) {
    this.notify.openFailureSnackBar("First word must be Masder");
    return;
  }

  // Copy existing entityInfo array
  const updatedEntityInfo = [...this.data.entity.entityInfo];

  // Find the one with the current lang
  const index = updatedEntityInfo.findIndex(e => e.language === this.data.lang);

  if (index >= 0) {
    // Update existing entry, keep tokens/isReviewed/autoTranslation if present
    updatedEntityInfo[index] = {
      ...updatedEntityInfo[index],
      entityText,
      stemmedEntity,
      language: this.data.lang,
      tokens: updatedEntityInfo[index].tokens ?? [],
      isReviewed: updatedEntityInfo[index].isReviewed ?? false,
      autoTranslation: updatedEntityInfo[index].autoTranslation ?? false
    };
  } else {
    // Add a new entry with defaults
    updatedEntityInfo.push({
      entityText,
      stemmedEntity,
      language: this.data.lang,
      tokens: [],
      isReviewed: false,
      autoTranslation: false
    });
  }

  this._ontologyEntitiesService
    .EditOntoloyEntity(
      this.data.projectId,
      updatedEntityInfo,
      this.data.Type,
      this.data.entityId,
      this.data.entityTextKnowTask,
      this.data._id
    )
    .subscribe((res: any) => {
      if (res.status == 1) {
        this.notify.openSuccessSnackBar("Entity updated successfully");
        this.dialogRef.close('success');
      } else {
        this.notify.openFailureSnackBar("Entity update failed");
      }
    });
}

  changeSenceAppearance(){
    this.showAnalysis = true
    this.showSenses = false
  }
  removeArabicFormation(text: string): string {
    // Regex to match Arabic diacritical marks
    const formationRegex = /[\u064B-\u065F]/g;
    return text.replace(formationRegex, '');
 }
  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
