import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NotifyService } from 'src/app/core/services/notify.service';
import { DashboardService } from 'src/app/Services/dashboard.service';

@Component({
  selector: 'vex-create-company',
  templateUrl: './create-company.component.html',
  styleUrls: ['./create-company.component.scss']
})
export class CreateCompanyComponent implements OnInit {

  constructor(private dashboardService: DashboardService,
    private fb:FormBuilder,
    private notify: NotifyService){}
    form:FormGroup

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      Email: [''],
      Password: [''],
      ConfirmPassword: [''],
      allawedChatbotCount: [''],
      Website: [''],
      facebookAccount: [''],
      twitterAccount: [''],
  })
}
createAccount(){
  this.dashboardService.createAccount(this.form.value).subscribe(res=>{
    this.notify.openSuccessSnackBar("Account successful Added" )
  },error=>{
    this.notify.openFailureSnackBar("Failed to Create account")
  })
}


}
