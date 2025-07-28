import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators, FormControl } from '@angular/forms';
import { map, Observable, startWith, Subject, takeUntil } from 'rxjs';
import { ProjectOptionsModel, Routing } from 'src/app/core/models/options-model';
import { AIModels, Models } from 'src/app/Models/Ai-Agent/toolInfo';
import { AiConversationService } from 'src/app/Services/ai-conversation.service';
import { OptionsServiceService } from 'src/app/Services/options-service.service';

@Component({
  selector: 'vex-brain',
  templateUrl: './brain.component.html',
  styleUrls: ['./brain.component.scss']
})
export class BrainComponent implements OnInit {

   onDestroy$: Subject<void> = new Subject();
   ProviderModels:Models[] = []
   projectOptions:ProjectOptionsModel = null
   aIModelsProvider:AIModels[] = []
   brainForm:FormGroup
   tasks:any[] = []
    isEntityExpand:boolean = false
    isInstractionsExpand:boolean = false
    isExampleExpand:boolean = false

   constructor(private fb:FormBuilder,
     private _optionsService:OptionsServiceService,
    private _aiConversationService:AiConversationService, ) { }

   ngOnInit(): void {
     this._optionsService.projectOptions$.pipe(takeUntil(this.onDestroy$)).subscribe((res:ProjectOptionsModel)=>{
       if(res){
         this.projectOptions = res
         debugger
          this.GetAIModelsProvider()


           if(this.tasks.length < 1)
             this.GetAgentsTasks()
       }
     })
   }


       GetAgentsTasks(){
      this._aiConversationService.GetAgentsTasks(this.projectOptions._id,"intent_1").subscribe((res:any)=>{
        this.tasks = res.tasks
      })
    }

   initiateForm(){
    debugger
     const providerModel = this.aIModelsProvider.find(x => x.provider == this.projectOptions.aiAgent.provider);
     this.ProviderModels = providerModel ? providerModel.models : [];
     this.brainForm = this.fb.group({
      //  nluMode: [this.projectOptions.nluMode],
       aiAgent : this.fb.group({
        model:[this.projectOptions.aiAgent.model],
        provider:[this.projectOptions.aiAgent?.provider || ''],
        task:[this.projectOptions.aiAgent.task],
        intentHeading:[this.projectOptions.aiAgent.intentHeading],
        intentRoutying:[this.projectOptions.aiAgent.intentRoutying],
        entity:[this.projectOptions.aiAgent.entity],
        instructions:[this.projectOptions.aiAgent.instructions],
        example:[this.projectOptions.aiAgent.example],
        prompt:[this.projectOptions.aiAgent.prompt],
        routing: this.fb.array(this.projectOptions.aiAgent.routing?.map(route => this.createRoutingGroup(route)) || [])
       })
     })

   }
  GetAIModelsProvider(){
    debugger
     this._aiConversationService.GetAIModels().subscribe((res:any)=>{
         this.aIModelsProvider = res
         this.initiateForm()
     })
  }

  createRoutingGroup(route?: Routing): FormGroup {
    return this.fb.group({
      intent: [route?.intent || '', Validators.required],
      taskId: [route?.taskId || '', Validators.required],
    });
  }

  get routingControls(): FormArray {
    return this.brainForm.get('aiAgent.routing') as FormArray;
  }
    addRouting() {
    this.routingControls.push(this.createRoutingGroup());
  }

  removeRouting(index: number) {
    this.routingControls.removeAt(index);
          this.brainForm?.patchValue({
        aiAgent: {
        intentRoutying: this.getIntentRoutingValue()
       }
      });
  }

   getFormValue(){
      debugger
      this.brainForm?.patchValue({
        aiAgent: {
        intentRoutying: this.getIntentRoutingValue()
       }
      });
      // this.projectOptions.nluMode = this.brainForm.get('nluMode')?.value;
      this.projectOptions.aiAgent.model = this.brainForm.get('aiAgent.model')?.value;
      this.projectOptions.aiAgent.provider = this.brainForm.get('aiAgent.provider')?.value;
      this.projectOptions.aiAgent.prompt = this.constractThePrompt();
      this.projectOptions.aiAgent.routing = this.brainForm.get('aiAgent.routing')?.value;
      this.projectOptions.aiAgent.task = this.brainForm.get('aiAgent.task')?.value;
      this.projectOptions.aiAgent.intentHeading = this.brainForm.get('aiAgent.intentHeading')?.value;
      this.projectOptions.aiAgent.intentRoutying = this.brainForm.get('aiAgent.intentRoutying')?.value;
      this.projectOptions.aiAgent.entity = this.brainForm.get('aiAgent.entity')?.value;
      this.projectOptions.aiAgent.instructions = this.brainForm.get('aiAgent.instructions')?.value;
      this.projectOptions.aiAgent.example = this.brainForm.get('aiAgent.example')?.value;

      const providerModel = this.aIModelsProvider.find(x => x.provider == this.projectOptions.aiAgent.provider);
      this.ProviderModels = providerModel ? providerModel.models : [];
      this._optionsService.projectOptions$.next(this.projectOptions)
   }
   getIntentRoutingValue(){
      var routingValue = this.brainForm.get('aiAgent.routing')?.value as Array<Routing>
      var intentValue = ""
      if(routingValue.length > 0){
        intentValue +='{'
        for (let index = 0; index < routingValue.length; index++) {
          if(index == routingValue.length-1 )
            intentValue+=`"${routingValue[index].intent}"`
          else
             intentValue+=`"${routingValue[index].intent}",`

        }
      intentValue += '}.'
    }
    return intentValue;
   }

   constractThePrompt(){
    var prompt = "";
     prompt += this.brainForm.get('aiAgent.task')?.value +'\n'
     prompt += this.brainForm.get('aiAgent.intentHeading')?.value +'\n'
     prompt += this.brainForm.get('aiAgent.intentRoutying')?.value +'\n'
     prompt += this.brainForm.get('aiAgent.entity')?.value +'\n'
     prompt += this.brainForm.get('aiAgent.instructions')?.value +'\n'
     prompt += this.brainForm.get('aiAgent.example')?.value
     return prompt;
   }
   getFormValuePrpmpt(event){
          debugger
      this.projectOptions.brainMode = this.brainForm.get('brainMode')?.value;
      this.projectOptions.aiAgent.model = this.brainForm.get('aiAgent.model')?.value;
      this.projectOptions.aiAgent.prompt = this.brainForm.get('aiAgent.prompt')?.value;
      this._optionsService.projectOptions$.next(this.projectOptions)
   }
   ngOnDestroy() {
     console.log("general destroy!!!")
     this.onDestroy$.next();
     this.onDestroy$.complete();
   }

}
