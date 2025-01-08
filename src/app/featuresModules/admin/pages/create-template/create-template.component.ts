import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DashboardService } from 'src/app/Services/dashboard.service';
import { DialogCreateTemplateComponent } from '../dialog-create-template/dialog-create-template.component';

@Component({
  selector: 'vex-create-template',
  templateUrl: './create-template.component.html',
  styleUrls: ['./create-template.component.scss']
})
export class CreateTemplateComponent implements OnInit {

  constructor(private dashboardService: DashboardService,
    public dialog: MatDialog) { }

  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['Actions','Template', 'Category','TemplateId'];
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

  deleteTemplate(elemnt){

  }
  openCreateTemplateDialog(){
      const dialogRef = this.dialog.open(DialogCreateTemplateComponent,{data:{}}
      );
  }

}
