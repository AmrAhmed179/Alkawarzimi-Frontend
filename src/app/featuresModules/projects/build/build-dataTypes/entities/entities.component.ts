import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { EntitiesService } from 'src/app/Services/Build/entities.service';
import { ProjectModel } from 'src/app/core/models/project-model';
import { DataService } from 'src/app/core/services/data.service';
import { NotifyService } from 'src/app/core/services/notify.service';
import { MagicWordWriteComponent } from 'src/app/shared/components/magic-word-write/magic-word-write.component';
import { EntitiesCreateComponent } from './entities-create/entities-create.component';
import { debug } from 'console';
import { ActivatedRoute, Router } from '@angular/router';
import { OptionsServiceService } from 'src/app/Services/options-service.service';

export interface Entity {
  entity: string;
  values: Value[];
}

interface Value {
  type?: string;
  value: string;
  language: string;
  synonymsInfo: SynonymInfo[];
  metadata?: any;
}

interface SynonymInfo {
  value: string;
  language: string;
}


// interface Entities {
//   entityId: string;
//   entity: string;
//   sysEntity: boolean;
//   description?: string;
//   values: any[];
//   sourceBot?: string;
// }


@Component({
  selector: 'vex-entities',
  templateUrl: './entities.component.html',
  styleUrls: ['./entities.component.scss']
})

export class EntitiesComponent implements OnInit, OnDestroy {

  entity: Entity[] = [];
  workspace_id: string;
  selectedLang: string = 'ar';
  private projectSubscription: Subscription;
  private languageSubscription: Subscription;

  displayedColumns: string[] = ['Entity', 'Values', 'Action'];
  dataSource: MatTableDataSource<any>;
  entitiesNames: string[] = [];

  constructor(private _systemEntity: EntitiesService,
    private _dataService: DataService,
    public dialog: MatDialog,
    private notify: NotifyService,
    private router: Router,
    private route: ActivatedRoute,
    private _optionsService: OptionsServiceService
  ) { }

  ngOnInit(): void {
    this.projectSubscription = this._dataService.$project_bs.subscribe((project: ProjectModel) => {
      this.workspace_id = project._id;
      this.getSystemEntities();
      this.languageSubscription = this._optionsService.selectedLang$.subscribe((res) => {
        if (res) {
          this.selectedLang = res
        }
      })
    });
  }

  ngOnDestroy(): void {
    if (this.projectSubscription) {
      this.projectSubscription.unsubscribe();
    }

    if (this.languageSubscription) {
      this.projectSubscription.unsubscribe();
    }
  }

  getSystemEntities(): any {
    this._systemEntity.GetSystemEntities(this.workspace_id).subscribe(response => {
      let entities = response['entities'];
      if (entities) {
        let entitiesArray = [];

        entitiesArray = entities.filter(x => x.sysEntity == false).map(x => {
          x.values = this.getValuesByLang(x.values, this.selectedLang).join(', ');
          return x;
        });
        this.dataSource = new MatTableDataSource(entitiesArray);
      }
    });
  }

  getValuesByLang(values, lang) {
    return values
      .filter(value => value.language === lang)
      .map(value => value.value);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteEntity(row: any) {
    const QuestionTitle = 'Are you sure you want to delete this Menu?';
    const pleasWriteMagic = 'Please write the **Magic** word to delete';
    const actionName = 'delete';

    const EntityData = {
      Entity: {
        entityId: row.entityId,
        entity: row.entity,
        sysEntity: row.sysEntity,
        description: row.description,
        values: row.values ? row.values : [],
        sourceBot: row.sourceBot ? row.sourceBot : null
      },
      workspace_id: this.workspace_id
    };

    console.log(` EntityData `, EntityData);

    this.dialog.open(MagicWordWriteComponent, {
      data: {
        QuestionTitle: QuestionTitle,
        pleasWriteMagic: pleasWriteMagic,
        actionName: actionName,
        item: EntityData
      },
      height: '20$', width: '40%'
    })
      .afterClosed()
      .subscribe(response => {
        if (response) {
          row.values = [];
          this._systemEntity.DeleteEntity(EntityData).subscribe(deleteResponse => {
            if (deleteResponse["status"] == 1) {
              this.notify.openSuccessSnackBar("Entity Successfully Deleted");
              this.getSystemEntities();
            } else {
              this.notify.openFailureSnackBar(deleteResponse ? deleteResponse["message"] : "Failed to delete entity");
            }
          });
        }
      });
  }

  CreateEntity() {
    const actionName = 'create';
    let entitiesNames = this.entitiesNames;
    console.log(entitiesNames);

    this.dialog.open(EntitiesCreateComponent,
      {
        data: { projectId: this.workspace_id, entityName: entitiesNames },
        height: '20$', width: '40%'
      })
      .afterClosed()
      .subscribe((response) => {
        if (response) {
          const CreateEntityData = {
            systemEntities: {
              entity: response.entity,
              values: response.values ? response.values : [],
            },
            workspace_id: this.workspace_id
          };
          this._systemEntity.CreateEntity(CreateEntityData).subscribe(response => {
            if (response) {
              if (response["status"] == 1) {
                this.notify.openSuccessSnackBar("Entity Successfully Created");
                this.getSystemEntities();
              } else {
                this.notify.openFailureSnackBar(response ? response["message"] : "Failed to create entity");
              }
            }
          });

        }
      });
  }

  navigateToEntityInfo(entityId: string) {
    this.router.navigate([`/projects/${this.workspace_id}/entityEdit/${entityId}`]);
  }


}


