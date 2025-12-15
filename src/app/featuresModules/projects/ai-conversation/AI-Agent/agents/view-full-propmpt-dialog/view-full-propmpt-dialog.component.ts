import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'vex-view-full-propmpt-dialog',
  templateUrl: './view-full-propmpt-dialog.component.html',
  styleUrls: ['./view-full-propmpt-dialog.component.scss']
})
export class ViewFullPropmptDialogComponent implements OnInit {
 isHovering:boolean = false
  constructor(@Inject(MAT_DIALOG_DATA) public data: { prompt: string},private dialogRef: MatDialogRef<ViewFullPropmptDialogComponent>,) { }

  ngOnInit(): void {
  }
cancel() {
    this.dialogRef.close();
  }
}
