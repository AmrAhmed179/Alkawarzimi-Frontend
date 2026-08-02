import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { SassProjects } from 'src/app/core/models/filterAnaylic';
import { NotifyService } from 'src/app/core/services/notify.service';
import { RagKnowledgeBaseService } from 'src/app/Services/rag-knowledge-base.service';
import { RagProjectContextService, RagSelectionState } from 'src/app/Services/rag-project-context.service';
import { WebSocketService } from 'src/app/Services/web-socket-service.service';
import { IndexDetailsComponent } from '../components/index-details/index-details.component';

@Component({
  selector: 'vex-parent-knowledge-base',
  templateUrl: './parent-knowledge-base.component.html',
  styleUrls: ['./parent-knowledge-base.component.scss']
})
export class ParentKnowledgeBaseComponent implements OnInit, OnDestroy {
  chatbotId: string;
  indexStatus: string;
  selectionState: RagSelectionState = 'idle';
  projects: SassProjects[] = [];
  selectedProjectName = '';
  onDestroy$: Subject<void> = new Subject();

  constructor(
    private wsService: WebSocketService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private _notify: NotifyService,
    private _ragKnowledgeBaseService: RagKnowledgeBaseService,
    private ragProjectContext: RagProjectContextService
  ) {}

  ngOnInit(): void {
    this.ragProjectContext.selectionState$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(state => {
        this.selectionState = state;
      });

    this.ragProjectContext.projects$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(projects => {
        this.projects = projects;
        this.updateSelectedProjectName();
      });

    this.ragProjectContext.ragProjectId$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => this.updateSelectedProjectName());

    this.route.parent?.parent?.paramMap
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(params => {
        this.chatbotId = params.get('projectid');
        if (this.chatbotId) {
          this.ragProjectContext.resolve(this.chatbotId);
        }
      });
  }

  selectProject(project: SassProjects): void {
    this.ragProjectContext.selectProject(project._id);
  }

  changeProject(): void {
    this.ragProjectContext.changeProject();
  }

  getProjectName(project: SassProjects): string {
    return project?.brandInfo?.name || project?._id || 'Untitled project';
  }

  getProjectDescription(project: SassProjects): string {
    return project?.brandInfo?.description || '';
  }

  getProjectImage(project: SassProjects): string {
    return project?.brandInfo?.image || '';
  }

  openIndexDetalis() {
    const dialogRef = this.dialog.open(IndexDetailsComponent, {
      width: '700px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Plain text submitted:', result);
      }
    });
  }

  get_index_status() {
    const projectId = this.ragProjectContext.ragProjectId$.value || this.chatbotId;
    const body = {
      deployment: 'Local',
      key: '',
      url: 'http://weaviate:8080',
      chatbotId: this.chatbotId,
      projectId,
      mode: 'test'
    };
    this._ragKnowledgeBaseService.get_index_status(body).subscribe({
      next: (res: any) => {
        this._ragKnowledgeBaseService.indexStaus$.next(res.status);
      },
      error: (err) => {
        console.error('API Error:', err);
        const errorMsg = err?.error?.message || 'Failed to create index. Please try again.';
        this._notify.openFailureSnackBar(errorMsg);
      }
    });
  }

  private updateSelectedProjectName(): void {
    const projectId = this.ragProjectContext.ragProjectId$.value;
    const selected = this.projects.find(p => p._id === projectId);
    this.selectedProjectName = selected ? this.getProjectName(selected) : '';
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
    this.ragProjectContext.clear();
    this.wsService.close();
  }
}
