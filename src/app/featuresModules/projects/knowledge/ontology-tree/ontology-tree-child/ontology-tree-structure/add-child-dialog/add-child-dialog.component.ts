import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { OntologyTreeService } from 'src/app/Services/Ontology-Tree/ontology-tree.service';
import { OptionsServiceService } from 'src/app/Services/options-service.service';
import { DataService } from 'src/app/core/services/data.service';

@Component({
  selector: 'vex-add-child-dialog',
  templateUrl: './add-child-dialog.component.html',
  styleUrls: ['./add-child-dialog.component.scss']
})
export class AddChildDialogComponent implements OnInit {

  workspace_id
  selectedLang
  private languageSubscription: Subscription;
  private projectSubscription: Subscription;

  classType: string = 'regular';
  regularClasses: any[] = [];
  classes: any[] = [];
  restrictedClasses: any[] = [];
  adverbClasses: any[] = [];
  individualClasses: any[] = [];

  searchTerm: string = '';
  filteredClassList: any[] = [];

  selectedNode: any;
  selectedIndex: any;
  selectedClass: any;
  selectedClassId: any;

  constructor(
    private _ontologyTree: OntologyTreeService,
    private _dataService: DataService,
    private _optionsService: OptionsServiceService,
    public dialogRef: MatDialogRef<AddChildDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.projectSubscription = this._dataService.$project_bs.subscribe((project) => {
      if (project) {
        this.workspace_id = project._id;
        this.languageSubscription = this._optionsService.selectedLang$.subscribe((response) => {
          if (response) {
            this.selectedLang = response;
            this.getClasses();
          }
        });
      }
    });

    this.selectedNode = this.data.selectedNode;
    this.selectedIndex = this.data.selectedIndex;

  }

  ngOnDestroy(): void {
    this.projectSubscription.unsubscribe();
    this.languageSubscription.unsubscribe();
  }

  getClasses() {
    // this._ontologyTree.getOntologyClasses(this.workspace_id).subscribe((response: any) => {
    //   if (response) {
    //     console.clear();
    //     console.log(response);
    //     this.regularClasses = response.entities;
    //     this.classes = response.entities.filter((entity: any) => entity.entityType === 'class');
    //     this.restrictedClasses = response.entities.filter((entity: any) => entity.entityType === 'prop');
    //     this.adverbClasses = response.entities.filter((entity: any) => entity.entityType === 'adverb');
    //     this.individualClasses = response.entities.filter((entity: any) => entity.entityType === 'individual');
    //   } else {
    //     console.error('Error fetching classes or invalid response format.');
    //   }
    // });
  }

  getClassList(): any[] {
    // Filter classes based on both class type and search term
    let filteredList = [];
    switch (this.classType) {
      case 'regular':
        filteredList = this.regularClasses;
        break;
      case 'class':
        filteredList = this.classes;
        break;
      case 'restricted':
        filteredList = this.restrictedClasses;
        break;
      case 'adverb':
        filteredList = this.adverbClasses;
        break;
      case 'individual':
        filteredList = this.individualClasses;
        break;
      default:
        break;
    }
    // Apply search filter
    this.filteredClassList = this.searchTerm ?
      filteredList.filter(entity => entity.entityInfo[0].entityText.toLowerCase().includes(this.searchTerm.toLowerCase())) :
      filteredList;
    return this.filteredClassList;
  }

  activeEntities: Set<any> = new Set();

  isActive(entity: any): boolean {
    return this.activeEntities.has(entity);
  }

  toggleActive(entity: any): void {
    if (this.isActive(entity)) {
      this.activeEntities.delete(entity);
    } else {
      this.activeEntities.add(entity);
    }
  }

  createClassNode(): void {


    console.log(`selected node ${this.selectedNode} selected class id ${this.selectedClassId} selected class ${this.selectedClass}`)


    let previousSiblingNode = this.data.siblingNodes[this.selectedIndex - 1];

    var payload =
    {
      "node": {
        "entityText": this.selectedClass,
        "entityId": this.selectedClassId,
        "entityType": "action",
        "node_id": "",
        "parent": this.selectedNode.node_id,
        "previous_sibling": null,
        "level": 0,
        "editable": true
      },
      "nextSiblingNode": null,
      "projectId": this.workspace_id
    }

    // this._ontologyTree.ontologyTreeCreate(payload).subscribe((response) => {
    //   if (response) {
    //     this.dialogRef.close({ success: true, newNode: response });
    //   }
    // });

  }

  closeDialog(): void {
    this.dialogRef.close();
  }


  classInfo(verb: string): void {
    debugger

    const index = this.filteredClassList.indexOf(verb);
    if (index !== -1) {

      this.selectedClass = this.filteredClassList[index].entityInfo[0].entityText;
      this.selectedClassId = this.filteredClassList[index]._id
    }
  }


}
