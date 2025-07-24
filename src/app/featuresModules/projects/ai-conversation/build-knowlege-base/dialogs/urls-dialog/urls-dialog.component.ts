import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PlainTextDialogComponent } from '../plain-text-dialog/plain-text-dialog.component';

@Component({
  selector: 'vex-urls-dialog',
  templateUrl: './urls-dialog.component.html',
  styleUrls: ['./urls-dialog.component.scss']
})
export class UrlsDialogComponent implements OnInit {

  ngOnInit(): void {
  }

   plainTextForm: FormGroup;

    constructor(
      private fb: FormBuilder,
      public dialogRef: MatDialogRef<UrlsDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      this.plainTextForm = this.fb.group({
        content: ['', [Validators.required]]
      });
    }

    submit() {
      if (this.plainTextForm.valid) {
        this.dialogRef.close(this.plainTextForm.value);
      }
    }

}
