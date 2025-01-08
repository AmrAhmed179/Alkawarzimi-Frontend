import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { SaveWidgetFile } from "../core/models/save-widget-file";
import { WidgetStyle } from "../core/models/widgetsetup-model";
import { AppConfigService } from "./app-config.service";
import { forkJoin } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ChatBotThemesService {
  uploadImageForm: FormData;
  uploadImages = [];
  constructor(private http_client: HttpClient) {}

  getAllChatBotThemes(chatBotId: string) {
    const url = `${
      AppConfigService.settings.messangerUrl + environment.URLS.GetChatBotThemes
    }${chatBotId}`;
    return this.http_client.get(url);
  }

  getThemeByThemeId(themeId: string) {
    const url = `${
      AppConfigService.settings.messangerUrl +
      environment.URLS.GetThemeByThemeId
    }${themeId}`;
    return this.http_client.get(url);
  }

  createNewChatBotTheme(themeName: string, chatBotId: string) {
    const url = `${
      AppConfigService.settings.messangerUrl +
      environment.URLS.CreateNewChatBotTheme
    }?chatBotId=${chatBotId}&themeName=${themeName}`;
    return this.http_client.post(url, null);
  }

  updateImagesPath(files: SaveWidgetFile[]) {
    const url = `${
      AppConfigService.settings.messangerUrl + environment.URLS.updateImagesPath
    }`;
    // const url = "http://localhost:50526/" + environment.URLS.updateImagesPath;
    return this.http_client.post(url, files);
  }

  deleteTheme(themeId: string) {
    const url = `${
      AppConfigService.settings.messangerUrl +
      environment.URLS.DeleteChatBotTheme
    }${themeId}`;
    return this.http_client.delete(url);
  }

  getBaseLibStyleFile(fileName: string, chatBotId: string) {
    const url = `${
      AppConfigService.settings.messangerUrl + environment.URLS.GetBaseLibFile
    }${fileName}&chatBotId=${chatBotId}`;
    return this.http_client.get(url, { responseType: "text" });
  }

  updateTheme(
    themeId: string,
    updatedTheme: WidgetStyle,
    files: SaveWidgetFile[]
  ) {
    const url = `${
      AppConfigService.settings.messangerUrl +
      environment.URLS.UpdateChatBotTheme
    }${themeId}`;
    console.log(url);
    const data = {
      updatedTheme: updatedTheme,
      files: files,
    };
    console.log(data);

    let uploadImage$;
    const uploadImageUrl = `${environment.URLS.UPloadRHImage}`;
    this.uploadImages.forEach((image) => {
      uploadImage$ = this.http_client
        .post(uploadImageUrl, image)
        .subscribe(() => {});
    });
    // const updateTheme$ = this.http_client.put(url, data);
    // return forkJoin([uploadImage$, updateTheme$]);
    return this.http_client.put(url, data);
  }

  uploadKHResource(
    name: string,
    file: File,
    chatBotID: string,
    themeName: string
  ) {
    let isExisted = false;
    let isExistedIdx;

    this.uploadImageForm = new FormData();
    this.uploadImageForm.append("channel", "web");
    this.uploadImageForm.append("lang", "ar");
    this.uploadImageForm.append("theme", themeName);
    this.uploadImageForm.append("chatBotId", chatBotID);
    this.uploadImageForm.append("name", name);
    this.uploadImageForm.append("file", file);

    if (this.uploadImages.length === 0) {
      this.uploadImages.push(this.uploadImageForm);
    }

    this.uploadImages.forEach((uploadImage, idx) => {
      if (uploadImage.get("name") === this.uploadImageForm.get("name")) {
        isExisted = true;
        isExistedIdx = idx;
      }
    });

    if (!isExisted) {
      this.uploadImages.push(this.uploadImageForm);
    } else {
      this.uploadImages[isExistedIdx] = this.uploadImageForm;
    }
  }
}
