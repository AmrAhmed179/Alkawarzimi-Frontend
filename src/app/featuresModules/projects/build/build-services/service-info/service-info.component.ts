import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { OutputMapping, ServiceData, ServiceMessage } from './../../../../../core/models/Services';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ServicesSetService } from 'src/app/Services/Build/services-set.service';
import { ServicesModel } from 'src/app/core/models/Services';
import { ContextVariableModel } from 'src/app/core/models/contextVariable';
import { Entities } from 'src/app/core/models/Entities';
import { Observable, map, startWith } from 'rxjs';
import { AutocompleteSelectValidator } from 'src/app/shared/validators/autocomplete-select-validator';
import { set } from 'date-fns/esm';
import { NotifyService } from 'src/app/core/services/notify.service';
import { ContextVariableService } from 'src/app/Services/Build/context-variable.service';
import { EntitiesService } from 'src/app/Services/Build/entities.service';

@Component({
  selector: 'vex-service-info',
  templateUrl: './service-info.component.html',
  styleUrls: ['./service-info.component.scss'],

})
export class ServiceInfoComponent implements OnInit {

  listvariables: string[] = [];
  listObjects: string[] = [];
  listMapping: string[] = [];
  selectedVariable = new FormControl('', [Validators.required]);
  selectedObject = new FormControl('', [Validators.required]);
  selectedMapping = new FormControl('', [Validators.required]);
  jsonMapping = new FormControl('', [Validators.required]);
  filteredOptions: Observable<ContextVariableModel[]>;
  filteredObjects: Observable<Entities[]>;
  filteredMapping: Observable<ContextVariableModel[]>;

  nameChang: boolean = false;
  form: FormGroup
  services: ServicesModel[] = []
  service: ServicesModel = null
  serviceID: any
  chatBotId: number;
  contextVariable: ContextVariableModel[] = [];
  staticVariable: ContextVariableModel[] = [];
  entities: Entities[] = [];
  objects: Entities[] = [];
  variables: ContextVariableModel[] = [];
  _outputMapping: OutputMapping[] = [];

  _messages: ServiceMessage[] = [{ confirmation: '', refuseMessage: '', uncompletedObjects: '', language: 'ar' }];
  _serviceData: ServiceData[] = [];

  constructor(
    private fb: FormBuilder,
    private _services: ServicesSetService,
    private _contextVariableService: ContextVariableService,
    private _entitiesService: EntitiesService,
    private route: ActivatedRoute,
    private router: Router,
    private notify: NotifyService) { }

  ngOnInit(): void {
    this.route.parent.params.subscribe((parmas: Params) => {
      this.chatBotId = parmas["projectid"];
      this.route.paramMap.subscribe((params: Params) => {
        this.serviceID = + params.get('serviceId');
        this.getServices();
      });
    })
  }

  getServices() {
    this._services.GetServices(this.chatBotId).subscribe((response) => {
      if (response) {
        this.services = response["services"];
        this.GetEntities();
      }

    })
  }

  GetEntities() {
    this._entitiesService.GetEntities(this.chatBotId).subscribe((result: any) => {
      if (result) {
        this.entities = result["entities"];
        this.ContextVariable();
      }
    })
  }

  ContextVariable() {
    this._contextVariableService.GetContextVariable(this.chatBotId).subscribe((response: ContextVariableModel[]) => {

      if (response) {
        debugger
        this.contextVariable = response;
        this.staticVariable = this.contextVariable.filter(a => a.servicesId == this.serviceID);
        //remove Static Variable
        this.staticVariable.forEach(a => {
          this.contextVariable.splice(this.contextVariable.findIndex(x => x.contextVariableId == a.contextVariableId), 1)
        })
        const serve: ServicesModel = this.services.find(a => a.servicesId == this.serviceID);


        //Service Data OutPut
        if (serve.outputMapping) {
          serve.outputMapping?.map(elment => {
            elment.variable = this.contextVariable.find(a => a.contextVariableId == elment.variableId)?.key
          })
        }
        else {
          serve.outputMapping = []
        }

        this._outputMapping = serve.outputMapping;

        if (serve.serviceData) {
          serve.serviceData?.map(elment => {
            elment.object = this.contextVariable.find(a => a.contextVariableId == elment.ObjectID)?.key
          })
        }
        else {
          serve.serviceData = [];
        }

        //Service Data input
        this._serviceData = serve.serviceData;
        if (this._serviceData) {

          this.contextVariable.forEach(ve => {
            let index = this._serviceData.findIndex(a => a.ObjectID == ve.contextVariableId);
            if (index == -1) {
              this.variables.push(ve)
            }
          });
          this.entities.forEach(c => {
            let index = this._serviceData.findIndex(a => a.ObjectID == c._id.toString());
            if (index == -1) {
              this.objects.push(c)
            }
          })

        }
        else {
          this.contextVariable.forEach(elment => {
            this.variables.push(elment)
          })
          this.entities.forEach(elment => {
            this.objects.push(elment)
          })

        }

        this.service = serve;
        this.IntializForm()
      }
    })
  }

