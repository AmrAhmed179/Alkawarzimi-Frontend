import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import moment from 'moment';
import { Subject, filter, map, takeUntil } from 'rxjs';
import { AnalyticServiceService } from 'src/app/Services/analytic-service.service';
import { filterAnalytical } from 'src/app/core/models/filterAnaylic';
import { DialogStatisticalReportComponent } from '../dialog-statistical-report/dialog-statistical-report.component';

@Component({
  selector: 'vex-sharedanaylatics',
  templateUrl: './sharedanaylatics.component.html',
  styleUrls: ['./sharedanaylatics.component.scss']
})

export class SharedanaylaticsComponent implements OnInit {
  jscode:string
  script = document.createElement('script');
  onDestroy$: Subject<void> = new Subject();
 range:any
 datetimeNow:Date;
 startDate:Date;

 endDate:Date;
 chatBotId:number;

 showButtons:boolean = false
 dateRange:any;
 filter:filterAnalytical = new filterAnalytical()
  statisticalReport:any
  conversationsReport:any
  agentMode:boolean = false

  constructor(private routerM: Router,private route: ActivatedRoute,
    private _analyticalService:AnalyticServiceService,
    private sanitizer:DomSanitizer, public dialog: MatDialog,
    private renderer: Renderer2) { }

  ngOnInit(): void {

    this.showButtons = false
    this.agentMode = false
    let y = window.location.href.split("/").pop()
      if(y==='Chatbotconversation' || y ==='Agentconversation'){
        this.showButtons = true
      }
      if(y === 'Agentconversation' ){
        this.agentMode = true
      }
      console.log("vko4vjrvpoojv55vj5vjpo5vjipij5v",window.location.href.split("/").pop())
      this.routerM.events.
      pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(re=>{
        this.showButtons = false
            this.agentMode = false

        console.log("vko4vjrvpoojv55vj5vjpo5vjipij5v",window.location.href.split("/").pop())
        let x = window.location.href.split("/").pop()
        if(x==='Chatbotconversation' || x ==='Agentconversation'){
          this.showButtons = true
        }
        if(x === 'Agentconversation' ){
          this.agentMode = true
        }
      })

    this.route.parent.params.subscribe((parmas:Params)=>{
      this.chatBotId = parmas["projectid"];})
      this.datetimeNow= new Date();// create a new Date object with the current date and time
      let endDteUTC = new Date()
      let myDate = new Date();
      //myDate.setDate(myDate.getDate() -12).toLocaleString()
       let convertDate = myDate
      this.startDate = new Date(convertDate.getDate())

      this.range = new FormGroup({
      startDate: new FormControl(new Date()),
      endDate: new FormControl(new Date()),
    });

    console.log("firstItialcompo")
    const  SetFilter = new filterAnalytical();
    SetFilter.chatBotId = this.chatBotId;
    SetFilter.startDate = (moment(this.range.get('startDate').value)).format('MM/DD/YYYY')
    SetFilter.endDate =   (moment(this.range.get('endDate').value)).format('MM/DD/YYYY')
    this._analyticalService.filterAnylatic$.next(SetFilter);

    // this.createStatisticReport()
    // this.createConversationsReport()
  }

  ngAfterViewInit(): void {
     //this.script = document.createElement('script');


  }
  detectMode(){
    debugger
    var x = this.agentMode
  }

  refeshData(){

    this.startDate = this.range.value['startDate']
    this.startDate.setDate(this.startDate.getDate())

    this.endDate = this.range.value['endDate']
   // let x = new Date (this.endDate.setDate((this.endDate.getDate())))
   // this.endDate.setHours(24,0,0,0)

    //  this.route.parent.params.subscribe((parmas:Params)=>{
    //   this.chatBotId = parmas["projectid"]
    // })

    var  filter = new filterAnalytical();
    filter.chatBotId = this.chatBotId;
    filter.startDate = (moment(this.range.get('startDate').value)).format('MM/DD/YYYY')
    filter.endDate = (moment(this.range.get('endDate').value)).format('MM/DD/YYYY')

    this._analyticalService.filterAnylatic$.next(filter);

   console.log("startDate",this.startDate)
   console.log("endDate",this.endDate)
   console.log("chatBotId",this.chatBotId)
  }

