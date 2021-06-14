import { Injectable, Inject, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import  { getQueryParam } from '../helpers/url.helper';

interface ITheme {
  name: string,
  baseColor?: string,
  isActive?: boolean
}

@Injectable()
export class ThemeService {
  public companyThemes :ITheme[]  = [{
    "name": "company-indigo",
    "baseColor": "#2c6837",
    "isActive": false 
  }, {
    "name": "company-indigo",
    "baseColor": "#2c6837",
    "isActive": false 
  }];
  public activatedTheme: ITheme;

  constructor(
    @Inject(DOCUMENT) private document: Document
  ) {}

  // Invoked in AppComponent and apply 'activatedTheme' on startup
  applyMatTheme(r: Renderer2) {
    /*
    ****** (SET YOUR DEFAULT THEME HERE) *******
    * Assign new Theme to activatedTheme
    */
    // this.activatedTheme = this.companyThemes[0]; 
    // this.activatedTheme = this.companyThemes[1]; 
    // this.activatedTheme = this.companyThemes[2]; 
    this.activatedTheme = this.companyThemes[0];

    // *********** ONLY FOR DEMO **********
    this.setThemeFromQuery();
    // ************************************

    this.changeTheme(r, this.activatedTheme)
  }

  changeTheme(r: Renderer2, theme:ITheme) {
    r.removeClass(this.document.body, this.activatedTheme.name);
    r.addClass(this.document.body, theme.name);
    this.flipActiveFlag(theme)
  }
  flipActiveFlag(theme:ITheme) {
    this.companyThemes.forEach((t) => {
      t.isActive = false;
      if(t.name === theme.name) {
        t.isActive = true;
        this.activatedTheme = theme;
      }
    });
  }

  // *********** ONLY FOR DEMO **********
  setThemeFromQuery() {
    let themeStr = getQueryParam('theme');
    try {
      this.activatedTheme = JSON.parse(themeStr);
      this.flipActiveFlag(this.activatedTheme);
    } catch(e) {}
  }
}
