import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { OptionsServiceService } from 'src/app/Services/options-service.service';
import { ProjectOptionsModel } from 'src/app/core/models/options-model';

@Component({
  selector: 'vex-languages',
  templateUrl: './languages.component.html',
  styleUrls: ['./languages.component.scss']
})
export class LanguagesComponent implements OnInit {

  onDestroy$: Subject<void> = new Subject();
  langugeForm:FormGroup
  projectOptions:ProjectOptionsModel = null
  languages:string[] = []
  constructor(private fb:FormBuilder,
    private _optionsService:OptionsServiceService,) { }

  ngOnInit(): void {
    this._optionsService.projectOptions$.pipe(takeUntil(this.onDestroy$)).subscribe((res:ProjectOptionsModel)=>{
      if(res){
        this.projectOptions = res
        this.languages = this.projectOptions.languages
        if(this.languages.length < 2){
          this.initiateForm()
        }
      }
    })
  }

  initiateForm(){
    this.langugeForm = this.fb.group({
      lang: ['',Validators.required],
    })
  }
  public checkError = (controlName: string, errorName: string) => {
    return this.langugeForm.controls[controlName].hasError(errorName);
  }
  removeLanguage(){
    debugger
    this.languages.splice(1,1)
    this.projectOptions.languages = this.languages
     this._optionsService.projectOptions$.next(this.projectOptions)
     this._optionsService.languages$.next(this.languages)
  }
  addLanguage(){
    debugger
    let x =this.langugeForm.controls['lang'].value
    this.languages.push(this.langugeForm.controls['lang'].value)
    this.projectOptions.languages = this.languages
     this._optionsService.projectOptions$.next(this.projectOptions)
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
