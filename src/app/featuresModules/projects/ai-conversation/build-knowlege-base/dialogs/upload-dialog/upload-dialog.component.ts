import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'vex-upload-dialog',
  templateUrl: './upload-dialog.component.html',
  styleUrls: ['./upload-dialog.component.scss']
})
export class UploadDialogComponent implements OnInit {
  selectedFiles: File[] | null = null;

  ngOnInit(): void {
  }

  constructor(private dialogRef: MatDialogRef<UploadDialogComponent>) {}

  onFileSelected(event: any) {
    this.selectedFiles = Array.from(event.target.files);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer?.files.length) {
      this.selectedFiles = Array.from(event.dataTransfer.files);
    }
  }

  upload() {
    if (this.selectedFiles && this.selectedFiles.length > 0) {
      console.log('Uploading:', this.selectedFiles);
      this.dialogRef.close(this.selectedFiles);
    }
  }

  removeFile(index: number) {
    if (this.selectedFiles) {
      this.selectedFiles.splice(index, 1);
      if (this.selectedFiles.length === 0) {
        this.selectedFiles = null;
      }
    }
  }

  getFileIcon(file: File): string {
    if (file.name.endsWith('.pdf')) return 'mat:picture_as_pdf';
    if (file.name.endsWith('.docx')) return 'mat:description';
    return 'mat:insert_drive_file';
  }

  getTotalSize(): number {
    if (!this.selectedFiles) return 0;
    return this.selectedFiles.reduce((total, file) => total + file.size, 0);
  }
}
