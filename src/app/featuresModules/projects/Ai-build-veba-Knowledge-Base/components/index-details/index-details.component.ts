import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { NotifyService } from 'src/app/core/services/notify.service';
import { RagKnowledgeBaseService } from 'src/app/Services/rag-knowledge-base.service';
import { RagProjectContextService } from 'src/app/Services/rag-project-context.service';
import { WebSocketService } from 'src/app/Services/web-socket-service.service';

@Component({
  selector: 'vex-index-details',
  templateUrl: './index-details.component.html',
  styleUrls: ['./index-details.component.scss']
})
export class IndexDetailsComponent implements OnInit, OnDestroy {
  chatbotId: string;
  projectId: string;
  isIndexRunning: boolean;
  indexStatus: any;
  intervalId: any;
  upTodated: boolean;
  onDestroy$: Subject<void> = new Subject();

  constructor(
    private wsService: WebSocketService,
    private dialog: MatDialog,
    private _notify: NotifyService,
    private _ragKnowledgeBaseService: RagKnowledgeBaseService,
    private ragProjectContext: RagProjectContextService
  ) {}

  ngOnInit(): void {
    this.ragProjectContext.whenReady()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(({ chatbotId, projectId }) => {
        this.chatbotId = chatbotId;
        this.projectId = projectId;
        this.get_index_status();

        if (this.intervalId) {
          clearInterval(this.intervalId);
        }
        this.intervalId = setInterval(() => {
          this.get_index_status();
        }, 20000);
      });
  }

  CreateIndex() {
    const body = {
      chatbotId: this.chatbotId,
      projectId: this.projectId,
    };
    this._ragKnowledgeBaseService.createIndex(body).subscribe({
      next: (res: any) => {
        this._notify.openSuccessSnackBar('Index Starting');
        this.get_index_status();
      },
      error: (err) => {
        console.error('API Error:', err);
        const errorMsg = err?.error?.message || 'Failed to create index. Please try again.';
        this._notify.openFailureSnackBar(errorMsg);
      }
    });
  }

  cancelIndex() {
    const body = {
      chatbotId: this.chatbotId,
      projectId: this.projectId,
    };
    this._ragKnowledgeBaseService.cancelIndex(body).subscribe({
      next: (res: any) => {
        this._notify.openSuccessSnackBar('Index Canceled');
        this.get_index_status();
      },
      error: (err) => {
        console.error('API Error:', err);
        const errorMsg = err?.error?.message || 'Failed to Canceled index. Please try again.';
        this._notify.openFailureSnackBar(errorMsg);
      }
    });
  }

  get_index_status() {
    if (!this.chatbotId || !this.projectId) {
      return;
    }
    const body = {
      chatbotId: this.chatbotId,
      projectId: this.projectId,
    };
    this._ragKnowledgeBaseService.get_index_status(body).subscribe({
      next: (res: any) => {
        this.indexStatus = res;
        this.isIndexRunning = res.status === 'running';
        if (this.indexStatus.updated_at > this.indexStatus.lastDocUpdatedAt && this.indexStatus.status == 'succeeded') {
          this.upTodated = true;
        } else {
          this.upTodated = false;
        }
      },
      error: (err) => {
        console.error('API Error:', err);
        const errorMsg = err?.error?.message || 'Failed to Get index. Please try again.';
        this._notify.openFailureSnackBar(errorMsg);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
