import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Subject, takeUntil } from 'rxjs';
import { DataService } from 'src/app/core/services/data.service';
import { NotifyService } from 'src/app/core/services/notify.service';
import { RagKnowledgeBaseService } from 'src/app/Services/rag-knowledge-base.service';
import { ConfirmDialoDeleteComponent } from 'src/app/shared/components/confirm-dialo-delete/confirm-dialo-delete.component';
export interface DocumentItem {
  title: string;
  extension: string;
  fileSize: number;
  labels: string[];
  source: string;
  meta: string;
  doc_uuid: string;
  file_id: string;
  uuid: string;
}
@Component({
  selector: 'vex-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit {

   documents:any[] = []
    chatbotId:string
    search = '';
    clickedItemIndex:number
    flag:boolean = false
    onDestroy$: Subject<void> = new Subject();
    selectedDocId:String
    documentContent:any
    totalPages:number
    contentOrChunks:string
    pageNumber:number = 1
    pageSize:number = 1
    totalItems:number
    title:string = ''

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @Output() documentSelected = new EventEmitter<DocumentItem>();
     constructor(private dialog: MatDialog,private _ragKnowledgeBaseService:RagKnowledgeBaseService, private _dataService: DataService,
      private fb: FormBuilder,
      private notify: NotifyService) { }

    ngOnInit(): void {
    this._dataService.$project_bs.pipe(takeUntil(this.onDestroy$)).subscribe((project) => {
      if (project) {
        this.chatbotId = project._id;
        this.getAllDocuments()
        }
    }
    )
  }

  ngAfterViewInit() {
  debugger
  this.paginator.page.asObservable().subscribe((pageEvent) => {
    debugger
    this.pageNumber = pageEvent.pageIndex + 1
    this.pageSize = pageEvent.pageSize
    if(this.contentOrChunks == 'content'){
        this.get_Doucment_content()
      }
      else{
        this.documentContent = ""
        this.get_Doucment_chunks()
      }
  });
}

    getAllDocuments(){
      let body = {
      "query": "",
      "labels": [],
      "page": 1,
      "pageSize": 50,
      "credentials": {
          "deployment": "Local",
          "key": "",
          "url": "http://weaviate:8080",
          "chatbotId": this.chatbotId,
          "projectId":"",
          "mode": "test"
      }
  }
      this._ragKnowledgeBaseService.getAllDocuments(body).subscribe((res:any)=>{
          this.documents = res.documents
      })
    }
   get_Doucment_content(){
    let body =
    {
    "uuid": this.selectedDocId,
    "page": this.pageNumber,
    "chunkScores": [],
    "credentials": {
        "deployment": "Local",
        "key": "",
        "url": "http://weaviate:8080",
        "chatbotId": this.chatbotId,
        "projectId":"",
        "mode": "test"
      }
    }

    this._ragKnowledgeBaseService.get_Doucment_content(body).subscribe((res:any)=>{
          this.documentContent = res.content[0].content.replace(/\r\n/g, '<br>')
          this.totalPages = res.maxPage
      })
    }
   get_Doucment_chunks(){
    let body =
    {
    "uuid": this.selectedDocId,
    "page": this.pageNumber,
    "pageSize":1,
    "chunkScores": [],
    "credentials": {
        "deployment": "Local",
        "key": "",
        "url": "http://weaviate:8080",
        "chatbotId": this.chatbotId,
        "projectId":"",
        "mode": "test"
      }
    }
    this._ragKnowledgeBaseService.get_Doucment_chunks(body).subscribe((res:any)=>{
      debugger
          this.documentContent = res.chunks[0].content.replace(/\r\n/g, '<br>')
          this.totalPages = res.chunks_count
      })
    }

  filteredDocuments(): DocumentItem[] {
    return this.documents.filter(doc => doc.title.includes(this.search));
  }

  selectDocument(doc: DocumentItem): void {
    this.selectedDocId = doc.uuid
    this.title = doc.title
    this.pageNumber =1
    if(this.contentOrChunks){
      if(this.contentOrChunks == 'content'){
        this.get_Doucment_content()
      }
      else{
        this.documentContent = ""
        this.get_Doucment_chunks()
      }
    }
    else{
      this.contentOrChunks = 'content'
       this.get_Doucment_content()
    }
  }

  selectChunkOrContent(type:string){
    this.contentOrChunks  = type
    this.pageNumber = 1
    this.paginator.firstPage()
    if(this.contentOrChunks == 'content'){
        this.get_Doucment_content()
      }
      else{
        this.documentContent = ""
        this.get_Doucment_chunks()
      }
  }
  deleteDocument(doc: DocumentItem, index){
    debugger
    let body =
    {
    "uuid": doc.uuid,
    "credentials": {
        "deployment": "Local",
        "key": "",
        "url": "http://weaviate:8080",
        "chatbotId": this.chatbotId,
        "projectId":"",
        "mode": "test"
      }
    }

    const dialogRef = this.dialog.open(ConfirmDialoDeleteComponent, {
          width: '300px',
          data: { message: 'Do you want to delete this item?' }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
           this._ragKnowledgeBaseService.delete_document(body).subscribe((res:any)=>{
            const docIndex = this.documents.findIndex(d => d.uuid === doc.uuid);
      if (docIndex !== -1) {
        this.documents.splice(docIndex, 1);
      }
      this.notify.openSuccessSnackBar("Successfully Deleted");
      },
       (err) => {
    this.notify.openFailureSnackBar("Failed to delete document");
    console.error('Delete error:', err);
  }
    )
          }
        });


    }

  ngOnDestroy() {
    console.log("general destroy!!!")
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

}
