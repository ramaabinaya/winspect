import { Injectable } from '@angular/core';
import { MatomoTracker } from 'ngx-matomo';

@Injectable({
  providedIn: 'root'
})
/**
 * Class service which is used to log user activities in matomo metric tool.
 */
export class MatomoService {
  /**
   * Component constructor used to inject the required services.
   * @param matomoTracker To define the MatomoTracker.
   */
  constructor(private matomoTracker: MatomoTracker) { }

  /**
   * Method which is used to set router link and track the page in matomo metrics manually.
   * @param title {string} defines the title to be displayed for the page url in matomo metric tool.
   */
  initialize(title: string) {
    const baseUrl = window.location.href;
    this.matomoTracker.setCustomUrl(`${baseUrl}`);
    this.matomoTracker.trackPageView(title);
  }

  /**
   * Method which is used to set USER ID in matomo metrics tool.
   * @param title {string} defines the title to be displayed for the page url in matomo metric tool.
   */
  setUserId(userId: string) {
    this.matomoTracker.setUserId(userId);
  }

  /**
   * Method which is used to add user action as an event.
   * @param category {string} to define the category to which event belong to.
   * @param action {string} defines the action in the category.
   * @param name {string} name for the action.
   * @param value {number} optional parameter default value is 1.
   */
  addEvent(category: string, action: string, name: string) {
    this.matomoTracker.trackEvent(category, action, name);

  }
}
