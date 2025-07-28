import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DashboardService } from 'src/app/Services/dashboard.service';
import { ConfirmDialoDeleteComponent } from 'src/app/shared/components/confirm-dialo-delete/confirm-dialo-delete.component';

@Component({
  selector: 'vex-aimodels',
  templateUrl: './aimodels.component.html',
  styleUrls: ['./aimodels.component.scss']
})
export class AIModelsComponent implements OnInit {

  form!: FormGroup;
  modelsList!: any[];
  showForm:boolean = false
  constructor(private fb: FormBuilder, private http: HttpClient,  private dashboardService: DashboardService,private dialog: MatDialog,) {}

  ngOnInit() {
    this.form = this.fb.group({
      _id: [''],
      provider: ['', Validators.required],
      apiKey: [''],
      models: this.fb.array([]),
    });

    this.getAll();
  }

  get models(): FormArray {
    return this.form.get('models') as FormArray;
  }

  newModel(): FormGroup {
    return this.fb.group({
      model: ['', Validators.required],
      promptRate: [0, Validators.required],
      completionRate: [0, Validators.required],
      cacheRate: [0, Validators.required],
    });
  }

  addModel() {
    this.models.push(this.newModel());
  }

  removeModel(index: number) {
    this.models.removeAt(index);
  }

  getAll() {
   this.dashboardService.GetAllAiModels().subscribe((res:any) => {
      this.modelsList = res;
    });
  }

  edit(model: any) {
    this.showForm = true
    this.form.patchValue(model);
    this.models.clear();
    model.models.forEach((m: any) => {
      this.models.push(this.fb.group(m));
    });
  }

  submit() {
    this.dashboardService.SaveAIModel(this.form.value).subscribe((res: any) => {
      if (res.success) {
        this.form.reset();
        this.models.clear();
        this.getAll();
        this.showForm = false
      }
    });
  }

  addProvider(){

  }
  deleteProvider(element){
     const dialogRef = this.dialog.open(ConfirmDialoDeleteComponent, {
              width: '300px',
              data: { message: 'Do you want to delete this item?' }
            });

            dialogRef.afterClosed().subscribe(result => {
              if (result) {
                  this.dashboardService.deleteProvider(element._id).subscribe((res: any) => {
                      if (res.success) {
                        this.getAll();
                      }
                    });
              }
            });

  }
}
