import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import moment from 'moment';

@Component({
  selector: 'vex-dialog-statistical-report',
  templateUrl: './dialog-statistical-report.component.html',
  styleUrls: ['./dialog-statistical-report.component.scss']
})
export class DialogStatisticalReportComponent implements OnInit {

  stasticalReport:any
  dialogRef: any;
  date:Date = new Date()
  constructor( @Inject(DIALOG_DATA) public data: {report:any, type:string }, private sanitizer:DomSanitizer) { }

  ngOnInit(): void {
    debugger
    this.stasticalReport = this.sanitizer.bypassSecurityTrustHtml(this.data.report)
  }
  save() {

    const name=moment(this.date).format('YYYY-MM-DD');
      const result = document.querySelector('mat-dialog-content');
    this.downloadToFile(result.innerHTML, name+this.data.type+''+'.html', 'text/plain');
    this.dialogRef.close();
  }
   downloadToFile (content, filename, contentType) {
    const a = document.createElement('a');
    const file = new Blob([content], {type: contentType});
    a.href= URL.createObjectURL(file);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  };

}
