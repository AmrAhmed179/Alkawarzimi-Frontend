import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { TasksService } from 'src/app/Services/Build/tasks.service';
import { NotifyService } from 'src/app/core/services/notify.service';

@Component({
  selector: 'vex-import-task',
  templateUrl: './import-task.component.html',
  styleUrls: ['./import-task.component.scss']
})
export class ImportTaskComponent implements OnInit {

  importedTask:any[]
  form:FormGroup

  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<any>,
    @Inject(DIALOG_DATA) public data: { workSpace_id:any},
    private notify: NotifyService,
    private _tasksService: TasksService) { }


  ngOnInit(): void {
    this.getExportedTasks()
    this.form = this.fb.group({
      'taskId':['']
    })
  }
  getExportedTasks(){
    this._tasksService.getExportedTasks().subscribe((res:any)=>{
      debugger
      this.importedTask = res.exportedTasks
    })
  }
  addTask(){
    this._tasksService.importTask(this.form.controls['taskId'].value,this.data.workSpace_id).subscribe((res:any)=>{
    if(res.status =='1'){
      this.notify.openSuccessSnackBar("Task imported")
      this.dialogRef.close()
    }
  })
}
}
