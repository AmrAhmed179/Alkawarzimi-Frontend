import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { OptionsServiceService } from 'src/app/Services/options-service.service';
import { ProjectOptionsModel } from 'src/app/core/models/options-model';

@Component({
  selector: 'vex-fact-categories',
  templateUrl: './fact-categories.component.html',
  styleUrls: ['./fact-categories.component.scss']
})
export class FactCategoriesComponent implements OnInit {

  onDestroy$: Subject<void> = new Subject();
  projectOptions:ProjectOptionsModel = null
  addFactForm:FormGroup
  factCategories:any[] = []
  constructor(private fb:FormBuilder,
    private _optionsService:OptionsServiceService,) { }

  ngOnInit(): void {
    this._optionsService.projectOptions$.pipe(takeUntil(this.onDestroy$)).subscribe((res:ProjectOptionsModel)=>{
      if(res){
        debugger
        this.projectOptions = res
        if(!res.factCategories){
          this.factCategories.push({name:'None--',id:0})
        }
        else{
          this.factCategories = res.factCategories
        }
      }
      this.initiateForm()
    })
  }

  initiateForm(){
    this.addFactForm = this.fb.group({
      name: ['',[Validators.required,Validators.pattern('[\u0600-\u06FF]*')]],
    })
  }
  public checkError = (controlName: string, errorName: string) => {
    return this.addFactForm.controls[controlName].hasError(errorName);
  }

  addFact(){
    debugger
    let maxId:number = 0
     this.factCategories.forEach(element => {
      if(element.id > maxId)
      maxId = element.id
    });
    this.factCategories.push({name:this.addFactForm.controls['name'].value,id:maxId+1})
    this.projectOptions.factCategories = this.factCategories
    this._optionsService.projectOptions$.next(this.projectOptions)
  }
  removeFact(id:number){
    let index = this.factCategories.map(x=>x.id).indexOf(id)
    this.factCategories.splice(index,1)
    this.projectOptions.factCategories = this.factCategories
    this._optionsService.projectOptions$.next(this.projectOptions)
  }
  ngOnDestroy() {
    console.log("general destroy!!!")
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

}
