import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { EntityModel } from 'src/app/Models/ontology-model/EntityCatogeryModel';
import { OntologyEntitiesService } from 'src/app/Services/Knowlege/ontology-entities.service';
import { DataService } from 'src/app/core/services/data.service';
import { NotifyService } from 'src/app/core/services/notify.service';

@Component({
  selector: 'vex-show-related-frames',
  templateUrl: './show-related-frames.component.html',
  styleUrls: ['./show-related-frames.component.scss']
})
export class ShowRelatedFramesComponent implements OnInit {
  relatedFrames:any
  relatedFramesDetalis:any
  senceFrame:string
  showFrameDetalisFlage:boolean = false
  form:FormGroup
  constructor( private _ontologyEntitiesService:OntologyEntitiesService,
    private route: ActivatedRoute,
    private _dataService: DataService,
    private fb:FormBuilder,
    private notify: NotifyService,
    @Inject(DIALOG_DATA) public data: { senseId:string},
   public dialogRef: MatDialogRef<ShowRelatedFramesComponent>) { }

   ngOnInit(): void {
    this.ShowRealtedFrames()
  }
  ShowRealtedFrames(){
    this._ontologyEntitiesService.SenseEXFrameGetAny( this.data.senseId).subscribe((res:any)=>{
      debugger
       this.relatedFrames = res.relatedFrame
    })
  }
  getSenseFrame(senceId){
    this._ontologyEntitiesService.getSenseFrame(senceId).subscribe((res:any)=>{
      debugger
       this.senceFrame = res.description
       this.senceFrame  = this.senceFrame.replace('/','')
    })
  }
  showFrameDetalis(frame){
    this.getSenseFrame(frame.senseId)
    this.showFrameDetalisFlage = true
    this.relatedFramesDetalis = frame.context
  }
}
