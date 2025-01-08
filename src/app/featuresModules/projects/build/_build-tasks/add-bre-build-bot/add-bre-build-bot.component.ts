import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { TasksService } from 'src/app/Services/Build/tasks.service';
import { NotifyService } from 'src/app/core/services/notify.service';

@Component({
  selector: 'vex-add-bre-build-bot',
  templateUrl: './add-bre-build-bot.component.html',
  styleUrls: ['./add-bre-build-bot.component.scss']
})
export class AddBreBuildBotComponent implements OnInit {

  form:FormGroup
  allTypes:any[]

  botTypes:any[] =[]
  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<any>,
    @Inject(DIALOG_DATA) public data: { workSpace_id:any,types:string[]},
    private notify: NotifyService,
    private _tasksService: TasksService,
    ) { }

  ngOnInit(): void {
    this.getPreBuiltBots()
    this.form = this.fb.group({
      'type':['']
    })
  }

  getPreBuiltBots(){
    this._tasksService.getPreBuiltBots(this.data.workSpace_id).subscribe((res:any)=>{
      debugger
      this.allTypes = res
      this.allTypes.forEach(element => {
        if(!this.data.types.includes(element.name)){
          this.botTypes.push(element)
        }
      });
    })
  }

  addPreBuildBot(){
    this._tasksService.setPreBuiltBot(this.form.controls['type'].value,this.data.workSpace_id).subscribe((res:any)=>{
      if(res.status =='1'){
        this.dialogRef.close()
      }
    })
  }
}
