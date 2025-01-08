import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NotifyService } from 'src/app/core/services/notify.service';
import { DashboardService } from 'src/app/Services/dashboard.service';

@Component({
  selector: 'vex-update-domain-data',
  templateUrl: './update-domain-data.component.html',
  styleUrls: ['./update-domain-data.component.scss']
})
export class UpdateDomainDataComponent implements OnInit {

  projects:any =[]
  form:FormGroup

  constructor(private dashboardService: DashboardService,
    private fb:FormBuilder,
    private notify: NotifyService,) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      Projects: ['',],
    })
    this.getProjects()
  }
  getProjects(){
    this.dashboardService.getprojectsInGenerateDomainData().subscribe((res:any)=> {
    this.projects = res})
  }
  updateDomainData(){
    debugger
    this.dashboardService.updateDomainData(this.form.value['Projects']).subscribe(res=>{
      this.notify.openSuccessSnackBar("Domain data Updated" )
    },error=>{
      this.notify.openFailureSnackBar("Failed to update Domain Data")
    })
  }
}
