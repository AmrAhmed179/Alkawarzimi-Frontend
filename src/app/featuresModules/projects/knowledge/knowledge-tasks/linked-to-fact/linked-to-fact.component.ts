import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EntityModel } from 'src/app/Models/ontology-model/EntityCatogeryModel';
import { OptionsServiceService } from 'src/app/Services/options-service.service';
import { AddIndividualClassFrameComponent } from '../../-ontolgyTree/fact-property-tree/tree-node-details/add-individual-class-frame/add-individual-class-frame.component';

@Component({
  selector: 'vex-linked-to-fact',
  templateUrl: './linked-to-fact.component.html',
  styleUrls: ['./linked-to-fact.component.scss']
})
export class LinkedToFactComponent implements OnInit {

  constructor(    private router: Router,
      private _optionsService:OptionsServiceService,
      @Inject(DIALOG_DATA) public data: {entityId,predicateId,entityText},
      public dialogRef: MatDialogRef<AddIndividualClassFrameComponent>) { }

  ngOnInit(): void {
  }

}
