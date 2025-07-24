import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { OptionsServiceService } from 'src/app/Services/options-service.service';
import { ProjectOptionsModel } from 'src/app/core/models/options-model';
import { DialogAddDmainAndClientEntityComponent } from './dialog-add-dmain-and-client-entity/dialog-add-dmain-and-client-entity.component';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { DialogAddClientEntityComponent } from './dialog-add-client-entity/dialog-add-client-entity.component';

@Component({
  selector: 'vex-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit {


  projectOptions: ProjectOptionsModel = null
  selectedLang: string
  projectId: string
  entitiesClass: any[] = []
  mainEntityAr: string = null
  mainEntityEn: string = null
  clientEntityAr: string = null
  ClientEntityEn: string = null
  constructor(private fb: FormBuilder,
    private _optionsService: OptionsServiceService,
    public dialog: MatDialog) { }
  counter = 0
  onDestroy$: Subject<void> = new Subject();

  generalOptions: FormGroup
  //   = this.fb.group({
  //   name: [''],
  //   description: [''],
  //   domainName: [''],
  //   ProccessingMode: [''],
  //   socialWelcomeInterval: [''],
  //   clearSessionInterval: [''],
  // })

  ngOnInit(): void {
    console.log("general component on init")

    this._optionsService.projectOptions$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((res: ProjectOptionsModel) => {
        if (res) {
          console.log("general component inside subscribe")
          this.projectOptions = res
          this.initiateForm()
          this._optionsService.selectedLang$
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(result => {
              this.selectedLang = result
            })
          this.getEntityClassAndProp()
          this.counter += 1
        }
      })
    console.log(this.generalOptions)
  }

  // initiateForm(){
  //   this.generalOptions.controls['name'].setValue(this.projectOptions.name);
  //   this.generalOptions.controls['description'].setValue(this.projectOptions.description);
  //   this.generalOptions.controls['domainName'].setValue(this.projectOptions.domainName);
  //   this.generalOptions.controls['proccessingMode'].setValue(this.projectOptions.proccessingMode);
  //   this.generalOptions.controls['socialWelcomeInterval'].setValue(this.projectOptions.socialWelcomeInterval);
  //   this.generalOptions.controls['clearSessionInterval'].setValue(this.projectOptions.clearSessionInterval);
  // }

  initiateForm() {
    this.generalOptions = this.fb.group({
      name: [this.projectOptions.name],
      description: [this.projectOptions.description],
      domainName: [this.projectOptions.domainName],
      //ProccessingMode: [this.projectOptions.proccessingMode],
      socialWelcomeInterval: [this.projectOptions.socialWelcomeInterval],
      clearSessionInterval: [this.projectOptions.clearSessionInterval],
      botSystem: [this.projectOptions.botSystem],
      brainMode: [this.projectOptions.brainMode],
      stopInterruption: [this.projectOptions.stopInterruption],
      nluMode: [this.projectOptions.nluMode],
      hybridMode: [this.projectOptions.hybridMode],
      includeAiMessage: [this.projectOptions.includeAiMessage],
    })
  }

  getEntityClassAndProp() {
    this._optionsService.getEntityClassAndProp(this.projectOptions._id).subscribe((res: any) => {

      if (res) {
        console.log("general component inside getEntityClassAndProp subscribe")
        this.entitiesClass = res.entities;
        // debugger
        let mainEntityObject = this.entitiesClass.find(x => x._id == this.projectOptions.mainEntityId)
        this.mainEntityAr = mainEntityObject.entityInfo[0].entityText
        this.mainEntityEn = mainEntityObject.entityInfo[1].entityText
        let clientEntityObject = this.entitiesClass.find(x => x._id == this.projectOptions.clientEntityId)
        this.clientEntityAr = clientEntityObject.entityInfo[0].entityText
        this.ClientEntityEn = clientEntityObject.entityInfo[1].entityText
      }
    })
  }

  openAddDomainDialog(type: string, lang: string) {

    const dialogRef = this.dialog.open(DialogAddDmainAndClientEntityComponent, {
      data: { type: "type", lang: lang }, maxHeight: '730px',
      width: '900px'
    },
    );
    dialogRef.afterClosed().subscribe(res => {
    })
  }

  openAddClientDialog(type: string, lang: string) {

    const dialogRef = this.dialog.open(DialogAddClientEntityComponent, {
      data: { type: "type", lang: lang }, maxHeight: '730px',
      width: '900px'
    },
    );
    dialogRef.afterClosed().subscribe(res => {
    })
  }
  getFormValue() {
    this.projectOptions.name = this.generalOptions.controls['name'].value
    this.projectOptions.hybridMode = this.generalOptions.controls['hybridMode'].value
    this.projectOptions.description = this.generalOptions.controls['description'].value
    this.projectOptions.domainName = this.generalOptions.controls['domainName'].value
    // this.projectOptions.proccessingMode = this.generalOptions.controls['ProccessingMode'].value
    this.projectOptions.botSystem = this.generalOptions.controls['botSystem'].value
    this.projectOptions.socialWelcomeInterval = this.generalOptions.controls['socialWelcomeInterval'].value
    this.projectOptions.clearSessionInterval = this.generalOptions.controls['clearSessionInterval'].value
    this.projectOptions.brainMode = this.generalOptions.controls['brainMode'].value
    this.projectOptions.stopInterruption = this.generalOptions.controls['stopInterruption'].value
    this.projectOptions.nluMode = this.generalOptions.controls['nluMode'].value
    this.projectOptions.includeAiMessage = this.generalOptions.controls['includeAiMessage'].value
    this._optionsService.projectOptions$.next(this.projectOptions)
  }


  ngOnDestroy() {
    console.log("general destroy!!!")
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
