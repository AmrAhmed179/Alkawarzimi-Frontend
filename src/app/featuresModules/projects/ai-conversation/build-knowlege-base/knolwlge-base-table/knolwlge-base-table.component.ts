import { Component, OnInit } from '@angular/core';
import { KnowledgeBaseBuildComponent } from '../knowledge-base-Build/knowledge-base.component';
import { MatDialog } from '@angular/material/dialog';
import { ShowContentComponent } from '../dialogs/show-content/show-content.component';
import { FormBuilder } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { DataService } from 'src/app/core/services/data.service';
import { AiConversationService } from 'src/app/Services/ai-conversation.service';
import { NotifyService } from 'src/app/core/services/notify.service';

@Component({
  selector: 'vex-knolwlge-base-table',
  templateUrl: './knolwlge-base-table.component.html',
  styleUrls: ['./knolwlge-base-table.component.scss']
})
export class KnolwlgeBaseTableComponent implements OnInit {

    searchTerm = '';
    clickedItemIndex:number
    flag:boolean = false
    onDestroy$: Subject<void> = new Subject();
    projectId
    documents:any[]  =[
    {
        "title": "الدليل الإجرائي لسياسات تصنيف ومشاركة البيانات - Copy.md",
        "extension": "md",
        "fileSize": 50762,
        "labels": [
            "Document"
        ],
        "source": "",
        "meta": "{\"Reader\": {\"name\": \"Default\", \"variables\": [], \"library\": [\"pypdf\", \"docx\", \"spacy\"], \"description\": \"Ingests text, code, PDF, and DOCX files\", \"config\": {}, \"type\": \"FILE\", \"available\": true}, \"Chunker\": {\"name\": \"Token\", \"variables\": [], \"library\": [], \"description\": \"Splits documents based on word tokens\", \"config\": {\"Tokens\": {\"type\": \"number\", \"value\": \"200\", \"description\": \"Choose how many Token per chunks\", \"values\": []}, \"Overlap\": {\"type\": \"number\", \"value\": 50, \"description\": \"Choose how many Tokens should overlap between chunks\", \"values\": []}}, \"type\": \"\", \"available\": true}}",
        "doc_uuid": "e711c1b4-9adb-53da-97ce-9552f41ae44e",
        "file_id": "الدليل الإجرائي لسياسات تصنيف ومشاركة البيانات - Copy.md",
        "uuid": "e711c1b4-9adb-53da-97ce-9552f41ae44e"
    },
    {
        "title": "سياسات إدارة مصادر البيانات.md",
        "extension": "md",
        "fileSize": 7514,
        "labels": [
            "Document"
        ],
        "source": "",
        "meta": "{\"Reader\": {\"name\": \"Default\", \"variables\": [], \"library\": [\"pypdf\", \"docx\", \"spacy\"], \"description\": \"Ingests text, code, PDF, and DOCX files\", \"config\": {}, \"type\": \"FILE\", \"available\": true}, \"Chunker\": {\"name\": \"Token\", \"variables\": [], \"library\": [], \"description\": \"Splits documents based on word tokens\", \"config\": {\"Tokens\": {\"type\": \"number\", \"value\": \"200\", \"description\": \"Choose how many Token per chunks\", \"values\": []}, \"Overlap\": {\"type\": \"number\", \"value\": 50, \"description\": \"Choose how many Tokens should overlap between chunks\", \"values\": []}}, \"type\": \"\", \"available\": true}}",
        "doc_uuid": "4f925fdb-07a1-569c-93b2-eb73a419565b",
        "file_id": "سياسات إدارة مصادر البيانات.md",
        "uuid": "4f925fdb-07a1-569c-93b2-eb73a419565b"
    },
    {
        "title": "سياسة استخدام الذكاء الاصطناعي التوليدي - Copy.md",
        "extension": "md",
        "fileSize": 24566,
        "labels": [
            "Document"
        ],
        "source": "",
        "meta": "{\"Reader\": {\"name\": \"Default\", \"variables\": [], \"library\": [\"pypdf\", \"docx\", \"spacy\"], \"description\": \"Ingests text, code, PDF, and DOCX files\", \"config\": {}, \"type\": \"FILE\", \"available\": true}, \"Chunker\": {\"name\": \"Token\", \"variables\": [], \"library\": [], \"description\": \"Splits documents based on word tokens\", \"config\": {\"Tokens\": {\"type\": \"number\", \"value\": \"200\", \"description\": \"Choose how many Token per chunks\", \"values\": []}, \"Overlap\": {\"type\": \"number\", \"value\": 50, \"description\": \"Choose how many Tokens should overlap between chunks\", \"values\": []}}, \"type\": \"\", \"available\": true}}",
        "doc_uuid": "8ea9ecf4-0fbf-5425-8850-4cb554b70bce",
        "file_id": "سياسة استخدام الذكاء الاصطناعي التوليدي - Copy.md",
        "uuid": "8ea9ecf4-0fbf-5425-8850-4cb554b70bce"
    },
    {
        "title": "سياسة البيانات الوصفية .md",
        "extension": "md",
        "fileSize": 11192,
        "labels": [
            "Document"
        ],
        "source": "",
        "meta": "{\"Reader\": {\"name\": \"Default\", \"variables\": [], \"library\": [\"pypdf\", \"docx\", \"spacy\"], \"description\": \"Ingests text, code, PDF, and DOCX files\", \"config\": {}, \"type\": \"FILE\", \"available\": true}, \"Chunker\": {\"name\": \"Token\", \"variables\": [], \"library\": [], \"description\": \"Splits documents based on word tokens\", \"config\": {\"Tokens\": {\"type\": \"number\", \"value\": \"200\", \"description\": \"Choose how many Token per chunks\", \"values\": []}, \"Overlap\": {\"type\": \"number\", \"value\": 50, \"description\": \"Choose how many Tokens should overlap between chunks\", \"values\": []}}, \"type\": \"\", \"available\": true}}",
        "doc_uuid": "52081347-1d52-5eb9-8800-63d18b2c8110",
        "file_id": "سياسة البيانات الوصفية .md",
        "uuid": "52081347-1d52-5eb9-8800-63d18b2c8110"
    },
    {
        "title": "سياسة التخزين والإستبقاء .md",
        "extension": "md",
        "fileSize": 17470,
        "labels": [
            "Document"
        ],
        "source": "",
        "meta": "{\"Reader\": {\"name\": \"Default\", \"variables\": [], \"library\": [\"pypdf\", \"docx\", \"spacy\"], \"description\": \"Ingests text, code, PDF, and DOCX files\", \"config\": {}, \"type\": \"FILE\", \"available\": true}, \"Chunker\": {\"name\": \"Token\", \"variables\": [], \"library\": [], \"description\": \"Splits documents based on word tokens\", \"config\": {\"Tokens\": {\"type\": \"number\", \"value\": \"200\", \"description\": \"Choose how many Token per chunks\", \"values\": []}, \"Overlap\": {\"type\": \"number\", \"value\": 50, \"description\": \"Choose how many Tokens should overlap between chunks\", \"values\": []}}, \"type\": \"\", \"available\": true}}",
        "doc_uuid": "2db2d960-9746-53ae-be7f-10679a469043",
        "file_id": "سياسة التخزين والإستبقاء .md",
        "uuid": "2db2d960-9746-53ae-be7f-10679a469043"
    },
    {
        "title": "سياسة النمذجة وهيكلة البيانات.md",
        "extension": "md",
        "fileSize": 20120,
        "labels": [
            "Document"
        ],
        "source": "",
        "meta": "{\"Reader\": {\"name\": \"Default\", \"variables\": [], \"library\": [\"pypdf\", \"docx\", \"spacy\"], \"description\": \"Ingests text, code, PDF, and DOCX files\", \"config\": {}, \"type\": \"FILE\", \"available\": true}, \"Chunker\": {\"name\": \"Token\", \"variables\": [], \"library\": [], \"description\": \"Splits documents based on word tokens\", \"config\": {\"Tokens\": {\"type\": \"number\", \"value\": \"200\", \"description\": \"Choose how many Token per chunks\", \"values\": []}, \"Overlap\": {\"type\": \"number\", \"value\": 50, \"description\": \"Choose how many Tokens should overlap between chunks\", \"values\": []}}, \"type\": \"\", \"available\": true}}",
        "doc_uuid": "40461331-8ad9-524d-9bc4-858a9a0fc7cc",
        "file_id": "سياسة النمذجة وهيكلة البيانات.md",
        "uuid": "40461331-8ad9-524d-9bc4-858a9a0fc7cc"
    },
    {
        "title": "سياسة جودة البيانات.md",
        "extension": "md",
        "fileSize": 16190,
        "labels": [
            "Document"
        ],
        "source": "",
        "meta": "{\"Reader\": {\"name\": \"Default\", \"variables\": [], \"library\": [\"pypdf\", \"docx\", \"spacy\"], \"description\": \"Ingests text, code, PDF, and DOCX files\", \"config\": {}, \"type\": \"FILE\", \"available\": true}, \"Chunker\": {\"name\": \"Token\", \"variables\": [], \"library\": [], \"description\": \"Splits documents based on word tokens\", \"config\": {\"Tokens\": {\"type\": \"number\", \"value\": \"200\", \"description\": \"Choose how many Token per chunks\", \"values\": []}, \"Overlap\": {\"type\": \"number\", \"value\": 50, \"description\": \"Choose how many Tokens should overlap between chunks\", \"values\": []}}, \"type\": \"\", \"available\": true}}",
        "doc_uuid": "cf93442a-4315-568b-a48b-9240e9a67644",
        "file_id": "سياسة جودة البيانات.md",
        "uuid": "cf93442a-4315-568b-a48b-9240e9a67644"
    },
    {
        "title": "سياسة حوكمة البيانات 1.md",
        "extension": "md",
        "fileSize": 36826,
        "labels": [
            "Document"
        ],
        "source": "",
        "meta": "{\"Reader\": {\"name\": \"Default\", \"variables\": [], \"library\": [\"pypdf\", \"docx\", \"spacy\"], \"description\": \"Ingests text, code, PDF, and DOCX files\", \"config\": {}, \"type\": \"FILE\", \"available\": true}, \"Chunker\": {\"name\": \"Token\", \"variables\": [], \"library\": [], \"description\": \"Splits documents based on word tokens\", \"config\": {\"Tokens\": {\"type\": \"number\", \"value\": \"200\", \"description\": \"Choose how many Token per chunks\", \"values\": []}, \"Overlap\": {\"type\": \"number\", \"value\": 50, \"description\": \"Choose how many Tokens should overlap between chunks\", \"values\": []}}, \"type\": \"\", \"available\": true}}",
        "doc_uuid": "14869232-007d-56ff-a408-0660eeb85145",
        "file_id": "سياسة حوكمة البيانات 1.md",
        "uuid": "14869232-007d-56ff-a408-0660eeb85145"
    },
    {
        "title": "سياسة حوكمة البيانات 2.md",
        "extension": "md",
        "fileSize": 49702,
        "labels": [
            "Document"
        ],
        "source": "",
        "meta": "{\"Reader\": {\"name\": \"Default\", \"variables\": [], \"library\": [\"pypdf\", \"docx\", \"spacy\"], \"description\": \"Ingests text, code, PDF, and DOCX files\", \"config\": {}, \"type\": \"FILE\", \"available\": true}, \"Chunker\": {\"name\": \"Token\", \"variables\": [], \"library\": [], \"description\": \"Splits documents based on word tokens\", \"config\": {\"Tokens\": {\"type\": \"number\", \"value\": \"200\", \"description\": \"Choose how many Token per chunks\", \"values\": []}, \"Overlap\": {\"type\": \"number\", \"value\": 50, \"description\": \"Choose how many Tokens should overlap between chunks\", \"values\": []}}, \"type\": \"\", \"available\": true}}",
        "doc_uuid": "bcf636b3-9623-55ea-8766-2ec9374e6077",
        "file_id": "سياسة حوكمة البيانات 2.md",
        "uuid": "bcf636b3-9623-55ea-8766-2ec9374e6077"
    },
    {
        "title": "سياسة حوكمة البيانات 3.md",
        "extension": "md",
        "fileSize": 62448,
        "labels": [
            "Document"
        ],
        "source": "",
        "meta": "{\"Reader\": {\"name\": \"Default\", \"variables\": [], \"library\": [\"pypdf\", \"docx\", \"spacy\"], \"description\": \"Ingests text, code, PDF, and DOCX files\", \"config\": {}, \"type\": \"FILE\", \"available\": true}, \"Chunker\": {\"name\": \"Token\", \"variables\": [], \"library\": [], \"description\": \"Splits documents based on word tokens\", \"config\": {\"Tokens\": {\"type\": \"number\", \"value\": \"200\", \"description\": \"Choose how many Token per chunks\", \"values\": []}, \"Overlap\": {\"type\": \"number\", \"value\": 50, \"description\": \"Choose how many Tokens should overlap between chunks\", \"values\": []}}, \"type\": \"\", \"available\": true}}",
        "doc_uuid": "b0d6d62a-b4a2-505e-a763-382f38b6f8a5",
        "file_id": "سياسة حوكمة البيانات 3.md",
        "uuid": "b0d6d62a-b4a2-505e-a763-382f38b6f8a5"
    },
    {
        "title": "سياسة ذكاء الأعمال و التحليلات ودعم اتخاذ القرار.md",
        "extension": "md",
        "fileSize": 21942,
        "labels": [
            "Document"
        ],
        "source": "",
        "meta": "{\"Reader\": {\"name\": \"Default\", \"variables\": [], \"library\": [\"pypdf\", \"docx\", \"spacy\"], \"description\": \"Ingests text, code, PDF, and DOCX files\", \"config\": {}, \"type\": \"FILE\", \"available\": true}, \"Chunker\": {\"name\": \"Token\", \"variables\": [], \"library\": [], \"description\": \"Splits documents based on word tokens\", \"config\": {\"Tokens\": {\"type\": \"number\", \"value\": \"200\", \"description\": \"Choose how many Token per chunks\", \"values\": []}, \"Overlap\": {\"type\": \"number\", \"value\": 50, \"description\": \"Choose how many Tokens should overlap between chunks\", \"values\": []}}, \"type\": \"\", \"available\": true}}",
        "doc_uuid": "327f8d52-1049-5144-a283-a859e781e5fd",
        "file_id": "سياسة ذكاء الأعمال و التحليلات ودعم اتخاذ القرار.md",
        "uuid": "327f8d52-1049-5144-a283-a859e781e5fd"
    },
    {
        "title": "نظام حماية البيانات الشخصية  .md",
        "extension": "md",
        "fileSize": 31072,
        "labels": [
            "Document"
        ],
        "source": "",
        "meta": "{\"Reader\": {\"name\": \"Default\", \"variables\": [], \"library\": [\"pypdf\", \"docx\", \"spacy\"], \"description\": \"Ingests text, code, PDF, and DOCX files\", \"config\": {}, \"type\": \"FILE\", \"available\": true}, \"Chunker\": {\"name\": \"Token\", \"variables\": [], \"library\": [], \"description\": \"Splits documents based on word tokens\", \"config\": {\"Tokens\": {\"type\": \"number\", \"value\": \"200\", \"description\": \"Choose how many Token per chunks\", \"values\": []}, \"Overlap\": {\"type\": \"number\", \"value\": 50, \"description\": \"Choose how many Tokens should overlap between chunks\", \"values\": []}}, \"type\": \"\", \"available\": true}}",
        "doc_uuid": "6ab0d5db-4e2e-5b29-a7b7-ad680758d940",
        "file_id": "نظام حماية البيانات الشخصية  .md",
        "uuid": "6ab0d5db-4e2e-5b29-a7b7-ad680758d940"
    },
    {
        "title": "الرؤية والرسالة.txt",
        "extension": "txt",
        "fileSize": 994,
        "labels": [
            "Document"
        ],
        "source": "",
        "meta": "{\"Reader\": {\"name\": \"Default\", \"variables\": [], \"library\": [\"pypdf\", \"docx\", \"spacy\"], \"description\": \"Ingests text, code, PDF, and DOCX files\", \"config\": {}, \"type\": \"FILE\", \"available\": true}, \"Chunker\": {\"name\": \"Token\", \"variables\": [], \"library\": [], \"description\": \"Splits documents based on word tokens\", \"config\": {\"Tokens\": {\"type\": \"number\", \"value\": \"2500\", \"description\": \"Choose how many Token per chunks\", \"values\": []}, \"Overlap\": {\"type\": \"number\", \"value\": \"0\", \"description\": \"Choose how many Tokens should overlap between chunks\", \"values\": []}}, \"type\": \"\", \"available\": true}}",
        "doc_uuid": "7a8a1d49-cb2f-5065-acb0-679e8c55fe7d",
        "file_id": "الرؤية والرسالة.txt",
        "uuid": "7a8a1d49-cb2f-5065-acb0-679e8c55fe7d"
    },
    {
        "title": "إجابات الأسئلة حول سياسة إدارة مصادر البيانات.md",
        "extension": "md",
        "fileSize": 4372,
        "labels": [
            "Document"
        ],
        "source": "",
        "meta": "{\"Reader\": {\"name\": \"Default\", \"variables\": [], \"library\": [\"pypdf\", \"docx\", \"spacy\"], \"description\": \"Ingests text, code, PDF, and DOCX files\", \"config\": {}, \"type\": \"FILE\", \"available\": true}, \"Chunker\": {\"name\": \"Markdown\", \"variables\": [], \"library\": [\"langchain_text_splitters\"], \"description\": \"Split documents based on markdown formatting using LangChain\", \"config\": {}, \"type\": \"\", \"available\": true}}",
        "doc_uuid": "7180ec39-2ac2-5171-92de-29fec1023320",
        "file_id": "إجابات الأسئلة حول سياسة إدارة مصادر البيانات.md",
        "uuid": "7180ec39-2ac2-5171-92de-29fec1023320"
    },
    {
        "title": "إجابات حول سياسة استخدام الذكاء الاصطناعي التوليدي.md",
        "extension": "md",
        "fileSize": 6282,
        "labels": [
            "Document"
        ],
        "source": "",
        "meta": "{\"Reader\": {\"name\": \"Default\", \"variables\": [], \"library\": [\"pypdf\", \"docx\", \"spacy\"], \"description\": \"Ingests text, code, PDF, and DOCX files\", \"config\": {}, \"type\": \"FILE\", \"available\": true}, \"Chunker\": {\"name\": \"Markdown\", \"variables\": [], \"library\": [\"langchain_text_splitters\"], \"description\": \"Split documents based on markdown formatting using LangChain\", \"config\": {}, \"type\": \"\", \"available\": true}}",
        "doc_uuid": "a0aeea10-e6fa-5439-ac0c-d191d573a365",
        "file_id": "إجابات حول سياسة استخدام الذكاء الاصطناعي التوليدي.md",
        "uuid": "a0aeea10-e6fa-5439-ac0c-d191d573a365"
    },
    {
        "title": "إجابات_الأسئلة- النمذجة .md",
        "extension": "md",
        "fileSize": 436,
        "labels": [
            "Document"
        ],
        "source": "",
        "meta": "{\"Reader\": {\"name\": \"Default\", \"variables\": [], \"library\": [\"pypdf\", \"docx\", \"spacy\"], \"description\": \"Ingests text, code, PDF, and DOCX files\", \"config\": {}, \"type\": \"FILE\", \"available\": true}, \"Chunker\": {\"name\": \"Markdown\", \"variables\": [], \"library\": [\"langchain_text_splitters\"], \"description\": \"Split documents based on markdown formatting using LangChain\", \"config\": {}, \"type\": \"\", \"available\": true}}",
        "doc_uuid": "8fb8345e-ca19-5ab4-b6a8-e3a75694cceb",
        "file_id": "إجابات_الأسئلة- النمذجة .md",
        "uuid": "8fb8345e-ca19-5ab4-b6a8-e3a75694cceb"
    },
    {
        "title": "إجابات_الأسئلة_التخزين_والنسخ_الاحتياطي.md",
        "extension": "md",
        "fileSize": 738,
        "labels": [
            "Document"
        ],
        "source": "",
        "meta": "{\"Reader\": {\"name\": \"Default\", \"variables\": [], \"library\": [\"pypdf\", \"docx\", \"spacy\"], \"description\": \"Ingests text, code, PDF, and DOCX files\", \"config\": {}, \"type\": \"FILE\", \"available\": true}, \"Chunker\": {\"name\": \"Markdown\", \"variables\": [], \"library\": [\"langchain_text_splitters\"], \"description\": \"Split documents based on markdown formatting using LangChain\", \"config\": {}, \"type\": \"\", \"available\": true}}",
        "doc_uuid": "d87798b1-a391-5175-957a-0785142afe69",
        "file_id": "إجابات_الأسئلة_التخزين_والنسخ_الاحتياطي.md",
        "uuid": "d87798b1-a391-5175-957a-0785142afe69"
    },
    {
        "title": "إجابات_الأسئلة_ذكاء_الأعمال.md",
        "extension": "md",
        "fileSize": 706,
        "labels": [
            "Document"
        ],
        "source": "",
        "meta": "{\"Reader\": {\"name\": \"Default\", \"variables\": [], \"library\": [\"pypdf\", \"docx\", \"spacy\"], \"description\": \"Ingests text, code, PDF, and DOCX files\", \"config\": {}, \"type\": \"FILE\", \"available\": true}, \"Chunker\": {\"name\": \"Markdown\", \"variables\": [], \"library\": [\"langchain_text_splitters\"], \"description\": \"Split documents based on markdown formatting using LangChain\", \"config\": {}, \"type\": \"\", \"available\": true}}",
        "doc_uuid": "5fe851d3-9910-570f-84ba-9b99b8f63729",
        "file_id": "إجابات_الأسئلة_ذكاء_الأعمال.md",
        "uuid": "5fe851d3-9910-570f-84ba-9b99b8f63729"
    },
    {
        "title": "التاريخ.txt",
        "extension": "txt",
        "fileSize": 2670,
        "labels": [
            "Document"
        ],
        "source": "",
        "meta": "{\"Reader\": {\"name\": \"Default\", \"variables\": [], \"library\": [\"pypdf\", \"docx\", \"spacy\"], \"description\": \"Ingests text, code, PDF, and DOCX files\", \"config\": {}, \"type\": \"FILE\", \"available\": true}, \"Chunker\": {\"name\": \"Token\", \"variables\": [], \"library\": [], \"description\": \"Splits documents based on word tokens\", \"config\": {\"Tokens\": {\"type\": \"number\", \"value\": \"2500\", \"description\": \"Choose how many Token per chunks\", \"values\": []}, \"Overlap\": {\"type\": \"number\", \"value\": \"0\", \"description\": \"Choose how many Tokens should overlap between chunks\", \"values\": []}}, \"type\": \"\", \"available\": true}}",
        "doc_uuid": "6f985396-7e0f-51fd-8783-5a50d537678d",
        "file_id": "التاريخ.txt",
        "uuid": "6f985396-7e0f-51fd-8783-5a50d537678d"
    }
];


  constructor(private dialog: MatDialog,private _aiConversationService:AiConversationService, private _dataService: DataService,
      private fb: FormBuilder,
          private notify: NotifyService) { }

  ngOnInit(): void {
          this._dataService.$project_bs.pipe(takeUntil(this.onDestroy$)).subscribe((project) => {
            if (project) {
              this.projectId = project._id;
              //this.getAllDocuments()

             }
          }
        )
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
        "chatbotId": this.projectId,
        "mode": "test"
    }
}
    // this._aiConversationService.getAllDocuments(body).subscribe((res:any)=>{
    //     this.documents = res.documents
    // })
  }
  get filteredContents() {
    const term = this.searchTerm.toLowerCase();
    return this.documents.filter(item =>
      item.file_id.toLowerCase().includes(term) ||
      item.type.toLowerCase().includes(term)
    );
  }

  openDialog(content: any, index) {
    this.clickedItemIndex = index
    this.dialog.open(ShowContentComponent, {
      data: content,
      width: '700px'
    });
  }
  openAddContentDialog(){
   const dialogRef = this.dialog.open(KnowledgeBaseBuildComponent, {
      width: '700px'
    });
    dialogRef.afterClosed().subscribe(result => {
      this.dialog.closeAll()
  });
  }
}
