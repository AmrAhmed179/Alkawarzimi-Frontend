import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { DataService } from 'src/app/core/services/data.service';
import { NotifyService } from 'src/app/core/services/notify.service';
import { AIModels, AIToolInfo, Agents, IntentResponse, Models, Routing, SubAgent, SubAgentSelected } from 'src/app/Models/Ai-Agent/toolInfo';
import { AiConversationService } from 'src/app/Services/ai-conversation.service';
import { ObjectId } from 'bson';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialoDeleteComponent } from 'src/app/shared/components/confirm-dialo-delete/confirm-dialo-delete.component';
import { ConfirmationForAgentTemplteSearchComponent } from './confirmation-for-agent-templte-search/confirmation-for-agent-templte-search.component';
import { SubAgentDialogComponent } from './sub-agent-dialog/sub-agent-dialog.component';
import { ToolDialogComponent } from './tool-dialog/tool-dialog.component';
import { ViewFullPropmptDialogComponent } from './view-full-propmpt-dialog/view-full-propmpt-dialog.component';
import { ContextVariableService } from 'src/app/Services/Build/context-variable.service';
import { ContextVariableModel } from 'src/app/core/models/contextVariable';
import { StateComponent } from './state/state.component';
import { IntentResponseDialogComponent } from './intent-response-dialog/intent-response-dialog.component';
import { VariableValueComponent } from './variable-value/variable-value.component';

@Component({
  selector: 'vex-agents',
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.scss']
})
export class AgentsComponent implements OnInit {

  variables: ContextVariableModel[] = []
  form: FormGroup
  ismain: boolean
  onDestroy$: Subject<void> = new Subject();
  projectId
  selectedIndex: number
  conversationsList: string[] = []
  selectedSession
  aIToolsInfo: AIToolInfo[]
  aIModelsProvider: AIModels[] = []
  selectedProvider: AIModels
  ProviderModels: Models[] = []
  selectedModel: string
  tasks: any[] = []
  SelectedAgent: Agents
  agents: Agents[] = []
  agentFromAgentTemplete: Agents
  selectedAgentId: string = 'all'
  isExpand: boolean = false
  expandName: string = ''
  constructor(private _aiConversationService: AiConversationService, private _dataService: DataService,
    private fb: FormBuilder,
    private notify: NotifyService,
    private dialog: MatDialog,
    private _contextVariableService: ContextVariableService,

  ) { }

  ngOnInit(): void {
    this._dataService.$project_bs.pipe(takeUntil(this.onDestroy$)).subscribe((project) => {
      if (project) {
        this.projectId = project._id;
      }
      this.GetAgents()
      this.GetTools()
      this.GetAgentsTasks()
      this.GetAIModelsProvider()
      this.ContextVariable()
    }
    )
  }

