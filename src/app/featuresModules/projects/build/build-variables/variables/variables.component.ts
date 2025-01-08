import { DisplayFieldComponent } from './../display-field/display-field.component';

import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ClassesService } from 'src/app/Services/Build/classes.service';
import { ContextVariableService } from 'src/app/Services/Build/context-variable.service';
import { SystemEntitiesService } from 'src/app/Services/Build/system-entities.service';
import { Classes } from 'src/app/core/models/classes';
import { ContextVariableModel, DataTypes } from 'src/app/core/models/contextVariable';
import { Menus } from 'src/app/core/models/menus';
import { SystemEntity } from 'src/app/core/models/systemEntity';
import { NotifyService } from 'src/app/core/services/notify.service';
import { VariableCreateEditComponent } from '../variable-create-edit/variable-create-edit.component';
import { MagicWordWriteComponent } from 'src/app/shared/components/magic-word-write/magic-word-write.component';


interface Menu {
  entityId: number;
  entity: string
}

export enum ValidationTypes {
  Empty = 0,
  UserId = 1,
  Password = 2,
  Token = 3,
  Digits = 4,
  FullName = 5,
  PhoneNumber = 6,
}

@Component({
  selector: 'vex-variables',
  templateUrl: './variables.component.html',
  styleUrls: ['./variables.component.scss'],

})

export class VariablesComponent implements OnInit {

  chatBotId: number;
  displayedColumns: string[] = ['actions', 'Variable', 'type', 'validation', 'name', 'context', 'value'];

  variables: ContextVariableModel[] = []
  dataSource: MatTableDataSource<ContextVariableModel>;
  itemSize = 50;
  placeholderHeight = 0;
  dataTypes: SystemEntity[] = [];
  menus: Menu[] = [];
  classes: Classes[] = []
  dataTypeSelected: DataTypes[] = [{ dataType: "sys", type: "string", id: "0" }];

  constructor(
    private _contextVariableService: ContextVariableService,
    private _systemEntitiesService: SystemEntitiesService,
    private _classesService: ClassesService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private notify: NotifyService
  ) { }

  ngOnInit(): void {
    this.route.parent.params.subscribe((parmas: Params) => {
      this.chatBotId = parmas["projectid"];
      this.GetDataTypes();

    })

  }

  public get ValidationTypes() {

    //return Object.keys(ValidationTypes).find((a)=>a);

    //return string
    return Object.values(ValidationTypes).filter((v) => isNaN(Number(v)));
    //return Numbers
    //return Object.values(ValidationTypes).filter((v) => !isNaN(Number(v)));
  }

  GetDataTypes() {
    this._systemEntitiesService.GetDataTypes(this.chatBotId).subscribe(respons => {
      if (respons && respons["status"] == 1) {
        let data: DataTypes
        this.dataTypes = respons["DataTypes"];
        this.dataTypes.forEach(d => {

          data = {
            type: d.entity,
            dataType: d.sysEntity == true ? "sys" : "entity",
            id: d.sysEntity == true ? "0" : d.entityId
          }

          this.dataTypeSelected.push(data)
        })

        this.dataTypeSelected.sort((a, b) => b.dataType.localeCompare(a.dataType))
        this.menus = respons["Menus"][0];
        this.menus.forEach(m => {
          data = {
            type: m.entity,
            dataType: "menu",
            id: m.entityId.toString()
          }
          this.dataTypeSelected.push(data)
        })
        this.GetClasses();
      }
    })
  }


  GetClasses() {
    this._classesService.GetClasses(this.chatBotId).subscribe(response => {
      if (response && response["status"] == 1) {
        this.classes = response["classes"];
        let data: DataTypes
        this.classes.forEach(c => {
          data = {
            type: c.name,
            dataType: "class",
            id: c.classId.toString()
          }
          this.dataTypeSelected.push(data)
        })
        this.ContextVariable();
      }
    })
  }

