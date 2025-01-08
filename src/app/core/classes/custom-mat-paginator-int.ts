import { Injectable } from "@angular/core";
import {
  MatDateFormats,
  MAT_NATIVE_DATE_FORMATS,
} from "@angular/material/core";
import { MatPaginatorIntl } from "@angular/material/paginator";
import { TranslateService } from "@ngx-translate/core";

@Injectable()
export class CustomMatPaginatorIntl extends MatPaginatorIntl {
  constructor(private translationService: TranslateService) {
    super();
    this.translationService.onLangChange.subscribe((x) => {
      this.getAndInitTranslations();
    });
  }

  getAndInitTranslations() {
    this.itemsPerPageLabel =
      this.translationService.instant("itemsPerPageLabel"); //"عنصر لكل صفحة";
    this.nextPageLabel = this.translationService.instant("nextPageLabel"); // "التالي";
    this.previousPageLabel =
      this.translationService.instant("previousPageLabel"); // "السابق";
    this.changes.next();
  }

  getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
      return `0 / ${length}`;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex =
      startIndex < length
        ? Math.min(startIndex + pageSize, length)
        : startIndex + pageSize;

    return `${startIndex + 1} - ${endIndex} / ${length}`;
  };
}

export const GRI_DATE_FORMATS: MatDateFormats = {
  ...MAT_NATIVE_DATE_FORMATS,
  display: {
    ...MAT_NATIVE_DATE_FORMATS.display,
    dateInput: {
      year: "numeric",
      month: "short",
      day: "numeric",
    } as Intl.DateTimeFormatOptions,
  },
};
