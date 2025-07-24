import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'vex-plain-text-dialog',
  templateUrl: './plain-text-dialog.component.html',
  styleUrls: ['./plain-text-dialog.component.scss']
})
export class PlainTextDialogComponent implements OnInit {


  ngOnInit(): void {
  }
  plainTextForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PlainTextDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.plainTextForm = this.fb.group({
      name: ['', Validators.required],
      content: ['', [Validators.required, Validators.maxLength(32768)]]
    });
  }

  submit() {
    if (this.plainTextForm.valid) {
      this.dialogRef.close(this.plainTextForm.value);
    }
  }

}