  createStatisticReport(){
     var filter:filterAnalytical = new filterAnalytical()
     filter.chatBotId = this.chatBotId
     filter.startDate = (moment(this.range.get('startDate').value)).format('MM/DD/YYYY')
     filter.endDate = (moment(this.range.get('endDate').value)).format('MM/DD/YYYY')
     filter.modeAgent = this.agentMode
    //  this._analyticalService.filterAnylatic$.pipe(takeUntil(this.onDestroy$)).subscribe((res:filterAnalytical)=>{
    //   this.filter = res
    //   this._analyticalService.CreateStatisticReport(this.filter).subscribe((res:any)=>{
    //     this.statisticalReport = res
    //   })
    // })

    this._analyticalService.CreateStatisticReport(filter).subscribe((res:any)=>{
      this.statisticalReport = res
      const dialogRef = this.dialog.open(DialogStatisticalReportComponent,{data:{report:this.statisticalReport ,type:'statisticalReport'}, height: '900px',
        width: '1500px'},
        );
        dialogRef.afterClosed().subscribe(res=>{
        })
    })
  }
  createConversationsReport(){
    debugger
    // this._analyticalService.filterAnylatic$.pipe(takeUntil(this.onDestroy$)).subscribe((res:filterAnalytical)=>{
    //   this.filter = res
    //   this._analyticalService.CreateConversationsReport(this.filter).subscribe((res:any)=>{
    //     this.conversationsReport = res
    //    // this.sanitizer.bypassSecurityTrustHtml(res);
    //   })
    // })
    var filter:filterAnalytical = new filterAnalytical()
    filter.chatBotId = this.chatBotId
    filter.startDate = (moment(this.range.get('startDate').value)).format('MM/DD/YYYY')
    filter.endDate = (moment(this.range.get('endDate').value)).format('MM/DD/YYYY')
     filter.modeAgent = this.agentMode

    this._analyticalService.CreateConversationsReport(filter).subscribe((res:any)=>{
      this.conversationsReport = res
      const dialogRef = this.dialog.open(DialogStatisticalReportComponent,{data:{report:this.conversationsReport ,type:'coversationReport'}, height: '900px',
        width: '1500px'},
        );
        dialogRef.afterClosed().subscribe(res=>{
        })
    })
  }

  createConversationsReport2(){
    // this._analyticalService.filterAnylatic$.pipe(takeUntil(this.onDestroy$)).subscribe((res:filterAnalytical)=>{
    //   this.filter = res
    //   this._analyticalService.CreateConversationsReport(this.filter).subscribe((res:any)=>{
    //     this.conversationsReport = res
    //    // this.sanitizer.bypassSecurityTrustHtml(res);
    //   })
    // })
    var filter:filterAnalytical = new filterAnalytical()
    filter.chatBotId = this.chatBotId
    filter.startDate = (moment(this.range.get('startDate').value)).format('MM/DD/YYYY')
    filter.endDate = (moment(this.range.get('endDate').value)).format('MM/DD/YYYY')
    filter.modeAgent = this.agentMode

    this._analyticalService.CreateConversationsReport2(filter).subscribe((response: Blob)=>{
      const url = window.URL.createObjectURL(response);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report`; // Specify the file name
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url); // Free up memory
    })
  }

  openStatisticalReportDialog(statisticalReport,type){
    var filter:filterAnalytical = new filterAnalytical()
    filter.chatBotId = this.chatBotId
    filter.startDate = (moment(this.range.get('startDate').value)).format('MM/DD/YYYY')
    filter.endDate = (moment(this.range.get('endDate').value)).format('MM/DD/YYYY')
    this.createStatisticReport()
    this.createConversationsReport()
    const dialogRef = this.dialog.open(DialogStatisticalReportComponent,{data:{report:statisticalReport,type:type}, height: '900px',
    width: '1500px'},
    );
    dialogRef.afterClosed().subscribe(res=>{
    })
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
    this.script.parentNode.removeChild(this.script)

   // document.removeChild(this.script);
  //  const element = document.querySelector('.khaIcon');
  //   if (element) {
  //   element.remove();
  //   }
  //   const element2 = document.getElementById('alkahwarizmi-chat-container')
  //   element2.remove();
  }
}
