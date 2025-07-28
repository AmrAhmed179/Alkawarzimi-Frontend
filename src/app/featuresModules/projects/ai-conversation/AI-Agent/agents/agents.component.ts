import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { DataService } from 'src/app/core/services/data.service';
import { NotifyService } from 'src/app/core/services/notify.service';
import { AIModels, AIToolInfo, Agents, Models, Routing } from 'src/app/Models/Ai-Agent/toolInfo';
import { AiConversationService } from 'src/app/Services/ai-conversation.service';
import { ObjectId } from 'bson';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialoDeleteComponent } from 'src/app/shared/components/confirm-dialo-delete/confirm-dialo-delete.component';
import { ConfirmationForAgentTemplteSearchComponent } from './confirmation-for-agent-templte-search/confirmation-for-agent-templte-search.component';

@Component({
  selector: 'vex-agents',
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.scss']
})
export class AgentsComponent implements OnInit {

   form:FormGroup
   ismain:boolean
    onDestroy$: Subject<void> = new Subject();
    projectId
    selectedIndex:number
    conversationsList:string[] = []
    selectedSession
    aIToolsInfo:AIToolInfo[]
    aIModelsProvider:AIModels[] = []
    selectedProvider:AIModels
    ProviderModels:Models[] = []
    selectedModel:string
    tasks:any[] = []
    SelectedAgent:Agents
    agents:Agents[] = []
    agentFromAgentTemplete:Agents
    selectedAgentId:string = 'all'
    isExpand:boolean = false
    expandName:string = ''
    constructor(private _aiConversationService:AiConversationService, private _dataService: DataService,
     private fb: FormBuilder,
         private notify: NotifyService,
         private dialog: MatDialog

    ) { }

    ngOnInit(): void {
          this._dataService.$project_bs.pipe(takeUntil(this.onDestroy$)).subscribe((project) => {
            if (project) {
              this.projectId = project._id;}
              this.GetAgents()
              this.GetAgentsTasks()
              this.GetAIModelsProvider()
            }
            )
    }

  intiateForm(SelectedAgent:Agents){
    if(SelectedAgent.provider)
     this.ProviderModels =   this.aIModelsProvider.find(x=>x.provider == SelectedAgent.provider).models

    this.form = this.fb.group({
      _id: [SelectedAgent._id? SelectedAgent._id :new ObjectId().toHexString()],
      name: [SelectedAgent.name, Validators.required],
      chatbotId: [SelectedAgent.chatbotId? SelectedAgent.chatbotId : this.projectId, Validators.required],
      model: [SelectedAgent.model, Validators.required],
      prompt: [SelectedAgent.prompt],
      provider: [SelectedAgent.provider],
      apiKey: [SelectedAgent.apiKey],
      mainAgent: [SelectedAgent.mainAgent],
      maxMemoryLength: [SelectedAgent.maxMemoryLength],
      routing: this.fb.array(SelectedAgent.routing?.map(route => this.createRoutingGroup(route)) || []),
            // / 👇 Now promptSections is a nested FormGroup
    promptSections: this.fb.group({
    identity: [SelectedAgent.promptSections?.identity],
    responseStyle: [SelectedAgent.promptSections?.responseStyle],
    functionCallRules: [SelectedAgent.promptSections?.functionCallRules],
    conversationFlow: [SelectedAgent.promptSections?.conversationFlow],
    crtitcalNote: [SelectedAgent.promptSections?.crtitcalNote],
    fewShotExamples: [SelectedAgent.promptSections?.fewShotExamples]
  })
    });

    this.form.valueChanges.pipe(takeUntil(this.onDestroy$)).subscribe((formValue) => {
    if (this.selectedIndex != null && this.agents[this.selectedIndex]) {
      this.agents[this.selectedIndex] = {
        ...this.agents[this.selectedIndex],
        ...formValue,
        routing: [...formValue.routing] // ensure routing is copied deeply
      };
    }
  });
  }
  createRoutingGroup(route?: Routing): FormGroup {
    return this.fb.group({
      intent: [route?.intent || '', Validators.required],
      taskId: [route?.taskId || '', Validators.required]
    });
  }

  get routingControls(): FormArray {
    return this.form.get('routing') as FormArray;
  }

  addRouting() {
    this.routingControls.push(this.createRoutingGroup());
  }

  removeRouting(index: number) {
    this.routingControls.removeAt(index);
  }

