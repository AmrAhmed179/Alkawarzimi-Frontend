import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TasksService } from 'src/app/Services/Build/tasks.service';

@Component({
  selector: 'vex-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.scss']
})
export class CreateTaskComponent implements OnInit {

  form:FormGroup
  chatBotId: number

  @Input() intentId
  @Input() workspace_id
  @Input() mainTaskId
  @Input() createParentId
  @Output() resetCreateTaskFlag = new EventEmitter<boolean>();
  constructor(
    private fb:FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private _tasksService: TasksService,


    ){}

  ngOnInit(): void {
    this.route.parent.params.subscribe((parmas: Params) => {
      this.chatBotId = parmas["projectid"];
      this.initiateForm()
    })
  }

  addNewItem(value: boolean) {
    this.resetCreateTaskFlag.emit(value);
  }

  initiateForm(){
    if(this.intentId){
      this.form = this.fb.group({
        name:['',[Validators.required,Validators.minLength(4)]],
        responseMode:['1'], //1,2 string
        description:[''],
        intentId:this.intentId,
        withinFlow:[false]
       })
    }
    else{
      this.form = this.fb.group({
        name:['',[Validators.required,Validators.minLength(4)]],
        responseMode:['1'], //1,2 string
        description:[''],
        intentId:['NEW_TASK'],
        withinFlow:[false]
       })
    }

  }

  createTask(){
    let  intent
    if(this.intentId){
      intent =  {
        intentId:this.form.controls['intentId'].value,
        name:this.form.controls['name'].value,
        responseMode:this.form.controls['responseMode'].value,
        description:this.form.controls['description'].value,
        intent:'',
        examples:[],
        matchingMode:0,
        taskContext: {
          context: true,
          withinFlow:this.form.controls['withinFlow'].value,
          mainTaskId: this.mainTaskId,
          parentId: this.createParentId
        }
      }
    }
    else{
        intent =  {
        intentId:this.form.controls['intentId'].value,
        name:this.form.controls['name'].value,
        responseMode:this.form.controls['responseMode'].value,
        description:this.form.controls['description'].value,
        intent:'',
        examples:[],
        matchingMode:0,
        withinFlow:this.form.controls['withinFlow'].value
      }
    }

    // if(this.form.controls['withinFlow'].value == true){
    //   intent.withinFlow = true
    // }
    this._tasksService.createTask(intent,this.chatBotId).subscribe((res:any)=>{
      debugger
      if(res.status == 1){
        if(this.intentId){
          this.resetCreateTaskFlag.emit(false);
          this.router.navigate([`/projects/${this.chatBotId}/editTask/${res.intent.intentId}/${res.intent.eventTask}/1`]);
        }
        else{
          this.router.navigate([`/projects/${this.chatBotId}/editTask/${res.intent.intentId}/${res.intent.eventTask}/1`]);
        }
      }
    })
  }

  cancel(){
    this.router.navigate([`/projects/${this.chatBotId}/home`]);
  }
}
