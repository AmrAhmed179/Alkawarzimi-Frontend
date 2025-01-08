import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { OptionsServiceService } from 'src/app/Services/options-service.service';
import { ProjectOptionsModel } from 'src/app/core/models/options-model';
import { NotifyService } from 'src/app/core/services/notify.service';

@Component({
  selector: 'vex-static-response',
  templateUrl: './static-response.component.html',
  styleUrls: ['./static-response.component.scss'],
})
export class StaticResponseComponent implements OnInit {

  projectOptions:ProjectOptionsModel = null
  onDestroy$: Subject<void> = new Subject();
  selectedLang:string
  staticResponse:any
  generalStaticResponse:any[] = []
  slectedResponse:any
  objectStaticResponse:any[] = []
  variableStaticResponse:any[] = []
  serviceStaticResponse:any[] = []
  flowStaticResponse:any[] = []


  responseForm:FormGroup
  changeBackGround:number
  showResponse:boolean = false
  tabType:string = ""
  get Responses(): FormArray {
    return <FormArray>this.responseForm.get('resonseArray');
  }
  constructor(private fb:FormBuilder,
    private _optionsService:OptionsServiceService,
    public dialog: MatDialog,
    private _notifyService:NotifyService) { }

  ngOnInit(): void {
    this._optionsService.projectOptions$
    .pipe(takeUntil(this.onDestroy$))
    .subscribe((res:ProjectOptionsModel)=>{
      if(res){
        this.projectOptions = res
        this._optionsService.selectedLang$.pipe(takeUntil(this.onDestroy$)).subscribe(result=>{
        this.selectedLang = result
      })
      this.getStaticResponse()
      }
    })
  }
  getStaticResponse(){
    this._optionsService.GetStaticResponse(this.projectOptions._id).subscribe((res:any)=>{
      debugger
      if(res){
        this.staticResponse = res.staticResponses.staticResponses
        this.getCategoryStaticResponse()
      }
    })
  }
  getCategoryStaticResponse(){
    this.generalStaticResponse =  this.staticResponse.filter(x=>x.category ==='general')
    this.objectStaticResponse =  this.staticResponse.filter(x=>x.category ==='object')
    this.variableStaticResponse =  this.staticResponse.filter(x=>x.category ==='variable')
    this.serviceStaticResponse =  this.staticResponse.filter(x=>x.category ==='service')
    this.flowStaticResponse =  this.staticResponse.filter(x=>x.category ==='flow')
  }

  openResponse(Response:any,index, showResponse, tapType:string){
    this._optionsService.selectedLang$.pipe(takeUntil(this.onDestroy$)).subscribe(result=>{
      this.selectedLang = result
      this.tabType = tapType
      this.slectedResponse = Response
      debugger
      this.changeBackGround = index
      this.showResponse = true
      this.responseForm = this.fb.group({
        resonseArray: this.fb.array([])
      });
      if(this.selectedLang ==='en'){
        Response.enResponses.forEach(response => {
          this.addResponse(response)
        })
      }

      if(this.selectedLang ==='ar'){
        Response.arResponses.forEach(response => {
          this.addResponse(response)
        })
      }
    })

  }

  addResponse(response: any) {
    this.Responses.push(this.createResponseGroup(response));
  }
  addNewResponse() {
    this.addResponse('');
  }
  createResponseGroup(response):FormGroup{
    if(this.selectedLang ==='ar'){
      return this.fb.group({
        text:[response]
      })
    }
    else{
      return this.fb.group({
        text:[response]
      })
    }
  }
  removeResponse(index){
    this.Responses.removeAt(index)
  }
  saveAllResponse(){
    let FormTostringArray:string[] = []
    let formValueResponse = this.responseForm.controls['resonseArray'].value
    formValueResponse.forEach(element => {
      FormTostringArray.push(element.text)
    });

    if(this.selectedLang ==='en'){
      let response = {projectId:this.projectOptions._id,sresponse:{_id:this.slectedResponse._id,
        name:this.slectedResponse.name,
        category:this.slectedResponse.category,
        arResponses:this.slectedResponse.arResponses,
        enResponses:FormTostringArray,
      }}
      this._optionsService.SaveStaticResponses(response).subscribe((res:any)=>{
        this._notifyService.openSuccessSnackBar("updated Successfuly")
        this.getStaticResponse()

      })
    }
    else if(this.selectedLang ==='ar'){
      let response = {projectId:this.projectOptions._id,sresponse:{_id:this.slectedResponse._id,
        name:this.slectedResponse.name,
        category:this.slectedResponse.category,
        arResponses:FormTostringArray,
        enResponses:this.slectedResponse.enResponses
      }}
      this._optionsService.SaveStaticResponses(response).subscribe((res:any)=>{
        this._notifyService.openSuccessSnackBar("updated Successfuly")
        this.getStaticResponse()
      })
    }
  }
  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
