import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'vex-confirm-dialo-delete',
  templateUrl: './confirm-dialo-delete.component.html',
  styleUrls: ['./confirm-dialo-delete.component.scss']
})
export class ConfirmDialoDeleteComponent {

    constructor(
    public dialogRef: MatDialogRef<ConfirmDialoDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }

}
