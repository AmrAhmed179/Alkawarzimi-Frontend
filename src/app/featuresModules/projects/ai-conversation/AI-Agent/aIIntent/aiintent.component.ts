import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Row, Workbook, Worksheet } from 'exceljs';
import { takeUntil, switchMap, of, finalize, Subject } from 'rxjs';
import { DataService } from 'src/app/core/services/data.service';
import { NotifyService } from 'src/app/core/services/notify.service';
import { AIIntentModel } from 'src/app/Models/Ai-Agent/toolInfo';
import { AiConversationService } from 'src/app/Services/ai-conversation.service';
import { ConfirmDialoDeleteComponent } from 'src/app/shared/components/confirm-dialo-delete/confirm-dialo-delete.component';
import { AiIntentDialogComponent } from './ai-intent-dialog/ai-intent-dialog.component';

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
  exporting = false;



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
          mode: [item?.mode ?? 'intent'],
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
// addNew() {
//   this.itemsFA.push(this.createItem({ _id: null, intent: '', response: '', ChatbotId: this.chatbotId } as any));
//   this.expandedIndex = this.itemsFA.length - 1;
// }
addNew() {
  const dialogRef = this.dialog.open(AiIntentDialogComponent, {
    width: '700px',
    data: { mode: 'intent', examples: [''] }
  });

  dialogRef.afterClosed().subscribe((result) => {
    if (!result){
      this.itemsFA.push(this.createItem({ _id: null, intent: '', response: '', ChatbotId: this.chatbotId, mode: '',
      examples: [] } as any))
    }else {
      const item: AIIntentModel = {
      _id: null,
      ChatbotId: this.chatbotId,
      intent: result.intent,     // from API
      response: '',
      mode: result.mode,
      examples: result.examples
    };

    this.itemsFA.push(this.createItem(item));
    }


    this.expandedIndex = this.itemsFA.length - 1;
  });
}

editExamples(index: number) {
  const g = this.itemsGroups[index];

  const dialogRef = this.dialog.open(AiIntentDialogComponent, {
    width: '700px',
    data: {
      mode: g.get('mode')?.value ?? 'intent',
      examples: g.get('examples')?.value ?? []
    }
  });

  dialogRef.afterClosed().subscribe((result) => {
    if (!result) return;

    g.get('mode')?.setValue(result.mode);
    g.get('examples')?.setValue(result.examples);
    g.get('intent')?.setValue(result.intent); // updated intent returned
    g.markAsDirty();
  });
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
    ChatbotId: this.chatbotId,
      mode: g.get('mode')?.value,
  examples: g.get('examples')?.value
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

  async exportExcel(): Promise<void> {
    const rows = this.itemsGroups
      .map(group => ({
        intent: String(group.get('intent')?.value || '').trim(),
        response: String(group.get('response')?.value || '').replace(/\r\n/g, '\n').trim()
      }))
      .filter(row => row.intent || row.response);

    if (!rows.length) {
      this.notify.openFailureSnackBar('No intents to export');
      return;
    }

    this.exporting = true;
    try {
      const workbook = this.buildIntentsWorkbook(rows);
      const buffer = await workbook.xlsx.writeBuffer();
      this.downloadWorkbook(buffer, this.exportFileName());
      this.notify.openSuccessSnackBar(`Exported ${rows.length} intents`);
    } catch {
      this.notify.openFailureSnackBar('Failed to export intents');
    } finally {
      this.exporting = false;
    }
  }

  private buildIntentsWorkbook(rows: { intent: string; response: string }[]): Workbook {
    const workbook = new Workbook();
    workbook.creator = 'Alkhawarizmi';
    workbook.created = new Date();
    workbook.title = 'AI Intents';

    const sheet = workbook.addWorksheet('Intents', {
      views: [{ state: 'frozen', ySplit: 1, activeCell: 'A2', showGridLines: false, zoomScale: 110 }],
      properties: { defaultRowHeight: 22, tabColor: { argb: 'FFDA6908' } },
      pageSetup: {
        orientation: 'landscape',
        fitToPage: true,
        fitToWidth: 1,
        fitToHeight: 0,
        paperSize: 9,
        horizontalCentered: true,
        printTitlesRow: '1:1',
        margins: { left: 0.5, right: 0.5, top: 0.6, bottom: 0.6, header: 0.3, footer: 0.3 }
      },
      headerFooter: {
        oddFooter: '&L&8 AI Intents&R&8 Page &P of &N',
        evenFooter: '&L&8 AI Intents&R&8 Page &P of &N'
      }
    });

    sheet.columns = [
      { header: 'Intent', key: 'intent', width: 42 },
      { header: 'Response', key: 'response', width: 92 }
    ];

    this.styleHeaderRow(sheet);

    rows.forEach((row, index) => {
      const excelRow = sheet.addRow({ intent: row.intent, response: row.response });
      excelRow.height = this.responseRowHeight(row.response);
      this.styleDataRow(excelRow, index);
    });

    const lastRow = rows.length + 1;
    sheet.autoFilter = `A1:B${lastRow}`;
    sheet.pageSetup.printArea = `A1:B${lastRow}`;
    sheet.views = [{ state: 'frozen', ySplit: 1, activeCell: 'A2', showGridLines: false, zoomScale: 110 }];

    return workbook;
  }

  private styleHeaderRow(sheet: Worksheet): void {
    const header = sheet.getRow(1);
    header.height = 30;
    header.eachCell(cell => {
      cell.font = { name: 'Calibri', bold: true, size: 13, color: { argb: 'FFFFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDA6908' } };
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFDA6908' } },
        left: { style: 'thin', color: { argb: 'FFDA6908' } },
        right: { style: 'thin', color: { argb: 'FFDA6908' } },
        bottom: { style: 'medium', color: { argb: 'FFF59A4B' } }
      };
    });
  }

  private styleDataRow(excelRow: Row, index: number): void {
    const fill = index % 2 === 0 ? 'FFFFFFFF' : 'FFFFF7F0';
    const grid = { style: 'thin' as const, color: { argb: 'FFE5E7EB' } };

    [1, 2].forEach(col => {
      const cell = excelRow.getCell(col);
      const isResponse = col === 2;
      cell.font = { name: 'Calibri', size: 11, color: { argb: 'FF1F2937' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: fill } };
      cell.alignment = {
        vertical: 'top',
        horizontal: isResponse ? 'right' : 'left',
        wrapText: true,
        readingOrder: isResponse ? 'rtl' : 'ltr'
      };
      cell.border = { top: grid, left: grid, bottom: grid, right: grid };
    });
  }

  private responseRowHeight(text: string): number {
    const visualLines = (text || '').split('\n').reduce((sum, line) => {
      return sum + Math.max(1, Math.ceil(line.length / 48));
    }, 0);
    return Math.min(409, Math.max(24, visualLines * 16 + 10));
  }

  private exportFileName(): string {
    const id = (this.chatbotId || 'chatbot').replace(/[^\w.-]+/g, '_');
    const date = new Date().toISOString().slice(0, 10);
    return `ai-intents-${id}-${date}.xlsx`;
  }

  private downloadWorkbook(buffer: ArrayBuffer, fileName: string): void {
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }
}
