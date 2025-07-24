import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { EntityModel } from 'src/app/Models/ontology-model/EntityCatogeryModel';
import { RelatedFramesAndEligible } from 'src/app/Models/ontology-model/related-frames_And_eligible';
import { OntologyEntitiesService } from 'src/app/Services/Knowlege/ontology-entities.service';
import { DataService } from 'src/app/core/services/data.service';
import { NotifyService } from 'src/app/core/services/notify.service';

@Component({
  selector: 'vex-show-realted-frames-and-eligible',
  templateUrl: './show-realted-frames-and-eligible.component.html',
  styleUrls: ['./show-realted-frames-and-eligible.component.scss']
})
export class ShowRealtedFramesAndEligibleComponent implements OnInit {

  relatedFrames:RelatedFramesAndEligible[]
  constructor( private _ontologyEntitiesService:OntologyEntitiesService,
    private route: ActivatedRoute,
    private _dataService: DataService,
    private fb:FormBuilder,
    private notify: NotifyService,
    @Inject(DIALOG_DATA) public data: {senseId:string, entityId:any,projectId ,childrenEntites:EntityModel[]},
   public dialogRef: MatDialogRef<ShowRealtedFramesAndEligibleComponent>) { }

  ngOnInit(): void {
    this.ShowRealtedFramesAndEligible()
  }
  ShowRealtedFramesAndEligible(){
    this._ontologyEntitiesService.SenseEXFrame("'frameRelation.sameEventFrame':1,'frameRelation.svl':1", this.data.senseId).subscribe((res:any)=>{
      debugger
       this.relatedFrames = res._v?.frameRelation[0]?.sameEventFrame
    })
  }
  frameIsCreated(senseId){
    debugger

    var d =  this.data.childrenEntites
     var result = this.data.childrenEntites.find(x=>x.senseId == senseId)
     return result;
  }
  createRelatedFrame(item){
    this._ontologyEntitiesService.createRelatedFrame(this.data.projectId,this.data.entityId, item).subscribe((res:any)=>{
      if(res.status == 1)
        this.dialogRef.close("sucess")
    })
  }
}
