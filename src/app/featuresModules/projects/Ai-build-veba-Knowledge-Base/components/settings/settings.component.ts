import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'vex-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  question: string = '';
  messages: { text: string; type: 'user' | 'bot' }[] = [];
  projectId:string
  @ViewChild('chatBox') chatBox!: ElementRef;

  constructor(private http: HttpClient, private route: ActivatedRoute) {}
  ngOnInit(): void {
        this.route.parent?.parent?.paramMap.subscribe(params => {
    this.projectId = params.get('projectid');
    console.log('Project ID:', this.projectId);  // Should now show "150"
    });
  }

  askQuestion() {
    const q = this.question.trim();
    if (!q) return;

    // Push user message
    this.messages.push({ text: q, type: 'user' });

    const payload = {
      mode: 'test',
      modelName: 'gpt',
      embeddingType: 'no_embeddingType',
      chatbotId: this.projectId,
      query: q
    };

    this.question = '';

    this.http.post<any>('https://alkhwarizmi.online/webhook/Verba/Ask', payload).subscribe({
      next: (res) => {
        const reply =
          res?.response?.state === 'known'
            ? res.response.response
            : 'غير معروف'; // "unknown" in Arabic
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

}
