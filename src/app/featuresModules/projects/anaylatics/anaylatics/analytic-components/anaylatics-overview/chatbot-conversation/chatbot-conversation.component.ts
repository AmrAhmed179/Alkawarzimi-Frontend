import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Console } from 'console';
import { AnalyticServiceService } from 'src/app/Services/analytic-service.service';
import { RequestFilter, SassProjects, filterAnalytical, formValueMapToForm } from 'src/app/core/models/filterAnaylic';
import { DialogChatBotConversationComponent } from '../dialog-chat-bot-conversation/dialog-chat-bot-conversation.component';
import moment from 'moment';
import { Subject, takeUntil } from 'rxjs';

export class StepsReponseCreation{
  message:string[] =[]
  rOptionTitle:string =''
  rOptionList:string[] =[]
}


@Component({
  selector: 'vex-chatbot-conversation',
  templateUrl: './chatbot-conversation.component.html',
  styleUrls: ['./chatbot-conversation.component.scss']
})


export class ChatbotConversationComponent implements OnInit {
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
 showSassProjectsFilter:boolean = false

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
  date:Date = new Date()

  sassProjects:SassProjects[] = []
  displayedColumnsConversation: string[] = ['User Input', 'System Response', 'Conversation Steps','User Id', 'prediction', 'Time','SessionId'];
  dataSourceConversation: MatTableDataSource<any>
  @ViewChild(MatPaginator) paginatorConversation: MatPaginator;

  constructor(private _analyticalService:AnalyticServiceService,private route: ActivatedRoute,
    private fb:FormBuilder,
    public dialog: MatDialog,
    ) {
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
    this._analyticalService.showButton$.next(true)
    this._analyticalService.filterAnylatic$.pipe(takeUntil(this.onDestroy$)).subscribe(res=>{

      this._analyticalService.formValue$.subscribe((result:formValueMapToForm)=>{
        if(result)
        this.formValue = result
      })


    this.filter = res
    this.filter.start = 0
    this.filter.modeAgent = false
    if(this.servicesName.length <1){
      this.getServices()
    }
    this.getSassProjects()
    this.intiateForm()
    if(this.entitiesName.length < 1){
      this.getEntityies()
    }
    if(this.intentsName.length < 1){
      this.getIntents()
    }
    if(this.firstIntentList.length < 1){
      this.getFirstIntentList()
    }
    if(this.undserstandingInentsList.length < 1){
      this.getUnderstandingIntents()
    }
    //this.formvalue() let y = window.location.href.split("/").pop()
    let y = window.location.href.split("/").pop()
      if(y==='Chatbotconversation' ){
        this.getChatbotConversation()
      }

    if(!this.filter.userId){
      this.getMessangerUser()
    }
    this.paginator.firstPage()
    this.paginatorConversation.firstPage()
    console.log("filterxx",this.filter);
  })
 }

  responses(row) {
  return row?.steps?.[0]?.output?.Responses || [];
}
 intiateForm(){
  this.form =this.fb.group({
    intents: new FormControl(this.formValue.intents),
    services: new FormControl(this.formValue.services),
    entities: new FormControl(this.formValue.entities),
    search:[this.formValue.search],
    userId:[this.formValue.userId],
    projectId:[this.formValue.projectId]
  }
  )
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

 getSassProjects(){
  let projectType = null
  if(this.filter.chatBotId == 320){
    projectType = 1
    this.showSassProjectsFilter = true
    }

  if(this.filter.chatBotId == 327 ||this.filter.chatBotId == 329 ||this.filter.chatBotId == 330){
    projectType = 0
    this.showSassProjectsFilter = true
  }
  this._analyticalService.GetSassProjects(projectType).subscribe((res:any)=>{
    this.sassProjects  = res.projects
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

    debugger
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
    this.filter.projectId = this.form.value['projectId']
    this.formValue.entities = this.form.value['entities']
    this.formValue.services = this.form.value['services']
    this.formValue.intents = this.form.value['intents']
    this.formValue.userId = this.form.value['userId']
    this.formValue.search = this.form.value['search']
    this.formValue.projectId = this.form.value['projectId']

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
   openConversationDialog(steps,userId){
    const dialogRef = this.dialog.open(DialogChatBotConversationComponent,{data:{steps:steps,userId:userId}, height: '600px',
    width: '800px'},
    );
    dialogRef.afterClosed().subscribe(res=>{
    })
   }

    changeDateFormate(dateString:string){
      const timestamp = parseInt(dateString.replace(/\/Date\((\d+)\)\//, '$1'), 10);
      const date = new Date(timestamp);
      return date.toString();
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
   getUserIdData(userId){
    this.filter.userId = userId
    this.formValue.userId = userId
    this._analyticalService.filterAnylatic$.next(this.filter)
    this.intiateForm()
    debugger
    this.dataSource = new MatTableDataSource([{_id:userId}])
    this.totalItem = 1
    this.messangerCount = 1
   }
   removeUserId(){
    this.filter.userId = ''
    this.formValue.userId =''
    this._analyticalService.filterAnylatic$.next(this.filter)
    this.intiateForm()
   }

   addDate(date){
    //date = "7/2/2023 9:08:47 PM";
    let addedDate = new Date(date)
     addedDate.setTime(addedDate.getTime() + 3 * 60 * 60 * 1000);
     return (moment(addedDate)).format('MM/DD/YYYY, HH:mm:ss A')
   }

   ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
    this.filter.start = 0
    this._analyticalService.filterAnylatic$.next(this.filter);
   }


}
