import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { IntentSettings } from 'src/app/Models/build-model/intent-model';
import { TasksService } from 'src/app/Services/Build/tasks.service';
import { OptionsServiceService } from 'src/app/Services/options-service.service';
import { NotifyService } from 'src/app/core/services/notify.service';
import { MainTAskCoditionComponent } from './main-task-codition/main-task-codition.component';

@Component({
  selector: 'vex-task-settings',
  templateUrl: './task-settings.component.html',
  styleUrls: ['./task-settings.component.scss']
})
export class TaskSettingsComponent implements OnInit {

  settingForm:FormGroup
  intentSettings:IntentSettings
  lang:string
  onDestroy$: Subject<void> = new Subject();

  constructor(private _tasksService: TasksService,
    private fb:FormBuilder,
    private notify:NotifyService,
    private _optionsService:OptionsServiceService,
    public dialog: MatDialog,
    ) { }

    @Input() workspace_id
    @Input() intentId

    ngOnInit(): void {
      this._optionsService.selectedLang$.pipe(takeUntil(this.onDestroy$)).subscribe((res)=>{
        if(res){
          this.lang = res
          this.getTaskSetting()
        }
      })
  }

  getTaskSetting(){
    this._tasksService.getTaskSetting(this.workspace_id,this.intentId).subscribe((res:any)=>{
      this.intentSettings = res.intent
      this.iniateForm()
    })
  }

  iniateForm(){
    debugger
    this.settingForm = this.fb.group({
       adFlow:[this.intentSettings.adFlow],
       category:[this.intentSettings.category],
       changeLanguage:[this.intentSettings.changeLanguage],
       description:[this.intentSettings.description],
       endConversation:[this.intentSettings.endConversation],
       hasTrigger:[this.intentSettings.hasTrigger],
        mainTask:[this.intentSettings.mainTask],
       name:[this.intentSettings.name],
       responseMode:[this.intentSettings.responseMode],
       serviceFlow:[this.intentSettings.serviceFlow],
       sideTalk:[this.intentSettings.sideTalk],
       statelessFlow:[this.intentSettings.statelessFlow],
      stopDigression:[this.intentSettings.stopDigression],
      changeLanguageTo:[this.intentSettings.changeLanguageTo]
    })
  }
  saveSettings(){
    this.intentSettings.adFlow = this.settingForm.controls['adFlow'].value
    this.intentSettings.category = this.settingForm.controls['category'].value
    this.intentSettings.changeLanguage = this.settingForm.controls['changeLanguage'].value
    this.intentSettings.description = this.settingForm.controls['description'].value
    this.intentSettings.endConversation = this.settingForm.controls['endConversation'].value
    this.intentSettings.hasTrigger = this.settingForm.controls['hasTrigger'].value
    this.intentSettings.mainTask = this.settingForm.controls['mainTask'].value
    this.intentSettings.name = this.settingForm.controls['name'].value
    this.intentSettings.responseMode = this.settingForm.controls['responseMode'].value
    this.intentSettings.serviceFlow = this.settingForm.controls['serviceFlow'].value
    this.intentSettings.sideTalk = this.settingForm.controls['sideTalk'].value
    this.intentSettings.statelessFlow = this.settingForm.controls['statelessFlow'].value
    this.intentSettings.stopDigression = this.settingForm.controls['stopDigression'].value

    this._tasksService.updateIntentInfo(this.intentSettings, this.workspace_id).subscribe((res:any)=>{
      if(res.status == 1){
        this.notify.openSuccessSnackBar("Task Info Updated")
      }
      else{
        this.notify.openFailureSnackBar("Task Info updated Faild")
      }
    })
  }

  mainTaskChange(){
     this.intentSettings.mainTask = this.settingForm.controls['mainTask'].value
    if(this.intentSettings.mainTask == true){
      debugger
      const dialogRef = this.dialog.open(MainTAskCoditionComponent,{data:{intentSettings:this.intentSettings}});
      dialogRef.afterClosed().subscribe(res=> {
        if(res){
          this.intentSettings.mainTaskCondations = {utteranceCount:res}
          this.createMainTask()
        }
      })
    }
    if(this.intentSettings.mainTask == false){
      this.deleteMainTask()
    }
  }

  editMainTask(){
    const dialogRef = this.dialog.open(MainTAskCoditionComponent,{data:{intentSettings:this.intentSettings}});
      dialogRef.afterClosed().subscribe(res=> {
        if(res){
          this.intentSettings.mainTaskCondations = {utteranceCount:res}
          this.createMainTask()
        }
      })
  }

  deleteMainTask(){
    this._tasksService.deleteMainTask(this.intentSettings, this.workspace_id).subscribe((res:any)=>{
    })
  }

  createMainTask(){
    this._tasksService.createMainTask(this.intentSettings, this.workspace_id).subscribe((res:any)=>{
    })
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
