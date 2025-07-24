import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UploadDialogComponent } from '../dialogs/upload-dialog/upload-dialog.component';
import { PlainTextDialogComponent } from '../dialogs/plain-text-dialog/plain-text-dialog.component';
import { UrlsDialogComponent } from '../dialogs/urls-dialog/urls-dialog.component';
import { MatTableDataSource } from '@angular/material/table';

interface Content {
  type: string;
  refreshRate?: string;
  lastUpdate: string;
  name: string;
  url?: string;
}
@Component({
  selector: 'vex-knowledge-base',
  templateUrl: './knowledge-base.component.html',
  styleUrls: ['./knowledge-base.component.scss']
})
export class KnowledgeBaseBuildComponent implements OnInit {

  contents: Content[] = [];
  constructor(private dialog: MatDialog) {
  }


  ngOnInit(): void {
  }

  openUploadDialog() {
    const dialogRef = this.dialog.open(UploadDialogComponent, {
      width: '400px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('File uploaded:', result);
        // handle upload result
      }
    });
  }
  openPlainTextDialog() {
  const dialogRef = this.dialog.open(PlainTextDialogComponent, {
    width: '700px',
    disableClose: true
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      console.log('Plain text submitted:', result);
      // Handle the plain text content here
    }
  });
  }
   openUrlsDialog() {
  const dialogRef = this.dialog.open(UrlsDialogComponent, {
    width: '700px',
    disableClose: true
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      console.log('Plain text submitted:', result);
      // Handle the plain text content here
    }
  });
  }
}
