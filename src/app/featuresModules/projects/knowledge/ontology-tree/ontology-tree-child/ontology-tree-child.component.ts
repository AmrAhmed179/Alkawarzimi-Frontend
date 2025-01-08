import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { OntologyTreeService } from 'src/app/Services/Ontology-Tree/ontology-tree.service';
import { SelectedVerbService } from 'src/app/Services/Ontology-Tree/selected-verb.service';
import { OptionsServiceService } from 'src/app/Services/options-service.service';
import { DataService } from 'src/app/core/services/data.service';
import { NotifyService } from 'src/app/core/services/notify.service';

@Component({
  selector: 'vex-ontology-tree-child',
  templateUrl: './ontology-tree-child.component.html',
  styleUrls: ['./ontology-tree-child.component.scss']
})
export class OntologyTreeChildComponent implements OnInit {


  selectedVerb: any;
  workspace_id: string;
  selectedLang: any;

  private languageSubscription: Subscription;
  private projectSubscription: Subscription;
  verbDescription: any;
  selectedVerbDetails: any;
  selectedVerbName: any;
  verbInfo: any;
  formattedValue: any;
  selectionType: any;
  entityIds: string[];
  matchingEntities: any;
  hoveredIndex: number | null = null; // Define the hoveredIndex property

  filteredEntities: any[] = []; // Initialize filteredEntities array
  searchControl = new FormControl();
  nodeId: any;
  nodeData: any;
  classInfo: any;
  ambClass: any;
  dataProperties: any;


  constructor(private selectedVerbService: SelectedVerbService, private _ontologyTree: OntologyTreeService, private _dataService: DataService,
    private _optionsService: OptionsServiceService,
    private notify: NotifyService,) { }

  ngOnInit(): void {
    this.projectSubscription = this._dataService.$project_bs.subscribe((project) => {
      if (project) {
        this.workspace_id = project._id;
        this.languageSubscription = this._optionsService.selectedLang$.subscribe((response) => {
          if (response) {
            this.selectedLang = response;
            //this.getVerbDetails();
          }
        });
      }
    });


    this.selectedVerbService.selectedVerb$.subscribe(verb => {
      if (verb) {
        this.nodeData = verb;
        this.nodeId = verb.node_id;
        this.selectedVerb = verb.entityId;
        this.selectionType = verb.entityType;
        this.getVerbInfo();
        this.getVerbDetails();

      } else {
        console.error('Invalid verb object received from selectedVerb$ observable.');
      }
    });


    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((searchTerm: string) => {
      this.filteredEntities = this.matchingEntities.filter(entity =>
        entity.entityInfo[0].entityText.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    this.getAmbClass();

  }


  getVerbDetails() {
    this._ontologyTree.getVerbs(this.workspace_id).subscribe((response: any) => {
      if (response) {
        this.selectedVerbDetails = response.verbs.find((verb: any) => {
          return verb.senseId === this.selectedVerb;
        });

      }
    });
  }

  getVerbInfo() {
    let payload = {
      "projectId": this.workspace_id,
      "senseId": this.selectedVerb
    }
    this._ontologyTree.getVerbInfo(payload).subscribe((response: any) => {
      if (response) {

        this.verbInfo = response;

        // Extract entityId values using the external method
        this.entityIds = this.extractEntityIds(response);
        this.getClassProp();

        let synonyms = this.verbInfo?.verbs?.synonyms;
        //        let verbName = this.verbInfo?.verbs?.frames[0].verb ?? null;
        let verbName = this.verbInfo?.verbs?.frames[0]?.verb ?? null;

        this.formattedValue = verbName || '';

        // Add synonyms if available
        if (synonyms && synonyms.length > 0) {
          this.formattedValue += ' (' + synonyms.join(', ') + ')';
        }

        return this.formattedValue;

      }
    });
  }

  extractEntityIds(response: any): string[] {
    let entityIds = [];
    if (response && response.verbs && response.verbs.frames) {
      response.verbs.frames.forEach(frame => {
        if (frame.entityId) {
          entityIds.push(frame.entityId);
        }
      });
    }
    return entityIds;
  }

  getClassProp() {
    this._ontologyTree.getClassProp(this.workspace_id).subscribe((response: any) => {
      if (response) {
        this.matchingEntities = response.entities.filter(entity => this.entityIds.includes(entity._id.toString()));
        this.filteredEntities = this.matchingEntities;

      }
    });
  }

  //{entityId: 0, ambClass: false, projectId: "294"}

  getAmbClass() {
    let payload = {
      "entityId": this.selectedVerb,
      "projectId": this.workspace_id
    }

    this._ontologyTree.getClassInfo(this.workspace_id, this.nodeData.entityId).subscribe((response: any) => {
      if (response) {
        console.log(`Class Info: ${JSON.stringify(response)}`);
        this.classInfo = response;
        //this.ambClass = response.ambClass;

      }
    });
  }


  setAmbClass() {
    debugger
    let payload = {
      "entityId": this.selectedVerb,
      "ambClass": !this.selectedVerb.ambClass,
      "projectId": this.workspace_id
    }


    this._ontologyTree.setAmbClass(payload).subscribe((response: any) => {
      if (response) {
        console.log(`Ambiguity class set successfully.`);
      }
    });
  }

  //{nodeId: "node_2", extension: true, projectId: "294"}

  setExtensionClass() {

    let payload = {
      nodeId: this.nodeId,
      extension: !this.nodeData.extension,
      projectId: this.workspace_id
    }

    this._ontologyTree.updateExtension(payload).subscribe((response: any) => {
      if (response) {
        this.notify.openSuccessSnackBar("Extension class set successfully.")
      }
    });
  }


  setArtificialParent() {
    let payload = {
      "nodeId": this.nodeId,
      "artificialParent": !this.nodeData.artificialParent,
      "projectId": this.workspace_id
    }

    this._ontologyTree.updateArtificialParent(payload).subscribe((response: any) => {
      if (response) {
        this.notify.openSuccessSnackBar("Artificial parent set successfully.")

      }
    });
  }

  getDataProperty() {
    this._ontologyTree.getDataProperty(this.workspace_id).subscribe((response: any) => {
      if (response) {
        let entityId = this.selectedVerb;
        const matchingObjects = response.nodes;
        debugger
  
        // Filter objects based on entityId inside the domains array
        let filteredObjects = matchingObjects.filter(obj => {
          return obj.domains.some(domain => domain.entityId === entityId);
        });
  
        console.log(`Matching Objects within Domains: ${JSON.stringify(filteredObjects)}`);
      }
    });
  }
  





}

