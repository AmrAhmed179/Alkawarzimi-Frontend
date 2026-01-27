import { Component, ElementRef, OnInit, Pipe, PipeTransform, Renderer2, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DataService } from 'src/app/core/services/data.service';
import { AiConversationService } from 'src/app/Services/ai-conversation.service';
import { OptionsServiceService } from 'src/app/Services/options-service.service';
import { AiConversationFilterDialogComponent, FilterData } from './ai-conversation-filter-dialog/ai-conversation-filter-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
@Pipe({ name: 'parseDate' })
export class ParseDatePipe implements PipeTransform {
  transform(dateStr: string): Date | null {
    if (!dateStr) return null;

    // Handle .NET date format: /Date(1751541540209)/
    const match = /\/Date\((\d+)\)\//.exec(dateStr);
    if (match) {
      const timestamp = Number(match[1]);
      return new Date(timestamp);
    }

    // Handle ISO date string
    const isoDate = new Date(dateStr);
    return isNaN(isoDate.getTime()) ? null : isoDate;
  }
}
@Component({
  selector: 'vex-ai-conversation',
  templateUrl: './ai-conversation.component.html',
  styleUrls: ['./ai-conversation.component.scss']
})
export class AiConversationComponent implements OnInit {
  onDestroy$: Subject<void> = new Subject();
  totalPagesArray: number[] = [];

  chatbotId
  totalCost:number = 0
  selectedSessionId:string = ""
  conversationsList:string[] = []
  selectedSession:any[]
  totalItems:number
   filter: FilterData = {
    userId: '',
    startDate: null,
    endDate: null,
    projectId:"",
    projects:[]
  };

  pageSize:number = 10
  page:number = 1
  tapNameValue:string = 'allConversations'
    @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private _aiConversationService:AiConversationService, private _dataService: DataService, private dialog: MatDialog,
          private renderer: Renderer2, private el: ElementRef,
  ) { }

  ngOnInit(): void {
        this._dataService.$project_bs.pipe(takeUntil(this.onDestroy$)).subscribe((project) => {
          if (project) {
            this.chatbotId = project._id;}
            this.getAllProjects()
            if(this.tapNameValue == 'allConversations')
             this.getAllConversations()
            else
            this.getOnlineConversations()
          }
          )
  }
  ngAfterViewInit() {
  debugger
  this.paginator.page.asObservable().subscribe((pageEvent) => {
    debugger
    this.page = pageEvent.pageIndex + 1
    this.pageSize = pageEvent.pageSize
    this.getAllConversations()
  });
}

  getAllProjects(){
     this._aiConversationService.GetAllProjects(this.chatbotId).subscribe((res:any)=>{
      this.filter.projects = res
     })
  }
  getAllConversations() {
    // Handle null dates - either skip them or provide defaults
    const startDate = this.filter.startDate ? this.filter.startDate.toISOString() : null;
    const endDate = this.filter.endDate ? this.filter.endDate.toISOString() : null;

    this._aiConversationService.GetALLAiSessions(
      this.chatbotId,
      this.filter.userId,
      startDate,
      endDate,
      this.filter.projectId,
      this.pageSize,
      this.page
    ).subscribe((res: any) => {
      this.conversationsList = res.sessions;
      this.totalItems = res.TotalCount;
       this.totalPagesArray = Array.from(
        { length: Math.ceil(this.totalItems / this.pageSize) },
        (_, i) => i + 1
      );
      this.appendPageSelection()
    });
  }
    getOnlineConversations(){
    this._aiConversationService.GetOnlineAiSessions(this.chatbotId).subscribe((res:any)=>{
      this.conversationsList = res.sessions
       this.totalItems = res.TotalCount
    })
  }


  getSessionHistory(sessionId){
    this.selectedSessionId = sessionId
    if(this.tapNameValue == 'allConversations')
      this.GetAiSessionHistory()
    else
      this.GetOnlineAiSessionHistory()
  }
  GetAiSessionHistory(){

    this._aiConversationService.GetAiSessionHistory(this.selectedSessionId,this.chatbotId).subscribe((res:any)=>{
      debugger
      this.selectedSession = res.history
      //this.SelectedSession(res.history)
      this.totalCost = res.cost
    })
  }
  GetOnlineAiSessionHistory(){
    this._aiConversationService.GetOnlineAiSessionHistory(this.selectedSessionId,this.chatbotId).subscribe((res:any)=>{
      debugger
      this.totalCost = 0
      this.SelectedSession(JSON.parse(res.History))
    })
  }
  SelectedSession(session){
    this.selectedSession = session
    this.selectedSession.forEach(el=>{
      debugger
      this.totalCost += el.cost
    })

  }
  openFilterDialog() {
    const dialogRef = this.dialog.open(AiConversationFilterDialogComponent, {
      width: '400px',
      data: { ...this.filter }
    });

    dialogRef.afterClosed().subscribe((result: FilterData) => {
      if (result) {
        this.filter = result;
        this.getAllConversations();
        this.paginator.firstPage()
      }
    });
  }
  refreshData(){
    if(this.tapNameValue == 'allConversations'){
      this.getAllConversations()
      this.paginator.firstPage()
    }
    else
    this.getOnlineConversations()
  }
  tapName(type:string){
    this.tapNameValue = type
     this.totalCost = 0
      this.selectedSession = []
    if(this.tapNameValue == 'allConversations'){
      this.getAllConversations()
      this.paginator.firstPage()
    }
    else
    this.getOnlineConversations()
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
  this.page = page;
  this.paginator.pageIndex = page - 1;
  this.getAllConversations()
}
}
