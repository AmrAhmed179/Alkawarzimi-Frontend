import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Params } from '@angular/router';
import { TriggeredTasksService } from 'src/app/Services/Build/triggered-tasks.service';
import { MagicWordWriteComponent } from 'src/app/shared/components/magic-word-write/magic-word-write.component';
import { AddBreBuildBotComponent } from '../_build-tasks/add-bre-build-bot/add-bre-build-bot.component';
import { NotifyService } from 'src/app/core/services/notify.service';

interface TriggeredTask {
  _id: number;
  intentId: string;
  name: string;
  triggeringUrl: {
    url: string;
    urlId: number;
  };
  hasTrigger: boolean;
}

interface TasksObj {
  status: number;
  triggeredTasks: TriggeredTask[];
  totalRecords: number;
}

@Component({
  selector: 'vex-build-triggered-tasks',
  templateUrl: './build-triggered-tasks.component.html',
  styleUrls: ['./build-triggered-tasks.component.scss']
})

export class BuildTriggeredTasksComponent implements OnInit {

  displayedColumns: string[] = ['Action', 'URL', 'Tasks'];
  workspace_id: number;
  start: number = 0;
  length: number = 10;
  totalItems = 0;
  triggeredTasks: TriggeredTask[] = [];
  taskId: number;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private TriggeredTasksService: TriggeredTasksService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private notify: NotifyService) { }

  ngOnInit() {
    debugger
    this.route.parent.params.subscribe((params: Params) => {
      this.workspace_id = params["projectid"];
      this.getTriggeredTasks();
    })
  }

  ngAfterViewInit() {
    this.paginator.page.asObservable().subscribe((pageEvent) => {
      this.start = pageEvent.pageIndex;
      this.length = pageEvent.pageSize;

      this.getTriggeredTasks();
    });
  }

  getTriggeredTasks() {
    this.triggeredTasks = []
    this.TriggeredTasksService.GetTasks(this.workspace_id, this.start, this.length).subscribe((response: TasksObj) => {
      if (response) {

        if (typeof response.triggeredTasks === 'string') {
          response.triggeredTasks = JSON.parse(response.triggeredTasks);
        }
        this.triggeredTasks = response.triggeredTasks;
        this.totalItems = response.totalRecords;
        this.taskId = response.triggeredTasks[0]._id;
      }
    });
  }

  // TODO: Connect to the delete task API.

  deleteTriggeredTask(event, type) {

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

    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        debugger
        this.TriggeredTasksService.deleteTask(this.taskId, this.workspace_id).subscribe((res: any) => {
          if (res.status == '1') {
            this.notify.openSuccessSnackBar("Deleted successfully")
          }
          else {
            this.notify.openFailureSnackBar("Failed to delete")
          }
        })
      }
    })
  }


}


