import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TasksService } from 'src/app/Services/Build/tasks.service';
import { AnalyticServiceService } from 'src/app/Services/analytic-service.service';
import { OptionsServiceService } from 'src/app/Services/options-service.service';
import { IndexLimitFilter } from 'src/app/core/models/tasks/IndexLimitFilter';
import { NotifyService } from 'src/app/core/services/notify.service';
import { MagicWordWriteComponent } from 'src/app/shared/components/magic-word-write/magic-word-write.component';
import { AddBreBuildBotComponent } from '../../add-bre-build-bot/add-bre-build-bot.component';
import { CreateTaskComponent } from '../../create-task/create-task.component';
import { ImportTaskComponent } from '../../import-task/import-task.component';

@Component({
  selector: 'vex-main-task-parent',
  templateUrl: './main-task-parent.component.html',
  styleUrls: ['./main-task-parent.component.scss']
})
export class MainTaskParentComponent implements OnInit {
  projectName: string;
  chatBotId: number
  types: string[]
  form: FormGroup
  taskSearchResult:any[] = []
  indexLimitFilter: IndexLimitFilter = new IndexLimitFilter()
  sourcBoat: string
  taskTypeName: string
  showfilter: boolean = false

  filterCategory: any
  pageNumber = 1
  pageSize = 10
  totalItems: number;
  showTaskSearch = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumnsTask: string[] = ['Delete', 'Task', 'ResponseType', 'ExamplesCount', 'StopDigression', 'Description', 'ImportTask'];
  displayedColumnsEvents: string[] = ['Delete', 'Task', 'ResponseType', 'Type'];
  displayedColumnsKnowldge: string[] = ['Delete', 'Task', 'ResponseType', 'ExamplesCount', 'StopDigression', 'Description'];
  displayedColumnsAds: string[] = ['Delete', 'Task', 'ResponseType'];

  dataSource: MatTableDataSource<any>;
  constructor(private _analyticalService: AnalyticServiceService,
    private _optionsService: OptionsServiceService,
    private _tasksService: TasksService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private notify: NotifyService,
    public dialog: MatDialog,
    private router: Router,

  ) {}

  ngOnInit(): void {
    this.route.parent.params.subscribe((parmas: Params) => {
      this.chatBotId = parmas["projectid"];
      this.indexLimitFilter.workspace_id = this.chatBotId

      this.getProjectLangAndName()
      this.getWorkspaceTypes()
      this.iniateFoem()

    })
  }

  ngAfterViewInit() {
    this.paginator.page.asObservable().subscribe((pageEvent) => {
      this.indexLimitFilter.start = pageEvent.pageIndex * 10,
        this.pageSize = pageEvent.pageSize,
        this.getIndexLimitData()
    });
  }
  getProjectLangAndName() {
    this._optionsService.getProjectLangAndName(this.chatBotId).subscribe((res: any) => {
      // debugger
      this.projectName = res.name;
      this.sourcBoat = this.projectName
      this.taskTypeName = 'dialogflow'

      this.indexLimitFilter.sourceBot = null
      this.indexLimitFilter.type = this.taskTypeName
      this.indexLimitFilter.start = 0
      this.getIndexLimitData()
    })
  }

  iniateFoem(){
    this.form = this.fb.group({
      'Text':['']
    })
  }
  getIndexLimitData() {
    this._tasksService.getIndexLimit(this.indexLimitFilter).subscribe((result: any) => {
      this.dataSource = new MatTableDataSource(result.intents);
      this.totalItems = result.totalCount
    })
  }
  getWorkspaceTypes() {
    this._tasksService.getWorkSpaceTypes(this.chatBotId).subscribe((res: string[]) => {
      res.splice(0, 1)
      this.types = res
    })
  }
  workspaceType(type) {
    debugger
    this.sourcBoat = type
    this.taskTypeName = 'dialogflow'

    if (type == this.projectName) {
      this.indexLimitFilter.sourceBot = null
    } else {
      this.indexLimitFilter.sourceBot = type
    }

    this.indexLimitFilter.type = this.taskTypeName
    this.indexLimitFilter.start = 0
    this.paginator.firstPage()
    this.getIndexLimitData()

  }

