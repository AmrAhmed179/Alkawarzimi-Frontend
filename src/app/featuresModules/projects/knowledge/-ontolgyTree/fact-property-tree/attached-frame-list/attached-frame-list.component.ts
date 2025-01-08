import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/core/services/data.service';
import { EntityModel } from 'src/app/Models/ontology-model/EntityCatogeryModel';
import { OntologyEntitiesService } from 'src/app/Services/Knowlege/ontology-entities.service';
import { OptionsServiceService } from 'src/app/Services/options-service.service';
import { ManageAttachedFramesComponent } from '../manage-attached-frames/manage-attached-frames.component';
import { FactProperties } from 'src/app/Models/ontology-model/fact-property';
import { NotifyService } from 'src/app/core/services/notify.service';
import { FactPropertyTreeService } from 'src/app/Services/Ontology-Tree/fact-property-tree.service';

@Component({
  selector: 'vex-attached-frame-list',
  templateUrl: './attached-frame-list.component.html',
  styleUrls: ['./attached-frame-list.component.scss']
})
export class AttachedFrameListComponent implements OnInit {

  search:string = ''
  entityTypeValue:string = 'all'
  lang:string
  currentClassAndPrpsIndex:number
  classesAndPropsFilter:EntityModel[]
  classesAndProps:EntityModel[]
  FactProperty:FactProperties
  constructor(private route: ActivatedRoute,
    private _ontologyEntitiesService:OntologyEntitiesService,
    private _factPropertyTreeService: FactPropertyTreeService,
    private _dataService: DataService,
    private fb:FormBuilder,
    private notify: NotifyService,
    public dialog: MatDialog,
    private router: Router,
    private _optionsService:OptionsServiceService,
    @Inject(DIALOG_DATA) public data: {FactProperty:FactProperties, projectId:any},
    public dialogRef: MatDialogRef<AttachedFrameListComponent>
  ) { }

  ngOnInit(): void {
    this.dialogRef.beforeClosed().subscribe(() => {
      this.dialogRef.close(this.data.FactProperty); // Pass this value when the dialog is closed by clicking outside
    });  }

  clickOnList(entity:EntityModel, index){
    this.currentClassAndPrpsIndex = index
  }

  addClass(){
    this.dialogRef.close(this.data.FactProperty)
  }
  DeAttachPropertyToFrame(entity:EntityModel){
    var body = {
      factProperty:this.data.FactProperty,
      FrameEntityId: entity._id,
      projectId: this.data.projectId
    }
    this._factPropertyTreeService.deAttachPropertyToFrame(body).subscribe((res:any)=>{
      if(res.status == 1){
        this.notify.openSuccessSnackBar("Data Saved")
        this.data.FactProperty.linkedFramesEntity.splice(this.data.FactProperty.linkedFramesEntity.findIndex(x=>x._id == entity._id),1)
        this.data.FactProperty.linkedFrames.splice(this.data.FactProperty.linkedFrames.findIndex(x=>x == entity._id),1)
      }
    })
    // this.data.FactProperty.linkedFramesEntity.splice(this.data.FactProperty.linkedFramesEntity.findIndex(x=>x._id == entity._id),1)
    // this.data.FactProperty.linkedFrames.splice(this.data.FactProperty.linkedFrames.findIndex(x=>x == entity._id),1)
  }
}
