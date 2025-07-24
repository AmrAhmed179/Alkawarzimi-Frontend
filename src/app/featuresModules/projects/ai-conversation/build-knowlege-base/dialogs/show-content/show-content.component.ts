import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'vex-show-content',
  templateUrl: './show-content.component.html',
  styleUrls: ['./show-content.component.scss']
})
export class ShowContentComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ShowContentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  close(): void {
    this.dialogRef.close();
  }
  update(): void {
    // You can add logic to update the item here
    this.dialogRef.close();
  }
  ngOnInit(): void {

  }

}
