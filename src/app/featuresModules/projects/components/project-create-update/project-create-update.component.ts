import { Component, Inject, OnInit } from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { fadeInRight400ms } from "src/@vex/animations/fade-in-right.animation";
import { fadeInUp400ms } from "src/@vex/animations/fade-in-up.animation";
import { scaleIn400ms } from "src/@vex/animations/scale-in.animation";
import { stagger40ms } from "src/@vex/animations/stagger.animation";
import { ProjectModel } from "src/app/core/models/project-model";

@Component({
  selector: "vex-project-create-update",
  templateUrl: "./project-create-update.component.html",
  styleUrls: ["./project-create-update.component.scss"],
  animations: [fadeInUp400ms, fadeInRight400ms, scaleIn400ms, stagger40ms],
})
export class ProjectCreateUpdateComponent implements OnInit {
  form: UntypedFormGroup;
  mode: "create" | "update" = "create";
  item: ProjectModel = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: any,
    private dialogRef: MatDialogRef<ProjectCreateUpdateComponent>,
    private fb: UntypedFormBuilder
  ) {}

  ngOnInit() {
    if (this.defaults) {
      this.mode = this.defaults.mode;
      this.item = this.defaults.item;

      if (this.defaults.item) this.item = this.defaults.item;
      else this.item = {} as ProjectModel;
    } else {
      this.defaults = {} as ProjectModel;
    }

    this.form = this.fb.group({
      name: [
        this.item.name || "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(24),
        ],
      ],
      categroy: ["", [Validators.required]],
      template: ["", [Validators.required]],
    });
  }
  brandsCategories: [] = [];
  save() {
    if (this.mode === "create") {
      this.createItem();
    } else if (this.mode === "update") {
      this.updateItem();
    }
  }

  createItem() {
    this.dialogRef.close(this.form.value);
  }

  updateItem() {
    const customer = this.form.value;

    this.dialogRef.close(customer);
  }

  isCreateMode() {
    return this.mode === "create";
  }

  isUpdateMode() {
    return this.mode === "update";
  }
}
