import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { DataService } from 'src/app/core/services/data.service';
import { CorpusIntent, EntityModelView } from 'src/app/Models/ontology-model/corpus-intents';
import { FactPropertyTreeService } from 'src/app/Services/Ontology-Tree/fact-property-tree.service';
import { OptionsServiceService } from 'src/app/Services/options-service.service';
const ELEMENT_DATA: any[] = [

    {
        "_id": 723,
        "header": "",
        "body": "ما كيفية التصرف فقدان العميل أمتعة",
        "tweetId": "",
        "userName": "",
        "profileUrl": "",
        "isReviewed": false,
        "annotatedEntities": [],
        "pattern": [
            {
                "patternId": "1",
                "answer": "<p>حقوق المسافر في حالة فقدان/تلف/تأخر الأمتعة</p>"
            }
        ],
        "type": 14,
        "deletedTag": 0,
        "deletedPatternTag": 0,
        "IntentType": 0,
        "created": "/Date(1726661658494)/",
        "answerResult": 0,
        "deleted": false,
        "responseTypeText": true,
        "categoryId": 0
    },
    {
        "_id": 724,
        "header": "",
        "body": "ما حقوق العميل فقدان العميل أمتعة",
        "tweetId": "",
        "userName": "",
        "profileUrl": "",
        "isReviewed": false,
        "annotatedEntities": [],
        "pattern": [
            {
                "patternId": "1",
                "answer": "<p>حقوق المسافر في حالة فقدان/تلف/تأخر الأمتعة</p>"
            }
        ],
        "type": 14,
        "deletedTag": 0,
        "deletedPatternTag": 0,
        "IntentType": 0,
        "created": "/Date(1726661658504)/",
        "answerResult": 0,
        "deleted": false,
        "responseTypeText": true,
        "categoryId": 0
    },
    {
        "_id": 725,
        "header": "",
        "body": "ما كيفية التصرف فقدان العميل أغراض ثمينة",
        "tweetId": "",
        "userName": "",
        "profileUrl": "",
        "isReviewed": false,
        "annotatedEntities": [],
        "pattern": [
            {
                "patternId": "1",
                "answer": "<p>عند فقدان المسافر أغراضاً ثمينة</p>"
            }
        ],
        "type": 14,
        "deletedTag": 0,
        "deletedPatternTag": 0,
        "IntentType": 0,
        "created": "/Date(1726661658513)/",
        "answerResult": 0,
        "deleted": false,
        "responseTypeText": true,
        "categoryId": 0
    },
    {
        "_id": 726,
        "header": "",
        "body": "ما حقوق العميل فقدان العميل أغراض ثمينة",
        "tweetId": "",
        "userName": "",
        "profileUrl": "",
        "isReviewed": false,
        "annotatedEntities": [],
        "pattern": [
            {
                "patternId": "1",
                "answer": "<p>عند فقدان المسافر أغراضاً ثمينة</p>"
            }
        ],
        "type": 14,
        "deletedTag": 0,
        "deletedPatternTag": 0,
        "IntentType": 0,
        "created": "/Date(1726661658522)/",
        "answerResult": 0,
        "deleted": false,
        "responseTypeText": true,
        "categoryId": 0
    },
    {
        "_id": 727,
        "header": "",
        "body": "ما كيفية التصرف تلف أمتعة العميل",
        "tweetId": "",
        "userName": "",
        "profileUrl": "",
        "isReviewed": false,
        "annotatedEntities": [],
        "pattern": [
            {
                "patternId": "1",
                "answer": "<p>حقوق المسافر في حالة فقدان/تلف/تأخر الأمتعة</p>"
            }
        ],
        "type": 14,
        "deletedTag": 0,
        "deletedPatternTag": 0,
        "IntentType": 0,
        "created": "/Date(1726661658531)/",
        "answerResult": 0,
        "deleted": false,
        "responseTypeText": true,
        "categoryId": 0
    },
    {
        "_id": 728,
        "header": "",
        "body": "ما حقوق العميل تلف أمتعة العميل",
        "tweetId": "",
        "userName": "",
        "profileUrl": "",
        "isReviewed": false,
        "annotatedEntities": [],
        "pattern": [
            {
                "patternId": "1",
                "answer": "<p>حقوق المسافر في حالة فقدان/تلف/تأخر الأمتعة</p>"
            }
        ],
        "type": 14,
        "deletedTag": 0,
        "deletedPatternTag": 0,
        "IntentType": 0,
        "created": "/Date(1726661658541)/",
        "answerResult": 0,
        "deleted": false,
        "responseTypeText": true,
        "categoryId": 0
    },
    {
        "_id": 729,
        "header": "",
        "body": "ما كيفية التصرف تأخر أمتعة العميل",
        "tweetId": "",
        "userName": "",
        "profileUrl": "",
        "isReviewed": false,
        "annotatedEntities": [],
        "pattern": [
            {
                "patternId": "1",
                "answer": "<p>حقوق المسافر في حالة فقدان/تلف/تأخر الأمتعة</p>"
            }
        ],
        "type": 14,
        "deletedTag": 0,
        "deletedPatternTag": 0,
        "IntentType": 0,
        "created": "/Date(1726661658551)/",
        "answerResult": 0,
        "deleted": false,
        "responseTypeText": true,
        "categoryId": 0
    },
    {
        "_id": 730,
        "header": "",
        "body": "ما وقت تأخر أمتعة العميل",
        "tweetId": "",
        "userName": "",
        "profileUrl": "",
        "isReviewed": false,
        "annotatedEntities": [],
        "pattern": [
            {
                "patternId": "1",
                "answer": "<p>حقوق المسافر في حالة فقدان/تلف/تأخر الأمتعة</p>"
            }
        ],
        "type": 14,
        "deletedTag": 0,
        "deletedPatternTag": 0,
        "IntentType": 0,
        "created": "/Date(1726661658560)/",
        "answerResult": 0,
        "deleted": false,
        "responseTypeText": true,
        "categoryId": 0
    },
    {
        "_id": 731,
        "header": "",
        "body": "ما حقوق العميل تأخر أمتعة العميل",
        "tweetId": "",
        "userName": "",
        "profileUrl": "",
        "isReviewed": false,
        "annotatedEntities": [],
        "pattern": [
            {
                "patternId": "1",
                "answer": "<p>حقوق المسافر في حالة فقدان/تلف/تأخر الأمتعة</p>"
            }
        ],
        "type": 14,
        "deletedTag": 0,
        "deletedPatternTag": 0,
        "IntentType": 0,
        "created": "/Date(1726661658570)/",
        "answerResult": 0,
        "deleted": false,
        "responseTypeText": true,
        "categoryId": 0
    },
    {
        "_id": 732,
        "header": "",
        "body": "ما كيفية التصرف إلغاء الناقل الجوي رحلة",
        "tweetId": "",
        "userName": "",
        "profileUrl": "",
        "isReviewed": false,
        "annotatedEntities": [],
        "pattern": [
            {
                "patternId": "1",
                "answer": "<p>عند إلغاء الناقل الجوي رحلة</p>"
            }
        ],
        "type": 14,
        "deletedTag": 0,
        "deletedPatternTag": 0,
        "IntentType": 0,
        "created": "/Date(1726661658579)/",
        "answerResult": 0,
        "deleted": false,
        "responseTypeText": true,
        "categoryId": 0
    }

];
@Component({
  selector: 'vex-view-ontology-intents',
  templateUrl: './view-ontology-intents.component.html',
  styleUrls: ['./view-ontology-intents.component.scss']
})

