import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { LanguageToolsService } from 'src/app/Services/language-tools.service';
import { OptionsServiceService } from 'src/app/Services/options-service.service';
import { DataService } from 'src/app/core/services/data.service';
import { NotifyService } from 'src/app/core/services/notify.service';

@Component({
  selector: 'vex-unique-domain-stems',
  templateUrl: './unique-domain-stems.component.html',
  styleUrls: ['./unique-domain-stems.component.scss']
})
export class UniqueDomainStemsComponent implements OnInit, OnDestroy {

  viewMode = 0;
  loader = true;
  clickedItem: any;
  selectedLang: string;
  projectName!: string;
  uniqueStems: any[] = [];
  projectId: string = '150';
  filteredStems: any[] = [];
  langUniqueStems: any[] = [];
  relatedEntities: any[] = [];
  private projectSubscription: Subscription;
  private languageSubscription: Subscription;
  descriptionFormControl = new FormControl('');
  stemFilter: { stemText: string } = { stemText: '' };

  displayedColumns: string[] = ['entityId', 'entityType', 'entityText'];
  displayedColumnsTwo: string[] = ['number', 'word', 'pos', 'stemId', 'prefix', 'suffix'];

  dataSource = new MatTableDataSource<any>([
    { word: '', pos: '', stemId: 16302, prefix: '', suffix: '' },
  ]);

  constructor(
    private languageToolsService: LanguageToolsService,
    private notify: NotifyService,
    private dataService: DataService,
    private optionsService: OptionsServiceService
  ) { }

  ngOnInit(): void {

    this.descriptionFormControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((value: string) => {
      this.applyFilter(value);
    });

    this.projectSubscription = this.dataService.$project_bs.subscribe((project) => {
      if (project) {
        this.projectId = project._id;
        this.languageSubscription = this.optionsService.selectedLang$.subscribe(
          (response) => {
            if (response) {
              this.selectedLang = response;
              this.getStems();
            }
          }
        );
      }
    });
  }

  ngOnDestroy(): void {
    if (this.projectSubscription) {
      this.projectSubscription.unsubscribe();
    }
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
  }

  getStems(): void {
    this.languageToolsService.getStems(this.projectId).subscribe((response: any) => {
      if (response) {
        this.uniqueStems = response.uniqueStems;
        this.filteredStems = [...this.uniqueStems];
        this.langUniqueStems = this.uniqueStems.filter((element) => element.language == this.selectedLang);
      } else {
        this.notify.openSuccessSnackBar("successful");
      }
    });
  }

  getUniqueStems(): void {
    this.languageToolsService.getStems(this.projectId).subscribe((response: any) => {
      if (response) {

      }
    });
  }

  applyFilter(value: string): void {
    this.filteredStems = this.uniqueStems.filter(entity =>
      entity.stemText.toLowerCase().includes(value.toLowerCase())
    );
  }

  onItemClicked(entity: any) {
    this.clickedItem = entity.relatedEntities
  }


}