    GetAgentsTasks(){
      this._aiConversationService.GetAgentsTasks(this.projectId,"intent_1").subscribe((res:any)=>{
        this.tasks = res.tasks
      })
    }
   selectedAgent(index){
     this.SelectedAgent = this.agents[index]
     this.selectedIndex = index
     this.intiateForm(this.SelectedAgent);
   }
  selectProvider(event){
    debugger
    this.selectedProvider = event.value
    this.ProviderModels =   this.aIModelsProvider.find(x=>x.provider == event.value).models
  }
  selectModel(event){
        debugger

    this.selectedModel = event.value
    this.GetAgentDataFromAgentTemplete()
  }
  deleteAgent(index,_id, event: Event): void {
    event.stopPropagation();

    const dialogRef = this.dialog.open(ConfirmDialoDeleteComponent, {
      width: '300px',
      data: { message: 'Do you want to delete this item?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
         this._aiConversationService.DeleteAgent(_id).subscribe((res:any)=>{
      debugger
      this.agents.splice(index,1)
      this.notify.openSuccessSnackBar("Agent Deleted Successfully")
    })
      }
    });
  }


  scrollToElement(id){
    debugger
    this.isExpand = false
    this.expandName = ''
    setTimeout(() => {
    const container = document.getElementById('agentFormScroll'); // your scrollable container
    const target = document.getElementById(id);

    if (container && target) {
      const containerHeight = container.clientHeight;
      const targetOffsetTop = target.offsetTop;
      const targetHeight = target.clientHeight;

      // Scroll to position that centers the element
      const scrollTop = targetOffsetTop - (containerHeight / 3.5) + (targetHeight / 2);
      container.scrollTo({ top: scrollTop, behavior: 'smooth' });
    }
  }, 100);
  }
   addAgent(){
    debugger
    this.agents.push(new Agents())
    this.selectedAgent(this.agents.length -1)
   }
   onSubmit(){
    this.buildPromptFromSections()
    console.log("eccrc",this.form.value)
        this._aiConversationService.saveAgent(this.form.value).subscribe((res:any)=>{
         this.notify.openSuccessSnackBar("Agent Saved successfuly")
     })
   }
    setMainAgent(agent:Agents){

    this._aiConversationService.SetMainAgent(agent._id, agent.mainAgent).subscribe((res:any)=>{
          this.agents.forEach(a => {
        a.mainAgent = (a._id === agent._id) ? agent.mainAgent : false;
      });
      if(agent._id == this.SelectedAgent._id){
        this.form?.patchValue({
        mainAgent: agent.mainAgent
        });
      }
         this.notify.openSuccessSnackBar("Main Agent setting  successfuly")
     })
    }
   GetAgents(){
     this._aiConversationService.GetAgents(this.projectId).subscribe((res:any)=>{
         this.agents = res
     })
   }

  GetAIModelsProvider(){
     this._aiConversationService.GetAIModels().subscribe((res:any)=>{
         this.aIModelsProvider = res
     })
  }
 GetAgentDataFromAgentTemplete(){
     this._aiConversationService.GetAgentDataFromAgentTemplete(this.projectId, this.SelectedAgent._id, this.form.get('provider')?.value , this.selectedModel).subscribe((res:any)=>{
         this.agentFromAgentTemplete = res
         debugger
         if(res){
           const dialogRef = this.dialog.open(ConfirmationForAgentTemplteSearchComponent, {
            width: '300px',
            data: { message: 'Existing data is available for this agent with the selected provider and model. Do you want to bind this data to the agent?' }
          });

              dialogRef.afterClosed().subscribe(result => {
                if (result) {
                  const agentTemplt:Agents =  res
                  agentTemplt._id = res.agent_id
                  this.intiateForm(res)
                }
              });
         }
     })
  }
  buildPromptFromSections(): void {
    const promptSections = this.form.get('promptSections')?.value;

    if (!promptSections) {
      return;
    }

    // Filter out empty/null/undefined sections and join with newlines
    const promptParts = [
      promptSections.identity,
      promptSections.responseStyle,
      promptSections.functionCallRules,
      promptSections.conversationFlow,
      promptSections.crtitcalNote,
      promptSections.fewShotExamples
    ].filter(section => section?.trim()); // Remove empty/undefined sections

    const combinedPrompt = promptParts.join('\n'); // Double newline for better separation

    // Update the prompt control value
    this.form.patchValue({
      prompt: combinedPrompt
    });
 }

}
