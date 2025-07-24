import { Injectable } from "@angular/core";
import {
  NavigationDropdown,
  NavigationItem,
  NavigationLink,
  NavigationSubheading,
} from "../interfaces/navigation-item.interface";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class NavigationService {
  items: NavigationItem[] = [];

  public _itemsSubject = new Subject<NavigationItem[]>();
  private _linkChangeSubject = new Subject<NavigationLink>();
  openLinkChange$ = this._linkChangeSubject.asObservable();

  private _openChangeSubject = new Subject<NavigationDropdown>();
  openChange$ = this._openChangeSubject.asObservable();

  constructor() {}
  public triggerItemsChange() {
    this._itemsSubject.next(this.items);
  }
  triggerOpenChange(item: NavigationDropdown) {
    this._openChangeSubject.next(item);
  }

  isLink(item: NavigationItem): item is NavigationLink {
    return item.type === "link";
  }

  isDropdown(item: NavigationItem): item is NavigationDropdown {
    return item.type === "dropdown";
  }

  isSubheading(item: NavigationItem): item is NavigationSubheading {
    return item.type === "subheading";
  }
}
