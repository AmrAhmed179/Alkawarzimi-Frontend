import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { NodeModel } from 'src/app/Models/ontology-model/node';
import { OntologyEntitiesService } from 'src/app/Services/Knowlege/ontology-entities.service';
import { DataService } from 'src/app/core/services/data.service';
import { NotifyService } from 'src/app/core/services/notify.service';
import { ReplaceSenseComponent } from '../replace-sense/replace-sense.component';

@Component({
  selector: 'vex-show-en',
  templateUrl: './show-en.component.html',
  styleUrls: ['./show-en.component.scss']
})
export class ShowENComponent implements OnInit {

  stems:any[] =[]
  constructor( private _ontologyEntitiesService:OntologyEntitiesService,
    private route: ActivatedRoute,
    private _dataService: DataService,
    private fb:FormBuilder,
    private notify: NotifyService,
    @Inject(DIALOG_DATA) public data: {senseId:number},
   public dialogRef: MatDialogRef<ShowENComponent>) { }

  ngOnInit(): void {
    this._ontologyEntitiesService.GetEnStem(this.data.senseId).subscribe((res:any)=>{
      this.stems = res.stems
    })
  }

}
