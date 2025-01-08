import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { OptionsServiceService } from 'src/app/Services/options-service.service';
import { ProjectOptionsModel } from 'src/app/core/models/options-model';

@Component({
  selector: 'vex-live-chat-escalation',
  templateUrl: './live-chat-escalation.component.html',
  styleUrls: ['./live-chat-escalation.component.scss']
})
export class LiveChatEscalationComponent implements OnInit {

  onDestroy$: Subject<void> = new Subject();
  projectOptions:ProjectOptionsModel = null
  liveChatEscalForm:FormGroup

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
    this.liveChatEscalForm = this.fb.group({
      errorCount: [this.projectOptions.errorCount],
      unSupportedLang: [this.projectOptions.unSupportedLang],
      utteranceMedia: [this.projectOptions.utteranceMedia],
    })
  }
  getFormValue(){
    debugger
    this.projectOptions.errorCount = this.liveChatEscalForm.controls['errorCount'].value
    this.projectOptions.unSupportedLang = this.liveChatEscalForm.controls['unSupportedLang'].value
    this.projectOptions.utteranceMedia = this.liveChatEscalForm.controls['utteranceMedia'].value
    this._optionsService.projectOptions$.next(this.projectOptions)
  }
  ngOnDestroy() {
    console.log("general destroy!!!")
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }


}
