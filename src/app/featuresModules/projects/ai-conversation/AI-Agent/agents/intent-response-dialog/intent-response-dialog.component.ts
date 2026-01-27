import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { IntentResponse } from 'src/app/Models/Ai-Agent/toolInfo';

@Component({
  selector: 'vex-intent-response-dialog',
  templateUrl: './intent-response-dialog.component.html',
  styleUrls: ['./intent-response-dialog.component.scss']
})
export class IntentResponseDialogComponent {
  form: FormGroup;

  // UI helpers
  filterText = '';
  expandedIndex: number | null = null;

  constructor(
    private fb: FormBuilder,
    private ref: MatDialogRef<IntentResponseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    const incoming: IntentResponse[] =
      (data?.intentResponse || data?.items || []) as IntentResponse[];

    this.form = this.fb.group({
      items: this.fb.array(incoming.map(x => this.createItem(x)))
    });
  }

  get itemsFA(): FormArray {
    return this.form.get('items') as FormArray;
  }

  get itemsGroups(): FormGroup[] {
    return this.itemsFA.controls as FormGroup[];
  }

  private createItem(item?: IntentResponse): FormGroup {
    return this.fb.group({
      intent: [item?.intent ?? '', [Validators.required, Validators.maxLength(120)]],
      response: [item?.response ?? '', [Validators.required]]
    });
  }

  addNew() {
    this.itemsFA.push(this.createItem({ intent: '', response: '' }));
    this.expandedIndex = this.itemsFA.length - 1;
  }

  remove(index: number) {
    this.itemsFA.removeAt(index);

    if (this.expandedIndex === index) this.expandedIndex = null;
    if (this.expandedIndex != null && this.expandedIndex > index) this.expandedIndex--;
  }

  saveAll() {
    debugger
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const result = (this.itemsFA.value as IntentResponse[]).map(x => ({
      intent: (x.intent || '').trim(),
      response: x.response || ''
    }));

    this.ref.close(result);
  }

  close() {
    this.ref.close(null);
  }

  // ----- UI -----
  preview(text: string, max = 140): string {
    const t = (text || '').replace(/\s+/g, ' ').trim();
    return t.length > max ? t.slice(0, max) + '…' : t;
  }

  matchesFilter(group: FormGroup): boolean {
    const f = (this.filterText || '').trim().toLowerCase();
    if (!f) return true;

    const intent = (group.get('intent')?.value || '').toLowerCase();
    const response = (group.get('response')?.value || '').toLowerCase();
    return intent.includes(f) || response.includes(f);
  }

  // if you want stable trackBy
  trackByIndex(i: number) {
    return i;
  }
}
