import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NotifyService } from 'src/app/core/services/notify.service';
import { DashboardService } from 'src/app/Services/dashboard.service';

@Component({
  selector: 'vex-edit-company',
  templateUrl: './edit-company.component.html',
  styleUrls: ['./edit-company.component.scss']
})
export class EditCompanyComponent implements OnInit {

  form:FormGroup

  constructor(public dialog: MatDialog,
    @Inject(DIALOG_DATA) public data: {account:any},
    private dashboardService: DashboardService,
    private fb:FormBuilder,
    private notify: NotifyService
    ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      Name: [this.data.account.name],
      allawedChatbotCount: [this.data.account.allawedChatbotCount],
      Website: [this.data.account.website],
      facebookAccount: [this.data.account.facebookAccount],
      twitterAccount: [this.data.account.twitterAccount],
    })
  }
  editAccount(){
    debugger
    this.dashboardService.editAccount(this.form.value).subscribe()
  }
}