  taskType(type) {
    this.showfilter = false
    this.taskTypeName = type
    this.indexLimitFilter.type = this.taskTypeName
    this.indexLimitFilter.start = 0
    this.paginator.firstPage()
    this.getIndexLimitData()
  }

  exportTask(intentId) {
    this._tasksService.exportTask(this.chatBotId, intentId).subscribe((res: any) => {
      if (res.status == 2) {
        this.notify.openSuccessSnackBar("Task Exported")
      }
    })
  }

  returnAfterDigression(row, event) {
    debugger
    row.stopDigression = event.checked
    this._tasksService.returnAfterDigression(row, this.chatBotId).subscribe((res: any) => {
      if (res.success == 1) {
        this.notify.openSuccessSnackBar("Return After Digression ");
      }
    })
  }

  deleteIntent(row) {
    debugger
    let QuestionTitle = "Are you sure you want to delete this ?"
    let pleasWriteMagic = "Please write the **Magic** word to delete"
    let actionName = "delete"
    const dialogRef = this.dialog.open(MagicWordWriteComponent,
      {
        data: { QuestionTitle: QuestionTitle, pleasWriteMagic: pleasWriteMagic, actionName: actionName }, maxHeight: '760px',
        width: '600px',
        position: { top: '100px', left: '400px' }
      });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        debugger
        this._tasksService.deleteIntent(row.intentId, this.chatBotId).subscribe((res: any) => {
          if (res.status == 1) {
            this.notify.openSuccessSnackBar("Successfully deleted");
            this.getIndexLimitData()
          }
        })
      }
    })
  }
  goToTasksFromSearch(intentId){
    this.router.navigate([`/projects/${this.chatBotId}/editTask/${intentId}/0/1`]);
  }
  filterclick() {
    this.showfilter = true
  }

  filterValue(event) {
    debugger
    this.indexLimitFilter.knowledgeType = event.value
    this.paginator.firstPage()
    this.getIndexLimitData()
  }

  deleteBot(event, type) {
    debugger
    let QuestionTitle = "Are you sure you want to delete this Type?"
    let pleasWriteMagic = "Please write the **Magic** word to delete"
    let actionName = "delete"
    let item = type
    event.stopPropagation();
    const dialogRef = this.dialog.open(MagicWordWriteComponent,
      {
        data: { QuestionTitle: QuestionTitle, pleasWriteMagic: pleasWriteMagic, actionName: actionName, item: item, }, maxHeight: '760px',
        width: '600px',
        position: { top: '100px', left: '400px' }
      });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        debugger
        this._tasksService.deleteType(type, this.chatBotId).subscribe((res: any) => {
          if (res.status == '1') {
            this.notify.openSuccessSnackBar("Successfully deleted")
            this.getProjectLangAndName()
            this.getWorkspaceTypes()
          }
          else {
            this.notify.openFailureSnackBar("faild to delete")
          }
        })
      }
    })
  }

  addBreBuildBot() {
    debugger
    const dialogRef = this.dialog.open(AddBreBuildBotComponent,
      { data: { workSpace_id: this.chatBotId,types:this.types}});
    dialogRef.afterClosed().subscribe(res=> {
      this.getProjectLangAndName()
      this.getWorkspaceTypes()
    })
  }

  searchTaskResult(){
    debugger
    const C = this.form.controls['Text'].value
    this._tasksService.matchPattern(this.form.controls['Text'].value,this.chatBotId).subscribe((res:any)=>{
        debugger
        this.taskSearchResult = res.intents.intents
        this.showTaskSearch = true
    })
  }
  onClickedOutside(e:Event){
    this.showTaskSearch = false
  }

  importTask(){
      debugger
      const dialogRef = this.dialog.open(ImportTaskComponent,{data:{workSpace_id: this.chatBotId}});
      dialogRef.afterClosed().subscribe(res=> {
        this.getProjectLangAndName()
        this.getWorkspaceTypes()
      })
  }
  createTask(){
    this.router.navigate([`/projects/${this.chatBotId}/createTask`]);
  }
  goToTaskEdit(responseMode,intentId,clickSource){
    this.router.navigate([`/projects/${this.chatBotId}/editTask/${intentId}/${responseMode}/${clickSource}`]);
  }

}
