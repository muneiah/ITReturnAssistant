import { Component, OnInit } from '@angular/core';
import {ReturnsService} from '../service/returns.service';

@Component({
  selector: 'app-savings',
  templateUrl: './savings.component.html',
  styleUrls: ['./savings.component.css']
})
export class SavingsComponent implements OnInit {

  constructor() { }

  getTypes() {
    return ReturnsService.typesOfSavings;
  }

  ngOnInit() {
  }

}
