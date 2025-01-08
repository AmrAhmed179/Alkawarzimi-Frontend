import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'vex-menu-edit',
  templateUrl: './menu-edit.component.html',
  styleUrls: ['./menu-edit.component.scss']
})
export class MenuEditComponent {

  form: FormGroup;
  node: any;

  constructor(
    private dialogRef: MatDialogRef<MenuEditComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    private fb: FormBuilder
  ) {
    this.node = data.node;

    this.form = this.fb.group({
      entityText: [this.node.nodeLangInfo[0].entityText, Validators.required],
      stemmedEntity: [this.node.nodeLangInfo[0].stemmedEntity],
      iconSrc: [this.node.iconSrc],
    });
  }

  save(): void {
    const updatedNode = {
      ...this.node,
      nodeLangInfo: [
        { ...this.node.nodeLangInfo[0], entityText: this.form.value.entityText },
      ],
      stemmedEntity: this.form.value.stemmedEntity,
      iconSrc: this.form.value.iconSrc,
    };

    this.dialogRef.close(updatedNode);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}