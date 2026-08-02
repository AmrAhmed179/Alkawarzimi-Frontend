import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { SassProjects } from 'src/app/core/models/filterAnaylic';
import { RagKnowledgeBaseService } from './rag-knowledge-base.service';

export type RagSelectionState = 'idle' | 'loading' | 'needsSelection' | 'ready';

@Injectable({
  providedIn: 'root'
})
export class RagProjectContextService {
  private readonly storageKeyPrefix = 'ragProjectId:';

  readonly chatbotId$ = new BehaviorSubject<string | null>(null);
  readonly ragProjectId$ = new BehaviorSubject<string | null>(null);
  readonly projects$ = new BehaviorSubject<SassProjects[]>([]);
  readonly selectionState$ = new BehaviorSubject<RagSelectionState>('idle');

  constructor(private ragKnowledgeBaseService: RagKnowledgeBaseService) {}

  resolve(chatbotId: string): void {
    if (!chatbotId) {
      return;
    }

    this.chatbotId$.next(chatbotId);
    this.ragProjectId$.next(null);
    this.selectionState$.next('loading');

    const storedProjectId = sessionStorage.getItem(this.storageKeyPrefix + chatbotId);

    this.ragKnowledgeBaseService.getChatBotProjects(chatbotId).subscribe({
      next: (res) => {
        const projects: SassProjects[] = res?.projects ?? [];
        this.projects$.next(projects);

        if (!projects.length) {
          this.setProjectId(chatbotId, chatbotId);
          return;
        }

        if (projects.length === 1) {
          this.setProjectId(chatbotId, projects[0]._id);
          return;
        }

        if (storedProjectId && projects.some(p => p._id === storedProjectId)) {
          this.setProjectId(chatbotId, storedProjectId);
          return;
        }

        this.ragProjectId$.next(null);
        this.selectionState$.next('needsSelection');
      },
      error: () => {
        this.projects$.next([]);
        this.setProjectId(chatbotId, chatbotId);
      }
    });
  }

  selectProject(projectId: string): void {
    const chatbotId = this.chatbotId$.value;
    if (!chatbotId || !projectId) {
      return;
    }
    this.setProjectId(chatbotId, projectId);
  }

  changeProject(): void {
    if (this.projects$.value.length > 1) {
      const chatbotId = this.chatbotId$.value;
      if (chatbotId) {
        sessionStorage.removeItem(this.storageKeyPrefix + chatbotId);
      }
      this.ragProjectId$.next(null);
      this.selectionState$.next('needsSelection');
    }
  }

  clear(): void {
    this.chatbotId$.next(null);
    this.ragProjectId$.next(null);
    this.projects$.next([]);
    this.selectionState$.next('idle');
  }

  whenReady(): Observable<{ chatbotId: string; projectId: string }> {
    return combineLatest([this.selectionState$, this.chatbotId$, this.ragProjectId$]).pipe(
      filter(([state, chatbotId, projectId]) =>
        state === 'ready' && !!chatbotId && !!projectId
      ),
      map(([, chatbotId, projectId]) => ({
        chatbotId: chatbotId as string,
        projectId: projectId as string
      })),
      distinctUntilChanged((a, b) =>
        a.chatbotId === b.chatbotId && a.projectId === b.projectId
      )
    );
  }

  private setProjectId(chatbotId: string, projectId: string): void {
    this.ragProjectId$.next(projectId);
    sessionStorage.setItem(this.storageKeyPrefix + chatbotId, projectId);
    this.selectionState$.next('ready');
  }
}
