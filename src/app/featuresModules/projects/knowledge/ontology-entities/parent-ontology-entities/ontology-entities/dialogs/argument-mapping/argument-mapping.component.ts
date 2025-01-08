import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { OntologyEntitiesService } from 'src/app/Services/Knowlege/ontology-entities.service';
import { DataService } from 'src/app/core/services/data.service';
import { NotifyService } from 'src/app/core/services/notify.service';
import { ShowRelatedFramesComponent } from '../show-related-frames/show-related-frames.component';

@Component({
  selector: 'vex-argument-mapping',
  templateUrl: './argument-mapping.component.html',
  styleUrls: ['./argument-mapping.component.scss']
})
export class ArgumentMappingComponent implements OnInit {
  features = [{
    IdStr:1,
    name:"Synonyms"
  },{
    IdStr:2,
    name:"Syn:Inverse"
  },{
    IdStr:3,
    name:"Syn:Simultaneous"
  },{
    IdStr:4,
    name:"Result"
  },{
    IdStr:5,
    name:"Implied"
  },]
  form:FormGroup
  constructor( private _ontologyEntitiesService:OntologyEntitiesService,
    private route: ActivatedRoute,
    private _dataService: DataService,
    private fb:FormBuilder,
    private notify: NotifyService,
    @Inject(DIALOG_DATA) public data: { entityId:any,cmp:any,sbj:any,obj:any,features:any,projectId:any},
   public dialogRef: MatDialogRef<ArgumentMappingComponent>) { }

   ngOnInit(): void {
    this.intiateForm()
  }

  intiateForm(){
    this.form = this.fb.group({
      'sbj':[this.data?.sbj],
      'obj':[this.data?.obj],
      'features':[this.data.features?.IdStr]
    })
  }
  saveArgu(){
    var sbj = this.form.controls['sbj'].value
    var obj = this.form.controls['obj'].value
    var feature = this.form.controls['features'].value
    var features
    if(feature){
      features = this.features.find(x=>x.IdStr == feature)
    }
    else{
      features = null
    }

    this._ontologyEntitiesService.setArgumentMapping(this.data.cmp,obj,sbj,features,this.data.entityId,this.data.projectId).subscribe((res:any)=>{
      if(res.status == 1){
        this.notify.openSuccessSnackBar("Argment Map is Saved")
        this.dialogRef.close("success")
      }
    })
  }

}
