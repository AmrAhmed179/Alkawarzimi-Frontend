import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { OptionsServiceService } from 'src/app/Services/options-service.service';
import { Subscription } from 'rxjs';
import { TypeClassesService } from 'src/app/Services/Build/type-classes.service';
import { ProjectOptionsModel } from 'src/app/core/models/options-model';
import { ProjectModel } from 'src/app/core/models/project-model';
import { DataService } from 'src/app/core/services/data.service';
import { MatPaginator } from '@angular/material/paginator';
import { MagicWordWriteComponent } from 'src/app/shared/components/magic-word-write/magic-word-write.component';
import { MatDialog } from '@angular/material/dialog';
import { NotifyService } from 'src/app/core/services/notify.service';
import { EntitiesCreateComponent } from '../entities/entities-create/entities-create.component';
import { ClassCreateComponent } from './class-create/class-create.component';
import { Router } from '@angular/router';

@Component({
  selector: 'vex-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.scss']
})

export class ClassesComponent implements OnInit {

  projectId: string;
  dataSource;
  selectedLang: string;
  classNames: string[] = [];


  displayedColumns: string[] = ['name', 'properties', 'actions'];

  private projectSubscription: Subscription;
  private languageSubscription: Subscription;

  constructor(
    private _classServices: TypeClassesService,
    private _dataService: DataService,
    private _optionsService: OptionsServiceService,
    public dialog: MatDialog, private notify: NotifyService,
    private router: Router,

  ) { }

  ngOnInit(): void {
    this.projectSubscription = this._dataService.$project_bs.subscribe((project: ProjectModel) => {
      if (project) {
        this.projectId = project._id;
        this.languageSubscription = this._optionsService.selectedLang$.subscribe((response) => {
          if (response) {
            this.selectedLang = response
            this.getTypeClasses();
          }
        })
      }
    });
  }

  // @ViewChild(MatPaginator) paginator: MatPaginator;

  // ngAfterViewInit() {
  //   this.dataSource.paginator = this.paginator;
  // }

  ngOnDestroy(): void {
    if (this.projectSubscription) {
      this.projectSubscription.unsubscribe();
    }
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
  }

  getTypeClasses() {
    this._classServices.GetTypeClasses(this.projectId).subscribe(response => {
      let classes = response['classes'];
      if (classes) {
        let classesArray = this.processClasses(classes);
        this.dataSource = new MatTableDataSource(classesArray);
        console.log(`this is the classes: ${this.dataSource}`);
      }
    });
  }

  processClasses(classes) {
    let classItem = classes.map(item => ({
      name: item.name,
      classId: item.classId,
      properties: this.getPropertyNames(item.properties)
    }));
    console.log(`this is the classItem: ${classItem}`);
    return classItem;
  }

  getPropertyNames(properties) {
    let result = [];
    if (properties) {
      result = properties
        .filter(property => property.names.some(name => name.lang === this.selectedLang))
        .map(property => property.names.find(name => name.lang === this.selectedLang).name)
    }
    return result;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  CreateClass() {

    const actionName = 'create';

    this.dialog.open(ClassCreateComponent, {
      data: { projectId: this.projectId },
      height: '20$', width: '40%'
    })
      .afterClosed()
      .subscribe((response) => {
        if (response) {
          let className = response.class;
          this._classServices.createClass(this.projectId, className).subscribe(response => {
            if (response) {
              if (response["status"] == 1) {
                this.notify.openSuccessSnackBar("Entity Successfully Created");
                this.getTypeClasses();
              } else {
                this.notify.openFailureSnackBar(response ? response["message"] : "Failed to create entity");
              }
            }
          });
        }
      });
  }

  deleteService(element) {
    const QuestionTitle = 'Are you sure you want to delete this Menu?';
    const pleasWriteMagic = 'Please write the **Magic** word to delete';
    const actionName = 'delete';
    console.log(element);

    let classId = element.classId;
    let projectId = this.projectId;

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
          this._classServices.DeleteClass(projectId, classId).subscribe(response => {
            if (response && response["status"] == 1) {
              this.notify.openSuccessSnackBar("This Menu Successfully Deleted");
              this.getTypeClasses();
            } else {
              this.notify.openFailureSnackBar(response ? response["message"] : "Failed to delete menu");
            }
          });
        }
      });
  }

  navigateToClassInfo(classId) {
    debugger
    this.router.navigate([`/projects/${this.projectId}/classEdit/${classId}`]);
  }
}