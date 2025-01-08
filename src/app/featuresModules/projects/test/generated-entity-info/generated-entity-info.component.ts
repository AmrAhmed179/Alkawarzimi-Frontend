import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'vex-generated-entity-info',
  templateUrl: './generated-entity-info.component.html',
  styleUrls: ['./generated-entity-info.component.scss']
})
export class GeneratedEntityInfoComponent implements OnInit {

  constructor(@Inject(DIALOG_DATA) public data: {entityInfo:any,parentEnityText:any}) { }

  ngOnInit(): void {
    debugger
    let x= this.data.entityInfo
  }

}
