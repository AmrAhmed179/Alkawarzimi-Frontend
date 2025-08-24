import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Subject, takeUntil } from 'rxjs';
import { DataService } from 'src/app/core/services/data.service';
import { NotifyService } from 'src/app/core/services/notify.service';
import { RagKnowledgeBaseService } from 'src/app/Services/rag-knowledge-base.service';
import { ConfirmDialoDeleteComponent } from 'src/app/shared/components/confirm-dialo-delete/confirm-dialo-delete.component';
import { DocumentSettingsDialogComponent } from './document-settings-dialog/document-settings-dialog.component';
export class DocumentItem {
  title: string;
  type: number;
  _id: string;
  doc_uuid: string;
  chunked:boolean
  select:boolean = false
}
@Component({
  selector: 'vex-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit {

    plainTextType:boolean = true
    fileType:boolean = true
    urlType:boolean = true
    documents:any[] = []
    filteredDocuments:any =[]
    chatbotId:string
    search = '';
    clickedItemIndex:number
    docType:number
    chunk_id:string
    chunked:boolean
    flag:boolean = false
    selectAllDocuments:boolean = false
    onDestroy$: Subject<void> = new Subject();
    selectedDoc_uuid:String
    documentContent:any
    totalPages:number
    contentOrChunks:string = 'chunk'
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
      this._ragKnowledgeBaseService.getAllDocuments(this.chatbotId, this.chatbotId).subscribe((res:any)=>{
          this.documents = res.data
          this.filteredDocuments  =  this.documents
      })
    }
   get_Doucment_content(){
    let body =
    {
    "uuid": this.selectedDoc_uuid,
    "page": this.pageNumber,
    "chunkScores": [],
    "credentials": {
        "deployment": "Local",
        "key": "",
        "url": "http://weaviate:8080",
        "chatbotId": this.chatbotId,
        "projectId":this.chatbotId,
        "mode": "test"
      }
    }

    this._ragKnowledgeBaseService.get_Doucment_content(body).subscribe((res:any)=>{
          this.documentContent = res.content[0].content.replace(/\r\n/g, '<br>')
          this.totalPages = res.maxPage
      })
    }

 openSettingsDialog() {
    let document = this.filteredDocuments.find(x => x.doc_uuid == this.selectedDoc_uuid);
    let documentIndex = this.filteredDocuments.findIndex(x => x.doc_uuid == this.selectedDoc_uuid);
    const dialogRef = this.dialog.open(DocumentSettingsDialogComponent, {
      width: '500px',
      data: { ...document }  // pass current doc data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
   this._ragKnowledgeBaseService.UpdateDocumentSettings(result).subscribe((res:any)=>{
      if(res.status == 1){
        this.notify.openSuccessSnackBar("Settings Successfully Updated")
        this.filteredDocuments[documentIndex] = result
      }
      else{
        this.notify.openSuccessSnackBar("Settings Faild to Update")
      }
   })
      }
    });
  }

    selectDocument(doc: DocumentItem): void {
    this.selectedDoc_uuid = doc.doc_uuid
    this.title = doc.title
    this.docType = doc.type
    this.chunked = doc.chunked
    this.paginator.firstPage()
    this.pageNumber = 1
    this.get_Doucment_chunks()
  }
  getDocumentsFilter(){
    debugger
    const selectedTypes: number[] = [];

  if (this.plainTextType) selectedTypes.push(0);
  if (this.fileType) selectedTypes.push(1);
  if (this.urlType) selectedTypes.push(2);

  this.filteredDocuments = this.documents.filter(doc =>
    doc.title.toLowerCase().includes(this.search.toLowerCase()) &&
    ( selectedTypes.includes(doc.type))
  );
  }

  clearSelectedDocuments(){
    var deletedDocuments =  this.filteredDocuments.filter(x=>x.select == true)
    const dialogRef = this.dialog.open(ConfirmDialoDeleteComponent, {
          width: '300px',
          data: { message: 'Do you want to delete selected documents?' }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
    deletedDocuments.forEach(doc=>{
     this._ragKnowledgeBaseService.delete_document(this.chatbotId,doc._id, doc.type, false).subscribe((res:any)=>{
     const docIndex = this.documents.findIndex(d => d.doc_uuid === doc.doc_uuid);
      if (docIndex !== -1) {
        this.documents.splice(docIndex, 1);
      }
      this.notify.openSuccessSnackBar(`Successfully Deleted`);
      },
       (err) => {
    this.notify.openFailureSnackBar(`Failed to delete document ${doc.title}`);
    console.error('Delete error:', err);
  }
    )
    })
          }
        });

  }
  showClearButtom() : boolean{
     if(this.filteredDocuments.find(x=>x.select == true))
      return true;
    return false
  }

  get_Doucment_chunks(){
    let projectId = this.chatbotId
  this._ragKnowledgeBaseService.get_Doucment_chunks(this.chatbotId,projectId,this.selectedDoc_uuid,this.docType,this.pageNumber).subscribe((res:any)=>{
    debugger
        this.documentContent = res.chunk.replace(/\r\n/g, '<br>')
        this.totalPages = res.chunksCount
        this.chunk_id = res.chunk_id
    })
  }

  deletePlaintext(){
    const dialogRef = this.dialog.open(ConfirmDialoDeleteComponent, {
          width: '300px',
          data: { message: 'Do you want to delete this item?' }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
           this._ragKnowledgeBaseService.delete_document(this.chatbotId,this.chunk_id, this.docType, true).subscribe((res:any)=>{
          if(res.status == 1){
            this.notify.openSuccessSnackBar("Successfully Deleted");
            this.paginator.firstPage()
          }
      },
       (err) => {
    this.notify.openFailureSnackBar("Failed to delete document");
    console.error('Delete error:', err);
  }
    )
          }
        });
    }

  selectAll(){
    debugger
    this.filteredDocuments.map(x => {
            x.select = this.selectAllDocuments;
            return x;
        })
    }
  ngOnDestroy() {
    console.log("general destroy!!!")
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

}
