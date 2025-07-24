import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ObjectId } from 'bson';
import { DataService } from 'src/app/core/services/data.service';
import { NotifyService } from 'src/app/core/services/notify.service';
import { AiConversationService } from 'src/app/Services/ai-conversation.service';
import { RagKnowledgeBaseService } from 'src/app/Services/rag-knowledge-base.service';

class Config {
  UseExactCache: boolean;
  prompt: string = ""
  embedding_model: string = ""
  semantic_docs_no: number = 0
  KeyWord_docs_no: number = 0
  reranker1_limit: number = 0
  reranker2_limit: number = 0
  window_size: number = 0
  threshold_after_reranker1: number = 0
  threshold_after_reranker2: number = 0
}
@Component({
  selector: 'vex-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  form:FormGroup
  configs:Config = new Config()
  chatbotId:string
  constructor(private _ragKnowledgeBaseService:RagKnowledgeBaseService, private _dataService: DataService,
       private fb: FormBuilder,
           private notify: NotifyService,
           private route: ActivatedRoute,
           private dialog: MatDialog) { }

  ngOnInit(): void {
    this.route.parent?.parent?.paramMap.subscribe(params => {
    this.chatbotId = params.get('projectid');
    console.log('Project ID:', this.chatbotId);  // Should now show "150"
    this.intiateForm()
    this.getConfigs()
    });
  }

  intiateForm(){
   this.form = this.fb.group({
        prompt: [this.configs.prompt, Validators.required],
        UseExactCache: [this.configs.UseExactCache, Validators.required],
        embedding_model: [this.configs.embedding_model, Validators.required],
        semantic_docs_no: [this.configs.semantic_docs_no, Validators.required],
        KeyWord_docs_no: [this.configs.KeyWord_docs_no, Validators.required],
        reranker1_limit: [this.configs.reranker1_limit, Validators.required],
        reranker2_limit: [this.configs.reranker2_limit, Validators.required],
        window_size: [this.configs.window_size, Validators.required],
        threshold_after_reranker1: [this.configs.threshold_after_reranker1, Validators.required],
        threshold_after_reranker2: [this.configs.threshold_after_reranker2,Validators.required]
      })
  }
  getConfigs(){
    let body =  {
    "deployment": "Local",
    "key": "",
    "url": "http://weaviate:8080",
    "chatbotId": this.chatbotId,
    "projectId":"",
    "mode": "test"
    }
    this._ragKnowledgeBaseService.getConfigs(body).subscribe({
      next: (res: any) => {
        this.configs = res.configs
      },
      error: (err) => {
        console.error('API Error:', err);
        const errorMsg = err?.error?.message || 'Failed to get configs';
        this.notify.openFailureSnackBar(errorMsg);
      }
    });
  }

  saveConfigs(){
    let body =  {
    "deployment": "Local",
    "key": "",
    "url": "http://weaviate:8080",
    "chatbotId": this.chatbotId,
    "projectId":"",
    "mode": "test",
    configs:this.form.value
    }
    this._ragKnowledgeBaseService.save_configs(body).subscribe({
      next: (res: any) => {
        this.notify.openSuccessSnackBar("Configs Saved Successfuly");
      },
      error: (err) => {
        console.error('API Error:', err);
        const errorMsg = err?.error?.message || 'Failed to get configs';
        this.notify.openFailureSnackBar(errorMsg);
      }
    });
  }


}


