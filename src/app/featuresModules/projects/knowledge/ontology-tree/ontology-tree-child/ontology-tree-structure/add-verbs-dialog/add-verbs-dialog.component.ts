import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { OntologyTreeService } from 'src/app/Services/Ontology-Tree/ontology-tree.service';
import { OptionsServiceService } from 'src/app/Services/options-service.service';
import { DataService } from 'src/app/core/services/data.service';

@Component({
  selector: 'vex-add-verbs-dialog',
  templateUrl: './add-verbs-dialog.component.html',
  styleUrls: ['./add-verbs-dialog.component.scss']
})
export class AddVerbsDialogComponent implements OnInit {

  workspace_id
  selectedLang
  private languageSubscription: Subscription;
  private projectSubscription: Subscription;
  verbs: any
  searchQuery: string = '';
  filteredVerbs: any[] = [];
  selectedVerb: any;
  selectedNode: any;
  selectedVerbId: any;
  selectedIndex: any;


  constructor(
    private _ontologyTree: OntologyTreeService,
    private _dataService: DataService,
    private _optionsService: OptionsServiceService,
    public dialogRef: MatDialogRef<AddVerbsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

  }

  ngOnInit(): void {
    this.projectSubscription = this._dataService.$project_bs.subscribe((project) => {
      if (project) {
        this.workspace_id = project._id;
        this.languageSubscription = this._optionsService.selectedLang$.subscribe((response) => {
          if (response) {
            this.selectedLang = response;
            this.getVerbs();
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

  getVerbs(): void {
    this._ontologyTree.getVerbs(this.workspace_id).subscribe((response: any) => {
      if (response) {
        debugger
        this.verbs = response.verbs.filter((verb: any) => verb.generated === false);
        this.filteredVerbs = [...this.verbs];
      }
    });
  }

  filterVerbs(): void {
    if (this.searchQuery.trim() === '') {
      this.filteredVerbs = [...this.verbs];
    } else {
      this.filteredVerbs = this.verbs.filter(verb =>
        verb.toLowerCase().includes(this.searchQuery.trim().toLowerCase())
      );
    }
  }

  createVerbNode(): void {

    let previousSiblingNode = this.data.siblingNodes[this.selectedIndex - 1];

    var payload =
    {
      "node": {
        "entityText": this.selectedVerb,
        "entityId": this.selectedVerbId,
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



  logSenseId(verb: string): void {

    const index = this.verbs.indexOf(verb);
    if (index !== -1) {

      this.selectedVerb = this.verbs[index].verb
      this.selectedVerbId = this.verbs[index].senseId
    }
  }


  activeIndex: number = -1;

  setActiveItem(index: number) {
    this.activeIndex = index;
  }


}


