import { Component, OnInit, Pipe, PipeTransform, ViewChild } from '@angular/core';
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
  projectId
  totalCost:number = 0
  selectedSessionId:string = ""
  conversationsList:string[] = []
  selectedSession:any[]
  totalItems:number
   filter: FilterData = {
    userId: '',
    startDate: null,
    endDate: null
  };

  pageSize:number = 10
  page:number = 1
  tapNameValue:string = 'allConversations'
    @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private _aiConversationService:AiConversationService, private _dataService: DataService, private dialog: MatDialog
  ) { }

  ngOnInit(): void {
        this._dataService.$project_bs.pipe(takeUntil(this.onDestroy$)).subscribe((project) => {
          if (project) {
            this.projectId = project._id;}
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
  getAllConversations() {
    // Handle null dates - either skip them or provide defaults
    const startDate = this.filter.startDate ? this.filter.startDate.toISOString() : null;
    const endDate = this.filter.endDate ? this.filter.endDate.toISOString() : null;

    this._aiConversationService.GetALLAiSessions(
      this.projectId,
      this.filter.userId,
      startDate,
      endDate,
      this.pageSize,
      this.page
    ).subscribe((res: any) => {
      this.conversationsList = res.sessions;
      this.totalItems = res.TotalCount;
    });
  }
    getOnlineConversations(){
    this._aiConversationService.GetOnlineAiSessions(this.projectId).subscribe((res:any)=>{
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

    this._aiConversationService.GetAiSessionHistory(this.selectedSessionId,this.projectId).subscribe((res:any)=>{
      debugger
      this.selectedSession = res.history
      //this.SelectedSession(res.history)
      this.totalCost = res.cost
    })
  }
  GetOnlineAiSessionHistory(){
    this._aiConversationService.GetOnlineAiSessionHistory(this.selectedSessionId,this.projectId).subscribe((res:any)=>{
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
}
