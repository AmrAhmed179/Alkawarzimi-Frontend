import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'vex-confirmation-for-agent-templte-search',
  templateUrl: './confirmation-for-agent-templte-search.component.html',
  styleUrls: ['./confirmation-for-agent-templte-search.component.scss']
})
export class ConfirmationForAgentTemplteSearchComponent   {

     constructor(
     public dialogRef: MatDialogRef<ConfirmationForAgentTemplteSearchComponent>,
     @Inject(MAT_DIALOG_DATA) public data: { message: string }
   ) {}

   onNoClick(): void {
     this.dialogRef.close(false);
   }

   onYesClick(): void {
     this.dialogRef.close(true);
   }


}
