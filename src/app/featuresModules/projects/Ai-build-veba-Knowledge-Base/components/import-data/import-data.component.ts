import { Component, OnInit, ViewChild } from '@angular/core';
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
import { bufferTime, Subject, takeUntil } from 'rxjs';
import { Config } from '../settings/settings.component';
import { NgModel } from '@angular/forms';


@Component({
  selector: 'vex-import-data',
  templateUrl: './import-data.component.html',
  styleUrls: ['./import-data.component.scss']
})
export class ImportDataComponent implements OnInit {
  configs:Config = new Config()
  addPlainText:boolean = false
  addUrl:boolean = false
   plainText: string = ''
   url:string = ''
  indexStatus:string = ''
  selectedFileIndex = 0
  selectedFileData:File
  overViewOrConfigValue:string = "overView"
  uploadedFiles: any[] = [];
  isImporting = false;
  importProgress: {[key: string]: number} = {};
  importStatus: {[key: string]: string} = {};
  chatbotId
  onDestroy$: Subject<void> = new Subject();
    @ViewChild('urlModel', { static: false }) urlModel?: NgModel;
    @ViewChild('plainTextModel', { static: false }) plainTextModel?: NgModel;

  constructor(private wsService: WebSocketService,
    private dialog:MatDialog,
    private route: ActivatedRoute,
    private _notify:NotifyService,
    private _ragKnowledgeBaseService:RagKnowledgeBaseService) {}

  ngOnInit(): void {

    this.route.parent?.parent?.paramMap.subscribe(params => {
    this.chatbotId = params.get('projectid');
    console.log('Project ID:', this.chatbotId);  // Should now show "150"
    this.getConfigs()
    });

  }

  ngOnDestroy(): void {
    // this.wsService.close();
    this.onDestroy$.next();
     this.onDestroy$.complete();
  }

    getConfigs() {
    let body = {
      chatbotId: this.chatbotId,
      projectId: this.chatbotId,
    };
    this._ragKnowledgeBaseService.getConfigs(body).subscribe({
      next: (res: any) => {
        this.configs = res;
      },
      error: (err) => {
        console.error('API Error:', err);
      }
    });
  }
  private handleServerMessage(message: any): void {
    if(message.type != "ping")
       debugger
    console.log("messageEventInhanleMessgae", message)
    if (message.fileID) {
      this.importStatus[message.fileID] = message.status;
      if (message.status === 'DONE') {
        this.importProgress[message.fileID] = 100;
        this._notify.showSuccess(message.message)
        console.log("DONE", message.message)
        const file = this.uploadedFiles.find(x => x.name === message.fileID);
          file ? file.importStatus = 'IMPORTED' : null;
      }
         if (message.status === 'STARTING') {
        this.importProgress[message.fileID] = 100;
        this._notify.showSTARTING(message.message)
        console.log("STARTING", message.message)
        const file = this.uploadedFiles.find(x => x.name === message.fileID);
          file ? file.importStatus = "STARTING" : null;
      }
      //      if (message.status === 'LOADING') {
      //   this.importProgress[message.fileID] = 100;
      //   this._notify.showLOADING(message.message)
      //   console.log("LOADING", message.message)
      //   const file = this.uploadedFiles.find(x => x.name === message.fileID);
      //     file ? file.importStatus = "LOADING" : null;
      // }
      //   if (message.status === 'EMBEDDING') {
      //   this.importProgress[message.fileID] = 100;
      //   if(message.message !='')
      //     this._notify.showEMBEDDING(message.message)
      //   console.log("EMBEDDING", message.message)
      //   const file = this.uploadedFiles.find(x => x.name === message.fileID);
      //     file ? file.importStatus = "EMBEDDING" : null;
      // }
      //    if (message.status === 'INGESTING') {
      //   this.importProgress[message.fileID] = 100;
      //   this._notify.showINGESTING(message.message)
      //   console.log("INGESTING", message.message)
      //   const file = this.uploadedFiles.find(x => x.name === message.fileID);
      //     file ? file.importStatus = "INGESTING" : null;
      // }
      // if (message.status === 'CHUNKING') {
      //   this.importProgress[message.fileID] = 100;
      //   if(message.message !='')
      //     this._notify.showCHUNKING(message.message)
      //   console.log("CHUNKING", message.message)
      //   const file = this.uploadedFiles.find(x => x.name === message.fileID);
      //     file ? file.importStatus = "CHUNKING" : null;
      // }
      if(message.status === 'ERROR'){
        this._notify.showError(message.message)
        console.log('message error',message)
          const file = this.uploadedFiles.find(x => x.name === message.fileID);
          file ? file.importStatus = "FAILD" : null;
        }
    }
  }

