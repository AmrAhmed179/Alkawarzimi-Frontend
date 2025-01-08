import { Component, HostListener, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { map, Observable, startWith, Subscription } from 'rxjs';
import { TypeClassesService } from 'src/app/Services/Build/type-classes.service';
import { OptionsServiceService } from 'src/app/Services/options-service.service';
import { ClassProp, Classes, PropInquery, PropName, objectInquiries } from 'src/app/core/models/classes';
import { DataService } from 'src/app/core/services/data.service';
import { DataTypes } from "../../../../../../core/models/contextVariable";
import { SystemEntitiesService } from "../../../../../../Services/Build/system-entities.service";

import { AutocompleteSelectValidator } from "../../../../../../shared/validators/autocomplete-select-validator";
import { SystemEntity } from "../../../../../../core/models/systemEntity";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { NotifyService } from 'src/app/core/services/notify.service';

interface Menu {
  entityId: number;
  entity: string
}

@Component({
  selector: 'vex-class-info',
  templateUrl: './class-info.component.html',
  styleUrls: ['./class-info.component.scss']
})

export class ClassInfoComponent implements OnInit, OnDestroy {

  editMode = -1
  operator: string[] = ['', '==', '!=', '>', '<'];
  PredicateId: string = '';
  VOperator: string = '';
  currentSelectedIndex: number = -1;
  classForm: FormGroup;
  workspace_id: string;
  selectedLang: string;
  classes: Classes[] = [];
  CurrentClasses: Classes = null;
  propertyList: ClassProp[] = [];
  newPropertyKey: string = '';
  selectedItem: ClassProp | null = null;
  dataTypes: SystemEntity[] = [];
  menus: Menu[] = [];
  dataTypeSelected: DataTypes[] = [{ dataType: "sys", type: "string", id: "0" }];
  filteredDataTypes: Observable<DataTypes[]>;
  contextVariableType: string = "";
  firstOpen = true;
  displayForm = false;
  classId: number;
  protected readonly event = event;
  protected readonly JSON = JSON;
  private languageSubscription: Subscription;
  private projectSubscription: Subscription;
  classInquiries
  className

  constructor(
    private router: Router,
    private _dataService: DataService,
    private _optionsService: OptionsServiceService,
    private fb: FormBuilder,
    private _classServices: TypeClassesService,
    private _systemEntitiesService: SystemEntitiesService,
    private route: ActivatedRoute,
    private notify: NotifyService,
  ) {
  }

  // Getter Functions
  get properties(): FormGroup {
    return this.classForm.get('properties') as FormGroup;
  }

  get outInquiries() {
    let result = this.classForm.get('inquiries') as FormArray;
    return result;
  }

  get names() {
    return this.classForm.get('properties').get('names') as FormArray
  }

  get inquiry(): FormArray {

    return (this.classForm.get('properties').get('inquiries') as FormArray)
  }

  get inquiries() {
    return (this.classForm.get('properties').get('inquiries') as FormArray);
  }

  get restrictions() {
    return (this.classForm.get('properties').get('restrictions') as FormArray);
  }

  isAddRestrictionDisabled(resValue: string): boolean {
    let result = false;
    if (this.PredicateId && this.VOperator && resValue) result = true
    return result
  }

  ngOnInit(): void {
    // Get Workspace ID
    this.projectSubscription = this._dataService.$project_bs.subscribe((project) => {
      if (project) {
        this.workspace_id = project._id;
        this.GetDataTypes();

        // Get Class ID
        this.route.paramMap.subscribe((params: Params) => {
          this.classId = +params.get('classId');
          // Get Language
          this.languageSubscription = this._optionsService.selectedLang$.subscribe((response) => {
            if (response) {
              this.selectedLang = response;
              this.getTypeClasses();
            }
          });
        });
      }
    });
    this.classForm.valueChanges.subscribe((value) => {
      console.log(' this is the value onInit', value);
    })

  }

  ngOnDestroy(): void {
    if (this.projectSubscription) {
      this.projectSubscription.unsubscribe();
    }

    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
  }

  AfterViewInit() {
    this.getTypeClasses()
  }

  preventDefault(event: Event): void {
    event.preventDefault();
  }

  getTypeClasses() {
    this._classServices.GetTypeClasses(this.workspace_id).subscribe(response => {
      if (response) {
        this.classes = response['classes'];
        this.CurrentClasses = this.classes.find(x => x.classId === this.classId);
        this.classInquiries = this.CurrentClasses.inquiries

        this.className = this.CurrentClasses.name

        this.propertyList = new Array<ClassProp>();
        if (this.CurrentClasses.properties) {
          this.propertyList = this.CurrentClasses.properties
        }
        this.firstOpen = false
        this.initializeClassForm(null);
        this.initializeFilter();
      }
    });
  }

  GetDataTypes() {
    this._systemEntitiesService.GetDataTypes(+this.workspace_id).subscribe(response => {
      if (response && response["status"] == 1) {
        let data: DataTypes
        this.dataTypes = response["DataTypes"];
        this.dataTypes.forEach(dataType => {
          data = {
            type: dataType.entity,
            dataType: dataType.sysEntity == true ? "sys" : "entity",
            id: dataType.sysEntity == true ? "0" : dataType.entityId
          }

          this.dataTypeSelected.push(data)
        })
        this.dataTypeSelected.sort((a, b) => b.dataType.localeCompare(a.dataType))
        this.menus = response["Menus"][0];
        this.menus.forEach(m => {
          data = {
            type: m.entity,
            dataType: "menu",
            id: m.entityId.toString()
          }
          this.dataTypeSelected.push(data)
        })
      }
    })
  }

  initializeClassForm(Prop: ClassProp) {

    this.displayForm = false;
    if (!Prop) {
      Prop = new ClassProp();
    }

    if (Prop.inquiries == null || Prop.inquiries.length <= 0) {
      Prop.inquiries = new Array<PropInquery>();
    }

    if (this.CurrentClasses.inquiries) {
      this.CurrentClasses.inquiries = new Array<objectInquiries>()
    }


    this.classForm = this.fb.group({
      classId: [(this.CurrentClasses && this.CurrentClasses.classId) || ''],
      name: [(this.CurrentClasses && this.CurrentClasses.name) || ''],
      caseClass: [(this.CurrentClasses && this.CurrentClasses.caseClass) || false],
      arbClassName: [(this.CurrentClasses && this.CurrentClasses.arbClassName) || null],

      inquiries: this.fb.array((this.classInquiries || []).map(inquiry =>
        this.fb.group({
          description: [inquiry?.description || ''],
          newInstance: [inquiry?.newInstance || ''],
          modifyInstance: [inquiry?.modifyInstance || ''],
          unCompleteInstance: [inquiry?.unCompleteInstance || ''],
          exitInstance: [inquiry?.exitInstance || ''],
          objectCompleted: [inquiry?.objectCompleted || ''],
          instanceNeedModification: [inquiry?.instanceNeedModification || ''],
          valueMessage: [inquiry?.valueMessage || ''],
          lang: [inquiry?.lang || '']
        })
      ) || []),


      properties: this.fb.group({
        propId: [Prop.propId || ''],
        key: [Prop.key, [Validators.required]],
        names: this.fb.array((Prop.names || []).map(x =>
          this.fb.group({
            name: [x.name || ''],
            lang: [x.lang || '']
          })
        ), []),

        inquiries: this.fb.array((Prop.inquiries).map(propertyInquiry =>
          this.fb.group({
            inquery: [propertyInquiry.inquery || ''],
            lang: [propertyInquiry.lang || '']
          })
        )),

        selection_policy: [Prop.selection_policy || 'random'],
        dataTypeId: [Prop.dataTypeId || ''],
        required: [Prop.required || false],
        reset: [Prop.reset || false],
        list: [Prop.list || false],
        dummy: [Prop.dummy || false],
        listValues: [Prop.listValues || false],
        ask: [Prop.ask || false],
        caseProp: [Prop.caseProp || false],
        restrictions: this.fb.array((Prop.restrictions || []).map(restriction =>
          this.fb.group({
            predicateId: [restriction.predicateId || ''],
            name: [restriction.name || ''],
            valueId: [restriction.valueId || ''],
            value: [restriction.value || ''],
            vOperator: [restriction.vOperator || '']
          })
        )),
        nameLanguageIndex: [Prop.nameLanguageIndex || ''],
        languageIndex: [Prop.languageIndex || '']
      }),
      languageIndex: [(this.CurrentClasses && this.CurrentClasses.languageIndex) || 0],

    }, []);

    this.displayForm = true;
  }

  initializeFilter() {
    const ListDataTypes = this.dataTypeSelected.map(x => x.type)

    this.filteredDataTypes = this.classForm.get('properties').valueChanges.pipe(
      startWith(''),
      map(value => {
        this.contextVariableType = this.classForm.get('properties').value;
        this.classForm.get('properties').addValidators(AutocompleteSelectValidator.compareMatching(ListDataTypes));
        return this._filter(value || '')
      }),
    );
  }

  duplicatePropertyError: boolean = false;

  addNewProperty() {
    let property = this.properties.value['key'];

    if (this.propertyExists(property)) {
      this.duplicatePropertyError = true;
      return;
    }

    let newProperty = new ClassProp();
    newProperty.key = property;
    newProperty.names = new Array<PropName>();
    newProperty.names.push({ name: '', lang: this.selectedLang });
    this.propertyList.push(newProperty);

    this.duplicatePropertyError = false;

    this.newPropertyKey = '';
  }

  propertyExists(property: string): boolean {
    return this.propertyList.some(prop => prop.key === property);
  }


  addInquiry() {

    const inquiriesArray = this.classForm.get('properties.inquiries') as FormArray;
    const newInquiry = new PropInquery();
    newInquiry.inquery = this.inquiry.value['inquery'];
    newInquiry.lang = this.selectedLang;
    inquiriesArray.push(this.fb.group(newInquiry));
  }

  removeInquiry(index: number) {
    const inquiriesArray = this.inquiries as FormArray;
    inquiriesArray.removeAt(index);
  }

  selectItem(index: number) {
    this.firstOpen = true
    this.currentSelectedIndex = index;
    this.selectedItem = this.propertyList[index];
    this.initializeClassForm(this.selectedItem);
  }

  saveProperty() {
    this.propertyList[this.currentSelectedIndex] = this.classForm.get('properties').value;

    this.notify.openSuccessSnackBar("Property Successfully Saved");

  }

  SaveClass() {
    if (this.currentSelectedIndex != -1) {
      this.propertyList[this.currentSelectedIndex] = this.classForm.value['properties']

    }
    this.classForm.value['properties'] = this.propertyList;
    let result = this.classForm.value;

    this._classServices.saveClass(result, this.workspace_id).subscribe(response => {
      if (response) {
      }
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.propertyList, event.previousIndex, event.currentIndex);
  }

  navigateBack() {
    this.router.navigate([`/projects/${this.workspace_id}/dataTypes/classes`]);
  }

  addRow(value) {
    const createRow = this.fb.group({
      predicateId: [this.PredicateId, Validators.required],
      vOperator: [this.VOperator, Validators.required],
      value: [value, Validators.required],
    });

    console.log('createRow', createRow);
    this.restrictions.push(createRow);
  }

  deleteItem(index: number): void {
    this.propertyList.splice(index, 1);
  }

  removeRow(index: number): void {
    this.restrictions.removeAt(index);
  }

  updateValue(event: any, index: number): void {
    this.restrictions[index].value = event.target.value;
  }

  saveOuterInquiries() {

    const inquiriesArray = this.outInquiries;

    const inquiriesValue = inquiriesArray.value;

    console.log(inquiriesValue);
  }

  enableEditMode(index: number) {
    this.editMode = index;
  }

  saveEditedRow(rowIndex: number): void {


    this.editMode = -1
    this.classForm.updateValueAndValidity()
  }

  private _filter(value: string): DataTypes[] {
    const filterValue = value.toLowerCase();
    return this.dataTypeSelected.filter(option => option.type.toLowerCase().includes(filterValue));
  }
}
