import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NotifyService } from 'src/app/core/services/notify.service';
import { DashboardService } from 'src/app/Services/dashboard.service';
import { DialogEditUserComponent } from '../dialog-edit-user/dialog-edit-user.component';
import { EditCompanyComponent } from '../edit-company/edit-company.component';

@Component({
  selector: 'vex-all-bot-developers',
  templateUrl: './all-bot-developers.component.html',
  styleUrls: ['./all-bot-developers.component.scss']
})
export class AllBotDevelopersComponent implements OnInit {

  constructor(private dashboardService: DashboardService,  public dialog: MatDialog, private notify: NotifyService
    ) { }

  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['Name', 'Email','Role', 'Actions'];
  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.getAllBotDevelopers();
  }

  getAllBotDevelopers(){
    debugger
    this.dashboardService.getAllBotsDevelopers().subscribe((res:any)=>{
      console.log(res)
      this.dataSource = new MatTableDataSource(res)
      this.dataSource.paginator = this.paginator;
    })
  }

  openEditBotDeveloper(row){
    const dialogRef = this.dialog.open(DialogEditUserComponent ,{data:{user:row}}
      );
      dialogRef.afterClosed().subscribe(res=>{
        this.getAllBotDevelopers();
      })
  }

  deleteBotDeveloper(row){
    this.dashboardService.deleteUser(row.Id).subscribe(res=>{
      this.dialog.closeAll();
      this.notify.openSuccessSnackBar("User successfully deleted" )
    },error=>{
      this.notify.openFailureSnackBar("User failed to delete")
    })
  }
}
