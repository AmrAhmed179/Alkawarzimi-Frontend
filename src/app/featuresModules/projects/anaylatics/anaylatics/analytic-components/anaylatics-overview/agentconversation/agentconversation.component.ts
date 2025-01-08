import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { AnalyticServiceService } from 'src/app/Services/analytic-service.service';
import { filterAnalytical, formValueMapToForm, RequestFilter } from 'src/app/core/models/filterAnaylic';
import { StepsReponseCreation } from '../chatbot-conversation/chatbot-conversation.component';
import { DialogChatBotConversationComponent } from '../dialog-chat-bot-conversation/dialog-chat-bot-conversation.component';
import { Subject, takeUntil } from 'rxjs';
import moment from 'moment';

@Component({
  selector: 'vex-agentconversation',
  templateUrl: './agentconversation.component.html',
  styleUrls: ['./agentconversation.component.scss']
})
export class AgentconversationComponent implements OnInit {

  onDestroy$: Subject<void> = new Subject();
  filter:filterAnalytical =  new filterAnalytical();
  formValue:formValueMapToForm =  new formValueMapToForm();
  range:any
  datetimeNow:Date = new Date()
  startDate:Date = new Date()
  endDate:Date = new Date()
  chatBotId:number
  form:FormGroup
  toppingList:string[] =[]

  servicesResponseList:any[] = []
  servicesName:string[] = []
  entityResponseList:any[] = []
  entitiesName:string[] = []
  intentsName:string[] = []
  intentResponseList:any[] = []

  serviceFormvalue:string[] = []
  intentFormValue:string[] = []
  entityFormvalue:string[] = []
  search:string;
  userId:string;
  requestFilter:RequestFilter[] = []
  conversationResponseData:any[] = []
  messangerCount:any
  conversationCount:any;
  userData:any = []
  pageSize:number = 10
  pageNumber = 0
  totalItem:number;
  predictionIDs:any;
  displayedColumns: string[] = ['ID', 'User'];
  dataSource: MatTableDataSource<any>
  stepsResponse:any[] = []
  stepsListCreation:StepsReponseCreation[] = []
  undserstandingInentsList:any[] = []
  firstIntentList:any[] = []

  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumnsConversation: string[] = ['User Input', 'System Response', 'Conversation Steps','User Id', 'prediction', 'Time','SessionId'];
  dataSourceConversation: MatTableDataSource<any>
  @ViewChild(MatPaginator) paginatorConversation: MatPaginator;

  constructor(private _analyticalService:AnalyticServiceService,private route: ActivatedRoute,
    private fb:FormBuilder,
    public dialog: MatDialog) {
    }

    ngAfterViewInit() {
      this.paginator.page.asObservable().subscribe((pageEvent) => {
        this.pageNumber=pageEvent.pageIndex + 1,
        this.pageSize=pageEvent.pageSize,
        this.filter.start = (this.pageSize * this.pageNumber) -10
        this.getMessangerUser()
      });
      this.paginatorConversation.page.asObservable().subscribe((pageEvent) => {
        this.pageNumber=pageEvent.pageIndex + 1,
        this.pageSize=pageEvent.pageSize,
        this.filter.start = (this.pageSize * this.pageNumber) -10
        this.getAgentConversation()
      });
      }

  ngOnInit(): void {
    this._analyticalService.filterAnylatic$. pipe(takeUntil(this.onDestroy$)).subscribe(res=>{
      this._analyticalService.formValue$.subscribe((result:formValueMapToForm)=>{
        if(result)
        this.formValue = result
      })

    this.filter = res
    this.filter.start = 0
    this.getServices()
    this.getEntityies()
    this.getIntents()
    this.getAgentConversation()
    this.getMessangerUser()
    this.paginator.firstPage()
    this.paginatorConversation.firstPage()
    console.log("filterxx",this.filter);
  })
 }


 getServices(){
  this._analyticalService.GetChatBotConvwesationServices(this.filter).subscribe((res:any)=>{
    this.servicesName = []

    this.servicesResponseList = res.services
    console.log(res.services)
    res.services.forEach(element => {
      this.servicesName.push(element.name)
    });
    console.log("services", this.servicesName)
  })
 }

