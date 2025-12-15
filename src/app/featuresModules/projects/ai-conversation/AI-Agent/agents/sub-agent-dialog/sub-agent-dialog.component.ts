import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Agents, SubAgent, SubAgentSelected } from 'src/app/Models/Ai-Agent/toolInfo';
import { AiConversationService } from 'src/app/Services/ai-conversation.service';

@Component({
  selector: 'vex-sub-agent-dialog',
  templateUrl: './sub-agent-dialog.component.html',
  styleUrls: ['./sub-agent-dialog.component.scss']
})
export class SubAgentDialogComponent implements OnInit {

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<SubAgentDialogComponent>,
    private _aiConversationService:AiConversationService,
    @Inject(MAT_DIALOG_DATA) public data: { allAgents: Agents[], parent: Agents, chatbotId:string}
  ) {}

ngOnInit(): void {
  debugger
  this.form = this.fb.group({
    globalInstruction: [this.data.parent.globalInstruction],
    description: [this.data.parent.description],
    agentHandoffMode: [this.data.parent.agentHandoffMode],
    subAgents: this.fb.array([])
  });

   this.showSubAgentsBasedOnAgentMode(this.data.parent.agentHandoffMode)
}

  get subAgentsArray(): FormArray {
    return this.form.get('subAgents') as FormArray;
  }

  save() {
    const agents = this.subAgentsArray.value
      // .filter(sa => sa.selected)
      // .map(sa => <SubAgent>{ agentId: sa.agentId, name: sa.name, description: sa.description });

    // this.dialogRef.close({subAgents:selected,globalInstruction:this.form.controls['globalInstruction'].value});
    this.dialogRef.close({
                          subAgents:agents,
                          globalInstruction:this.form.controls['globalInstruction'].value,
                          agentHandoffMode:this.form.controls['agentHandoffMode'].value,
                          description:this.form.controls['description'].value});
  }

  changeAgentMode(event){
    debugger
    (this.form.get('subAgents') as FormArray).clear();
    this.showSubAgentsBasedOnAgentMode(event.value)

  }
  cancel() {
    this.dialogRef.close();
  }

  showSubAgentsBasedOnAgentMode(agentMode:number){
    if(agentMode == 1){
      this.data.allAgents.forEach(agent => {
    // Skip if this is the same parent agent (can't be its own subagent)
     if (agent._id === this.data.parent._id) return;

     // ❌ Skip if this agent already has subAgents (don't allow parents as subAgents)
    //if (agent.subAgents && agent.subAgents.length > 0) return;
    // Check if this agent is already a subagent of the current parent
    const existing = this.data.parent.subAgents.find(sa => sa.agentId === agent._id);

    // ✅ Only show:
    // - if it belongs to this parent already (existing != null)
    // - OR if it is not part of *any* parent.subAgents
    // const isAlreadySubAgentOfAnother = this.data.allAgents.some(a =>
    //   a._id !== this.data.parent._id &&
    //   a.subAgents?.some(sa => sa.agentId === agent._id)
    // );

      (this.form.get('subAgents') as FormArray).push(
        this.fb.group({
          agentId: [agent._id],
          name: [agent.name],
          subAgentParentId: [agent.parentAgentId],
          selected: [!!existing],
          description: [existing ? existing.description : '']
        })
      );
  });
    }else{
      this.data.allAgents.forEach(agent => {
    // Skip if this is the same parent agent (can't be its own subagent)
    if (agent._id === this.data.parent._id) return;

     // ❌ Skip if this agent already has subAgents (don't allow parents as subAgents)
    //if (agent.subAgents && agent.subAgents.length > 0) return;
    // Check if this agent is already a subagent of the current parent

    const existing = this.data.parent.subAgents.find(sa => sa.agentId === agent._id);

    // ✅ Only show:
    // - if it belongs to this parent already (existing != null)
    // - OR if it is not part of *any* parent.subAgents
    // const isAlreadySubAgentOfAnother = this.data.allAgents.some(a =>
    //   a._id !== this.data.parent._id &&
    //   a.subAgents?.some(sa => sa.agentId === agent._id)
    // );

    // if (existing || !isAlreadySubAgentOfAnother) {
    if ((existing || true) && (agent.parentAgentId == null || existing ) ) {
      (this.form.get('subAgents') as FormArray).push(
        this.fb.group({
          agentId: [agent._id],
          name: [agent.name],
          subAgentParentId: [agent.parentAgentId],
          selected: [!!existing],
          description: [existing ? existing.description : '']
        })
      );
    }
  });
    }
  }
}
