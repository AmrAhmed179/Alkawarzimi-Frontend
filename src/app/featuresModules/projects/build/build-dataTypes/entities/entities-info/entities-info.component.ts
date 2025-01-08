import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EntitiesService } from 'src/app/Services/Build/entities.service';
import { OptionsServiceService } from 'src/app/Services/options-service.service';
import { DataService } from 'src/app/core/services/data.service';
import { MagicWordWriteComponent } from 'src/app/shared/components/magic-word-write/magic-word-write.component';

interface Entity {
  entityId: string;
  entity: string;
  values: Value[];

}

interface Value {
  type: string | null;
  value: string;
  language: string;
  synonymsInfo: Synonym[];
  metadata: any;
}

interface Synonym {
  value: string;
}

@Component({
  selector: 'vex-entities-info',
  templateUrl: './entities-info.component.html',
  styleUrls: ['./entities-info.component.scss']
})

export class EntitiesInfoComponent implements OnInit {

  // Properties
  workspace_id: string;
  form: FormGroup;
  entityId: number;
  private projectSubscription: Subscription;
  entityForm!: FormGroup;
  selectedLang: string;
  private languageSubscription: Subscription;
  editingRow: any = null;
  eName: any;

  // Material Table
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ['Delete', 'Keys', 'Values', 'Save'];
  entityName: any;

  constructor(
    private fb: FormBuilder,
    private _dataService: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private _systemEntity: EntitiesService,
    private _optionsService: OptionsServiceService,
    public dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    // Initialize Form
    this.form = this.fb.group({
      entityName: ['' || '', Validators.required],
    });

    // Get Workspace ID
    this.projectSubscription = this._dataService.$project_bs.subscribe((project) => {
      if (!project) return;
      this.workspace_id = project._id;
      // Get Entity ID
      this.route.paramMap.subscribe((params: Params) => {
        this.entityId = + params.get('entityId');
        this.getSystemEntities();
      });
      // Get Language
      this.languageSubscription = this._optionsService.selectedLang$.subscribe((res) => {
        if (res) {
          this.selectedLang = res
        }
      })
    });

    this.form.setControl('values', this.fb.array([]));

    this.entityForm = this.fb.group({
      // entityName: ['entity', Validators.required],
      values: this.fb.array([
        this.createValueGroup(),
      ]),
    });

    this.addSynonym(0);

  }

  ngOnDestroy(): void {
    if (this.projectSubscription) {
      this.projectSubscription.unsubscribe();
    }

    if (this.languageSubscription) {
      this.projectSubscription.unsubscribe();
    }
  }

  createValueGroups(): FormGroup {
    return this.fb.group({
      value: '',
      synonyms: this.fb.array([this.createSynonymGroup()]),
    });
  }

  createSynonymGroup(): FormGroup {
    return this.fb.group({
      value: '',
    });
  }

  getSystemEntities() {
    this._systemEntity.GetSystemEntities(this.workspace_id).subscribe(response => {
      if (response) {
        let entities = response['entities'];

        let filteredEntity = entities.find(x => x.entityId == this.entityId);
        this.eName = filteredEntity.entity;

        if (filteredEntity) {
          this.form.patchValue({
            entityName: filteredEntity.entity,
          });

          let values = filteredEntity.values;
          let valuesArray = [];

          values.forEach((value: any) => {
            let entityObj = {
              value: value.value,
              language: value.language,
              synonymsInfo: value.synonymsInfo.map((synonym: any) => ({
                value: synonym.value,
                language: synonym.language
              }))
            };

            valuesArray.push(entityObj);
          });

          this.dataSource = new MatTableDataSource(valuesArray);
          this.entityName = this.form.patchValue({ entityName: filteredEntity.entity });
        }
      }
    });
  }

  getValuesByLang(values: Value[], lang: string) {
    let valuesArray = [];
    values.forEach(value => {
      if (value.language == lang) {
        valuesArray.push(value.value);
      }
    });
    return valuesArray;
  }

  onRowClick(row: any): void {
    if (this.editingRow !== null && this.editingRow !== row) {
      this.saveEditedValues(this.editingRow);
    }
    this.startEditing(row);
  }

  get valuesFormArray(): FormArray {
    return this.entityForm.get('values') as FormArray;
  }

  getSynonyms(valueGroup: AbstractControl): FormArray {
    return valueGroup.get('synonyms') as FormArray;
  }

  createValueGroup(): FormGroup {
    return this.fb.group({
      value: ['', Validators.required],
      synonyms: this.fb.array([]),
    });
  }

  // Form Functionalities
  addSynonym(valueIndex: number): void {
    const valueGroup = this.valuesFormArray.at(valueIndex);

    if (valueGroup) {
      const synonymsArray = this.getSynonyms(valueGroup);

      const newSynonym: Synonym = {
        value: '',
      };

      const newSynonymGroup = this.fb.group({
        value: [newSynonym.value || '', Validators.required],
        editedValue: [''],
      });

      synonymsArray.push(newSynonymGroup);
    }
  }

  removeSynonym(valueIndex: number, synonymIndex: number): void {
    const synonymsArray = this.getSynonyms(this.valuesFormArray.at(valueIndex)) as FormArray;
    synonymsArray.removeAt(synonymIndex);
  }

  isAddSynonymDisabled(valueGroupIndex: number): boolean {
    const synonymsArray = this.getSynonyms(this.valuesFormArray.at(valueGroupIndex)) as FormArray;
    const lastSynonymIndex = synonymsArray.length - 1;


    return !synonymsArray.at(lastSynonymIndex)?.get('value')?.value;
  }


