import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { EntityModel } from 'src/app/Models/ontology-model/EntityCatogeryModel';
import { OntologyEntitiesService } from 'src/app/Services/Knowlege/ontology-entities.service';
import { DataService } from 'src/app/core/services/data.service';
import { NotifyService } from 'src/app/core/services/notify.service';
import { SelectFactCategoryComponent } from '../../../../dialogs/select-fact-category/select-fact-category.component';
import { NodeModel } from 'src/app/Models/ontology-model/node';

@Component({
  selector: 'vex-add-frame-attachment',
  templateUrl: './add-frame-attachment.component.html',
  styleUrls: ['./add-frame-attachment.component.scss']
})
export class AddFrameAttachmentComponent implements OnInit {
  search:string =''
  currentIndex:number
  nodes:NodeModel[] =[]
  constructor( private _ontologyEntitiesService:OntologyEntitiesService,
    private route: ActivatedRoute,
    private _dataService: DataService,
    private fb:FormBuilder,
    private notify: NotifyService,
    @Inject(DIALOG_DATA) public data: {nodes:NodeModel[] },
   public dialogRef: MatDialogRef<SelectFactCategoryComponent>) { }

  ngOnInit(): void {
    this.nodes = this.data.nodes
  }
  searchNode(){
    var search = this.search

    if(search.trim() != ''){
        this.nodes = this.data.nodes.filter(x=>x.entityText.trim().includes(search.trim()))
    }
    else{
      this.nodes = this.data.nodes
    }
  }
  clickOnList(index){
    this.currentIndex = index
  }
  addCoreAttch(){
    if(this.currentIndex){
      let node = this.nodes[this.currentIndex]
      this.dialogRef.close(node.entityId)
    }
  }
}
