import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OntologyTreeService } from 'src/app/Services/Ontology-Tree/ontology-tree.service';
import { MagicWordWriteComponent } from 'src/app/shared/components/magic-word-write/magic-word-write.component';

@Component({
  selector: 'vex-delete-ontology-node',
  templateUrl: './delete-ontology-node.component.html',
  styleUrls: ['./delete-ontology-node.component.scss']
})
export class DeleteOntologyNodeComponent implements OnInit {

  constructor(public dialog: MatDialog, private _ontologyTree: OntologyTreeService,) { }

  ngOnInit(): void {
  }
}