  // Operations on Table Values
  startEditing(row: any): void {
    if (this.editingRow == row) return;
    this.editingRow = row;

    row.synonymsInfo.forEach((synonym: any) => {
      synonym.editedValue = synonym.value;
    });
  }

  onInputFocus(element: any, synonymIndex: number): void {
    this.editingRow = { element, synonymIndex };
  }

  // onInputBlur(row: any, synonymIndex: number): void {
  //   console.log('Saved:', row.synonymsInfo[synonymIndex].editedValue);
  // }

  saveEditedValues(element: any): void {
    this.checkFormValidity();
    const index = this.dataSource.data.indexOf(element);
    const updatedRow = { ...element };

    updatedRow.synonymsInfo.forEach((synonym: any, i: number) => {
      if (synonym.editedValue === null || synonym.editedValue === undefined || synonym.editedValue.trim() === '') {
      } else {
        synonym.value = synonym.editedValue;
      }
    });

    this.dataSource.data[index] = updatedRow;
    this.dataSource.data = [...this.dataSource.data];

  }



  deleteRow(element: any) {
    const QuestionTitle = 'Are you sure you want to delete this Menu?';
    const pleasWriteMagic = 'Please write the **Magic** word to delete';
    const actionName = 'delete';

    this.dialog.open(MagicWordWriteComponent, {
      data: {
        QuestionTitle: QuestionTitle,
        pleasWriteMagic: pleasWriteMagic,
        actionName: actionName,
      },
      height: '20$', width: '40%'
    })
      .afterClosed()
      .subscribe(response => {
        if (response) {
          const index = this.dataSource.data.indexOf(element);
          this.dataSource.data.splice(index, 1);

          this.dataSource.data = [...this.dataSource.data];
        }
      });
  }


  addNewValue(element: any): void {
    const newSynonym: Synonym = {
      value: '',
    };

    element.synonymsInfo.push({ ...newSynonym, editedValue: '' });
  }

  removeSynonymFromTable(element: any, index: number): void {
    element.synonymsInfo.splice(index, 1);
  }

  startEditingValues(element: any): void {
    this.editingRow = element;
    element.synonymsInfo.forEach(synonym => {
      synonym.editedValue = synonym.value;
    });

    element.editedKey = element.value;
  }

  isEditing(row: any): boolean {
    return this.editingRow === row;
  }

  shiftToFirst(event: Event, element: any, currentIndex: number): void {
    event.stopPropagation();
    if (element && element.synonymsInfo && currentIndex > 0 && currentIndex < element.synonymsInfo.length) {
      const selectedSynonym = element.synonymsInfo.splice(currentIndex, 1)[0];
      element.synonymsInfo.unshift(selectedSynonym);
      this.dataSource.data = [...this.dataSource.data];
    }
  }

  // Prepare Payload & Submit & Save Entity
  preparePayload(): any {
    const formData = this.form.value;
    const entity = formData.entityName ? formData.entityName : '';

    const payload: any = {
      Entity: {
        entity: entity,
        entityId: this.entityId.toString(),
        values: [],
      },
      workspace_id: this.workspace_id.toString(),
    };

    this.dataSource.data.forEach((value: any) => {
      const nonEmptySynonymsInfo = value.synonymsInfo.filter((synonym: any) => synonym.value.trim() !== '');

      if (value.value.trim() !== '' || nonEmptySynonymsInfo.length > 0) {
        payload.Entity.values.push({
          type: value.type,
          value: value.value,
          language: this.selectedLang,
          synonymsInfo: nonEmptySynonymsInfo.map((synonym: any, index: number) => ({
            value: synonym.value.trim(),
            language: this.selectedLang,
            main: index === 0,
          })),
        });
      }
    });

    return payload;
  }

  onSubmit(): void {
    const formData = this.entityForm.value;
    const newData = [];

    formData.values.forEach((value: any) => {
      const trimmedValue = value.value.trim(); // Trim the value to check if it's empty

      if (trimmedValue !== '') {
        const newDataRow = {
          value: trimmedValue,
          synonymsInfo: value.synonyms.map((synonym: any) => ({
            value: synonym.value.trim(),
          })),
        };
        newData.push(newDataRow);
      }
    });

    this.dataSource.data.push(...newData);

    const valuesArray = this.entityForm.get('values') as FormArray;

    while (valuesArray.length !== 0) {
      valuesArray.removeAt(0);
    }

    valuesArray.push(this.createValueGroups());

    this.entityForm.reset();

    this.dataSource = new MatTableDataSource(this.dataSource.data);
  }

  saveEntity() {
    if (this.editingRow !== null) {
      this.saveEditedValues(this.editingRow);
    }
    const payload = this.preparePayload();
    this._systemEntity.SaveSystemEntity(payload).subscribe(response => {
    });
  }

  // This Part Deals With Validation Errors
  checkFormValidity(): void {
    this.logValidationErrors(this.entityForm);
  }

  logValidationErrors(group: FormGroup | FormArray): void {
    Object.keys(group.controls).forEach(controlName => {
      const control = group.get(controlName);

      if (control instanceof FormControl && control.errors) {
      } else if (control instanceof FormGroup || control instanceof FormArray) {
        this.logValidationErrors(control);
      }
    });
  }

  navigateBack() {
    this.router.navigate([`/projects/${this.workspace_id}/dataTypes/entities`]);
  }

}

