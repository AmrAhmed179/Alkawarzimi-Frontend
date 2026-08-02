import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { RagKnowledgeBaseService } from 'src/app/Services/rag-knowledge-base.service';
import { RagProjectContextService } from 'src/app/Services/rag-project-context.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'vex-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {

  question: string = '';
  messages: { text: string; type: 'user' | 'bot' }[] = [];
  chatbotId: string;
  projectId: string;
  onDestroy$: Subject<void> = new Subject();
  @ViewChild('chatBox') chatBox!: ElementRef;

  constructor(
    private http: HttpClient,
    private ragKnowledgeBaseService: RagKnowledgeBaseService,
    private ragProjectContext: RagProjectContextService
  ) {}

  ngOnInit(): void {
    this.ragProjectContext.whenReady()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(({ chatbotId, projectId }) => {
        this.chatbotId = chatbotId;
        this.projectId = projectId;
      });
  }

  askQuestion() {
    const q = this.question.trim();
    if (!q) return;

    // Push user message
    this.messages.push({ text: q, type: 'user' });

    const payload = {
      chatbotId: this.chatbotId,
      projectId: this.projectId,
      query: q
    };

    this.question = '';
    debugger
    const dd = environment.URLS.RagAsk
    this.http.post<any>(`${this.ragKnowledgeBaseService.ragUrl}ask`, payload).subscribe({
      next: (res) => {
        const reply =
          res?.response?.state === 'known'
            ? res.response.response
            : 'غير معروف'; // "unknown" in Arabicc
        this.messages.push({ text: reply, type: 'bot' });
        setTimeout(() => this.scrollToBottom(), 100);
      },
      error: (err) => {
        this.messages.push({ text: 'حدث خطأ في الاتصال بالخادم.', type: 'bot' });
        setTimeout(() => this.scrollToBottom(), 100);
      }
    });
  }

  scrollToBottom() {
    try {
      this.chatBox.nativeElement.scrollTop = this.chatBox.nativeElement.scrollHeight;
    } catch (err) {}
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

}
