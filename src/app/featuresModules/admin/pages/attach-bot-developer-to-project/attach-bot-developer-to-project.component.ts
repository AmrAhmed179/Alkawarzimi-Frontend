import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NotifyService } from 'src/app/core/services/notify.service';
import { DashboardService } from 'src/app/Services/dashboard.service';

@Component({
  selector: 'vex-attach-bot-developer-to-project',
  templateUrl: './attach-bot-developer-to-project.component.html',
  styleUrls: ['./attach-bot-developer-to-project.component.scss']
})
export class AttachBotDeveloperToProjectComponent implements OnInit {

  users:any= []
  projects:any = []
  projectId:string = ""
  userId:string = ""
  form:FormGroup

  constructor(private dashboardService: DashboardService,
    private fb:FormBuilder,
    private notify: NotifyService,) { }

  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['Username', 'Email','PhoneNumber', 'Actions'];
  @ViewChild(MatSort) sort: MatSort;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  ngOnInit(): void {
      this.form = this.fb.group({
        Projects: ['',],
        Users: [''],
      })
    this.getSystemUsers();
    this.getProjects();
  }

  getAllBotDevelopers(){
    debugger
    this.dashboardService.getAllBotsDevelopers().subscribe((res:any)=>{
      console.log(res)
      this.dataSource = new MatTableDataSource(res)
      this.dataSource.paginator = this.paginator;
    })
  }

  getSystemUsers(){
    debugger
    this.dashboardService.getSystemUsers().subscribe(res=> this.users = res)
  }
  getProjects(){
    this.dashboardService.getProjects().subscribe(res=> this.projects = res)
  }
  addUserToProject(){
    debugger
    this.projectId = this.form.value['Projects']
    this.userId = this.form.value['Users']
    this.dashboardService.addUserToProJect(this.projectId,this.userId).subscribe(res=>{
      this.notify.openSuccessSnackBar("User successful added to project" )
    },error=>{
      this.notify.openFailureSnackBar("Failed to Add user To project")
    })
  }

}