    openUploadDialog() {
      this.uploadedFiles = []
      const dialogRef = this.dialog.open(UploadDialogComponent, {
        width: '400px',
        disableClose: true
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          debugger
         const filesWithConfig = result.map((file: any) => {
          file.reader = this.configs.reader
          file.chunker = this.configs.chunker
          file.importStatus = "Not_Imported"
          file.projectId = this.chatbotId
          file.fileContent = ""
          file.chatBotId = this.chatbotId
          file.PlainTextOrDocument = 1   //1 document  0  plaintext
          return file;
        });


      this.uploadedFiles.push(...filesWithConfig);
      console.log("files", this.uploadedFiles)
        }
    });
  }

   importFiles(): Promise<void> {
    if (this.isImporting || this.uploadedFiles.length === 0) return;
    this.uploadedFiles.forEach((e:any)=>{
      debugger
      if(e.importStatus == "IMPORTED" || e.importStatus == "FAILD" ||e.importStatus == "STARTING"){
        return
      }
      if(e.size > 1024*1024*20){
        e.importStatus = "Exceed_max_Size"
        return
      }

      e.importStatus = "STARTING"
      this._ragKnowledgeBaseService.uploadRagResource(e).subscribe((res:any)=>{
        if(res.status == 1){
          e.importStatus = "IMPORTED"
          this.plainText = ''
          this.url = ''
        }
        else
          e.importStatus = "FAILD"
      })
    })
  }

  uplaodTextFile(): void {
    if(this.plainText.trim() == '')
        return
    const blob = new Blob([this.plainText], { type: 'text/plain' });
    const file = new File([blob], 'plain-text.txt', { type: 'text/plain' }) as any;

    file.reader = this.configs.reader
    file.chunker = this.configs.chunker
    file.importStatus = "Not_Imported"
    file.projectId = this.chatbotId
    file.chatBotId = this.chatbotId
    file.PlainTextOrDocument = 0
    file.fileContent = this.plainText
    this.uploadedFiles = []
    this.uploadedFiles.push(file)
    this.importFiles()
  }

  uplaodUrl(): void {
    if(this.url.trim() == '')
        return
    const blob = new Blob([this.url], { type: 'text/plain' });
    const file = new File([blob], this.url, { type: 'text/plain' }) as any;

    file.reader = this.configs.reader
    file.chunker = this.configs.chunker
    file.importStatus = "Not_Imported"
    file.projectId = this.chatbotId
    file.chatBotId = this.chatbotId
    file.PlainTextOrDocument = 2
    file.url = this.url
    file.fileContent = ''
    this.uploadedFiles = []
    this.uploadedFiles.push(file)
    this.importFiles()
  }

  overViewOrconfig(type){
    this.overViewOrConfigValue = type
  }

  selectedFile(index){
    this.selectedFileIndex = index
    this.selectedFileData = this.uploadedFiles[index]
  }


  removeFile(index){
    this.uploadedFiles.splice(index,1)
  }
  changeChunker(event){
    console.log( this.uploadedFiles[this.selectedFileIndex])
  }
  applySettingsToAll() {
  const chunkerRagConfig = structuredClone(this.uploadedFiles[this.selectedFileIndex].chunker);
  const readerRagConfig = structuredClone(this.uploadedFiles[this.selectedFileIndex].reader);
  this.uploadedFiles.forEach((file, index) => {
    if (index !== this.selectedFileIndex) {
      file.chunker = structuredClone(chunkerRagConfig);
      file.reader = structuredClone(readerRagConfig);
    }
  });
}

}
