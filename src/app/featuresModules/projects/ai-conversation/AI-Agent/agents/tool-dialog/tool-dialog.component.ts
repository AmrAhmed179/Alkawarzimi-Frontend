import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Agents, AgentTool, AIToolInfo, SubAgent } from 'src/app/Models/Ai-Agent/toolInfo';
import { AiConversationService } from 'src/app/Services/ai-conversation.service';
import { SubAgentDialogComponent } from '../sub-agent-dialog/sub-agent-dialog.component';

@Component({
  selector: 'vex-tool-dialog',
  templateUrl: './tool-dialog.component.html',
  styleUrls: ['./tool-dialog.component.scss']
})
export class ToolDialogComponent implements OnInit {
 form: FormGroup;
  category:string = 'All'
  allTools: any[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<SubAgentDialogComponent>,
    private _aiConversationService:AiConversationService,
    @Inject(MAT_DIALOG_DATA) public data: { tools: AIToolInfo[], parent: Agents, chatbotId:string}
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      tools: this.fb.array([])
    });

    // keep original list
    //this.allTools = this.data.tools;

    //this.buildForm(this.allTools);

    this.data.tools.forEach(tool=>{
      const existing = this.data.parent.tools.find(sa => sa.toolId === tool._id);
       this.allTools.push({
        toolId: tool._id,
         name: tool.functionName,
         category: tool.category,
         selected: !!existing,
         description: existing ? existing.description : ''
       })
    })
  }

private buildForm(tools: any[]) {
  const formArray = this.fb.array<FormGroup>([]); // 👈 tell Angular it's array of FormGroup

  tools.forEach(tool => {
    const existing = this.data.parent.tools.find(sa => sa.toolId === tool._id);

    formArray.push(
      this.fb.group({
        toolId: [tool._id],
        name: [tool.functionName],
        category: [tool.category],
        selected: [!!existing],
        description: [existing ? existing.description : '']
      })
    );
  });

  this.form.setControl('tools', formArray);
}
//   GetCatogryFilter() {
//   let filteredTools = this.allTools;
//    debugger
//      if(this.category == 'selected'){
//     filteredTools = this.allTools.filter(t => t.selected === true)
//   }
//   if (this.category !== 'All' && this.category !== 'selected' ) {
//     filteredTools = this.allTools.filter(t => t.category === this.category);
//   }
// }

  get toolsArray(): FormArray {
    return this.form.get('tools') as FormArray;
  }

  save() {
    const selected = this.allTools
      .filter(sa => sa.selected)
      .map(sa => <AgentTool>{ toolId: sa.toolId, name: sa.name, description: sa.description });

    this.dialogRef.close(selected);
  }

  cancel() {
    this.dialogRef.close();
  }


}
