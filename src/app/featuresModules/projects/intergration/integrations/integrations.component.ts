import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DialogUsersChannelsComponent } from '../dialog-users-channels/dialog-users-channels.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params } from '@angular/router';
import { OptionsServiceService } from 'src/app/Services/options-service.service';

@Component({
  selector: 'vex-integrations',
  templateUrl: './integrations.component.html',
  styleUrls: ['./integrations.component.scss']
})
export class IntegrationsComponent implements OnInit {

  form:FormGroup
  liveChat:FormGroup
  chatBotId:number
  integrations:any = {}
  liveChatResponse:any = {}
  constructor(private fb:FormBuilder,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private _optionsService:OptionsServiceService,) { }

  ngOnInit(): void {
    debugger
    this.route.parent.params.subscribe((parmas:Params)=>{
      this.chatBotId = parmas["projectid"];})
      this._optionsService.getIntegrationIndex(this.chatBotId).subscribe((res:any)=>{
        if(res){
          debugger
          this.integrations = res.integration.integrations
          this.liveChatResponse = res.integration.liveChat
          this.initiateForm()
        }
      })
  }
  openDialog(type:string){
    let x =  this.form.controls['telegram'].value

    const dialogRef = this.dialog.open(DialogUsersChannelsComponent,{data:{integrations:this.integrations ,liveChatResponse:this.liveChatResponse ,type:type, chatBotId:this.chatBotId} ,maxHeight: '800px',
    width: '900px'},
    );
    dialogRef.afterClosed().subscribe(res=>{
    })
  }
  initiateForm(){
    this.form = this.fb.group({
      webWidget: [this.integrations.web],
      mobileApp: [false],
      whatsApp: [this.integrations.whatsApp],
      twitter: [this.integrations.twitterApp.enabled],
      facebookMessenger: [this.integrations.facebook],
      instagram: [false],
      telegram: [this.integrations.telegram],
    })

    this.liveChat = this.fb.group({
      typwOfLiveChatIntegration:[this.liveChatResponse?.type],
      genesysURL:[this.liveChatResponse?.url]
    })
  }
}
