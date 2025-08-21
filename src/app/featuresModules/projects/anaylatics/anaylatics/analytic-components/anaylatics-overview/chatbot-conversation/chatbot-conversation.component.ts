import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
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
import { Subject, take, takeUntil } from 'rxjs';
import { get } from 'http';

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
  ActiveTap = 1
  totalPagesArray: number[] = [];

  onDestroy$: Subject<void> = new Subject();
  filter:filterAnalytical =  new filterAnalytical();
  filterObserve:filterAnalytical =  new filterAnalytical();
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
  displayedColumns: string[] = ['ID'] //'User'];
  dataSource: MatTableDataSource<any>
  stepsResponse:any[] = []
  stepsListCreation:StepsReponseCreation[] = []
  undserstandingInentsList:any[] = []
  firstIntentList:any[] = []
  @ViewChild('paginator') paginator: MatPaginator;
    @ViewChild('paginatorConversation') paginatorConversation: MatPaginator;

  date:Date = new Date()

  sassProjects:SassProjects[] = []
  displayedColumnsConversation: string[] = ['User Input', 'System Response', 'Conversation Steps','User Id', 'prediction', 'Time','SessionId'];
  dataSourceConversation: MatTableDataSource<any>

  constructor(private _analyticalService:AnalyticServiceService,private route: ActivatedRoute,
    private fb:FormBuilder,
    public dialog: MatDialog,
        private renderer: Renderer2, private el: ElementRef,

    ) {
    }

    ngAfterViewInit() {
      debugger
      this.paginator.page.asObservable().subscribe((pageEvent) => {
        this.pageNumber=pageEvent.pageIndex + 1,
        this.pageSize=pageEvent.pageSize,
        this.filter.start = (this.pageSize * this.pageNumber) -10
debugger
        this.getMessangerUser()
      });
      debugger
      this.paginatorConversation.page.asObservable().subscribe((pageEvent) => {
        this.pageNumber=pageEvent.pageIndex + 1,
        this.pageSize=pageEvent.pageSize,
        this.filter.start = (this.pageSize * this.pageNumber) -10
        debugger
        this.getChatbotConversation()
      });
      }

  ngOnInit(): void {
    this._analyticalService.showButton$.next(true)
    this._analyticalService.filterAnylatic$.pipe(takeUntil(this.onDestroy$)).subscribe(res=>{

      debugger
      this._analyticalService.formValue$.pipe(takeUntil(this.onDestroy$)).subscribe((result:formValueMapToForm)=>{
        if(result){
           //debugger
                   this.formValue = result
        }
      })


    this.filter.endDate = res.endDate
    this.filter.startDate = res.startDate
    this.filter.chatBotId = res.chatBotId
    this.filter.searchFromParent = res.searchFromParent
    this.filter.start = 0

    this.filter.modeAgent = false

    if(this.servicesName.length <1){
      this.getServices()
    }
    if(this.sassProjects.length < 1){
       this.getSassProjects()
    }
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
        debugger
        if(this.filter.searchFromParent){
          this.getChatbotConversation()
          this.getMessangerUser()

        }
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
  debugger
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
    this.servicesResponseList.forEach(element => {
      element.selected = false
      this.servicesName.push(element.name)
    });
    console.log("services", this.servicesName)
  })
 }

 getSassProjects(){
  if(this.filter.chatBotId == 327 ||this.filter.chatBotId == 329 ||this.filter.chatBotId == 330 || this.filter.chatBotId == 320){
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

 }

  getEntityies(){
    this._analyticalService.GetChatBotConversationSystemEntities(this.filter).subscribe((res:any)=>{
      this.entitiesName = []

      this.entityResponseList = res.entities
      this.entityResponseList.forEach(element=>{
        this.entitiesName.push(element.entity)
        element.selected = false
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
         element.selected = false
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

        this.totalPagesArray = Array.from(
        { length: Math.ceil(this.conversationCount / this.pageSize) },
        (_, i) => i + 1
      );
      this.appendPageSelection()
      }
    })
  }

  appendPageSelection() {
  debugger
  // Get the element by its class name
  const childDiv = this.el.nativeElement.querySelector('.childDiv');
  //const parentDiv = this.el.nativeElement.querySelector('.mat-paginator-outer-container');
  const parentDiv = this.el.nativeElement.querySelector('.mat-paginator-range-actions');
   const prevDiv = this.el.nativeElement.querySelector('.mat-paginator-navigation-next');
  if (childDiv) {
    this.renderer.appendChild(parentDiv, childDiv);
  }
}
goToPage(page: number) {
  this.pageNumber = page;
  this.paginatorConversation.pageIndex = page - 1;
  this.filter.start = (this.pageSize * this.pageNumber) - this.pageSize;
  this.getChatbotConversation();
}
  getMessangerUser(){
    debugger
    this._analyticalService.getMessangerUsers(this.filter).subscribe((res:any)=>{
      this.dataSource = new MatTableDataSource(res.data)
        this.totalItem = res.recordsTotal
       //this.userData   = res.data
      this.messangerCount = res.recordsTotal
    })
  }
  formvalue2(value:number){

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

    this.filter.searchFromParent = false


    this.formValue.entities = this.form.value['entities']
    this.formValue.services = this.form.value['services']
    this.formValue.intents = this.form.value['intents']
    this.formValue.userId = this.form.value['userId']
    this.formValue.search = this.form.value['search']
    this.formValue.projectId = this.form.value['projectId']
    this.formValue.searchFromParent = false

    this._analyticalService.formValue$.next(this.formValue)
    this._analyticalService.filterAnylatic$.next(this.filter)
    if(value == 1){
      this.getChatbotConversation()
      this.getMessangerUser()

    }

    console.log("FORMVALUE", this.filter)

    console.log("requestFilter", this.requestFilter)

  }
   formvalue(value:number){

    debugger
    this.requestFilter  = []

    this.setServiceRequestFilter();
    this.setIntentRequestFilter();
    this.setEntityRequestFilter();
    this.filter.filter = this.requestFilter
    this.filter.searchFromParent = false
    this._analyticalService.filterAnylatic$.next(this.filter)
    if(value == 1){
      this.getChatbotConversation()
      this.getMessangerUser()

    }

    console.log("FORMVALUE", this.filter)

    console.log("requestFilter", this.requestFilter)

  }

   setServiceRequestFilter2(){

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
    setServiceRequestFilter(){

    if(this.selectedServices.length > 0){
      this.selectedServices.forEach(e=>{
        const serviceFilter = new RequestFilter()
        serviceFilter.id =  e.servicesId;
        serviceFilter.text = '@'+ e.name
        serviceFilter.type = 3
        this.requestFilter.push(serviceFilter)
      })
    }
    console.log("serviceRequestFilter",this.requestFilter)
   }

   setIntentRequestFilter2(){
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
    setIntentRequestFilter(){
    if(this.selectedIntents.length > 0){
      this.selectedIntents.forEach(e=>{
        const serviceFilter = new RequestFilter()
        serviceFilter.id =  e.intentId;
        serviceFilter.text = '#'+e.intent
        serviceFilter.type = 0
        this.requestFilter.push(serviceFilter)
      })
    }
    console.log("intentFilter",this.requestFilter)
   }
   setEntityRequestFilter2(){
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
   setEntityRequestFilter(){
    if(this.selectedEntities.length > 0 ){
      this.selectedEntities.forEach(e=>{
        const serviceFilter = new RequestFilter()
        serviceFilter.id =  e.entityId;
        serviceFilter.text =e.entity
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
    return response.message;
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
    this._analyticalService.filterAnylatic$.next(this.filter)
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
////////////////////////////////////////////////////////

 searchServiceText = '';
 ServiceDropdownOpen = false;

  get filteredServices() {
    if (!this.searchServiceText) return this.servicesResponseList;
    return this.servicesResponseList.filter(s =>
      s.name.toLowerCase().includes(this.searchServiceText.toLowerCase())
    );
  }

  get selectedServices() {
    return this.servicesResponseList.filter(s => s.selected);
  }

  toggleService(service: any) {
    service.selected = !service.selected;
  }

  removeService(service: any) {
    service.selected = false;
  }

  clearAllServices() {
    this.servicesResponseList.forEach(s => s.selected = false);
    this.formvalue(0)
  }
  ////////////////////////////////////////////////////////////////
   searchIntentsText = '';
   IntentsDropdownOpen = false;

  get filteredIntents() {
    if (!this.searchServiceText) return this.intentResponseList;
    return this.intentResponseList.filter(s =>
      s.intent.toLowerCase().includes(this.searchIntentsText.toLowerCase())
    );
  }

  get selectedIntents() {
    return this.intentResponseList.filter(s => s.selected);
  }

  toggleIntents(intent: any) {
    intent.selected = !intent.selected;
  }

  removeIntents(intent: any) {
    intent.selected = false;
  }

  clearAllIntents() {
    this.intentResponseList.forEach(s => s.selected = false);
    this.formvalue(0)
  }

  ////////////////////////////////////////////////////////////////
   searchEntitiesText = '';
   EntitiesDropdownOpen = false;

  get filteredEntities() {
    if (!this.searchServiceText) return this.entityResponseList;
    return this.entityResponseList.filter(s =>
      s.entity.toLowerCase().includes(this.searchEntitiesText.toLowerCase())
    );
  }

  get selectedEntities() {
    return this.entityResponseList.filter(s => s.selected);
  }

  toggleEntities(intent: any) {
    intent.selected = !intent.selected;
  }

  removeEntities(intent: any) {
    intent.selected = false;
  }

  clearAllEntities() {
    this.entityResponseList.forEach(s => s.selected = false);
    this.formvalue(0)
  }

}
