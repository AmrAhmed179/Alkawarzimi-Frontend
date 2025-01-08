import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BotDeveloper } from 'src/app/core/models/BotDeveloperModel';
import { NotifyService } from 'src/app/core/services/notify.service';
import { DashboardService } from 'src/app/Services/dashboard.service';

@Component({
  selector: 'vex-add-bot-developer',
  templateUrl: './add-bot-developer.component.html',
  styleUrls: ['./add-bot-developer.component.scss']
})
export class AddBotDeveloperComponent implements OnInit {

  constructor(private dashboardService: DashboardService,
    private fb:FormBuilder,
    private notify: NotifyService,
     ) { }

  botDeveloper:BotDeveloper = new BotDeveloper()

  Role
  form:FormGroup
  ngOnInit(): void {
    this.form = this.fb.group({
      Name: ['',],
      Email: ['admin@alkhawarizmi.com'],
      PhoneNumber: [],
      Password: [],
      Confirmpassword: [],
      Role: [],
    })
  }

  addBotDeveloper(){
    debugger
    this.botDeveloper.name = this.form.value['Name']
    this.botDeveloper.Email = this.form.value['Email']
    this.botDeveloper.Password = this.form.value['Password']
    this.botDeveloper.PhoneNumber = this.form.value['PhoneNumber']

    this.botDeveloper.Confirmpassword = this.form.value['Confirmpassword']
    this.Role = this.form.value['Role']
    this.dashboardService.createUser(this.botDeveloper,this.Role).subscribe(res=>{
      this.notify.openSuccessSnackBar(`User ${this.form.value['Name']} Created`)
    },error=>{
      this.notify.openFailureSnackBar("Failed to create user")
    })
  }


}
