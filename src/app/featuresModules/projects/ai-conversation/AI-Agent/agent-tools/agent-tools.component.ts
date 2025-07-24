import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { DataService } from 'src/app/core/services/data.service';
import { NotifyService } from 'src/app/core/services/notify.service';
import { Agents, AIToolInfo } from 'src/app/Models/Ai-Agent/toolInfo';
import { AiConversationService } from 'src/app/Services/ai-conversation.service';
import { ObjectId } from 'bson';

@Component({
  selector: 'vex-agent-tools',
  templateUrl: './agent-tools.component.html',
  styleUrls: ['./agent-tools.component.scss']
})
export class AgentToolsComponent implements OnInit {
   form:FormGroup
   onDestroy$: Subject<void> = new Subject();
   projectId
   selectedIndex:number
   conversationsList:string[] = []
   selectedSession
   aIToolsInfo:AIToolInfo[]
   SelectedAiTool:AIToolInfo
   agents:Agents[] = []
   selectedAgentId:string = 'all'
       isExpand:boolean = false

   constructor(private _aiConversationService:AiConversationService, private _dataService: DataService,
    private fb: FormBuilder,
        private notify: NotifyService,

   ) { }

   ngOnInit(): void {
         this._dataService.$project_bs.pipe(takeUntil(this.onDestroy$)).subscribe((project) => {
           if (project) {
             this.projectId = project._id;}
             this.GetAgents()
              this.GetTools()
           }
           )
   }

   intiateForm(){
      debugger

      let x;
      try {
              x = JSON.parse(this.SelectedAiTool.functionParameters)

      } catch (error) {
        this.SelectedAiTool.functionParameters = null
        this.aIToolsInfo[this.selectedIndex].functionParameters = null
      }
    this.form = this.fb.group({
      _id: [this.SelectedAiTool._id?this.SelectedAiTool._id :new ObjectId().toHexString()],
      agentId : [this.SelectedAiTool?.agentId],
      agentName: [this.SelectedAiTool?.agentName],
      historyMode: [this.SelectedAiTool?.historyMode],
      callGPT: [this.SelectedAiTool.callGPT],
      isActive: [this.SelectedAiTool.isActive],
      message: [this.SelectedAiTool.message],
      taskCompleted: [this.SelectedAiTool.taskCompleted],
      functionName: [this.SelectedAiTool.functionName,[Validators.required,Validators.minLength(6)]],
      functionDescription: [this.SelectedAiTool.functionDescription],
      functionSchemaIsStrict: [this.SelectedAiTool.functionSchemaIsStrict],
      functionParameters: [this.SelectedAiTool.functionParameters],
    });
    console.log("formvalueee",this.form.value)
    this.form.valueChanges.pipe(takeUntil(this.onDestroy$)).subscribe((formValue) => {
    if (this.selectedIndex != null && this.aIToolsInfo[this.selectedIndex]) {
      this.aIToolsInfo[this.selectedIndex] = {
        ...this.aIToolsInfo[this.selectedIndex],
        ...formValue,
      };
      this.SelectedAiTool = this.aIToolsInfo[this.selectedIndex]
    }
  });
   }
   GetTools(){
     this._aiConversationService.GetTools(this.selectedAgentId).subscribe((res:any)=>{
       this.aIToolsInfo = res
     })
   }
   setIsCompleted(tool:AIToolInfo){
    this._aiConversationService.EditTools(tool).subscribe((res:any)=>{
      this.form?.patchValue({
      taskCompleted: tool.taskCompleted
    });
    this.notify.openSuccessSnackBar("taskCompleted Updated")
     })
   }
  selectedTool(index){
    this.SelectedAiTool = this.aIToolsInfo[index]
    this.selectedIndex = index
    this.intiateForm();
  }

  onSubmit(){
    try {
      debugger

       const value =  this.form?.value as AIToolInfo
       if(value?.functionParameters != null && value?.functionParameters.trim() != ""){
         const jsonParameters = JSON.parse(value?.functionParameters)
       }
       if(value?.functionParameters != null){
       if(value?.functionParameters.trim() == ""){
        this.form?.patchValue({
        functionParameters: null
        });
       }}
        var agentName = this.agents.find(x=>x._id == value?.agentId )
         this.form?.patchValue({
        agentName: agentName?.name
        });
        this._aiConversationService.EditTools(this.form.value).subscribe((res:any)=>{
        this.aIToolsInfo[this.selectedIndex] = this.form.value
       this.notify.openSuccessSnackBar("Tool Updated")
     })
    }
     catch (error) {
      this.notify.openFailureSnackBar("Json is invalid")

    }
  }

  addTool(){
    debugger
    this.aIToolsInfo.push(new AIToolInfo())
    this.selectedTool(this.aIToolsInfo.length -1)
  }
  GetAgents(){
    this._aiConversationService.GetAgents(this.projectId).subscribe((res:any)=>{
        this.agents = res
    })
  }
  selectAgent(){
    this.GetTools()
  }
}
