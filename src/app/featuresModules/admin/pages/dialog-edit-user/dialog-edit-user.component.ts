import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NotifyService } from 'src/app/core/services/notify.service';
import { DashboardService } from 'src/app/Services/dashboard.service';

@Component({
  selector: 'vex-dialog-edit-user',
  templateUrl: './dialog-edit-user.component.html',
  styleUrls: ['./dialog-edit-user.component.scss']
})
export class DialogEditUserComponent implements OnInit {

  form:FormGroup

  constructor(public dialog: MatDialog,
    @Inject(DIALOG_DATA) public data: {user:any},
    private dashboardService: DashboardService,
    private fb:FormBuilder,
    private notify: NotifyService
    ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      UserName: [this.data.user.name],
      EmailAddress: [this.data.user.email],
      PhoneNumber: ["01011121314"],
    })
  }
 editUser(){
    this.dashboardService.editUser(this.form.value,this.data.user.Id).subscribe(res=>{
      this.dialog.closeAll();
      this.notify.openSuccessSnackBar("User successfully edited" )
    },error=>{
      this.notify.openFailureSnackBar("User faild to edited")
    })

 }
}
