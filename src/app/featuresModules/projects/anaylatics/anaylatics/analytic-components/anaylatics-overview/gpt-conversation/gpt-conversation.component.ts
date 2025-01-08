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
import { Subject } from 'rxjs';

@Component({
  selector: 'vex-gpt-conversation',
  templateUrl: './gpt-conversation.component.html',
  styleUrls: ['./gpt-conversation.component.scss']
})
export class GptConversationComponent implements OnInit {
  onDestroy$: Subject<void> = new Subject();
  //filter:filterAnalytical =  new filterAnalytical();
  filter
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
        this.getChatbotConversation()
      });
      }

  ngOnInit(): void {
  //   this._analyticalService.showButton$.next(true)
  //   this._analyticalService.filterAnylatic$.pipe(takeUntil(this.onDestroy$)).subscribe(res=>{

  //     this._analyticalService.formValue$.subscribe((result:formValueMapToForm)=>{
  //       if(result)
  //       this.formValue = result
  //     })

  //   this.filter = res
  //   this.filter.start = 0
  //   this.filter.modeAgent = false
  //   this.getServices()
  //   this.intiateForm()
  //   this.getEntityies()
  //   this.getIntents()
  //   this.getFirstIntentList()
  //   this.getUnderstandingIntents()
  //   this.formvalue
  //   this.getChatbotConversation()
  //   this.getMessangerUser()
  //   this.paginator.firstPage()
  //   this.paginatorConversation.firstPage()
  //   console.log("filterxx",this.filter);
  // })
 }

 intiateForm(){
  this.form =this.fb.group( {intents: new FormControl(this.formValue.intents),services: new FormControl(this.formValue.services),entities: new FormControl(this.formValue.entities),search:[this.formValue.search],userId:[this.formValue.userId]})
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

  getChatbotConversation(){
    this.conversationResponseData = []
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
  formvalue(){

    this.requestFilter = []
    this.intentFormValue = this.form.value['intents']
    this.serviceFormvalue = this.form.value['services']
    this.entityFormvalue = this.form.value['entities']

    this.setServiceRequestFilter();
    this.setIntentRequestFilter();
    this.setEntityRequestFilter();

    this.filter.userId = this.form.value['userId']
    this.filter.search = this.form.value['search']
    this.filter.filter = this.requestFilter

    this.formValue.entities = this.form.value['entities']
    this.formValue.services = this.form.value['services']
    this.formValue.intents = this.form.value['intents']
    this.formValue.userId = this.form.value['userId']
    this.formValue.search = this.form.value['search']

    this._analyticalService.formValue$.next(this.formValue)
    this._analyticalService.filterAnylatic$.next(this.filter)
    console.log("FORMVALUE", this.filter)

    console.log("requestFilter", this.requestFilter)

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

   stepsResponseCreate(responseSteps){

    this.stepsListCreation = []
      responseSteps.forEach(element=>{
        let  stepsResponseCreation:StepsReponseCreation = new StepsReponseCreation();

        element.forEach(ele=>{
          if(ele.message){

           let start1 = ele.message.indexOf('<')
           let start2 = ele.message.indexOf('>')
           if(start2){
            let newMessage = ele.message.substr(0,start1-1) +  ele.message.substr(start2+1,ele.message.length-start2)
            stepsResponseCreation.message.push(ele.message);
           }
           else{
            stepsResponseCreation.message.push(ele.message);
           }
          }
          if(ele.rOptions){
            stepsResponseCreation.rOptionTitle = ele.title
             ele.rOptions.forEach(x=>{
              stepsResponseCreation.rOptionList.push(x.title)
             })
          }

        })
        this.stepsListCreation.push(stepsResponseCreation)
      })
      console.log("stepsResponseCreation",this.stepsListCreation )
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

  getUnderstandingIntents(){
    this._analyticalService.GetUnderstanding(this.filter).subscribe((res:any)=>{
      if(res){
        this.undserstandingInentsList = res
      }
      console.log("undersatandingIntents", this.undserstandingInentsList )
    })
   }

   getFirstIntentList(){
    this._analyticalService.GetIntents(this.filter).subscribe((res:any)=>{
      if(res){
        this.firstIntentList = res
      }
      console.log("FirstintentList",this.firstIntentList )
    })
   }


   ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
    this.filter.start = 0
    this._analyticalService.filterAnylatic$.next(this.filter);
   }

}
