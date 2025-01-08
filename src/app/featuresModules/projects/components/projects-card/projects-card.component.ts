import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ProjectModel } from "src/app/core/models/project-model";

@Component({
  selector: "vex-projects-card",
  templateUrl: "./projects-card.component.html",
  styleUrls: ["./projects-card.component.scss"],
})
export class ProjectsCardComponent implements OnInit {
  @Input() project: ProjectModel;
  @Output() openProject = new EventEmitter<ProjectModel>();
  // @Output() editProject = new EventEmitter<ProjectModel>();
  @Output() deleteProject = new EventEmitter<ProjectModel>();

  constructor() {}

  ngOnInit() {}
}