export class ViewOntologyIntentsComponent implements OnInit {
  onDestroy$: Subject<void> = new Subject();
  projectId:string
  projectName:string
  page:number = 1
  projectS:any[]
  corpusIntents:CorpusIntent[] = []
  totalitems
  displayedColumns: string[] = ['position'];
  dataSource: MatTableDataSource<any>;
  entities:EntityModelView[] = []
  activeTap = 'AllGeneratedIntents'
  pageSize:number
  pageNumber:number = 1
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(    private _factPropertyTreeService: FactPropertyTreeService,
    private _dataService: DataService,
    private _optionsService:OptionsServiceService,


  ) { }

  ngOnInit(): void {
    this._dataService.$project_bs.pipe(takeUntil(this.onDestroy$)).subscribe((project:any)=>{
      if(project){
        debugger
      this.projectId = project._id
      this.projectName = project.name

      this.getEntities()
     // this.dataSource = ELEMENT_DATA;
      this.getAllProjects()
      this.corpusIndexIntents()
  }}
  )
  }

  ngAfterViewInit() {
    this.paginator.page.asObservable().subscribe((pageEvent) => {
      this.pageNumber = pageEvent.pageIndex + 1,
        this.pageSize = pageEvent.pageSize,
        this.corpusIndexIntents()
    });
  }
  getEntities(){
    this._factPropertyTreeService.getEntities('ques_tool',this.projectId,0).subscribe((res:any)=>{
      this.entities = res.entities
    })
  }

  corpusIndexIntents(){
    this._factPropertyTreeService.CorpusIndexIntents('10',this.projectId,this.pageNumber).subscribe((res:any)=>{
      debugger
      this.corpusIntents = res.data
      this.dataSource = new MatTableDataSource(this.corpusIntents);
      this.totalitems = res.meta.total
    })
  }

  factsAsHTML(){
    this._factPropertyTreeService.factsAsHTML(this.projectId, this.projectName).subscribe((response: Blob)=>{
      const url = window.URL.createObjectURL(response);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Fact_Developers-Flow.html'; // Specify the file name
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url); // Free up memory
    })
  }
  errorHTML(){
    this._factPropertyTreeService.errorHTML(this.projectId, this.projectName).subscribe((response: Blob)=>{
      const url = window.URL.createObjectURL(response);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'error_Developers-Flow'; // Specify the file name
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url); // Free up memory
    })
  }

  factsAsTable(){
    this._factPropertyTreeService.factsAsTable(this.projectId, this.projectName).subscribe((response: Blob)=>{
      const url = window.URL.createObjectURL(response);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'factsAsTable_Fact_Developers-Flow'; // Specify the file name
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url); // Free up memory
    })
  }

  getAllProjects(){
    debugger
    this._optionsService.getAllProjects().subscribe((res:any)=>{
      debugger
    this.projectS = res
     this.projectName = this.projectS?.find(x=>x._id == this.projectId)?.name
    })
  }
  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

}
