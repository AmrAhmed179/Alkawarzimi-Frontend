import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { OptionsServiceService } from 'src/app/Services/options-service.service';
import { ProjectOptionsModel } from 'src/app/core/models/options-model';

@Component({
  selector: 'vex-media-base-url',
  templateUrl: './media-base-url.component.html',
  styleUrls: ['./media-base-url.component.scss']
})
export class MediaBaseURLComponent implements OnInit {

  onDestroy$: Subject<void> = new Subject();
  projectOptions:ProjectOptionsModel = null
  MediaBaseForm:FormGroup
  MediaBaseUrl:string = ''
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
    this.MediaBaseForm = this.fb.group({
      mediaBaseUrl: [this.projectOptions.mediaBaseUrl],
      useResource: [this.projectOptions.useResource],
    })
  }
  getFormValue(){

    this.projectOptions.mediaBaseUrl = this.MediaBaseForm.controls['mediaBaseUrl'].value
    this.projectOptions.useResource = this.MediaBaseForm.controls['useResource'].value
    this._optionsService.projectOptions$.next(this.projectOptions)
  }
  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

}