  ContextVariable() {
    this._contextVariableService.GetContextVariable(this.projectId).subscribe((response: ContextVariableModel[]) => {
      if (response) {
        this.variables = response;
      }
    })
  }
  intiateForm(SelectedAgent: Agents) {
    if (SelectedAgent.provider)
      this.ProviderModels = this.aIModelsProvider.find(x => x.provider == SelectedAgent.provider).models

    this.form = this.fb.group({
      _id: [SelectedAgent._id ? SelectedAgent._id : new ObjectId().toHexString()],
      name: [SelectedAgent.name, Validators.required],
      globalInstruction: [SelectedAgent.globalInstruction],
      startWithoutHistory: [SelectedAgent.startWithoutHistory],
      parentAgentId: [SelectedAgent.parentAgentId],
      subAgents: [SelectedAgent.subAgents],
      description: [SelectedAgent.description],
      tools: [SelectedAgent.tools],
      state: [SelectedAgent.state],
      chatbotId: [SelectedAgent.chatbotId ? SelectedAgent.chatbotId : this.projectId, Validators.required],
      model: [SelectedAgent.model, Validators.required],
      prompt: [SelectedAgent.prompt],
      provider: [SelectedAgent.provider],
      apiKey: [SelectedAgent.apiKey],
      mainAgent: [SelectedAgent.mainAgent],
      isVoice: [SelectedAgent.isVoice],
      agentHandoffMode: [SelectedAgent.agentHandoffMode],
      maxMemoryLength: [SelectedAgent.maxMemoryLength],
      aiIntents: [SelectedAgent.aiIntents],
      //intentResponse: [SelectedAgent.intentResponse || []],
      routing: this.fb.array(SelectedAgent.routing?.map(route => this.createRoutingGroup(route)) || []),
      // / 👇 Now promptSections is a nested FormGroup
      promptSections: this.fb.group({
        identity: [SelectedAgent.promptSections?.identity],
        responseStyle: [SelectedAgent.promptSections?.responseStyle],
        functionCallRules: [SelectedAgent.promptSections?.functionCallRules],
        conversationFlow: [SelectedAgent.promptSections?.conversationFlow],
        crtitcalNote: [SelectedAgent.promptSections?.crtitcalNote],
        fewShotExamples: [SelectedAgent.promptSections?.fewShotExamples]
      }),

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
      taskId: [route?.taskId || '', Validators.required],
      variables: [route?.variables || []]
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

  GetTools() {
    this._aiConversationService.GetTools(this.selectedAgentId).subscribe((res: any) => {
      this.aIToolsInfo = res
    })
  }
  GetAgentsTasks() {
    this._aiConversationService.GetAgentsTasks(this.projectId, "intent_1").subscribe((res: any) => {
      this.tasks = res.tasks
    })
  }
  selectedAgent(index) {
    debugger
    this.SelectedAgent = this.agents[index]
    this.selectedIndex = index
    this.intiateForm(this.SelectedAgent);
  }

  viewIntentReponse() {
    const dialogRef = this.dialog.open(IntentResponseDialogComponent, {
      width: '1200px',
      maxWidth: '95vw',
      height: '800px',
      data: {
        items: this.SelectedAgent.intentResponse || []
      }
    });

    dialogRef.afterClosed().subscribe((result: IntentResponse[] | null) => {
      if (!result) return;

      this.SelectedAgent.intentResponse = result;
      this.form?.patchValue({ intentResponse: result });

      // optional: persist
      this._aiConversationService.saveAgent(this.form.value).subscribe(() => {
        this.notify.openSuccessSnackBar("Intent responses updated successfully");
      });
    });
  }
  setHaveIntentRespone() {
    this.form?.patchValue({ aiIntents: this.SelectedAgent.aiIntents });
  }
  setStartWithoutHistory() {
    this.form?.patchValue({ startWithoutHistory: this.SelectedAgent.startWithoutHistory });
  }
  setIsvoice() {
    this.form?.patchValue({ isVoice: this.SelectedAgent.isVoice });
  }

  selectProvider(event) {
    debugger
    this.selectedProvider = event.value
    this.ProviderModels = this.aIModelsProvider.find(x => x.provider == event.value).models
  }
  selectModel(event) {
    debugger

    this.selectedModel = event.value
    this.GetAgentDataFromAgentTemplete()
  }
  deleteAgent(index, _id, event: Event): void {
    event.stopPropagation();

    const dialogRef = this.dialog.open(ConfirmDialoDeleteComponent, {
      width: '300px',
      data: { message: 'Do you want to delete this item?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._aiConversationService.DeleteAgent(_id).subscribe((res: any) => {
          debugger
          this.agents.splice(index, 1)
          this.notify.openSuccessSnackBar("Agent Deleted Successfully")
        })
      }
    });
  }
  openSubAgentsDialog() {
    debugger
    const dialogRef = this.dialog.open(SubAgentDialogComponent, {
      width: '1000px',
      data: { allAgents: this.agents.filter(x => x._id != this.SelectedAgent._id), parent: this.form.value, chatbotId: this.projectId }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.SelectedAgent.subAgents = result.subAgents;
        this.SelectedAgent.globalInstruction = result.globalInstruction;
        let body = {
          subAgents: result.subAgents,
          globalInstruction: result.globalInstruction,
          agentHandoffMode: result.agentHandoffMode,
          description: result.description,
          chatbotId: this.projectId,
          parentId: this.SelectedAgent._id
        }
        this._aiConversationService.saveSubAgents(body).subscribe((res: any) => {
          this.notify.openSuccessSnackBar("Subagent Saved successfuly")
          // this.GetAgents()
          // this.intiateForm(this.SelectedAgent)
          var selectedSubAgent = result.subAgents.filter(sa => sa.selected)
            .map(sa => <SubAgent>{ agentId: sa.agentId, name: sa.name, description: sa.description, });
          this.form.patchValue({
            globalInstruction: result.globalInstruction,
            subAgents: selectedSubAgent,
            description: result.description,
            agentHandoffMode: result.agentHandoffMode
          })
          this.SelectedAgent.subAgents = selectedSubAgent;
          this.SelectedAgent.globalInstruction = result.globalInstruction;
          this.SelectedAgent.agentHandoffMode = result.agentHandoffMode;
          this.SelectedAgent.description = result.description;
          this.updateAgentWhenSetSubAgents(result.subAgents, result.agentHandoffMode);
        })
      }
    });
  }

