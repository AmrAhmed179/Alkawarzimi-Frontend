import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogChatBotConversationComponent } from '../../anaylatics/anaylatics/analytic-components/anaylatics-overview/dialog-chat-bot-conversation/dialog-chat-bot-conversation.component';
import { ActivatedRoute, Params } from '@angular/router';
import { OptionsServiceService } from 'src/app/Services/options-service.service';
import { NotifyService } from 'src/app/core/services/notify.service';

@Component({
  selector: 'vex-dialog-users-channels',
  templateUrl: './dialog-users-channels.component.html',
  styleUrls: ['./dialog-users-channels.component.scss']
})
export class DialogUsersChannelsComponent implements OnInit {
  whatsAppForm:FormGroup
  twitterForm:FormGroup
  facebookMessengerForm:FormGroup
  alkhwarizmiLiveChat:FormGroup
  telegramForm:FormGroup
  chatBotId:number
  code:string = ""
  constructor(private fb:FormBuilder,
    @Inject(DIALOG_DATA) public data: {integrations,liveChatResponse,type:string,chatBotId:number},
     public dialogRef: MatDialogRef<DialogUsersChannelsComponent>,
     private _optionsService:OptionsServiceService,
     private _notify:NotifyService
    ) { }


  ngOnInit(): void {
    this.code = `
    <script>
    (function (w, d, s, o, f, js, fjs) {
      w['alkawarizmi'] = o; w[o] = w[o] || function () { (w[o].q = w[o].q || []).push(arguments) };
      js = d.createElement(s), fjs = d.getElementsByTagName(s)[0];
      js.id = o; js.src = f; js.async = 1; fjs.parentNode.insertBefore(js, fjs);
  }(window, document, 'script', 'myBbot', 'https://orchestrator.alkhwarizmi.xyz/plugins/alkhwarizmi.sdk.1.1.0.js'));
  myBbot('init', { id: ${this.data.chatBotId}, title: "", draggable: true, animatedIcon: 1 });
    <script/>
    `
    this.intiateForm()
  }
  intiateForm(){
    this.whatsAppForm = this.fb.group({
      provider:[this.data.integrations.whatsApp?.providor],
      callBack: [{value:'',disabled:true}],
      accountId: [this.data.integrations.whatsApp?.accountId],
      accessToken: [this.data.integrations.whatsApp?.authToken],
      phone: [this.data.integrations.whatsApp?.phone],
      appId: [this.data.integrations.whatsApp?.appId],
      Sandbox: [this.data.integrations.whatsApp?.sandbox],
    })

    this.twitterForm = this.fb.group({
      callBack: [{ value: "https://orchestrator.alkhwarizmi.xyz/Twitter/Index/"+this.data.chatBotId,  disabled:true}],
      consumerKey: [this.data.integrations.twitterApp?.consumerKey],
      consumerKeySecret: [this.data.integrations.twitterApp?.consumerKeySecret],
      accessToken: [this.data.integrations.twitterApp?.accessToken],
      accessTokenSecret: [this.data.integrations.twitterApp?.accessTokenSecret],
    })
    this.facebookMessengerForm = this.fb.group({
      callBack: [{value:'https://alkhawarizmi.xyz:6060/Home/facebook/fa'+this.data.chatBotId,disabled:true}],
      verifyToken: [this.data.integrations.facebook?.verifyToken],
      pageId: [this.data.integrations?.facebook?.userId],
      pageAccessToken: [this.data.integrations?.facebook?.pageAccessToken],
    })

    this.telegramForm = this.fb.group({
      telegramToken: [this.data.integrations.telegram?.telegramToken],
    })

    this.alkhwarizmiLiveChat = this.fb.group({
      applicationKey: [],
      liveChatURL: [this.data.liveChatResponse?.url],
    })
  }
  providerChange(event){
    debugger
    let x = event.value
    if(x ==1){
      this.whatsAppForm.controls['callBack'].setValue("https://orchestrator.alkhwarizmi.xyz/WhatsApp/Index/"+this.chatBotId)
    }
    if(x ==2){
      this.whatsAppForm.controls['callBack'].setValue("https://orchestrator.alkhwarizmi.xyz/Unifonic/Index/"+this.chatBotId)
    }
    if(x ==3){
      this.whatsAppForm.controls['callBack'].setValue("https://orchestrator.alkhwarizmi.xyz/DialogWhatsApp/Index/"+this.chatBotId)
    }
    if(x ==4){
      this.whatsAppForm.controls['callBack'].reset()
    }
    if(x ==5){
      this.whatsAppForm.controls['callBack'].reset()
    }
  }
  save(type){
    if(type == 'Whatsapp'){
      let whatsapp = {
        accountId:this.whatsAppForm.controls['accountId'].value,
        appId:this.whatsAppForm.controls['appId'].value,
        accessToken:this.whatsAppForm.controls['accessToken'].value,
        enabled:this.data.integrations.whatsApp.enabled,
        phone:this.whatsAppForm.controls['phone'].value,
        provider:this.whatsAppForm.controls['provider'].value,
        Sandbox:this.whatsAppForm.controls['Sandbox'].value,
        workspace_id:this.data.chatBotId
    }
      this._optionsService.saveWhats(whatsapp).subscribe((res:any)=>{
        if(res.status == 1){
          this._notify.openSuccessSnackBar("Data Updated ")
        }else{
          this._notify.openFailureSnackBar("Faild to update Data")
        }
      })
    }

    debugger
    if(type == 'Twitter'){
      let twitter = {
        enabled:this.data.integrations.twitterApp.enabled,
        consumerKey:this.twitterForm.controls['consumerKey'].value,
        consumerKeySecret:this.twitterForm.controls['consumerKeySecret'].value,
        accessToken:this.twitterForm.controls['accessToken'].value,
        accessTokenSecret:this.twitterForm.controls['accessTokenSecret'].value,

        accountId:this.data.integrations.twitterApp.accountId,
        authType:this.data.integrations.twitterApp.authType,
        userBearToken:this.data.integrations.twitterApp.userBearToken,
        userRefreshToken:this.data.integrations.twitterApp.userRefreshToken,
        updateAt:this.data.integrations.twitterApp.updateAt,
        twitterMode:this.data.integrations.twitterApp.twitterMode,
    }
      this._optionsService.saveTwitter(twitter).subscribe((res:any)=>{
        if(res.status == 1){
          this._notify.openSuccessSnackBar("Data Updated ")
        }else{
          this._notify.openFailureSnackBar("Faild to update Data")
        }
      })
    }

    // if(type == 'Messenger'){
    //   let facebook = {
    //     enabled:this.data.integrations.twitterApp.enabled,
    //     consumerKey:this.twitterForm.controls['consumerKey'].value,
    //     consumerKeySecret:this.twitterForm.controls['consumerKeySecret'].value,
    //     accessToken:this.whatsAppForm.controls['accessToken'].value,
    //     accessTokenSecret:this.whatsAppForm.controls['accessTokenSecret'].value,
    // }
    //   this._optionsService.saveFacebookMessanger(facebook).subscribe((res:any)=>{
    //     if(res.status == 1){
    //       this._notify.openSuccessSnackBar("Data Updated ")
    //     }else{
    //       this._notify.openFailureSnackBar("Faild to update Data")
    //     }
    //   })
    // }
  }

}
