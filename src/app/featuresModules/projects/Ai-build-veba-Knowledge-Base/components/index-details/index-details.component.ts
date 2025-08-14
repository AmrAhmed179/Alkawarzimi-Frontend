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
 chatbotId:string
 isIndexRunning:boolean
 indexStatus:any
 intervalId: any;
 upTodated:boolean
  constructor(private wsService: WebSocketService,
      private dialog:MatDialog,
      private route: ActivatedRoute,
      private _notify:NotifyService,
      private _ragKnowledgeBaseService:RagKnowledgeBaseService) { }

  ngOnInit(): void {
    this.route.parent?.parent?.paramMap.subscribe(params => {
    this.chatbotId = params.get('projectid');
    console.log('Project ID:', this.chatbotId);  // Should now show "150"
    this.get_index_status()
     // Set interval to call get_index_status every 10 seconds
    this.intervalId = setInterval(() => {
      this.get_index_status();
    }, 20000);
    });
  }
  CreateIndex(){
   let body =  {
    "chatbotId": this.chatbotId,
    "projectId":this.chatbotId,
    }
    this._ragKnowledgeBaseService.createIndex(body).subscribe({
      next: (res: any) => {
        this._notify.openSuccessSnackBar("Index Starting");
        this.get_index_status()
      },
      error: (err) => {
        console.error('API Error:', err);
        const errorMsg = err?.error?.message || 'Failed to create index. Please try again.';
        this._notify.openFailureSnackBar(errorMsg);
      }
    });
  }

  cancelIndex(){
   let body =  {
    "chatbotId": this.chatbotId,
    "projectId":this.chatbotId,
    }
    this._ragKnowledgeBaseService.cancelIndex(body).subscribe({
      next: (res: any) => {
        this._notify.openSuccessSnackBar("Index Canceled");
        this.get_index_status()
      },
      error: (err) => {
        console.error('API Error:', err);
        const errorMsg = err?.error?.message || 'Failed to Canceled index. Please try again.';
        this._notify.openFailureSnackBar(errorMsg);
      }
    });
  }

   get_index_status(){
   let body =  {
    "chatbotId": this.chatbotId,
    "projectId":this.chatbotId,
    }
    this._ragKnowledgeBaseService.get_index_status(body).subscribe({
      next: (res: any) => {
        this.indexStatus = res
         this.isIndexRunning = res.status === "running";
         if(this.indexStatus.updated_at > this.indexStatus.lastDocUpdatedAt && this.indexStatus.status == 'succeeded')
          this.upTodated = true
        else
          this.upTodated = false
      },
      error: (err) => {
        console.error('API Error:', err);
        const errorMsg = err?.error?.message || 'Failed to create index. Please try again.';
        this._notify.openFailureSnackBar(errorMsg);
      }
    });
  }

  ngOnDestroy(): void {
  if (this.intervalId) {
    clearInterval(this.intervalId);
  }
}
}
