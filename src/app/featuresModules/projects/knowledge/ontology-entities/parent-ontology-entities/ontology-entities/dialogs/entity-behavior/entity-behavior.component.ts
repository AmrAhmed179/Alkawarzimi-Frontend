import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { OntologyEntitiesService } from 'src/app/Services/Knowlege/ontology-entities.service';
import { DataService } from 'src/app/core/services/data.service';
import { NotifyService } from 'src/app/core/services/notify.service';
import { ArgumentMappingComponent } from '../argument-mapping/argument-mapping.component';
import { BehaviourModel, EntityBehaviourModel } from 'src/app/Models/ontology-model/entity-Behaviour-model';
import { EntityModel } from 'src/app/Models/ontology-model/EntityCatogeryModel';

@Component({
  selector: 'vex-entity-behavior',
  templateUrl: './entity-behavior.component.html',
  styleUrls: ['./entity-behavior.component.scss']
})
export class EntityBehaviorComponent implements OnInit {

  dataProperty:boolean
  onTree:boolean
  showData:boolean = false
  obj:BehaviourModel[]
  cmp:BehaviourModel[]
  sbj:BehaviourModel[]
  form:FormGroup
  ontologyEntities:EntityModel[]
  currentIndex:number
  constructor( private _ontologyEntitiesService:OntologyEntitiesService,
    private route: ActivatedRoute,
    private _dataService: DataService,
    private fb:FormBuilder,
    private notify: NotifyService,
    @Inject(DIALOG_DATA) public data: {projectId:any, entityId:any, ontologyEntities:EntityModel[]},
   public dialogRef: MatDialogRef<EntityBehaviorComponent>) { }


  ngOnInit(): void {
    this.useEntitie()
    this.intiateForm()
  }
  useEntitie(){
    this._ontologyEntitiesService.useEntitie(this.data.entityId, this.data.projectId).subscribe((res:EntityBehaviourModel)=>{
      debugger
      this.onTree = res.onTree
      this.dataProperty = res.dataProperty
      this.obj =res.obj
      this.cmp =res.cmp
      this.sbj =res.sbj
      this.ontologyEntities = this.data.ontologyEntities
      this.showData = true

    })
  }

  intiateForm(){
    this.form = this.fb.group({
      'search':[''],
    })
  }
  replace(){
   var toEntity = this.ontologyEntities[this.currentIndex]
    this._ontologyEntitiesService.replaceEntity(this.data.entityId,toEntity._id,this.data.projectId).subscribe((res:any)=>{
      debugger
      this.notify.openSuccessSnackBar("Replace Entity is updated")
      this.dialogRef.close()
    })
  }

  formChang(){
    debugger
    var search= this.form?.controls['search'].value
    var filteredData:EntityModel[]

      filteredData = this.data.ontologyEntities.filter(x=>x.entityInfo[0].entityText.trim().includes(search.trim()))

      this.ontologyEntities = filteredData
  }
  clickOnList(entity:EntityModel, index){
    this.currentIndex = index
  }
}
