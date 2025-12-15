import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContextVariableModel } from 'src/app/core/models/contextVariable';
import { AIToolInfo, Agents, StateVariable } from 'src/app/Models/Ai-Agent/toolInfo';
import { AiConversationService } from 'src/app/Services/ai-conversation.service';

@Component({
  selector: 'vex-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.scss']
})
export class StateComponent  {

 availableVariables: ContextVariableModel[] = [];
  filteredVariables: ContextVariableModel[] = [];
  agent: Agents;
  searchText: string = '';

  constructor(
    public dialogRef: MatDialogRef<StateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { variables: ContextVariableModel[], selectedAgent: Agents }
  ) {
    this.agent = data.selectedAgent;
    this.filterAvailableVariables();
  }

  filterAvailableVariables() {
    this.availableVariables = this.data.variables.filter(
      v => !this.agent.state.some(s => s.variableId === v.contextVariableId)
    );
    this.applySearch();
  }

  applySearch() {
    debugger
    if (!this.searchText.trim()) {
      this.filteredVariables = this.availableVariables;
    } else {
      const search = this.searchText.toLowerCase();
      this.filteredVariables = this.availableVariables.filter(v =>
        v.key.toLowerCase().includes(search) ||
        v.type.toLowerCase().includes(search)
      );
    }
  }

  addVariable(variable: ContextVariableModel) {
    this.agent.state.push({
      variableId: variable.contextVariableId,
      name: variable.key,
      defaultValue: ''
    });
    this.filterAvailableVariables();
  }

  removeVariable(stateVar: StateVariable) {
    this.agent.state = this.agent.state.filter(s => s.variableId !== stateVar.variableId);
    this.filterAvailableVariables();
  }

  save() {
    this.dialogRef.close(this.agent.state);
  }

  cancel() {
    this.dialogRef.close();
  }
}

