import { Component } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { UserService } from "../services/user.service";
import { Router } from "@angular/router";

import { AuthenticationService } from "../services/authentication.service";
import { Language } from "../models/enums";
import { UserInfo } from "../models/UserInfo";

const LANGUAGE_STORAGE_STRING = "language";
const MOBILE_WIDTH = 630;

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  currentToken: string;
  drawerOpen: boolean = true;

  get userInfo(): UserInfo {
    return this.userService.currentUserValue;
  }

  get isAdmin(): Boolean {
    return this.userService.isAdmin();
  }

  get languageEnum() {
    return Language;
  }

  constructor(
    private translate: TranslateService,
    private userService: UserService,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.initLanguage();
    this.authenticationService.currentToken.subscribe(
      x => (this.currentToken = x)
    );
    if (this.authenticationService.isLoggedIn()) this.getUserInfo();
    this.drawerOpen = window.innerWidth >= MOBILE_WIDTH;
  }

  getUserInfo() {
    this.userService.getUserInfo().subscribe(() => {});
  }

  initLanguage() {
    const language = localStorage.getItem(LANGUAGE_STORAGE_STRING);
    if (language) this.setLanguage(language);
    else this.setLanguage(Language.EN);
  }

  setLanguage(language) {
    this.translate.setDefaultLang(language);
    this.translate.use(language);
    localStorage.setItem(LANGUAGE_STORAGE_STRING, language);
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(["/login"]);
    this.navAction();
  }

  goToAccount() {}

  toggleDrawer(){
    this.drawerOpen = !this.drawerOpen
  }

  navAction(){
    if (window.innerWidth < MOBILE_WIDTH) {
      this.toggleDrawer();
    }
  }

}
