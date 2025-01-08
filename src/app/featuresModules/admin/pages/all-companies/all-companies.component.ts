import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NotifyService } from 'src/app/core/services/notify.service';
import { DashboardService } from 'src/app/Services/dashboard.service';
import { EditCompanyComponent } from '../edit-company/edit-company.component';

@Component({
  selector: 'vex-all-companies',
  templateUrl: './all-companies.component.html',
  styleUrls: ['./all-companies.component.scss']
})
export class AllCompaniesComponent implements OnInit {

  constructor(private dashboardService: DashboardService, public dialog: MatDialog, private notify: NotifyService,
    ) { }

  dataSource = new MatTableDataSource();

  account:any = []
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['id', 'name','website', 'Admin','CountOfUsers','AllawedChatbotCount','CountOfChatbot','Actions'];
  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.getAllAccounts();
  }

  getAllAccounts(){
    this.dashboardService.getAllAccounts().subscribe((res:any)=>{
      console.log(res)
      this.account = res
      this.dataSource = new MatTableDataSource(res)
      this.dataSource.paginator = this.paginator;
    })
  }

  openEditCompany(element){
    const dialogRef = this.dialog.open(EditCompanyComponent,{data:{account:element}}
      );
      dialogRef.afterClosed().subscribe(res=>{
        this.getAllAccounts();
      })
  }
  openCompanyDetails(element){

  }

  deleteCompany(element){
    this.dashboardService.deleteAccount(element.id).subscribe(res=>{
      this.notify.openSuccessSnackBar("Account Deleted")
    },error=>{
      this.notify.openFailureSnackBar("Failed to delete account")
    })
  }

}
