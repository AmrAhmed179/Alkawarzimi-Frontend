import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'vex-delete-theme',
  templateUrl: './delete-theme.component.html',
  styleUrls: ['./delete-theme.component.scss']
})
export class DeleteThemeComponent implements OnInit {
  constructor(private dialogRef: MatDialogRef<DeleteThemeComponent>) {}
  ngOnInit() {}
  confirm(): void {
    this.dialogRef.close(true);
  }
  cancel(): void {
    this.dialogRef.close(false);
  }
}
