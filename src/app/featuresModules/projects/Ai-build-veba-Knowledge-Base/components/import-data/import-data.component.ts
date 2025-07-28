import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PlainTextDialogComponent } from '../../../ai-conversation/build-knowlege-base/dialogs/plain-text-dialog/plain-text-dialog.component';
import { UploadDialogComponent } from '../../../ai-conversation/build-knowlege-base/dialogs/upload-dialog/upload-dialog.component';
import { UrlsDialogComponent } from '../../../ai-conversation/build-knowlege-base/dialogs/urls-dialog/urls-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { WebSocketService } from 'src/app/Services/web-socket-service.service';
import { FileImportChunk } from 'src/app/Models/Ai-Agent/Rag';
import { NotifyService } from 'src/app/core/services/notify.service';
import { RagKnowledgeBaseService } from 'src/app/Services/rag-knowledge-base.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'vex-import-data',
  templateUrl: './import-data.component.html',
  styleUrls: ['./import-data.component.scss']
})
export class ImportDataComponent implements OnInit {

  indexStatus:string = ''
  selectedFileIndex = 0
  selectedFileData:File
  overViewOrConfigValue:string = "overView"
  uploadedFiles: any[] = [];
  isImporting = false;
  importProgress: {[key: string]: number} = {};
  importStatus: {[key: string]: string} = {};
  chatbotId
  constructor(private wsService: WebSocketService,
    private dialog:MatDialog,
    private route: ActivatedRoute,
    private _notify:NotifyService,
    private _ragKnowledgeBaseService:RagKnowledgeBaseService) {}

  ngOnInit(): void {

    this.route.parent?.parent?.paramMap.subscribe(params => {
    this.chatbotId = params.get('projectid');
    console.log('Project ID:', this.chatbotId);  // Should now show "150"
    //this.get_index_status()
    });
    this.wsService.connect(`${environment.VerbaBaseUrl}ws/import_files`);

    this.wsService.onMessage().subscribe({
      next: (message) => this.handleServerMessage(message),
      error: (err) => console.error('WebSocket error:', err)
    });
  }

  ngOnDestroy(): void {
    this.wsService.close();
  }

  async importFiles(): Promise<void> {
    if (this.isImporting || this.uploadedFiles.length === 0) return;

    this.isImporting = true;

    try {
      const credentials = {
        deployment: 'Local',
        key: '',
        url: 'http://weaviate:8080',
        chatbotId: this.chatbotId,
        projectId:"",
        mode: 'test'
      };

      for (let i = 0; i < this.uploadedFiles.length; i++) {
        const file = this.uploadedFiles[i];
        this.importStatus[file.name] = 'STARTING';
        this.importProgress[file.name] = 0;

        try {
          await this.wsService.uploadFile(
            file,
            credentials,
            i === this.uploadedFiles.length - 1
          );
          this.importStatus[file.name] = 'UPLOAD_COMPLETE';
        } catch (error) {
          this.importStatus[file.name] = 'ERROR';
          console.error(`Error uploading ${file.name}:`, error);
        }
      }
      var data = {
        "chunk":"",
        "isLastChunk":false,
        "total":0,
        "order":0,
        "fileID":"",
        "credentials":{
          "deployment":"Local",
          "key":"",
          "url":"http://weaviate:8080",
          "chatbotId":this.chatbotId,
          "projectId":"",
          "mode":"test"},
        "isLastDocument":true
      }

      this.wsService.send(data)
    } finally {
      this.isImporting = false;
    }
  }

  private handleServerMessage(message: any): void {
    debugger
    if (message.fileID) {
      this.importStatus[message.fileID] = message.status;
      if (message.status === 'DONE') {
        this.importProgress[message.fileID] = 100;
        this._notify.showSuccess(message.message)
        const file = this.uploadedFiles.find(x => x.name === message.fileID);
          file ? file.importStatus = 1 : null;
      }
      if(message.status === 'ERROR'){
        this._notify.showError(message.message)
        console.log('message error',message)
          const file = this.uploadedFiles.find(x => x.name === message.fileID);
          file ? file.importStatus = -2 : null;
        }
    }
  }
  openUploadDialog() {
      const dialogRef = this.dialog.open(UploadDialogComponent, {
        width: '400px',
        disableClose: true
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
         const filesWithConfig = result.map((file: any) => {
          file.rag_config = this.wsService.getDefaultRAGConfig();
          file.importStatus = 0   // 0 not imported // 1 imported // -2 fails
          return file;
        });


      this.uploadedFiles.push(...filesWithConfig);
      console.log("files", this.uploadedFiles)
        }
    });
  }
  openPlainTextDialog() {
  // const dialogRef = this.dialog.open(PlainTextDialogComponent, {
  //   width: '700px',
  //   disableClose: true
  // });

  // dialogRef.afterClosed().subscribe(result => {
  //   if (result) {
  //     console.log('Plain text submitted:', result);
  //     // Handle the plain text content here
  //   }
  // });
  }
  openUrlsDialog() {
  // const dialogRef = this.dialog.open(UrlsDialogComponent, {
  //   width: '700px',
  //   disableClose: true
  // });

  // dialogRef.afterClosed().subscribe(result => {
  //   if (result) {
  //     debugger
  //     console.log('Plain text submitted:', result);
  //     // Handle the plain text content here
  //   }
  // });
  }

  overViewOrconfig(type){
    this.overViewOrConfigValue = type
  }

  selectedFile(index){
    this.selectedFileIndex = index
    this.selectedFileData = this.uploadedFiles[index]

  }
  CreateIndex(){
   let body =  {
    "deployment": "Local",
    "key": "",
    "url": "http://weaviate:8080",
    "chatbotId": this.chatbotId,
    "projectId":"",
    "mode": "test"
    }
    this._ragKnowledgeBaseService.createIndex(body).subscribe({
      next: (res: any) => {
        this._notify.openSuccessSnackBar("Index created successfully");
      },
      error: (err) => {
        console.error('API Error:', err);
        const errorMsg = err?.error?.message || 'Failed to create index. Please try again.';
        this._notify.openFailureSnackBar(errorMsg);
      }
    });
  }
  get_index_status(){
   let body =  {
    "deployment": "Local",
    "key": "",
    "url": "http://weaviate:8080",
    "chatbotId": this.chatbotId,
    "projectId":"",
    "mode": "test"
    }
    this._ragKnowledgeBaseService.get_index_status(body).subscribe({
      next: (res: any) => {
        this.indexStatus = res.status
      },
      error: (err) => {
        console.error('API Error:', err);
        const errorMsg = err?.error?.message || 'Failed to create index. Please try again.';
        this._notify.openFailureSnackBar(errorMsg);
      }
    });
  }

    removeFile(index){
    this.uploadedFiles.splice(index,1)
  }
  changeChunker(event){
    console.log( this.uploadedFiles[this.selectedFileIndex])
  }
  applySettingsToAll() {
  const chunkerRagConfig = structuredClone(this.uploadedFiles[this.selectedFileIndex].rag_config.Chunker);
  this.uploadedFiles.forEach((file, index) => {
    if (index !== this.selectedFileIndex) {
      file.rag_config.Chunker = structuredClone(chunkerRagConfig);
    }
  });
}
  ///////////////////////////////////

}
