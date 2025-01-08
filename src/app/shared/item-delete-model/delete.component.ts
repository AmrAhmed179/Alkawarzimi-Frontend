import { Component, Inject, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { fadeInRight400ms } from "src/@vex/animations/fade-in-right.animation";
import { fadeInUp400ms } from "src/@vex/animations/fade-in-up.animation";
import { scaleIn400ms } from "src/@vex/animations/scale-in.animation";
import { stagger40ms } from "src/@vex/animations/stagger.animation";

@Component({
  selector: "vex-delete",
  templateUrl: "./delete.component.html",
  styleUrls: ["./delete.component.scss"],
  animations: [fadeInUp400ms, fadeInRight400ms, scaleIn400ms, stagger40ms],
})
export class DeleteComponent implements OnInit {
  form: UntypedFormGroup;

  title = "حذف المنتج 619";
  bodyText = "هل تريد حذف المنتج ؟";
  hints = [
    "ملحوظة:حالة المنتج مستخدم بالقائمة الرئيسية.",
    "ملحوظة:لكي يتم الحذف قم بتعديل حالة المنتج الي غير ناشط.",
  ];
  item: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: any,
    private dialogRef: MatDialogRef<DeleteComponent>,
    private fb: UntypedFormBuilder
  ) {}

  ngOnInit() {
    if (this.defaults) {
      this.title = this.defaults.title;
      this.bodyText = this.defaults.bodyText;
      this.hints = this.defaults.hints;
      this.item = this.defaults.item;
    } else {
      //this.defaults = {} as Product;
    }

    this.form = this.fb.group({});
  }

  delete() {
    this.dialogRef.close(this.item);
  }
}
