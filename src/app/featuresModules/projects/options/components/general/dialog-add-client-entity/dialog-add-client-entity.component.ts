import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Subject, Observable, takeUntil, startWith, map } from 'rxjs';
import { OptionsServiceService } from 'src/app/Services/options-service.service';
import { ProjectOptionsModel } from 'src/app/core/models/options-model';

@Component({
  selector: 'vex-dialog-add-client-entity',
  templateUrl: './dialog-add-client-entity.component.html',
  styleUrls: ['./dialog-add-client-entity.component.scss']
})
export class DialogAddClientEntityComponent implements OnInit {

  entityTypeForm:FormGroup

  onDestroy$: Subject<void> = new Subject();
  projectOptions:ProjectOptionsModel = null
  selectedLang:string
  radioButtonValue:string = 'all'
  entityAll:any[] = []
  entityClasses:any[] = []
  entityRestrictedClasses:any[] = []
  entityIndividuals:any[] = []
  entityAdjective:any[] = []
  entityAdverbs:any[] = []
  constructor(private fb:FormBuilder,private _optionsService:OptionsServiceService,
    @Inject(DIALOG_DATA) public data: {type:string,lang:string}, public dialogRef: MatDialogRef<DialogAddClientEntityComponent>
    ) { }

    myControl = new FormControl('');
    filteredOptions: Observable<any[]>;
    allEntityData:any
    ngOnInit() {
      this._optionsService.projectOptions$
    .pipe(takeUntil(this.onDestroy$))
    .subscribe((res:ProjectOptionsModel)=>{
      if(res){
        this.projectOptions = res
        this._optionsService.getEntityClassAndProp(this.projectOptions._id).subscribe((res:any)=>{

          if(res){
            console.log("general component inside getEntityClassAndProp subscribe")
            this.allEntityData = res.entities
            this.intiateForm()
            this.entityClasses = this.getEntitiesBasedOnFilter('class')
            this.entityRestrictedClasses = this.getEntitiesBasedOnFilter('restrictedClass')
            this.entityIndividuals = this.getEntitiesBasedOnFilter('individual')
            this.entityAdjective = this.getEntitiesBasedOnFilter('adjective')
            this.entityAdverbs = this.getEntitiesBasedOnFilter('adverb')
            let x:any[] = []
            this.entityAll =  x.concat(this.entityClasses,this.entityRestrictedClasses,this.entityIndividuals,this.entityAdjective,this.entityAdverbs)
            debugger
            this.filteredOptions = this.myControl.valueChanges.pipe(
              startWith(''),
              map(value => this._filter(value || '')),
            );
          }})
      }})

    }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    if(this.radioButtonValue ==='all' && this.data.lang ==='ar'){
      return this.entityAll.filter(option => option.entityInfo[0].entityText.toLowerCase().includes(filterValue));
    }
    if(this.radioButtonValue ==='class' && this.data.lang ==='ar'){
      return this.entityClasses.filter(option => option.entityInfo[0].entityText.toLowerCase().includes(filterValue));
    }
    if(this.radioButtonValue ==='restrictedClasses' && this.data.lang ==='ar'){
      return this.entityRestrictedClasses.filter(option => option.entityInfo[0].entityText.toLowerCase().includes(filterValue));
    }
    if(this.radioButtonValue ==='individuals' && this.data.lang ==='ar'){
      return this.entityIndividuals.filter(option => option.entityInfo[0].entityText.toLowerCase().includes(filterValue));
    }
    if(this.radioButtonValue ==='adjective' && this.data.lang ==='ar'){
      return this.entityAdjective.filter(option => option.entityInfo[0].entityText.toLowerCase().includes(filterValue));
    }
    if(this.radioButtonValue ==='adverbs' && this.data.lang ==='ar'){
      return this.entityAdverbs.filter(option => option.entityInfo[0].entityText.toLowerCase().includes(filterValue));
    }
    /////////////////////////////////////////////////////////////////////////////
    if(this.radioButtonValue ==='all' && this.data.lang ==='en'){
      return this.entityAll.filter(option => option.entityInfo[1]?.entityText.toLowerCase().includes(filterValue));
    }
    if(this.radioButtonValue ==='class' && this.data.lang ==='en'){
      return this.entityClasses.filter(option => option.entityInfo[1]?.entityText.toLowerCase().includes(filterValue));
    }
    if(this.radioButtonValue ==='restrictedClasses' && this.data.lang ==='en'){
      return this.entityRestrictedClasses.filter(option => option.entityInfo[1]?.entityText.toLowerCase().includes(filterValue));
    }
    if(this.radioButtonValue ==='individuals' && this.data.lang ==='en'){
      return this.entityIndividuals.filter(option => option.entityInfo[1]?.entityText.toLowerCase().includes(filterValue));
    }
    if(this.radioButtonValue ==='adjective' && this.data.lang ==='en'){
      return this.entityAdjective.filter(option => option.entityInfo[1]?.entityText.toLowerCase().includes(filterValue));
    }
    if(this.radioButtonValue ==='adverbs' && this.data.lang ==='en'){
      return this.entityAdverbs.filter(option => option.entityInfo[1]?.entityText.toLowerCase().includes(filterValue));
    }
  }

  intiateForm(){
    this.entityTypeForm = this.fb.group({
      entityType:['all'],
    })
  }
  getvalue(){
    debugger
    let entitiy:any = {}
    console.log(this.myControl.value)
    if(this.data.lang === 'ar'){
      entitiy = this.allEntityData.find(x=>x.entityInfo[0].entityText ===this.myControl.value)
    }
    if(this.data.lang === 'en'){
      entitiy = this.allEntityData.find(x=>x.entityInfo[1].entityText ===this.myControl.value)
    }

    if(entitiy){
      this.projectOptions.clientEntityId = entitiy._id
      this._optionsService.projectOptions$.next(this.projectOptions)
      this.dialogRef.close()
    }
  }
  getEntitiesBasedOnFilter(entityType:string){
    return this.allEntityData.filter(x=>x.entityType == entityType)
  }
  getEntityTypeFromRadioButton(){
    debugger
    this.radioButtonValue = this.entityTypeForm.controls['entityType'].value
  }

  ngOnDestroy() {
    console.log("general destroy!!!")
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

}