  ContextVariable() {
    this._contextVariableService.GetContextVariable(this.chatBotId).subscribe((response: ContextVariableModel[]) => {
      if (response) {
        this.variables = response;
        this.variables.map(elment => {
          if (elment.dataType == "sys") {
            elment.show = elment.type;
          }
          else if (elment.dataType == "entity") {
            elment.show = this.dataTypes.find(a => a.entityId == elment.type).entity;
          }
          else if (elment.dataType == "class") {
            elment.show = this.classes.find(a => a.classId == +elment.type).name;
          }
          else if (elment.dataType == "menu") {
            elment.show = this.menus.find(a => a.entityId == +elment.type).entity;
          }
          elment.validationSubTypeN = +elment.validationSubType
        })
        this.dataSource = new MatTableDataSource(this.variables);
      }
    })
  }

  applyFilter(event: Event) {

    const filterValue = (event.target as HTMLInputElement).value;

    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  CreateVariable() {
    const listName = this.variables.map(a => a.key)
    this.dialog.open(VariableCreateEditComponent, { data: { dataTypes: this.dataTypeSelected, variable: null, mode: "create", listName: listName }, height: '45%', width: '40%' })
      .afterClosed()
      .subscribe((respons: ContextVariableModel) => {
        if (respons) {
          this._contextVariableService.CreateContextVariable(respons, this.chatBotId).subscribe(re => {
            if (re && re["status"] == 1) {
              this.notify.openSuccessSnackBar("This Variable Successfuly Created");
              this.ContextVariable();
            }
            else {
              this.notify.openFailureSnackBar(re["Exception"])
            }
          }, error => {
            this.notify.openFailureSnackBar(error.error.Message);
          })
        }
      })
  }

  editVariable(v: ContextVariableModel) {
    const listName = this.variables.map(a => a.key)
    let sysFlag = v.dataType == "sys" ? true : false;
    this.dialog.open(VariableCreateEditComponent, { data: { dataTypes: this.dataTypeSelected, variable: v, mode: "edit", listName: listName, sysVariable: sysFlag }, height: '45%', width: '40%' })
      .afterClosed()
      .subscribe((respons: ContextVariableModel) => {
        if (respons) {
          this._contextVariableService.EditContextVariable(respons, this.chatBotId).subscribe(re => {
            if (re && re["status"] == 1) {
              this.notify.openSuccessSnackBar("This Variable Successfully Updated");
              this.ContextVariable();
            }
            else {
              this.notify.openFailureSnackBar(re["Message"])
            }
          }, error => {
            this.notify.openFailureSnackBar(error.error.Message);
          })
        }
      })
  }

  deleteVariable(v: ContextVariableModel) {
    const QuestionTitle = 'Are you sure you want to delete this Variable?';
    const pleasWriteMagic = 'Please write the **Magic** word to delete';
    const actionName = 'delete';

    this.dialog.open(MagicWordWriteComponent, {
      data: {
        QuestionTitle: QuestionTitle, pleasWriteMagic: pleasWriteMagic, actionName: actionName, item: v.contextVariableId
      },
      maxHeight: '760px',
      width: '600px',
      position: { top: '100px', left: '400px' }
    },
    ).afterClosed()
      .subscribe(response => {
        if (response) {
          this._contextVariableService.DeleteContextVariable(v.contextVariableId, this.chatBotId).subscribe(respon => {
            if (respon) {
              if (respon["status"] == 1) {
                this.notify.openSuccessSnackBar("This Variable Successfuly Deleted");
                this.ContextVariable();
              }
              else {
                this.notify.openFailureSnackBar(respon["message"])
              }
            }
          })
        }
      })
  }

  displayFields(v: ContextVariableModel) {
    this.dialog.open(DisplayFieldComponent, { data: { variable: v }, width: '35%', height: '60%' })
      .afterClosed()
      .subscribe((response: string[]) => {
        if (response) {
          debugger
          v.displayFields = response
          this._contextVariableService.EditContextVariable(v, this.chatBotId).subscribe(re => {
            if (re && re["status"] == 1) {
              this.notify.openSuccessSnackBar("This Variable Successfuly Updated");
              this.ContextVariable();
            }
            else {
              this.notify.openFailureSnackBar(re["Message"])
            }
          }, error => {
            this.notify.openFailureSnackBar(error.error.Message);
          })
        }
      })
  }

}
