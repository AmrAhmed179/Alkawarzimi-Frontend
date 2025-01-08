import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { OptionsServiceService } from 'src/app/Services/options-service.service';
import { ProjectOptionsModel } from 'src/app/core/models/options-model';

@Component({
  selector: 'vex-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  onDestroy$: Subject<void> = new Subject();
  projectOptions:ProjectOptionsModel = null
  loginForm:FormGroup

  constructor(private fb:FormBuilder,
    private _optionsService:OptionsServiceService,) { }

  ngOnInit(): void {
    this._optionsService.projectOptions$.pipe(takeUntil(this.onDestroy$)).subscribe((res:ProjectOptionsModel)=>{
      if(res){
        this.projectOptions = res
          this.initiateForm()
      }
    })
  }

  initiateForm(){
    this.loginForm = this.fb.group({
      loginType: [this.projectOptions.loginType],
    })
  }
  getFormValue(){
    debugger
    this.projectOptions.loginType = this.loginForm.controls['loginType'].value
    this._optionsService.projectOptions$.next(this.projectOptions)
  }
  ngOnDestroy() {
    console.log("general destroy!!!")
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

}
