import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'vex-upload-dialog',
  templateUrl: './upload-dialog.component.html',
  styleUrls: ['./upload-dialog.component.scss']
})
export class UploadDialogComponent implements OnInit {
  selectedFiles: File[] | null = null;
  onlyTextFiles = false;

  ngOnInit(): void {
  }

  constructor(
    private dialogRef: MatDialogRef<UploadDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: { onlyTextFiles?: boolean } | null
  ) {
    this.onlyTextFiles = data?.onlyTextFiles ?? false;
  }

  get acceptedFileTypes(): string {
    return this.onlyTextFiles ? '.txt' : '.pdf,.docx,.md, .txt';
  }

  private filterFiles(files: File[]): File[] {
    if (!this.onlyTextFiles) {
      return files;
    }
    return files.filter(file => file.name.toLowerCase().endsWith('.txt'));
  }

  onFileSelected(event: any) {
    this.selectedFiles = this.filterFiles(Array.from(event.target.files));
    if (this.selectedFiles.length === 0) {
      this.selectedFiles = null;
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer?.files.length) {
      const files = this.filterFiles(Array.from(event.dataTransfer.files));
      this.selectedFiles = files.length > 0 ? files : null;
    }
  }

  selectFiles() {
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
    if (file.name.toLowerCase().endsWith('.txt')) return 'mat:article';
    return 'mat:insert_drive_file';
  }

  getTotalSize(): number {
    if (!this.selectedFiles) return 0;
    return this.selectedFiles.reduce((total, file) => total + file.size, 0);
  }
}
