import { Component } from '@angular/core';

import {ReturnsService} from "./service/returns.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  manage: string = 'declaration';
  processing: boolean;

  constructor(private rs: ReturnsService) { }

  select(manage: string) {
    this.manage = manage;
  }
}
