import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AIIntentModel } from 'src/app/Models/Ai-Agent/toolInfo';

export interface AIIntentDialogData {
  chatbotId: string;
  item?: AIIntentModel | null;
}

export interface AIIntentDialogResult {
  _id?: string | null;
  ChatbotId: string;
  mode: 'intent' | 'topic';
  intentOrTopic: string;
  response: string;
  examples: string[];
}

@Component({
  selector: 'vex-ai-intent-dialog',
  templateUrl: './ai-intent-dialog.component.html',
  styleUrls: ['./ai-intent-dialog.component.scss']
})
export class AiIntentDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AiIntentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AIIntentDialogData
  ) {
    const item = data.item;

    this.form = this.fb.group({
      _id: [item?._id ?? null],
      ChatbotId: [data.chatbotId, [Validators.required]],

      // ✅ mode is string: intent | topic
      mode: [item?.mode ?? 'intent', [Validators.required]],

      // ✅ input text: if mode=intent => intent name, if mode=topic => topic text
      intentOrTopic: [item?.intent ?? '', [Validators.required, Validators.maxLength(120)]],

      response: [item?.response ?? '', [Validators.required]],

      // ✅ examples array
      examples: this.fb.array((item?.examples ?? []).map(x => this.fb.control(x, [Validators.required])))
    });
  }

  get examplesFA(): FormArray {
    return this.form.get('examples') as FormArray;
  }

  addExample() {
    this.examplesFA.push(this.fb.control('', [Validators.required]));
  }

  removeExample(i: number) {
    this.examplesFA.removeAt(i);
  }

  cancel() {
    this.dialogRef.close(null);
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.value;

    const result: AIIntentDialogResult = {
      _id: v._id,
      ChatbotId: v.ChatbotId,
      mode: v.mode,
      intentOrTopic: (v.intentOrTopic || '').trim(),
      response: v.response,
      examples: (v.examples || []).map((x: string) => (x || '').trim()).filter(Boolean)
    };

    this.dialogRef.close(result);
  }
}
