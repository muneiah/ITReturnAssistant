import {Component, Input, OnInit, OnChanges} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ReturnsService} from '../service/returns.service';
import {Declaration} from '../model/declaration';
import {User} from '../model/user';
import {Suggestions} from '../model/suggestions';
import {isUndefined} from 'util';

@Component({
  selector: 'app-declaration',
  templateUrl: './declaration.component.html',
  styleUrls: ['./declaration.component.css']
})
export class DeclarationComponent implements OnInit {

  @Input() ctc: string;
  @Input() user: User;
  ctcForm: FormGroup;
  declarationForm: FormGroup;
  processing: boolean;
  hide: boolean;
  ctcLess: boolean;
  errorMessage: string;
  suggestions: Suggestions = new Suggestions;
  declaration: Declaration = new Declaration;
  rentAmount: number;
  start: boolean;
  toast: boolean;
  initialTax: number;

  constructor(private fb: FormBuilder) {
    this.createCTCForm();
    this.createDeclaratioForm();
  }

  years: string[] = ['2018-19'];
  sodexoAmounts: string[] = ['0', '1100', '2200'];
  locations: string[] = ['Hyderabad', 'Pune', 'Other'];

  createDeclaratioForm() {
    this.declarationForm = this.fb.group({
      email: '',
      id: '',
      password: '',
      year: '',
      name: '',
      pan: '',
      location: '',
      rent: 0,
      ownerPan: '',
      sodexo: 0,
      homeLoanInterest: 0,
      homeLoanPrincipal: 0,
      phoneBill: 0,
      savings: 0,
      insurance: 0,
      NPSPension: 0,
      educationLoan: 0
    });
  }

  createCTCForm() {
    this.ctcForm = this.fb.group({
      ctc: 0,
      taxable: 0,
      tax: 0,
      initialTax: 0,
      consultingPayRole: true
    });
  }

  updateTaxableAmount() {
    this.ctcForm.value.taxable = this.taxable;
    this.calculateTax();
  }

  calculateTax() {
    this.ctcForm.value.tax = this.tax;
  }

  get tax(): number {
    let tax: number = 0;
    if (this.ctcForm.value.ctc > 250000) {
      let s1: number = Math.min(this.taxable, 250000);
      let s2: number = Math.min(250000, this.taxable - s1);
      let s3: number = Math.min(500000, this.taxable - s1 - s2);
      let s4: number = Math.min(1000000, this.taxable - s1 - s2 - s3);
      tax = Math.round((s1 * 0) + (s2 * 0.05) + (s3 * 0.2) + (s4 * 0.3));
      tax = (tax + (tax * 0.04));
      if (this.start) {
        this.initialTax = tax;
        // this.taxable = this.taxable - 250000;
      }
      this.ctcForm.value.tax = tax;
      this.start = false;
      if (!this.toast && tax === 0) {
        Materialize.toast('<strong>Hurry!! You have saved complete tax amount!!</strong>', 4000, 'rounded');
        this.toast = true;
      }
    }
    return tax;
  }

  get taxable(): number {
    let taxable: number = 0;
    if (this.ctcForm.value.ctc > 250000) {
      taxable = this.ctcForm.value.ctc - (this.suggestions.insurance + this.declarationForm.value.sodexo * 12 + this.suggestions.pf) - 250000;
      let save: number = 0;
      let basic: number = ((this.isValid(this.suggestions.basic) ? this.suggestions.basic : 0) * 0.1);
      save = save + ((this.declarationForm.value.rent > 0 && this.declarationForm.value.rent > basic) ? Math.min(this.suggestions.hra, this.declarationForm.value.rent, (this.declarationForm.value.rent - basic)) : 0);
      save = save + Math.min(200000, this.declarationForm.value.homeLoanInterest);
      save = save + Math.min(150000, (this.declarationForm.value.homeLoanPrincipal + this.declarationForm.value.savings + (this.isValid(this.suggestions.pf) ? this.suggestions.pf : 0)));
      console.log(this.declarationForm.value.homeLoanPrincipal + this.declarationForm.value.savings + (this.isValid(this.suggestions.pf) ? this.suggestions.pf : 0));
      save = save + Math.min(18000, this.declarationForm.value.phoneBill);
      save = save + Math.min(25000, this.declarationForm.value.insurance);
      save = save + Math.min(50000, this.declarationForm.value.NPSPension);
      save = save + this.declarationForm.value.educationLoan;
      taxable = taxable - save;
    }
    return taxable;
  }

  declarationChanges() {
    this.suggestions.rent = Math.max(this.declarationForm.value.rent, this.suggestions.hra, this.declarationForm.value.rent - this.suggestions.basic * 0.1);
    this.ctcForm.value.taxable = this.ctcForm.value.taxable - Math.min(this.declarationForm.value.rent, this.suggestions.hra, this.declarationForm.value.rent - this.suggestions.basic * 0.1);
    this.calculateTax();
  }