  IntializForm() {

    this.listvariables = this.variables.map(elment => elment.key)

    const info = this.objects.map(a => a.entityInfo)
    this.listObjects = info.map(a => a[0].entityText)

    this.listMapping = this.contextVariable.map(elment => elment.key)
    this.filteredOptions = this.selectedVariable.valueChanges.pipe(
      startWith(''),
      map(value => {
        this.selectedVariable.addValidators(AutocompleteSelectValidator.compareMatching(this.listvariables));
        return this._filter(value || '')
      }),
    );
    this.filteredObjects = this.selectedObject.valueChanges.pipe(
      startWith(''),
      map(value => {
        this.selectedObject.addValidators(AutocompleteSelectValidator.compareMatching(this.listObjects));
        return this._filterObject(value || '')
      }),
    );
    this.filteredMapping = this.selectedMapping.valueChanges.pipe(
      startWith(''),
      map(value => {
        this.selectedMapping.addValidators(AutocompleteSelectValidator.compareMatching(this.listMapping));
        return this._filterMapping(value || '')
      }),
    );

    const servicesNameList = this.services.map(x => x.name);
    servicesNameList.splice(servicesNameList.indexOf(this.service.name), 1)
    this.form = this.fb.group({
      servicesId: [this.service.servicesId, [Validators.required]],
      name: [this.service.name, [Validators.required, AutocompleteSelectValidator.compareUnMatching(servicesNameList, false)]],
      url: [this.service.url, [Validators.required]],
      userName: [this.service.userName],
      password: [this.service.password],
      login: [this.service.login],
      mainApi: [this.service.mainApi],
      dynamicMenuLoader: [this.service.dynamicMenuLoader],
      uncompletedObjects: [''],
      messages: this.fb.array(this._messages?.map(x => this.fb.group({
        confirmation: this.fb.control(x.confirmation),
        refuseMessage: this.fb.control(x.refuseMessage),
        uncompletedObjects: this.fb.control(x.uncompletedObjects),
        language: this.fb.control(x.language)
      }))),
      serviceData: this.fb.array(this._serviceData?.map(x => this.fb.group({
        ObjectID: this.fb.control(x.ObjectID),
        Required: this.fb.control(x.Required),
        Knowledege: this.fb.control({ value: x.Knowledege, disabled: true }),
        dispaly: this.fb.control(x.dispaly),
        resetAfterUsage: this.fb.control(x.resetAfterUsage)

      }))),
      outputMapping: this.fb.array(this._outputMapping.map(a => this.fb.group({
        variableId: this.fb.control(a.variableId),
        jsonField: ({ value: a.jsonField, disabled: true })
      })))
    })

    this.form.get("name").valueChanges.subscribe(r => {
      if (this.service.name == this.form.get("name").value) {
        this.nameChang = false
      }
      else {
        this.nameChang = true
      }

    });
  }

  get messages() {
    return this.form.get("messages") as FormArray;
  }

  get serviceData() {
    return this.form.get("serviceData") as FormArray;
  }

  get outputMapping() {
    return this.form.get("outputMapping") as FormArray;
  }

  addVariable() {
    let varaiable: ContextVariableModel = this.contextVariable.find(a => a.key == this.selectedVariable.value);
    if (!varaiable) return;

    const serviceData: ServiceData = {
      ObjectID: varaiable.contextVariableId,
      Required: false,
      Knowledege: false,
      dispaly: false,
      resetAfterUsage: false,
      password: null,
      object: varaiable.key,
    }
    this._serviceData.push(serviceData)

    this.serviceData.push(this.fb.group({
      ObjectID: [varaiable.contextVariableId],
      Required: [false],
      Knowledege: this.fb.control({ value: false, disabled: true }),
      dispaly: [false],
      resetAfterUsage: [false]
    }));
    this.variables.splice(this.variables.findIndex(a => a.key == this.selectedVariable.value), 1)
    this.selectedVariable.reset()
  }

