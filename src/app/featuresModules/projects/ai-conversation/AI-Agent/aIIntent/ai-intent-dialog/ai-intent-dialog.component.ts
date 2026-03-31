import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { finalize } from 'rxjs';
import { NotifyService } from 'src/app/core/services/notify.service';
import { AiConversationService } from 'src/app/Services/ai-conversation.service';

export interface AiIntentDialogData {
  mode?: string;          // 'intent' | 'topic'
  examples?: string[];
}

export interface AiIntentDialogResult {
  mode: string;
  examples: string[];
  intent: string;         // returned from API
}

@Component({
  selector: 'app-ai-intent-dialog',
  templateUrl: './ai-intent-dialog.component.html',
})
export class AiIntentDialogComponent {
  form: FormGroup;
  saving = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AiIntentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AiIntentDialogData,
    private aiService: AiConversationService,
    private notify: NotifyService,
  ) {
    this.form = this.fb.group({
      mode: [data?.mode ?? 'intent', [Validators.required]],
      examples: this.fb.array([])
    });

    const initial = (data?.examples?.length ? data.examples : ['']);
    initial.forEach(x =>
      this.examplesFA.push(this.fb.control(x, [Validators.required, Validators.maxLength(300)]))
    );
  }

  get examplesFA(): FormArray {
    return this.form.get('examples') as FormArray;
  }

  addExample() {
    this.examplesFA.push(this.fb.control('', [Validators.required, Validators.maxLength(300)]));
  }

  removeExample(i: number) {
    if (this.examplesFA.length === 1) return;
    this.examplesFA.removeAt(i);
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const mode = this.form.value.mode as string;
    const examples = (this.form.value.examples as string[])
      .map(x => (x || '').trim())
      .filter(Boolean);

    if (!examples.length) {
      this.examplesFA.at(0).setErrors({ required: true });
      return;
    }

    this.saving = true;

    this.aiService.detectIntent({ mode, examples })
      .pipe(finalize(() => (this.saving = false)))
      .subscribe({
        next: (res: any) => {
          const intent = typeof res === 'string' ? res : res?.intent;

          const result: AiIntentDialogResult = {
            mode,
            examples,
            intent: (intent || '').trim()
          };
          this.notify.openSuccessSnackBar('Intent generated successfully');
          this.dialogRef.close(result);
        },
        error: () => {
          this.notify.openFailureSnackBar('Failed to generate intent');
          this.dialogRef.close(null);
        }
      });
  }

  close() {
    this.dialogRef.close(null);
  }
}
