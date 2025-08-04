import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { DataService } from 'src/app/core/services/data.service';
import { RagKnowledgeBaseService } from 'src/app/Services/rag-knowledge-base.service';
import { IndexDetailsComponent } from '../components/index-details/index-details.component';
import { ActivatedRoute } from '@angular/router';
import { WebSocketService } from 'src/app/Services/web-socket-service.service';
import { NotifyService } from 'src/app/core/services/notify.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'vex-parent-knowledge-base',
  templateUrl: './parent-knowledge-base.component.html',
  styleUrls: ['./parent-knowledge-base.component.scss']
})
export class ParentKnowledgeBaseComponent implements OnInit {
  chatbotId:string
  indexStatus:string
  onDestroy$: Subject<void> = new Subject();
  constructor(private wsService: WebSocketService,
         private dialog:MatDialog,
         private route: ActivatedRoute,
         private _notify:NotifyService,
         private _ragKnowledgeBaseService:RagKnowledgeBaseService) { }

  ngOnInit(): void {
    this.route.parent?.parent?.paramMap.subscribe(params => {
    this.chatbotId = params.get('projectid');
    console.log('Project ID:', this.chatbotId);  // Should now show "150"
    // this.get_index_status()
    });
    this.wsService.connect(`${environment.VerbaBaseUrl}ws/import_files`);
    // this._ragKnowledgeBaseService.indexStaus().pipe(takeUntil(this.onDestroy$)).subscribe(res=>{
    //   this.indexStatus = res
    // })

    }
  openIndexDetalis(){
    const dialogRef = this.dialog.open(IndexDetailsComponent, {
    width: '700px',
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      debugger
      console.log('Plain text submitted:', result);
      // Handle the plain text content here
    }
  });
  }

    get_index_status(){
   let body =  {
    "deployment": "Local",
    "key": "",
    "url": "http://weaviate:8080",
    "chatbotId": this.chatbotId,
    "projectId":"",
    "mode": "test"
    }
    this._ragKnowledgeBaseService.get_index_status(body).subscribe({
      next: (res: any) => {
         this._ragKnowledgeBaseService.indexStaus$.next(res.status)
        //  this.indexStatus = res.status
      },
      error: (err) => {
        console.error('API Error:', err);
        const errorMsg = err?.error?.message || 'Failed to create index. Please try again.';
        this._notify.openFailureSnackBar(errorMsg);
      }
    });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
    this.wsService.close();
  }
}
