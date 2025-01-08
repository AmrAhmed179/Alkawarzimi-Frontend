import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import moment from 'moment';

@Component({
  selector: 'vex-dialog-chat-bot-conversation',
  templateUrl: './dialog-chat-bot-conversation.component.html',
  styleUrls: ['./dialog-chat-bot-conversation.component.scss']
})
export class DialogChatBotConversationComponent implements OnInit {

  constructor( @Inject(DIALOG_DATA) public data: {steps:any, mode:string,userId:any }, public dialogRef: MatDialogRef<DialogChatBotConversationComponent>,
  ) { }

  response:any
  date:Date = new Date()
  apperance:boolean = false
  ngOnInit(): void {
    debugger
    let x= this.data.steps
  }
  getTextResponse(response){
debugger
    let start1 = response.message.indexOf('<')
    let start2 = response.message.indexOf('>')

    if(start2)
      return response.message.substr(0,start1-1) +  response.message.substr(start2+1,response.message.length-start2)

    return response.message;
   }
   save() {
    this.apperance = true
    const name=moment(this.date).format('YYYY-MM-DD');
      const result = document.getElementById('content-to-download');
    this.downloadToFile(result.innerHTML, name+'-'+this.data.userId+'-'+'.html', 'text/plain');
    this.apperance = false
    this.dialogRef.close()

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
