import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NotifyService } from 'src/app/core/services/notify.service';
import { DashboardService } from 'src/app/Services/dashboard.service';

@Component({
  selector: 'vex-delete-project',
  templateUrl: './delete-project.component.html',
  styleUrls: ['./delete-project.component.scss']
})

export class DeleteProjectComponent implements OnInit {
   projects:any = []


  constructor(private dashboardService: DashboardService,
    private fb:FormBuilder,
    private notify: NotifyService,) { }

    formRemove:FormGroup
    formRestore:FormGroup

  ngOnInit(): void {
    this.getProjects()

    this.formRemove = this.fb.group({
      ProjectsRemove: [''],
    })

    this.formRestore = this.fb.group({
      ProjectsRestore: [''],
    })
  }
  getProjects(){
    this.dashboardService.getDeletedProject().subscribe((res:any)=> {
      debugger
    this.projects = res})
  }
  projectRestore(){
    debugger
    this.formRestore.value
    var id = this.formRestore.value['ProjectsRestore']
    this.dashboardService.RestorProjects(id).subscribe(res=>{
      this.notify.openSuccessSnackBar("project  restored" )
    },error=>{
      this.notify.openFailureSnackBar("Failed to restrore project")
    })
  }

  projectRemove(){
    debugger
    this.dashboardService.updateDomainData(this.formRemove.value['Projects']).subscribe(res=>{
      this.notify.openSuccessSnackBar("Domain data Updated" )
    },error=>{
      this.notify.openFailureSnackBar("Failed to update Domain Data")
    })
  }
}
