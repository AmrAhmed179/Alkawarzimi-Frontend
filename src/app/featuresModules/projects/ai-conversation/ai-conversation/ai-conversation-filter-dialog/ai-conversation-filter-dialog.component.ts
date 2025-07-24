import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface FilterData {
  userId: string;
  startDate: Date;
  endDate: Date;
}
@Component({
  selector: 'vex-ai-conversation-filter-dialog',
  templateUrl: './ai-conversation-filter-dialog.component.html',
  styleUrls: ['./ai-conversation-filter-dialog.component.scss']
})

export class AiConversationFilterDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AiConversationFilterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FilterData
  ) {}

onClose(): void {
  // Adjust dates to start and end of day
  if (this.data.startDate) {
    this.data.startDate = this.startOfDay(this.data.startDate);
  }
  if (this.data.endDate) {
    this.data.endDate = this.endOfDay(this.data.endDate);
  }

  this.dialogRef.close(this.data);
}

  // Helper methods to adjust dates
  private startOfDay(date: Date): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  private endOfDay(date: Date): Date {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
  }
}
