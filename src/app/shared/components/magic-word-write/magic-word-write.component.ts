import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'vex-magic-word-write',
  templateUrl: './magic-word-write.component.html',
  styleUrls: ['./magic-word-write.component.scss']
})
export class MagicWordWriteComponent implements OnInit {

  magicWordForm: FormGroup

  constructor(private fb: FormBuilder,
    @Inject(DIALOG_DATA) public data: { QuestionTitle: string, pleasWriteMagic: string, actionName: string, item: any }, public dialogRef: MatDialogRef<MagicWordWriteComponent>
  ) { }

  ngOnInit(): void {
    this.magicWordForm = this.fb.group({
      magicword: ['', [Validators.required, this.equalValueValidator(this.data.actionName)]]
    })
  }

  equalValueValidator(expectedValue: string) {
    return (control) => {
      const value = control.value;
      return value.toLowerCase() === expectedValue.toLowerCase() ? null : { notEqual: true };
    };
  }

  checkValue() {
    if (this.magicWordForm.controls['magicword'].value.toLowerCase() == this.data.actionName.toLowerCase()) {
      this.dialogRef.close('success')
    }
  }
}