  getEntityies(){
    this._analyticalService.GetChatBotConversationSystemEntities(this.filter).subscribe((res:any)=>{
      this.entitiesName = []

      this.entityResponseList = res.entities
      this.entityResponseList.forEach(element=>{
        this.entitiesName.push(element.entity)
      })
      console.log("Entites",this.entitiesName)
    })
  }
  getIntents(){
    this._analyticalService.GetIntents(this.filter).subscribe((res:any[])=>{
      this.intentsName = []

      this.intentResponseList = res.filter(x=>x.responseMode != 1 || x.eventTask == 1)
      this.intentResponseList.forEach(element=>{
         this.intentsName.push(element.intent)
      })
      console.log("intents",this.intentsName)
    })
  }

  getAgentConversation(){
    this.conversationResponseData = []
    this.filter.modeAgent = true
    this.filter.filter = []
    this._analyticalService.chatbotConversationIndex(this.filter).subscribe((res:any)=>{
      if(res){

        this.conversationResponseData = res.data

        this.dataSourceConversation = new MatTableDataSource(this.conversationResponseData)
        this.conversationCount = res.recordsTotal
        console.log("consersationResponseData",this.conversationResponseData )
      }
    })
  }

  getMessangerUser(){
    this._analyticalService.getMessangerUsers(this.filter).subscribe((res:any)=>{
      this.dataSource = new MatTableDataSource(res.data)
        this.totalItem = res.recordsTotal
       //this.userData   = res.data
      this.messangerCount = res.recordsTotal
    })
  }


   setServiceRequestFilter(){

    const t = this.serviceFormvalue
    if(this.serviceFormvalue){
      this.serviceFormvalue.forEach(e=>{
        const x = this.servicesResponseList.filter(x=>x.name == e )
        const serviceFilter = new RequestFilter()
        serviceFilter.id =  x[0].servicesId;
        serviceFilter.text = '@'+ x[0].name
        serviceFilter.type = 3
        this.requestFilter.push(serviceFilter)
      })
    }
    console.log("serviceRequestFilter",this.requestFilter)
   }

   setIntentRequestFilter(){
    if(this.intentFormValue){
      this.intentFormValue.forEach(e=>{
        const x = this.intentResponseList.filter(x=>x.intent == e )
        const serviceFilter = new RequestFilter()
        serviceFilter.id =  x[0].intentId;
        serviceFilter.text = '#'+ x[0].intent
        serviceFilter.type = 0
        this.requestFilter.push(serviceFilter)
      })
    }
    console.log("intentFilter",this.requestFilter)
   }
   setEntityRequestFilter(){
    if(this.entityFormvalue){
      this.entityFormvalue.forEach(e=>{
        const x = this.entityResponseList.filter(x=>x.entity == e )
        const serviceFilter = new RequestFilter()
        serviceFilter.id =  x[0].entityId;
        serviceFilter.text = x[0].entity
        serviceFilter.type = 1
        this.requestFilter.push(serviceFilter)
      })
    }
    console.log("entity",this.requestFilter)
   }


   getTextResponse(response){

    let start1 = response.message.indexOf('<')
    let start2 = response.message.indexOf('>')

    if(start2)
      return response.message.substr(0,start1-1) +  response.message.substr(start2+1,response.message.length-start2)

    return response.message;
   }
   openConversationDialog(steps){
    const dialogRef = this.dialog.open(DialogChatBotConversationComponent,{data:{steps:steps}, height: '600px',
    width: '800px'},
    );
    dialogRef.afterClosed().subscribe(res=>{
    })
   }
   getPredictionName(predictionId){
    let predictionIdName:string = ''


      let intentResult  = this.firstIntentList.find(y=>y.intentId == predictionId)

      if(intentResult){
        return predictionIdName = '#'+ intentResult.intent
      }
      else{
         let understandIntentResult  = this.undserstandingInentsList.find(r=>r.intentId == predictionId)
        if(understandIntentResult){
          return predictionIdName = '#'+  understandIntentResult.description
        }
        let service = this.servicesResponseList.find(x=>x.servicesId ==predictionId )
        if(service){
          return predictionIdName = 'API:'+ service.name
        }
        else{
          return  predictionIdName =  '#'+  predictionId
        }

      }
  }

  addDate(date){
    let addedDate = new Date(date)
     addedDate.setTime(addedDate.getTime() + 3 * 60 * 60 * 1000);
     return (moment(addedDate)).format('MM/DD/YYYY HH:mm:ss A')
   }
   ngOnDestroy(){
    this.onDestroy$.next();
    this.onDestroy$.complete();
    this.filter.start = 0
    this.filter.modeAgent = false
    this._analyticalService.filterAnylatic$.next(this.filter);
   }

}
