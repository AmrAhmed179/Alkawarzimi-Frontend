import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { OptionsServiceService } from 'src/app/Services/options-service.service';
import { ProjectOptionsModel } from 'src/app/core/models/options-model';

@Component({
  selector: 'vex-response-footer',
  templateUrl: './response-footer.component.html',
  styleUrls: ['./response-footer.component.scss']
})
export class ResponseFooterComponent implements OnInit {

  onDestroy$: Subject<void> = new Subject();
  projectOptions:ProjectOptionsModel = null
  responseFooterForm:FormGroup

  constructor(private fb:FormBuilder,
    private _optionsService:OptionsServiceService,) { }

  ngOnInit(): void {
    this._optionsService.projectOptions$.pipe(takeUntil(this.onDestroy$)).subscribe((res:ProjectOptionsModel)=>{
      if(res){
        this.projectOptions = res
          this.initiateForm()
      }
    })
  }

  initiateForm(){
    this.responseFooterForm = this.fb.group({
      hasFooter: [this.projectOptions.hasFooter],
    })
  }
  getFormValue(){
    debugger
    this.projectOptions.hasFooter = this.responseFooterForm.controls['hasFooter'].value
    this._optionsService.projectOptions$.next(this.projectOptions)
  }
  ngOnDestroy() {
    console.log("general destroy!!!")
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

}
