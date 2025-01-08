import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { DataService } from 'src/app/core/services/data.service';
import { NotifyService } from 'src/app/core/services/notify.service';
import { LanguageToolsService } from 'src/app/Services/language-tools.service';
import { OptionsServiceService } from 'src/app/Services/options-service.service';

@Component({
  selector: 'vex-unique-verbs',
  templateUrl: './unique-verbs.component.html',
  styleUrls: ['./unique-verbs.component.scss']
})
export class UniqueVerbsComponent implements OnInit {


  viewMode = 0;
  loader = true;
  clickedItem: any;
  selectedLang: string;
  projectName!: string;
  uniqueStems: any[] = [];
  projectId: string
  filteredStems: any[] = [];
  langUniqueStems: any[] = [];
  relatedEntities: any[] = [];
  private projectSubscription: Subscription;
  private languageSubscription: Subscription;
  descriptionFormControl = new FormControl('');
  stemFilter: { stemText: string } = { stemText: '' };

  showSyn:boolean = false
  showEnglish:boolean = false
  engSyn:any[] = []
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
              this.languageToolsGetVerbs();
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

  languageToolsGetVerbs(): void {
    this.languageToolsService.languageToolsGetVerbs(this.projectId).subscribe((response: any) => {
      if (response) {
        this.uniqueStems = response.verbs;
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
      entity.verb.toLowerCase().includes(value.toLowerCase())
    );
  }
  clickOnSynonum(){
    this.showEnglish = false
    this.showSyn = true
  }

  clickOnEnglish(){
    this.showEnglish = true
    this.showSyn = false
  }
  onItemClicked(entity: any) {
    debugger
    this.engSyn = []
    let engSynObj = []
    this.clickedItem = entity
    this.showEnglish = false
    this.showSyn = false

    entity?.verbs?.forEach((element:any) => {
      if(element.lang == "en")
        this.engSyn.push(element)
    });
  }

}
