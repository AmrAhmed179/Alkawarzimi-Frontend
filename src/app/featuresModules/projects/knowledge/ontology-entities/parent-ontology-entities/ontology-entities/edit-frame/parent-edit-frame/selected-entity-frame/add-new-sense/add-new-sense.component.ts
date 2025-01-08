import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { NodeModel } from 'src/app/Models/ontology-model/node';
import { OntologyEntitiesService } from 'src/app/Services/Knowlege/ontology-entities.service';
import { DataService } from 'src/app/core/services/data.service';
import { NotifyService } from 'src/app/core/services/notify.service';
import { SelectFactCategoryComponent } from '../../../../dialogs/select-fact-category/select-fact-category.component';
import { VerbModel } from 'src/app/Models/ontology-model/verb';

@Component({
  selector: 'vex-add-new-sense',
  templateUrl: './add-new-sense.component.html',
  styleUrls: ['./add-new-sense.component.scss']
})
export class AddNewSenseComponent implements OnInit {

  search:string =''
  currentIndex:number = 0
  senses:any[] =[]
  constructor( private _ontologyEntitiesService:OntologyEntitiesService,
    private route: ActivatedRoute,
    private _dataService: DataService,
    private fb:FormBuilder,
    private notify: NotifyService,
    @Inject(DIALOG_DATA) public data: {senses:NodeModel[] , lang:string, verb:string,projectId:any },
   public dialogRef: MatDialogRef<AddNewSenseComponent>) { }

  ngOnInit(): void {
    this.senses = this.data.senses
  }
  clickOnList(index){
    this.currentIndex = index
  }
  addSense(){
    let sense = this.senses[this.currentIndex]
    let verb = new VerbModel()
    verb.lang = this.data.lang
    verb.verb = this.data.verb
    verb.senseId = sense.senseId
    verb.generated = false
    verb.description = sense.description
    verb.function = 0
    verb.synonyms = []
    verb.frq = 0
    verb.frames = []
    verb.found = false
    verb.templateId = 0
    verb.verbs =  null
    verb.synonmsSet = null
    this._ontologyEntitiesService.createVerbFrame(this.data.projectId, verb).subscribe((res:any)=>{
      if(res.status == '1'){
        this.dialogRef.close(res.verb)
      }
    })
  }
}
