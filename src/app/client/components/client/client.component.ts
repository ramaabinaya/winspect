import { Component, OnInit } from '@angular/core';
import { MatomoService } from '../../../common/services/matomo.service';
/**
 * Component which is used to manage client details.
 */
@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {
  /**
  * Variable which is used to set the title of the page in metric tool.
  */
  pageTitle: string = "CLIENTS";
  /**
   * Constructor which is used to inject the required services.
   * @param matomoService to perform metric operation on this component.
   */
  constructor(private matomoService: MatomoService) { }

  /**
   * Component oninit life cycle hook
   */
  ngOnInit() {
    this.matomoService.initialize(this.pageTitle);    // Setting the component as page to track.
  }

}
