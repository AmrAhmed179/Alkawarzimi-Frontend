import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ObjectId } from 'bson';
import { DataService } from 'src/app/core/services/data.service';
import { NotifyService } from 'src/app/core/services/notify.service';
import { AiConversationService } from 'src/app/Services/ai-conversation.service';
import { RagKnowledgeBaseService } from 'src/app/Services/rag-knowledge-base.service';

// class Config {
//   UseExactCache: boolean;
//   prompt: string = ""
//   embedding_model: string = ""
//   semantic_docs_no: number = 0
//   KeyWord_docs_no: number = 0
//   reranker1_limit: number = 0
//   reranker2_limit: number = 0
//   window_size: number = 0
//   threshold_after_reranker1: number = 0
//   threshold_after_reranker2: number = 0
// }

class RetrieverConfig {
  name: string;
  docs_count: number;
  threshold?: number;
}

class ReaderConfig {
  name: string;
}

class ChunkerConfig {
  name: string;
  tokens: number;
  overlap: number;
}
class Reranker {
  enabled: boolean = false
  docs_limit: number = 0
  threshold: number = 0
}

class Config {
  _id: string;
  chatbotId: string;
  projectId: string;
  mode: string;
  prompt: string;
  reranker:Reranker = new Reranker()
  reader: ReaderConfig = new ReaderConfig()
  chunker: ChunkerConfig = new ChunkerConfig()
  indexing: string[] = []
  retriever: RetrieverConfig[] = []
}
@Component({
  selector: 'vex-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  retrieverOptions = ['Similarity', 'Entity', 'KeyWords'];
  indexingOptions = ['Similarity', 'Entity', 'KeyWords'];
  configForm:FormGroup
  configs:Config = new Config()
  chatbotId:string
  constructor(private _ragKnowledgeBaseService:RagKnowledgeBaseService, private _dataService: DataService,
       private fb: FormBuilder,
           private notify: NotifyService,
           private route: ActivatedRoute,
           private dialog: MatDialog) { }

  ngOnInit(): void {
    this.route.parent?.parent?.paramMap.subscribe(params => {
    this.chatbotId = params.get('projectid');
    console.log('Project ID:', this.chatbotId);  // Should now show "150"
    this.getConfigs()
    });
  }

  getConfigs() {
    let body = {
      chatbotId: this.chatbotId,
      projectId: this.chatbotId,
    };
    this._ragKnowledgeBaseService.getConfigs(body).subscribe({
      next: (res: any) => {
        this.configs = res;
        this.initForm();
      },
      error: (err) => {
        console.error('API Error:', err);
      }
    });
  }

  initForm() {
    debugger
      const rerankerConfig = this.configs.reranker || {
    enabled: false,
    docs_limit: 0,
    threshold: 0
  };
    this.configForm = this.fb.group({
      chatbotId: [this.configs.chatbotId],
      projectId: [this.configs.projectId],
      prompt: [this.configs.prompt],
      reader: this.fb.group({
        name: [this.configs.reader.name]
      }),
      chunker: this.fb.group({
        name: [this.configs.chunker.name],
        tokens: [this.configs.chunker.tokens],
        overlap: [this.configs.chunker.overlap]
      }),
       reranker: this.fb.group({
        enabled: [rerankerConfig.enabled],
        docs_limit: [rerankerConfig.docs_limit],
        threshold: [rerankerConfig.threshold]
      }),
          indexing: [this.configs.indexing || []], // multi-select
          retrieverSelection: [this.configs.retriever.map((r: any) => r.name)], // multi-select for names
  retrieverDocs: this.fb.group(
    this.configs.retriever.reduce((acc: any, r: any) => {
      acc[`${r.name}_docs`] = [r.docs_count, [Validators.required, Validators.min(1)]];
      if (r.threshold !== undefined) {
        acc[`${r.name}_threshold`] = [r.threshold, [Validators.required, Validators.min(0), Validators.max(1)]];
      }
      return acc;
    }, {})
    )
    });

    this.handleRetrieverSelectionChanges()
  }

  // INDEXING getters
  // get indexing(): FormArray {
  //   return this.configForm.get('indexing') as FormArray;
  // }

  get retrieverDocsGroup() {
  return this.configForm.get('retrieverDocs') as FormGroup;
  }

// handleRetrieverSelectionChanges() {
//   debugger
//   const retrieverSelectionControl = this.configForm.get('retrieverSelection');
//   const retrieverDocsGroup = this.configForm.get('retrieverDocs') as FormGroup;

//   retrieverSelectionControl?.valueChanges.subscribe((selected: string[]) => {
//     debugger
//     const currentKeys = Object.keys(retrieverDocsGroup.controls);

//     // Add new selections
//     selected.forEach(name => {
//       if (!retrieverDocsGroup.contains(name)) {
//         retrieverDocsGroup.addControl(name, this.fb.control(1, [Validators.required, Validators.min(1)]));
//       }
//     });

//     // Remove unselected
//     currentKeys.forEach(name => {
//       if (!selected.includes(name)) {
//         retrieverDocsGroup.removeControl(name);
//       }
//     });
//   });
// }
defaultRetrievers: RetrieverConfig[] = [
  { name: "Similarity", docs_count: 3, threshold: 0.75 },
  { name: "Entity", docs_count: 3 , threshold: 0.75 },
  { name: "KeyWords", docs_count: 3, threshold: 0.75 }
];

handleRetrieverSelectionChanges() {
  const retrieverSelectionControl = this.configForm.get('retrieverSelection');
  const retrieverDocsGroup = this.configForm.get('retrieverDocs') as FormGroup;

  retrieverSelectionControl?.valueChanges.subscribe((selected: string[]) => {
    const currentKeys = Object.keys(retrieverDocsGroup.controls);

    selected.forEach(name => {
      // check if already exists
      if (!retrieverDocsGroup.contains(`${name}_docs`)) {
        // try to get from configs first
        const retriever = this.configs.retriever.find((r: any) => r.name === name);
        const base = retriever ?? this.defaultRetrievers.find(r => r.name === name);
debugger
        retrieverDocsGroup.addControl(
          `${name}_docs`,
          this.fb.control(base?.docs_count ?? 1, [Validators.required, Validators.min(1)])
        );

        if (base?.threshold !== undefined) {
          retrieverDocsGroup.addControl(
            `${name}_threshold`,
            this.fb.control(base.threshold, [Validators.required, Validators.min(0), Validators.max(1)])
          );
        }
      }
    });

    // remove unselected
    currentKeys.forEach(key => {
      const baseName = key.replace(/_(docs|threshold)$/, '');
      if (!selected.includes(baseName)) {
        retrieverDocsGroup.removeControl(key);
      }
    });
  });
}
  saveConfigs(){
    debugger
    if (this.configForm.valid) {
    const indexing = this.configForm.value.indexing;
    const retrieverSelection = this.configForm.value.retrieverSelection;
    const retrieverDocs = this.configForm.value.retrieverDocs;

    const retriever: any[] = [];
   Object.keys(retrieverDocs).forEach(key => {
   const [name, field] = key.split("_"); // e.g. "KeyWords_docs" -> ["KeyWords", "docs"]

  let obj = retriever.find(r => r.name === name);
  if (!obj) {
    obj = { name };
    retriever.push(obj);
  }

  if (field === "docs") {
    obj.docs_count = retrieverDocs[key];
  } else if (field === "threshold") {
    obj.threshold = retrieverDocs[key];
  }
});


    const payload = {
      chatbotId: this.configForm.value.chatbotId,
      projectId: this.configForm.value.projectId,
      prompt: this.configForm.value.prompt,
      reader: this.configForm.value.reader,
      chunker: this.configForm.value.chunker,
      reranker: this.configForm.value.reranker,
      indexing,
      retriever: retriever
    };

    this._ragKnowledgeBaseService.save_configs(payload).subscribe({
          next: (res: any) => {
            this.notify.openSuccessSnackBar("Configs Saved Successfuly");
          },
          error: (err) => {
            console.error('API Error:', err);
            const errorMsg = err?.error?.message || 'Failed to sa ve configs';
            this.notify.openFailureSnackBar(errorMsg);
          }
        });
      }
}



}