  getInsuranceAmount() {
    if (this.ctcForm.value.consultingPayRole) {
      this.suggestions.insurance = 6684.0;
    } else {
      this.suggestions.insurance = 7644.0;
    }
  }

  showhide(val) {
    this.hide = val;
    document.getElementById('ctc').setAttribute('type', !this.hide ? 'password' : 'number');
  }

  showTaxableAmount() {
    this.start = true;
    this.resetSuggestions();
    this.ctcLess = this.ctcForm.value.ctc <= 250000;
    this.updatePayStructure();
    if (!this.ctcLess) {
      this.getSuggestions();
    }
  }

  getMonth(val) {
    return Math.round(val / 12);
  }

  fetchRecords() {

  }

  updatePayStructure() {
    this.getInsuranceAmount();
    this.suggestions.basic = Math.round(this.ctcForm.value.ctc * 0.35);
    this.suggestions.hra = Math.round(this.suggestions.basic * 0.4);
    this.suggestions.stand = 40000.0;
    this.suggestions.phone = 18000.0;
    this.suggestions.pf = Math.max(Math.round(this.suggestions.basic * 0.12), 21600);
    this.suggestions.gratuity = Math.round(this.suggestions.basic * 0.04808);
    let sum: number = this.suggestions.basic + this.suggestions.hra + this.suggestions.stand + this.suggestions.phone;
    this.suggestions.spl = this.ctcForm.value.ctc - (this.suggestions.insurance + this.suggestions.sodexo + this.suggestions.pf + this.suggestions.gratuity + sum);
    this.suggestions.gross = sum + this.suggestions.spl;
    this.suggestions.esi = Math.round((this.suggestions.gross / 12) >= 21000 ? 0 : (this.suggestions.gross / 12) * 0.0175);
    this.suggestions.pt = 2400;
    this.updateTaxableAmount();
  }

  getSuggestions() {
    if (this.ctcForm.value.ctc > 250000) {
      let remaining: number = 0;
      if (this.taxable > 0) {
        this.suggestions.rent = Math.round(this.suggestions.basic * 0.5);
        remaining = this.ctcForm.value.ctc - this.suggestions.hra;
      }
      if (remaining > 0) {
        this.suggestions.phoneBills = remaining > 18000 ? 18000 : remaining;
        remaining = remaining - this.suggestions.phoneBills;
      }
      if (remaining > 0) {
        this.suggestions.sodexo = remaining > 13200 ? 26400 : 13200;
        remaining = remaining - this.suggestions.sodexo;
      }
      if (remaining > 0) {
        let saved = this.suggestions.pf + this.declarationForm.value.homeLoanPrincipal;
        this.suggestions.savings = saved > 150000 ? 0 : (remaining < (150000 - saved) ? remaining : (150000 - saved));
        remaining = remaining - (this.suggestions.savings + saved);
      }
      if (remaining > 0) {
        this.suggestions.otherInsurance = remaining > 25000 ? 25000 : remaining;
        remaining = remaining - this.suggestions.otherInsurance;
      }
      if (remaining > 0) {
        this.suggestions.NPSPension = remaining > 50000 ? 50000 : remaining;
        remaining = remaining - this.suggestions.NPSPension;
      }
    }
  }

  ngOnChanges() {
    this.ctcForm.reset({
      ctc: this.ctc
    });
    this.declarationForm.reset({
      rent: this.declaration.rent,
      ownerPan: this.declaration.ownerPan,
      sodexo: this.declaration.sodexo,
      homeLoanInterest: this.declaration.homeLoanInterest,
      homeLoanPrincipal: this.declaration.homeLoanPrincipal,
      phoneBill: this.declaration.phoneBill,
      savings: this.declaration.savings,
      insurance: this.declaration.insurance,
      NPSPension: this.declaration.NPSPension,
      educationLoan: this.declaration.educationLoan
    });
  }

  isValid(val) {
    return (isUndefined(val) ? false : (val > 0));
  }

  resetSuggestions() {
    this.suggestions.rent = 0;
    this.suggestions.otherInsurance = 0;
    this.suggestions.NPSPension = 0;
    this.suggestions.phoneBills = 0;
    this.suggestions.savings = 0;
    this.suggestions.sodexo = 0;
    this.suggestions.spl = 0;
    this.suggestions.basic = 0;
  }

  ngOnInit() {
    this.hide = false;
    this.ctcLess = false;
    this.errorMessage = '';
    this.rentAmount = 0;
    this.initialTax = 0;
    this.toast = false;
    this.resetSuggestions();
  }
}
