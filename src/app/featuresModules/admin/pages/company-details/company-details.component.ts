import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ChatBots } from 'src/app/core/models/chatbot-model';
import { DashboardService } from 'src/app/Services/dashboard.service';

@Component({
  selector: 'vex-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.scss']
})
export class CompanyDetailsComponent implements OnInit {

  chatbotCount:number=0;
  chatbotCountDeleted:number=0;
  maxAllawedBots:number=0;
  messangerUsers:number=0;
  users:number=0;

  chatbots:ChatBots[]=[]
  account:any = {}
  totalItems;
  pageSize;
  //dataSource;
  constructor(private dashboardService: DashboardService, private route:ActivatedRoute) {
   }

  dataSource = new MatTableDataSource<ChatBots[]>();

  id:Number
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['ID', 'Name', 'Intents','DialogNodes', 'Entities', 'Created'];

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  ngOnInit(): void {
  this.getAccountDetails()
  }

  getAccountDetails(){
    debugger
    this.id =  Number(this.route.snapshot.paramMap.get('id'))

    this.dashboardService.getAccountDetails(this.id).subscribe((res:any)=>{
      debugger
      this.account = res.Account
      this.chatbots = res.chatbots;
      this.users = res.users;
      this.dataSource = new MatTableDataSource(res.chatbots);
      this.dataSource.paginator = this.paginator;

      console.log(res);
    })
  }

}
