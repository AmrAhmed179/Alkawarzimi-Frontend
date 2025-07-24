import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { OptionsServiceService } from 'src/app/Services/options-service.service';
import { ProjectOptionsModel, ResponseFooter } from 'src/app/core/models/options-model';

@Component({
  selector: 'vex-response-footer',
  templateUrl: './response-footer.component.html',
  styleUrls: ['./response-footer.component.scss']
})
export class ResponseFooterComponent implements OnInit {

  lang:string
  onDestroy$: Subject<void> = new Subject();
  projectOptions:ProjectOptionsModel = null
  responseFooterForm:FormGroup
  responseFooterObjAr:ResponseFooter = new ResponseFooter()
  responseFooterObjEn:ResponseFooter =  new ResponseFooter()

  constructor(private fb:FormBuilder,
    private _optionsService:OptionsServiceService,) { }

  ngOnInit(): void {
        this._optionsService.selectedLang$.pipe(takeUntil(this.onDestroy$)).subscribe((response) => {
          if (response) {
            this.lang = response;
                this._optionsService.projectOptions$.pipe(takeUntil(this.onDestroy$)).subscribe((res:ProjectOptionsModel)=>{
      if(res){
        this.projectOptions = res
          this.initiateForm()
      }
    })
          }
        });

  }

  initiateForm(){
    this.responseFooterForm = this.fb.group({
      hasFooter: [this.projectOptions.hasFooter],
    })

    if(this.lang == 'ar' && this.projectOptions.hasFooter == true ){
        if( this.projectOptions.responseFooter.length < 1){
            this.projectOptions.responseFooter.push({footer:null,lang:"ar"})
        }
        this.projectOptions.responseFooter .forEach((el:ResponseFooter)=>{
          if(el.lang == 'ar')
            this.responseFooterObjAr = el
        })
    }
        if(this.lang == 'en' && this.projectOptions.hasFooter == true ){
        if( this.projectOptions.responseFooter.length < 1){
            this.projectOptions.responseFooter.push({footer:null,lang:"ar"},{footer:null,lang:"en"})
        }
        this.projectOptions.responseFooter .forEach((el:ResponseFooter)=>{
          if(el.lang == 'en')
            this.responseFooterObjEn = el
        })
    }

  }
  getFormValue(){
    debugger
    this.projectOptions.hasFooter = this.responseFooterForm.controls['hasFooter'].value
    if(this.lang == 'ar' && this.projectOptions.hasFooter == true){
      this.projectOptions.responseFooter[0] = this.responseFooterObjAr
    }
     if(this.lang == 'en' && this.projectOptions.hasFooter == true){
      this.projectOptions.responseFooter[1] = this.responseFooterObjEn
    }
    this._optionsService.projectOptions$.next(this.projectOptions)
  }
  ngOnDestroy() {
    console.log("general destroy!!!")
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

}
