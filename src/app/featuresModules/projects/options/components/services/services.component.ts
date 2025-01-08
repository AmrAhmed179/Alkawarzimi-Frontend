import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ProjectOptionsModel } from 'src/app/core/models/options-model';
import { OptionsServiceService } from 'src/app/Services/options-service.service';

@Component({
  selector: 'vex-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {
  onDestroy$: Subject<void> = new Subject();
  projectOptions:ProjectOptionsModel = null
  serviceForm:FormGroup
  serviceUrl:string = ''
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
    this.serviceForm = this.fb.group({
      serviceBaseUrl: [this.projectOptions.serviceBaseUrl],
    })
  }
  getFormValue(){
    this.projectOptions.serviceBaseUrl = this.serviceForm.controls['serviceBaseUrl'].value
    this._optionsService.projectOptions$.next(this.projectOptions)
  }
  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
