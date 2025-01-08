import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OptionsServiceService } from 'src/app/Services/options-service.service';
import { NotifyService } from 'src/app/core/services/notify.service';

@Component({
  selector: 'vex-create-work-space',
  templateUrl: './create-work-space.component.html',
  styleUrls: ['./create-work-space.component.scss']
})
export class CreateWorkSpaceComponent implements OnInit {

  form:FormGroup
  constructor(private fb:FormBuilder,
    private _optionsService:OptionsServiceService,
    private notify:NotifyService) { }

  ngOnInit(): void {
    this.initiateForm()
  }
  initiateForm(){
    this.form = this.fb.group({
      name:['',[Validators.required]],
      description:[''],
      facebook:[''],
      twitter:[''],
      language:[''],
      template:['']
    })
  }

  addWorkSpace(){
    let respons ={
      chatBot:{
        name:this.form.controls['name'].value,
        description:this.form.controls['description'].value,
        facebook:this.form.controls['facebook'].value,
        twitter:this.form.controls['twitter'].value,
        language:this.form.controls['language'].value,
      },
      template:this.form.controls['template'].value,
    }
    this._optionsService.CreateWorkSpace(respons).subscribe((res:any)=>{
      if(res.status == 1){
        this.notify.openSuccessSnackBar(res.Message)
      }
      else{
        this.notify.openFailureSnackBar(res.Message)
      }
    })
  }
}
