import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SelectedVerbService {

  private selectedVerbSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  selectedVerb$: Observable<any> = this.selectedVerbSubject.asObservable();

  constructor() { }

  setSelectedVerb(verb: any) {
    this.selectedVerbSubject.next(verb);
  }
}
