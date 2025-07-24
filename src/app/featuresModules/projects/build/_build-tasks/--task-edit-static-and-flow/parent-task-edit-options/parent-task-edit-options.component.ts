import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Example, Intent, IntentSettings } from 'src/app/Models/build-model/intent-model';
import { TaskTree } from 'src/app/Models/build-model/task-tree-model';
import { TasksService } from 'src/app/Services/Build/tasks.service';
import { OptionsServiceService } from 'src/app/Services/options-service.service';
import { NotifyService } from 'src/app/core/services/notify.service';
import { MagicWordWriteComponent } from 'src/app/shared/components/magic-word-write/magic-word-write.component';

@Component({
  selector: 'vex-parent-task-edit-options',
  templateUrl: './parent-task-edit-options.component.html',
  styleUrls: ['./parent-task-edit-options.component.scss']
})
export class ParentTaskEditOptionsComponent implements OnInit {

  addExampleForm:FormGroup
  showEditForm:boolean =false
  editExampleForm:FormGroup
  seletedEditIndex:number
  mainTaskId:string
  showCreateTask:boolean = false
  createParentId:string
  tasksTree:TaskTree[]
  TREE_DATA:TaskTree[]

  treeControl = new NestedTreeControl<TaskTree>(node => node.children);

  dataSource = new MatTreeNestedDataSource<TaskTree>();
  projectName:string
  IframLink:string
  examples:Example[] = []
  allExamplescount:number
  intent:Intent
  showTaskTree:boolean = false
  intentId:string
  responseMode:number
  eventTask:number
  clickSource:number
  workspace_id:any
  taskName:string
  tapeName:string
  lang:string
  onDestroy$: Subject<void> = new Subject();

  constructor(private route: ActivatedRoute,
    private _tasksService: TasksService,
    private fb:FormBuilder,
    private notify:NotifyService,
    private _optionsService:OptionsServiceService,
    public dialog: MatDialog,
    private router: Router,


    ) {
    }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.route.parent.params.subscribe((parmas: Params) => {
        this.workspace_id = parmas["projectid"];
      })
      this.intentId = params['intentId'];
      this.eventTask =  +params['eventTask'];
      this.clickSource =  +params['clickSource'];

      this.getTaskSetting()
    });
  }

  detectTapeName(){
    if(this.clickSource == 1 && this.eventTask == 0){
      this.tapeName = 'Intents'
    }

    if(this.clickSource == 1 && this.eventTask == 1){
      if(this.responseMode == 2)
      {
        this.tapeName = 'Diagram Flow'
      }
      if(this.responseMode == 1){
        this.tapeName ='Static Responses'
      }
    }

    if(this.clickSource == 2 &&  this.responseMode == 2){
      this.tapeName = 'Diagram Flow'
    }

    if(this.clickSource == 2 && this.responseMode == 1){
      this.tapeName = 'Static Responses'
    }
  }
  resetCreateFlag(event){
    this.showCreateTask = event
  }
  editTask(node){
    this.router.navigate([`/projects/${this.workspace_id}/editTask/${node.intentId}/0/2`]);
  }

  deleteTask(node){
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
        this._tasksService.deleteIntent(node.intentId, this.workspace_id).subscribe((res: any) => {
          if (res.status == 1) {
            this.notify.openSuccessSnackBar("Successfully deleted");
            if(node.parentId){
              this.router.navigate([`/projects/${this.workspace_id}/editTask/${this.mainTaskId}/0/2`]);
            }
            else{
              this.router.navigate([`/projects/${this.workspace_id}/home`]);
            }
          }

        })
      }
    })
  }
  addTask(node){
    this.createParentId = node.intentId
    this.showCreateTask = true

  }
  clickOnTapButton(tapeName:string){
    this.tapeName = tapeName
  }
  showAndHideTaskTree(){
    this.showTaskTree =  !this.showTaskTree
  }
  getTaskSetting(){
    this._tasksService.getTaskSetting(this.workspace_id,this.intentId).subscribe((res:any)=>{
      debugger
      this.responseMode = res.intent.responseMode
      this.taskName = res.intent.name
      this.detectTapeName()
      this.getTaskTree()
    })
  }

  getTaskTree(){
    this._tasksService.getTasksTree(this.workspace_id,this.intentId).subscribe((res:any)=>{
      debugger
      this.tasksTree = res.tasks
      this.mainTaskId = res.mainTaskId
       this.TREE_DATA = this.constructTree()
      this.dataSource.data = this.TREE_DATA

      this.expandAllNodes()
      })
  }

  hasChild = (_: number, node: TaskTree) => !!node.children && node.children.length > 0;

  constructTree(): TaskTree[] {
    const tree: TaskTree[] = [];
    // Create a map to store intents by their intentId
    const map: { [key: string]: TaskTree } = {};

    // Initialize the map with intents
    this.tasksTree.forEach(intent => {
      map[intent.intentId] = { ...intent, children: [] };
    });

    // Iterate over the data to construct the tree
    this.tasksTree.forEach(intent => {
      if (intent.parentId) {
        // If the intent has a parentId, add it as a child to its parent
        const parent = map[intent.parentId];
        if (parent) {
          parent.children.push(map[intent.intentId]);
        }
      } else {
        // If the intent does not have a parentId, it is a root node
        tree.push(map[intent.intentId]);
      }
    });
    console.log(tree)
    return tree;
  }

  expandTree(node: TaskTree): void {
    this.treeControl.expand(node);
    if (node.children) {
      node.children.forEach(child => {
        this.expandTree(child);
      });
    }
  }

  savedSettingIntent(intentSettings:IntentSettings){
    this.responseMode = intentSettings.responseMode
    this.detectTapeName()
  }
  expandAllNodes(): void {
    this.dataSource.data.forEach(node => {
      this.expandTree(node);
    });
  }

  collapseTree(node: TaskTree): void {
    this.treeControl.collapse(node);
    if (node.children) {
      node.children.forEach(child => {
        this.collapseTree(child);
      });
    }
  }

  collapseAllNodes(): void {
    this.dataSource.data.forEach(node => {
      this.collapseTree(node);
    });
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
