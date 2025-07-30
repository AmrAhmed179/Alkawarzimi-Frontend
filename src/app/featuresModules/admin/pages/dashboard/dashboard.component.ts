import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ChatBots } from 'src/app/core/models/chatbot-model';
import { DashboardService } from 'src/app/Services/dashboard.service';

export interface PeriodicElement {
  ID: number;
  Name: string;
  Intents: number;
  DialogNodes: number;
  Entities: number;
  Created: string;
}

// const ELEMENT_DATA: PeriodicElement[] = [
//  { ID: 1, Name: 'name1', Intents: 2, DialogNodes: 3, Entities: 4, Created:'1/3/2023'},
//  { ID: 2, Name: 'name2', Intents: 2, DialogNodes: 3, Entities: 4, Created:'1/3/2023'},
//  { ID: 3, Name: 'name3', Intents: 2, DialogNodes: 3, Entities: 4, Created:'1/3/2023'}
//   ];

@Component({
  selector: 'vex-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  chatbotCount:number=0;
  chatbotCountDeleted:number=0;
  maxAllawedBots:number=0;
  messangerUsers:number=0;
  users:number=0;

  chatbots:ChatBots[]=[]
  totalItems;
  pageSize;
  //dataSource;
  constructor(private dashboardService: DashboardService) {
   }

  dataSource = new MatTableDataSource<ChatBots[]>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['ID', 'Name', 'Intents','DialogNodes', 'Entities', 'Created'];

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  ngOnInit(): void {
  this.getDashboardDetails()
  }

  getDashboardDetails(){
    this.dashboardService.getDashBoardDetails().subscribe((res:any)=>{
      debugger
      this.chatbotCount =res.chatbotCount;
      this.maxAllawedBots =res.maxAllawedBots;
      this.messangerUsers =res.messangerUsers;
      this.chatbots = res.chatbots;
      this.users = res.users;
      this.chatbotCountDeleted = res.chatbotCountDeleted
      this.dataSource = new MatTableDataSource(res.chatbots);
      this.dataSource.paginator = this.paginator;

      console.log(res);
    })
  }

}
