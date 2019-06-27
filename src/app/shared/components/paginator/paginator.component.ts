import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent implements OnInit {
  @Input() pageDetails;
  @Output() paginatorClicked = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
    console.log('pagedetails', this.pageDetails);
  }
  paginate(event) {
    console.log('event', event);
    this.paginatorClicked.emit(event);
  }
}
