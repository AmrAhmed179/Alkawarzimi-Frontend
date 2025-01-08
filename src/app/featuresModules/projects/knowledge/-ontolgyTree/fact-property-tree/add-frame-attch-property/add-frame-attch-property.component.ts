import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/core/services/data.service';
import { NotifyService } from 'src/app/core/services/notify.service';
import { NodeModel } from 'src/app/Models/ontology-model/node';
import { OntologyEntitiesService } from 'src/app/Services/Knowlege/ontology-entities.service';
import { SelectFactCategoryComponent } from '../../../ontology-entities/parent-ontology-entities/ontology-entities/dialogs/select-fact-category/select-fact-category.component';

@Component({
  selector: 'vex-add-frame-attch-property',
  templateUrl: './add-frame-attch-property.component.html',
  styleUrls: ['./add-frame-attch-property.component.scss']
})
export class AddFrameAttchPropertyComponent implements OnInit {

  search:string =''
  currentIndex:number
  nodes:NodeModel[] =[]
  constructor( private _ontologyEntitiesService:OntologyEntitiesService,
    private route: ActivatedRoute,
    private _dataService: DataService,
    private fb:FormBuilder,
    private notify: NotifyService,
    @Inject(DIALOG_DATA) public data: {dataProps:NodeModel[] },
   public dialogRef: MatDialogRef<SelectFactCategoryComponent>) { }

  ngOnInit(): void {
    debugger
    this.nodes = this.data.dataProps
  }
  searchNode(){
    var search = this.search

    if(search.trim() != ''){
        this.nodes = this.data.dataProps.filter(x=>x.entityText.trim().includes(search.trim()))
    }
    else{
      this.nodes = this.data.dataProps
    }
  }
  clickOnList(index){
    this.currentIndex = index
  }
  addCoreAttch(){
    if(this.currentIndex || this.currentIndex ==0){
      let node = this.nodes[this.currentIndex]
      this.dialogRef.close(node.entityId)
    }
  }

}
