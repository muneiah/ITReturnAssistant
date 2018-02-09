import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {ReturnsService} from '../service/returns.service';
import {Sodexo} from '../model/sodexo';

@Component({
  selector: 'app-sodexo',
  templateUrl: './sodexo.component.html',
  styleUrls: ['./sodexo.component.css']
})
export class SodexoComponent implements OnInit {

  @Input() sodexo: Sodexo;
  sodexoForm: FormGroup;
  processing: boolean;


  constructor(private fb: FormBuilder, private returnService: ReturnsService) {
    this.createSodexoForm();
  }

  createSodexoForm() {
    this.sodexoForm = this.fb.group({
      haveCard: false,
      amount: 0
    });
  }

  saveSodexo() {
    this.processing = true;

    this.processing = false;

  }


  ngOnInit() {
  }

}
