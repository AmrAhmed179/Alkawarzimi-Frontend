import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil, switchMap, of, finalize, Subject } from 'rxjs';
import { DataService } from 'src/app/core/services/data.service';
import { NotifyService } from 'src/app/core/services/notify.service';
import { AIIntentModel } from 'src/app/Models/Ai-Agent/toolInfo';
import { AiConversationService } from 'src/app/Services/ai-conversation.service';
import { ConfirmDialoDeleteComponent } from 'src/app/shared/components/confirm-dialo-delete/confirm-dialo-delete.component';
import { AiIntentDialogComponent, AIIntentDialogResult } from './ai-intent-dialog/ai-intent-dialog.component';

@Component({
  selector: 'vex-aiintent',
  templateUrl: './aiintent.component.html',
  styleUrls: ['./aiintent.component.scss']
})
export class AIIntentComponent implements OnInit {

    form: FormGroup;

  filterText = '';
  expandedIndex: number | null = null;

  chatbotId = '';
  loading = false;

  savingIndex: number | null = null;
  deletingIndex: number | null = null;



  private onDestroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private _aiService: AiConversationService,
    private _dataService: DataService,
    private notify: NotifyService,
    private dialog: MatDialog,

  ) {
    this.form = this.fb.group({
      items: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this._dataService.$project_bs
      .pipe(
        takeUntil(this.onDestroy$),
        switchMap((project: any) => {
          if (!project?._id) return of(null);
          this.chatbotId = project._id;
          return this.load();
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  // ---------- Form helpers ----------
  get itemsFA(): FormArray {
    return this.form.get('items') as FormArray;
  }

  get itemsGroups(): FormGroup[] {
    return this.itemsFA.controls as FormGroup[];
  }

  private createItem(item?: AIIntentModel): FormGroup {
    return this.fb.group({
      _id: [item?._id ?? null],
      ChatbotId: [item?.ChatbotId ?? this.chatbotId, [Validators.required]],
      intent: [item?.intent ?? '', [Validators.required, Validators.maxLength(120)]],
      response: [item?.response ?? '', [Validators.required]],
      mode: [item?.mode ?? 'intent', [Validators.required]],
      examples: [item?.examples ?? []]
    });
  }

  private setItems(items: AIIntentModel[]) {
    this.itemsFA.clear();
    items.forEach(x => this.itemsFA.push(this.createItem(x)));
    this.expandedIndex = null;
  }

  load() {
    if (!this.chatbotId) return of(null);

    this.loading = true;
    return this._aiService.GetAIIntents(this.chatbotId).pipe(
      finalize(() => (this.loading = false))
    ).pipe(
      switchMap((items: any) => {
        this.setItems(items as AIIntentModel[]);
        return of(true);
      })
    );
  }

  // ---------- Actions ----------
addNew() {
  this.itemsFA.push(this.createItem({ _id: null, intent: '', response: '', ChatbotId: this.chatbotId } as any));
  this.expandedIndex = this.itemsFA.length - 1;
}


  toggle(i: number) {
  this.expandedIndex = (this.expandedIndex === i) ? null : i;
}

markPristine(i: number) {
  const g = this.itemsGroups[i];
  g.markAsPristine();
}
private buildId(intent: string, chatbotId: string): string {
  return `${(intent || '').trim()}_${chatbotId}`;
}
saveOne(index: number) {
  const g = this.itemsGroups[index];
  if (g.invalid) {
    g.markAllAsTouched();
    return;
  }

  const intent = (g.get('intent')?.value || '').trim();
  const response = g.get('response')?.value || '';
  const newId = this.buildId(intent, this.chatbotId);

  const oldId = (g.get('_id')?.value as string | null) || null;

  const payload: AIIntentModel = {
    _id: newId,              // force correct id
    intent: intent,
    response: response,
    ChatbotId: this.chatbotId
  };

  this.savingIndex = index;

  // If user changed "intent" => id changed => delete old doc first
  const deleteOld$ =
    oldId && oldId !== newId
      ? this._aiService.DeleteAIIntent(oldId)
      : of(null);

  deleteOld$
    .pipe(
      switchMap(() => this._aiService.UpsertAIIntent(payload)),
      finalize(() => (this.savingIndex = null))
    )
    .subscribe({
      next: () => {
        // ✅ update UI without reloading
        g.get('_id')?.setValue(newId);
        g.get('ChatbotId')?.setValue(this.chatbotId);

        // mark saved (no unsaved badge)
        g.markAsPristine();
        g.markAsUntouched();
      },
      error: (_err) => {
        // TODO: notify error
      }
    });
}
  get filteredCount(): number {
    return this.itemsGroups.filter(g => this.matchesFilter(g)).length;
  }

  deleteOne(index: number) {
const dialogRef = this.dialog.open(ConfirmDialoDeleteComponent, {
    width: '300px',
    data: { message: 'Do you want to delete this item?' }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (!result) return;
        const g = this.itemsGroups[index];
    const id = g.get('_id')?.value as string | null;

    // if not saved yet, just remove locally
    if (!id) {
      this.itemsFA.removeAt(index);
      this.fixExpandedIndex(index);
      return;
    }

    this.deletingIndex = index;

    this.deletingIndex = index;

    this._aiService.DeleteAIIntent(id)
      .pipe(finalize(() => (this.deletingIndex = null)))
      .subscribe({
        next: () => {
          this.itemsFA.removeAt(index);
          this.fixExpandedIndex(index);
          this.notify.openSuccessSnackBar('Intent deleted successfully');
        },
        error: () => {
          this.notify.openFailureSnackBar('Failed to delete intent');
        }
      });
  });
  }

  private fixExpandedIndex(removedIndex: number) {
    if (this.expandedIndex === removedIndex) this.expandedIndex = null;
    if (this.expandedIndex != null && this.expandedIndex > removedIndex) this.expandedIndex--;
  }

  // ---------- UI helpers ----------
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

  trackByIndex(i: number) {
    return i;
  }
}
