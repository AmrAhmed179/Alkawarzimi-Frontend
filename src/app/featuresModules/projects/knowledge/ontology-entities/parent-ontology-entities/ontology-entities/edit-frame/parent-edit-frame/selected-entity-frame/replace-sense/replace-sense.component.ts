import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { NodeModel } from 'src/app/Models/ontology-model/node';
import { VerbModel } from 'src/app/Models/ontology-model/verb';
import { OntologyEntitiesService } from 'src/app/Services/Knowlege/ontology-entities.service';
import { DataService } from 'src/app/core/services/data.service';
import { NotifyService } from 'src/app/core/services/notify.service';

@Component({
  selector: 'vex-replace-sense',
  templateUrl: './replace-sense.component.html',
  styleUrls: ['./replace-sense.component.scss']
})
export class ReplaceSenseComponent implements OnInit {

  search:string =''
  currentIndex:number = 0
  senses:any[] =[]
  constructor( private _ontologyEntitiesService:OntologyEntitiesService,
    private route: ActivatedRoute,
    private _dataService: DataService,
    private fb:FormBuilder,
    private notify: NotifyService,
    @Inject(DIALOG_DATA) public data: {senses:NodeModel[] , lang:string, verb:string,projectId:any , sense:any},
   public dialogRef: MatDialogRef<ReplaceSenseComponent>) { }

  ngOnInit(): void {
    this.senses = this.data.senses
  }
  clickOnList(index){
    this.currentIndex = index
  }
  replaceSense(){
    let sense = this.senses[this.currentIndex]

    this._ontologyEntitiesService.replaceSense(this.data.projectId, sense.senseId,this.data.sense, sense.description).subscribe((res:any)=>{
      if(res.status == '1'){
        this.dialogRef.close('success')
      }
    })
  }
}
