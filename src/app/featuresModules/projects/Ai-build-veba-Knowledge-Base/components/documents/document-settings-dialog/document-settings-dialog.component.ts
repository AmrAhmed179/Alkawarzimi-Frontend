import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'vex-document-settings-dialog',
  templateUrl: './document-settings-dialog.component.html',
  styleUrls: ['./document-settings-dialog.component.scss']
})
export class DocumentSettingsDialogComponent   {

    settingsForm: FormGroup;

  constructor( private fb: FormBuilder,
    private dialogRef: MatDialogRef<DocumentSettingsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.settingsForm = this.fb.group({
      _id: [data._id],
      chatbotId: [data.chatbotId, Validators.required],
      doc_uuid: [data.doc_uuid],
      title: [data.title, Validators.required],
      type: [data.type, Validators.required],
      chunked: [data.chunked],

      reader: this.fb.group({
        name: [data.reader?.name || '', Validators.required]
      }),

      chunker: this.fb.group({
        name: [data.chunker?.name || '', Validators.required],
        tokens: [data.chunker?.tokens || 0, [Validators.required, Validators.min(1)]],
        overlap: [data.chunker?.overlap || 0, [Validators.required, Validators.min(0)]]
      })
    });
    }


  save() {
    if (this.settingsForm.valid) {
      this.dialogRef.close(this.settingsForm.value);
    }
  }

  close() {
    this.dialogRef.close();
  }
}
