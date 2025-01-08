import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { IntentSettings } from 'src/app/Models/build-model/intent-model';
import { TasksService } from 'src/app/Services/Build/tasks.service';
import { NotifyService } from 'src/app/core/services/notify.service';

@Component({
  selector: 'vex-main-task-codition',
  templateUrl: './main-task-codition.component.html',
  styleUrls: ['./main-task-codition.component.scss']
})
export class MainTAskCoditionComponent implements OnInit {
  form:FormGroup
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<any>,
    @Inject(DIALOG_DATA) public data: { intentSettings:IntentSettings},
    private notify: NotifyService,
    private _tasksService: TasksService
  ) { }

  ngOnInit(): void {
    debugger
    this.form = this.fb.group({
      'Id':[this.data.intentSettings.mainTaskCondations?.utteranceCount]
    })
  }
  createMainTask(){
    this.dialogRef.close(this.form.controls['Id'].value)
  }

}
