import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContextVariableModel } from 'src/app/core/models/contextVariable';
import { Agents, Routing, StateVariable } from 'src/app/Models/Ai-Agent/toolInfo';
import { StateComponent } from '../state/state.component';

@Component({
  selector: 'vex-variable-value',
  templateUrl: './variable-value.component.html',
  styleUrls: ['./variable-value.component.scss']
})

export class VariableValueComponent  {

 availableVariables: ContextVariableModel[] = [];
  filteredVariables: ContextVariableModel[] = [];
  agent: Agents;
  routing: Routing
  searchText: string = '';
  constructor(
    public dialogRef: MatDialogRef<VariableValueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { variables: ContextVariableModel[], agentRouting: Routing, routingIdex: number }
  ) {
    this.routing = data.agentRouting;
    this.filterAvailableVariables();
  }

  filterAvailableVariables() {
    this.availableVariables = this.data.variables.filter(
      v => !this.routing.variables.some(s => s.variableId === v.contextVariableId)
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
    this.routing.variables.push({
      variableId: variable.contextVariableId,
      variableName: variable.key,
      value: ''
    });
    this.filterAvailableVariables();
  }

  removeVariable(stateVar: any) {
    this.routing.variables = this.routing.variables.filter(s => s.variableId !== stateVar.variableId);
    this.filterAvailableVariables();
  }

  save() {
    this.dialogRef.close(this.routing.variables);
  }

  cancel() {
    this.dialogRef.close();
  }
}
