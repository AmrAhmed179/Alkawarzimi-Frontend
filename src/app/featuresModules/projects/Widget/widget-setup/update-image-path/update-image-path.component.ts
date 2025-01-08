import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'vex-update-image-path',
  templateUrl: './update-image-path.component.html',
  styleUrls: ['./update-image-path.component.scss']
})
export class UpdateImagePathComponent implements OnInit {
  path: string;
  constructor(private dialogRef: MatDialogRef<UpdateImagePathComponent>) {}

  ngOnInit() {}

  save() {
    this.dialogRef.close(this.path);
  }

}
