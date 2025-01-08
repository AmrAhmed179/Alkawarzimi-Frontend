import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

export interface PeriodicElement {
  ID: number;
  Name: string;
  Intents: number;
  DialogNodes: number;
  Entities: number;
  Created: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
 { ID: 1, Name: 'name1', Intents: 2, DialogNodes: 3, Entities: 4, Created:'1/3/2023'},
 { ID: 2, Name: 'name2', Intents: 2, DialogNodes: 3, Entities: 4, Created:'1/3/2023'},
 { ID: 3, Name: 'name3', Intents: 2, DialogNodes: 3, Entities: 4, Created:'1/3/2023'}
  ];
@Component({
  selector: 'vex-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage {

  totalItems;
  pageSize;
  dataSource;
  constructor() {
    this.dataSource = new MatTableDataSource(ELEMENT_DATA);
   }
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['ID', 'Name', 'Intents','DialogNodes', 'Entities', 'Created'];
  ngOnInit(): void {
  }
}
