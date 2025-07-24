import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { NotifyService } from 'src/app/core/services/notify.service';
import { RagKnowledgeBaseService } from 'src/app/Services/rag-knowledge-base.service';
import { WebSocketService } from 'src/app/Services/web-socket-service.service';

@Component({
  selector: 'vex-index-details',
  templateUrl: './index-details.component.html',
  styleUrls: ['./index-details.component.scss']
})
export class IndexDetailsComponent implements OnInit {
 projectId:string
 indexStatus:string
  constructor(private wsService: WebSocketService,
      private dialog:MatDialog,
      private route: ActivatedRoute,
      private _notify:NotifyService,
      private _ragKnowledgeBaseService:RagKnowledgeBaseService) { }

  ngOnInit(): void {
    this.route.parent?.parent?.paramMap.subscribe(params => {
    this.projectId = params.get('projectid');
    console.log('Project ID:', this.projectId);  // Should now show "150"
    this.get_index_status()
    });
  }
  CreateIndex(){
   let body =  {
    "deployment": "Local",
    "key": "",
    "url": "http://weaviate:8080",
    "chatbotId": this.projectId,
    "mode": "test"
    }
    this._ragKnowledgeBaseService.createIndex(body).subscribe({
      next: (res: any) => {
        this._notify.openSuccessSnackBar("Index created successfully");
      },
      error: (err) => {
        console.error('API Error:', err);
        const errorMsg = err?.error?.message || 'Failed to create index. Please try again.';
        this._notify.openFailureSnackBar(errorMsg);
      }
    });
  }

   get_index_status(){
   let body =  {
    "deployment": "Local",
    "key": "",
    "url": "http://weaviate:8080",
    "chatbotId": this.projectId,
    "mode": "test"
    }
    this._ragKnowledgeBaseService.get_index_status(body).subscribe({
      next: (res: any) => {
        this.indexStatus = res.status
      },
      error: (err) => {
        console.error('API Error:', err);
        const errorMsg = err?.error?.message || 'Failed to create index. Please try again.';
        this._notify.openFailureSnackBar(errorMsg);
      }
    });
  }
}