  updateAgentWhenSetSubAgents(subAgents: SubAgentSelected[], agentHandoffMode: number) {
    subAgents.forEach(el => {
      let agentIndex = this.agents.findIndex(x => x._id == el.agentId)
      if (!el.selected) {
        this.agents[agentIndex].parentAgentId = null
        return
      }
      if (el.selected == true && agentHandoffMode == 0) {
        this.agents[agentIndex].parentAgentId = this.SelectedAgent._id
        this.agents[agentIndex].subAgents = []
      }

      if (el.selected == true && agentHandoffMode == 1) {
        if (el.subAgentParentId == this.SelectedAgent._id)
          this.agents[agentIndex].parentAgentId = null
      }

      // if(el.selected == true && agentHandoffMode == 0)
      //   this.agents[agentIndex].parentAgentId = this.SelectedAgent._id
      // else
      //   this.agents[agentIndex].parentAgentId = null
    })
  }

  openToolDialog() {
    const dialogRef = this.dialog.open(ToolDialogComponent, {
      width: '1000px',
      data: { tools: this.aIToolsInfo, parent: this.form.value }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        debugger
        this.form.patchValue({
          tools: result
        })
        this.SelectedAgent.tools = result;
        this._aiConversationService.saveAgent(this.form.value).subscribe((res: any) => {
          this.notify.openSuccessSnackBar("Tools Updated successfuly")
        })
      }
    });
  }
  openStateDialog() {
    const dialogRef = this.dialog.open(StateComponent, {
      width: '1300px',
      data: { variables: this.variables, selectedAgent: this.form.value }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.form.patchValue({
          state: result
        })
        this.SelectedAgent.state = result;
        this._aiConversationService.saveAgent(this.form.value).subscribe((res: any) => {
          this.notify.openSuccessSnackBar("State Updated successfuly")
        })
      }
    });
  }

  openVariableValueDialog(routing, index) {
    const dialogRef = this.dialog.open(VariableValueComponent, {
      width: '1300px',
      data: { variables: this.variables, agentRouting: routing, routingIdex: index }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.routingControls.at(index).patchValue({
          variables: result
        });

        // 🔥 Also update SelectedAgent model
        this.SelectedAgent.routing[index].variables = result;
      }
    });
  }

  removeRoutingVariable(routeIndex: number, variableIndex: number) {

    const variables = this.routingControls
      .at(routeIndex)
      .value.variables || [];

    variables.splice(variableIndex, 1);

    this.routingControls.at(routeIndex).patchValue({
      variables: [...variables]
    });

    this.SelectedAgent.routing[routeIndex].variables = [...variables];
  }
  viewFullPropmpt() {
    this.buildPromptFromSections()
    const dialogRef = this.dialog.open(ViewFullPropmptDialogComponent, {
      width: '1300px',
      data: { prompt: this.form.controls['prompt'].value }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
    });
  }
  scrollToElement(id) {
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
  addAgent() {
    debugger
    this.agents.push(new Agents())
    this.selectedAgent(this.agents.length - 1)
  }
  onSubmit() {
    this.buildPromptFromSections()
    console.log("eccrc", this.form.value)
    this._aiConversationService.saveAgent(this.form.value).subscribe((res: any) => {
      this.notify.openSuccessSnackBar("Agent Saved successfuly")
    })
  }
  setMainAgent(agent: Agents) {

    this._aiConversationService.SetMainAgent(agent._id, agent.mainAgent).subscribe((res: any) => {
      this.agents.forEach(a => {
        a.mainAgent = (a._id === agent._id) ? agent.mainAgent : false;
      });
      if (agent._id == this.SelectedAgent._id) {
        this.form?.patchValue({
          mainAgent: agent.mainAgent
        });
      }
      this.notify.openSuccessSnackBar("Main Agent setting  successfuly")
    })
  }
  GetAgents() {
    this._aiConversationService.GetAgents(this.projectId).subscribe((res: any) => {
      this.agents = res
    })
  }

  GetAIModelsProvider() {
    this._aiConversationService.GetAIModels().subscribe((res: any) => {
      this.aIModelsProvider = res
    })
  }
  GetAgentDataFromAgentTemplete() {
    this._aiConversationService.GetAgentDataFromAgentTemplete(this.projectId, this.SelectedAgent._id, this.form.get('provider')?.value, this.selectedModel).subscribe((res: any) => {
      this.agentFromAgentTemplete = res
      debugger
      if (res) {
        const dialogRef = this.dialog.open(ConfirmationForAgentTemplteSearchComponent, {
          width: '300px',
          data: { message: 'Existing data is available for this agent with the selected provider and model. Do you want to bind this data to the agent?' }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            const agentTemplt: Agents = res
            agentTemplt._id = res.agent_id
            this.SelectedAgent.startWithoutHistory = res.startWithoutHistory
            this.SelectedAgent.mainAgent = res.mainAgent
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
    this.form.patchValue({
      startWithoutHistory: this.SelectedAgent.startWithoutHistory
    });
  }
  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }


}