  addObject() {
    let object: Entities = this.entities.find(a => a.entityInfo.find(a => a.entityText == this.selectedObject.value));
    const serviceData: ServiceData = {
      ObjectID: object._id.toString(),
      Required: false,
      Knowledege: true,
      dispaly: false,
      resetAfterUsage: false,
      password: null,
      object: this.selectedObject.value
    }
    this._serviceData.push(serviceData)

    this.serviceData.push(this.fb.group({
      ObjectID: [object._id.toString()],
      Required: [false],
      Knowledege: this.fb.control({ value: true, disabled: true }),
      dispaly: [false],
      resetAfterUsage: [false]
    }));
    this.objects.splice(this.objects.findIndex(a => a.entityInfo.find(c => c.entityText == this.selectedObject.value)), 1)
    this.selectedObject.reset()
  }

  addMapping() {
    debugger
    let varaiable: ContextVariableModel = this.contextVariable.find(a => a.key == this.selectedMapping.value);
    const outPut: OutputMapping = {
      variableId: varaiable.contextVariableId,
      jsonField: this.jsonMapping.value,
      variable: varaiable.key,
    }

    this._outputMapping.push(outPut);

    this.outputMapping.push(this.fb.group({
      variableId: [varaiable.contextVariableId],
     // jsonField: this.fb.control({ value: this.jsonMapping.value, disabled: true })
      jsonField:[this.jsonMapping.value]
    }));

    this.selectedMapping.reset()
    this.jsonMapping.reset()
     const modelfd= this.form.value;
     const model: ServicesModel = this.form.value;
  }

  deleteVariable(index: number) {

    const ObjectID = this._serviceData[index].ObjectID;
    this.variables.push(this.contextVariable.find(a => a.contextVariableId == ObjectID))
    this._serviceData.splice(index, 1)
    this.serviceData.removeAt(index)
    this.selectedVariable.reset()
  }

  deleteObject(index: number) {

    const ObjectID = this._serviceData[index].ObjectID;

    this.objects.push(this.entities.find(a => a._id == +ObjectID))
    this._serviceData.splice(index, 1)
    this.serviceData.removeAt(index)
    this.selectedObject.reset()
  }

  deleteMapping(index: number) {

    this._outputMapping.splice(index, 1)
    this.outputMapping.removeAt(index)
    this.jsonMapping.reset()
  }

  isVariableDisabled() {

    if (this.selectedVariable.invalid) return true;
    else return false;
  }

  isObjectDisabled() {
    if (this.selectedObject.invalid) return true;
    else return false;
  }

  isMappingDisabled() {
    if (this.selectedMapping.invalid || this.jsonMapping.invalid) return true;
    else return false;
  }

  SaveEdit() {
    debugger
    const model: ServicesModel = this.form.value;
    this._services.EditServices(model, this.chatBotId).subscribe(respons => {
      if (respons) {
        if (respons["status"] == 1) {
          debugger
          if (this.nameChang == true) {
            this._contextVariableService.EditContextVariableName(this.service.servicesId, model.name, this.service.name, this.chatBotId).subscribe(res => {
              if (respons) {
                if (respons["status"] == 1) {
                  debugger
                  this.notify.openSuccessSnackBar("This Servic:" + this.service.name + "Successfuly Updated")
                  this.router.navigate(['..'], { relativeTo: this.route })
                }
                else {
                  this.notify.openFailureSnackBar(respons["Message"]);
                }
              }

            })
          }
          else {
            this.notify.openSuccessSnackBar("This Servic:" + this.service.name + "Successfuly Updated")
            this.router.navigate(['..'], { relativeTo: this.route })
          }

        }
        else {
          this.notify.openFailureSnackBar(respons["message"]);
        }
      }

    }, error => {
      this.notify.openFailureSnackBar(error.error.Message);
    })
  }
  private _filter(value: string): ContextVariableModel[] {

    const filterValue = value.toLowerCase();
    return this.variables.filter(option => option.key.toLowerCase().includes(filterValue));
  }

  private _filterObject(value: string): Entities[] {

    const filterValue = value.toLowerCase();
    return this.objects.filter(option => option.entityInfo.find(a => a.entityText.toLowerCase().includes(filterValue)));
  }

  private _filterMapping(value: string): ContextVariableModel[] {
    const filterValue = value.toLowerCase();
    return this.contextVariable.filter(option => option.key.toLowerCase().includes(filterValue));
  }

}
