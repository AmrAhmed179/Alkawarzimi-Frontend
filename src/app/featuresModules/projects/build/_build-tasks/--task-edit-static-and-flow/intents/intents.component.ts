import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Example, Intent } from 'src/app/Models/build-model/intent-model';
import { TasksService } from 'src/app/Services/Build/tasks.service';
import { OptionsServiceService } from 'src/app/Services/options-service.service';
import { NotifyService } from 'src/app/core/services/notify.service';
import { MagicWordWriteComponent } from 'src/app/shared/components/magic-word-write/magic-word-write.component';

@Component({
  selector: 'vex-intents',
  templateUrl: './intents.component.html',
  styleUrls: ['./intents.component.scss']
})
export class IntentsComponent implements OnInit {

  @Input() workspace_id
  @Input() intentId

  lang:string
  addExampleForm:FormGroup
  showEditForm:boolean =false
  editExampleForm:FormGroup
  seletedEditIndex:number

  examples:Example[] = []
  allExamplescount:number
  intent:Intent
  showTaskTree:boolean = false
  responseMode:number
  eventTask:number
  clickSource:number
  onDestroy$: Subject<void> = new Subject();
  constructor(
    private route: ActivatedRoute,
    private _tasksService: TasksService,
    private fb:FormBuilder,
    private notify:NotifyService,
    private _optionsService:OptionsServiceService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this._optionsService.selectedLang$.pipe(takeUntil(this.onDestroy$)).subscribe((res)=>{
      if(res){
        this.lang = res
        this.getIntent()
      }
    })
  }
  getIntent(){
    this._tasksService.getIntent(this.workspace_id,this.intentId).subscribe((res:any)=>{
      if(res.status ==1){
        debugger
          this.intent = res.intent
          this.examples = this.intent.examples.filter(x=>x.language == this.lang)
          this.allExamplescount = this.intent.examples.length
          this.intiateAddExampleForm()
      }
    })
  }

  intiateAddExampleForm(){
    this.addExampleForm = this.fb.group({
      text:['',[Validators.required, this.duplicateValueValidator(this.examples)]]
    })
  }

  intiateEditExampleForm(){
    this.editExampleForm = this.fb.group({
      text:['',[Validators.required, this.duplicateValueValidator(this.examples)]]
    })
  }

  duplicateValueValidator(existingValues: any[]) {
    return (control: AbstractControl): ValidationErrors | null => {
      const inputValue = control.value;

      if (existingValues.find(x=>x.text ==inputValue )) {
        return { duplicateValue: true };
      }
      return null;
    };
  }

  createExample(){
    this._tasksService.createExample(this.workspace_id,this.lang,this.intentId,this.addExampleForm.controls['text'].value).subscribe((res:any)=>{
      if(res.status == 1){
        this.addExampleForm.reset()
        this.getAllExamples()
      }
    })
  }

  getAllExamples(){
    this._tasksService.getAllExamples(this.workspace_id,this.intentId).subscribe((res:any)=>{
      debugger
      this.examples = res.examples.filter(x=>x.language == this.lang)
      this.allExamplescount = res.examples.length
      this.intiateAddExampleForm()
    })
  }

  deleteExample(example:Example){
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
        this._tasksService.deleteExample(this.workspace_id,this.intentId,example).subscribe((res:any)=>{
          this.getAllExamples()
        })
      }
    })
  }

  showEditExample(example:Example){
    this.showEditForm = true
    this.seletedEditIndex = this.examples.indexOf(example)
    this.intiateEditExampleForm()
    this.editExampleForm.controls['text'].setValue(example.text)
  }

  editExample(example:Example){
    debugger
    const oldExample = example.text
    example.text = this.editExampleForm.controls['text'].value
    this._tasksService.editExample(this.workspace_id,this.intentId,oldExample,example).subscribe((res:any)=>{
      this.showEditForm = false
      this.seletedEditIndex = -1
      this.getAllExamples()
    })
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
