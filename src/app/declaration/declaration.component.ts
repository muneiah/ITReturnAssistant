import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ReturnsService} from '../service/returns.service';
import {Declaration} from '../model/declaration';
import {User} from '../model/user';
import {Suggestions} from '../model/suggestions';
import {isUndefined} from 'util';
import {Year} from '../model/year';

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
  isUpdateInfo: boolean;
  isNewUser: boolean;
  isActiveYear: boolean;
  errorMessage: string;
  suggestions: Suggestions = new Suggestions;
  declaration: Declaration = new Declaration;
  rentAmount: number;
  start: boolean;
  getSuggestion: boolean;
  toast: boolean;
  initialTax: number;
  initialTaxable: number;
  selectedYear: string;
  toastSuccessMessage: string;
  years: Year[];

  constructor(private fb: FormBuilder, private returnService: ReturnsService) {
    this.createCTCForm();
    this.createDeclaratioForm();
  }


  sodexoAmounts: number[] = [0, 1100, 2200];
  locations: string[] = ['Hyderabad', 'Pune', 'Other'];
  tipBackGround: string[] = ['lazur-bg', 'navy-bg', 'yellow-bg'];

  createDeclaratioForm() {
    this.declarationForm = this.fb.group({
      email: '',
      id: '',
      password: '',
      year: '',
      name: '',
      pan: '',
      location: 'Hyderabad',
      rent: 0,
      ownerPan: '',
      sodexo: 0,
      homeLoanInterest: 0,
      homeLoanPrincipal: 0,
      phoneBill: 0,
      savings: 0,
      insurance: 0,
      npspension: 0,
      educationLoan: 0
    });
  }

  createCTCForm() {
    this.ctcForm = this.fb.group({
      ctc: 0,
      taxable: 0,
      tax: 0,
      initialTax: 0,
      consultingPayRole: true,
      technologiesPayRole: false
    });
  }

  updateTaxableAmount() {
    this.ctcForm.value.taxable = this.taxable;
    this.calculateTax();
  }

  calculateTax() {
    this.ctcForm.value.tax = this.tax;
  }

  getTaxAmount(num): number {
    let tax: number = 0;
    let s1: number = Math.min(num, 250000);
    let s2: number = Math.min(250000, num - s1);
    let s3: number = Math.min(500000, num - s1 - s2);
    let s4: number = Math.min(1000000, num - s1 - s2 - s3);
    tax = Math.round((s1 * 0) + (s2 * 0.05) + (s3 * 0.2) + (s4 * 0.3));
    tax = (tax + (tax * 0.04));
    return tax;
  }

  get tax(): number {
    let tax: number = 0;
    if (this.ctcForm.value.ctc > 250000) {
      this.initialTax = this.getTaxAmount(this.initialTaxable);
      tax = this.getTaxAmount(this.taxable);
      this.ctcForm.value.tax = tax;
      this.start = false;
      if (!this.toast && tax === 0) {
        this.toastSuccessMessage = '<strong>Hurry!! You have saved complete tax amount!!</strong>';
        let ele: HTMLElement = document.getElementById('toastSuccessMessage');
        ele.click();
        this.toast = true;
      }
    }
    return tax;
  }

  get taxable(): number {
    let taxable: number = 0;
    if (this.ctcForm.value.ctc > 250000) {
      let gross: number = this.suggestions.basic + this.suggestions.stand + this.suggestions.phone + this.suggestions.spl + this.suggestions.hra;
      let remaining: number = gross - this.suggestions.stand;
      taxable = remaining - this.suggestions.pt;
      this.initialTaxable = taxable - (this.isValid(this.suggestions.pf) ? this.suggestions.pf : 0);
      taxable = taxable - (this.declarationForm.value.sodexo * 12);
      let save: number = 0;
      let basic: number = ((this.isValid(this.suggestions.basic) ? this.suggestions.basic : 0) * 0.1);
      save = save + ((this.declarationForm.value.rent > 0 && this.declarationForm.value.rent > basic) ? Math.min(this.suggestions.hra, this.declarationForm.value.rent, (this.declarationForm.value.rent - basic)) : 0);
      save = save + Math.min(200000, this.declarationForm.value.homeLoanInterest);
      save = save + Math.min(150000, (this.declarationForm.value.homeLoanPrincipal + this.declarationForm.value.savings + (this.isValid(this.suggestions.pf) ? this.suggestions.pf : 0)));
      save = save + Math.min(18000, this.declarationForm.value.phoneBill);
      save = save + Math.min(25000, this.declarationForm.value.insurance);
      save = save + Math.min(50000, this.declarationForm.value.npspension);
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
    this.toast = false;
    // this.resetSuggestions();
    this.ctcLess = this.ctcForm.value.ctc <= 250000;
    this.updatePayStructure();
    if (this.ctcLess) {
      this.getSuggestion = false;
    } else {
      this.getSuggestions();
      this.getSuggestion = true;
    }
  }

  getMonth(val) {
    return Math.round(val / 12);
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
        remaining = this.taxable - 250000 - this.suggestions.hra;
      } else {
        this.suggestions.rent = 0;
      }
      if (remaining > 0) {
        this.suggestions.phoneBills = remaining > 18000 ? 18000 : remaining;
        remaining = remaining - this.suggestions.phoneBills;
      } else {
        this.suggestions.phoneBills = 0;
      }
      if (remaining > 0) {
        this.suggestions.sodexo = remaining > 13200 ? 26400 : 13200;
        remaining = remaining - this.suggestions.sodexo;
      } else {
        this.suggestions.sodexo = 0;
      }
      if (remaining > 0) {
        let saved = this.suggestions.pf + this.declarationForm.value.homeLoanPrincipal;
        this.suggestions.savings = saved > 150000 ? 0 : (remaining < (150000 - saved) ? remaining : (150000 - saved));
        remaining = remaining - (this.suggestions.savings + saved);
      } else {
        this.suggestions.savings = 0;
      }
      if (remaining > 0) {
        this.suggestions.otherInsurance = remaining > 25000 ? 25000 : remaining;
        remaining = remaining - this.suggestions.otherInsurance;
      } else {
        this.suggestions.otherInsurance = 0;
      }
      if (remaining > 0) {
        this.suggestions.NPSPension = remaining > 50000 ? 50000 : remaining;
        remaining = remaining - this.suggestions.NPSPension;
      } else {
        this.suggestions.NPSPension = 0;
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
      npspension: this.declaration.npspension,
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

  getYears() {
    this.processing = true;
    this.returnService.getYears().subscribe(years => {
      this.years = years;
      this.processing = false;
    });
  }

  saveUser() {
    this.processing = true;
    this.getDeclarationFormData();
    this.returnService.saveUser(this.user).subscribe(result => {
      if (!result)
        this.errorMessage = 'An error occured while saving your information!!';
      else
        this.errorMessage = 'Hurry!! You have saved your declaration details!!';
      this.processing = false;
      document.documentElement.scrollTop = 0;
    });
  }

  getDeclarationFormData() {
    this.user.id = this.declarationForm.value.id;
    this.user.password = this.declarationForm.value.password;
    this.user.email = this.declarationForm.value.email;
    this.user.name = this.declarationForm.value.name;
    this.user.pan = this.declarationForm.value.pan;
    this.user.location = this.declarationForm.value.location;
    let de: Declaration = new Declaration;
    de.year = this.declarationForm.value.year;
    de.rent = this.declarationForm.value.rent;
    de.ownerPan = this.declarationForm.value.ownerPan;
    de.sodexo = +this.declarationForm.value.sodexo;
    de.homeLoanInterest = this.declarationForm.value.homeLoanInterest;
    de.homeLoanPrincipal = this.declarationForm.value.homeLoanPrincipal;
    de.phoneBill = this.declarationForm.value.phoneBill;
    de.savings = this.declarationForm.value.savings;
    de.insurance = this.declarationForm.value.insurance;
    de.npspension = this.declarationForm.value.npspension;
    de.educationLoan = this.declarationForm.value.educationLoan;
    if (this.user.declaration.length > 0) {
      let missing = this.user.declaration.filter(item => item.year !== this.selectedYear);
      missing.push(de);
      this.user.declaration = missing;
    } else {
      this.user.declaration = [de];
    }
    // this.user.declarations = [];
    console.log(this.user);
  }

  setUserAndDeclarationFormData() {
    let de: Declaration = new Declaration;
    if (this.user.declaration != null) {
      let missing = this.user.declaration.filter(item => item.year === this.selectedYear);
      if (missing.length > 0) {
        de = missing[0];
      }
      this.isNewUser = missing.length === 0;
      this.isUpdateInfo = true;
    } else {
      this.user.declaration = [];
      this.isNewUser = true;
      this.isUpdateInfo = false;
    }
    this.declarationForm = this.fb.group({
      email: this.user.email,
      id: this.user.id,
      password: this.user.password,
      year: this.selectedYear,
      name: this.user.name,
      pan: this.user.pan,
      location: this.user.location,
      rent: de.rent,
      ownerPan: de.ownerPan,
      sodexo: de.sodexo,
      homeLoanInterest: de.homeLoanInterest,
      homeLoanPrincipal: de.homeLoanPrincipal,
      phoneBill: de.phoneBill,
      savings: de.savings,
      insurance: de.insurance,
      npspension: de.npspension,
      educationLoan: de.educationLoan
    });
  }

  getUser() {
    this.processing = true;
    this.selectedYear = this.declarationForm.value.year;
    if (this.declarationForm.value.id !== '' && this.declarationForm.value.password !== '') {
      this.returnService.getUser(this.declarationForm.value.id, this.declarationForm.value.password).subscribe(userInfo => {
        if (userInfo === null) {
          this.errorMessage = 'Your password is invalid! Entered ID::'.concat(this.declarationForm.value.id);
          this.declarationForm.value.year = '';
          this.declarationForm.value.password = '';
          this.createDeclaratioForm();
        } else {
          this.errorMessage = '';
          this.user = userInfo;
          this.setUserAndDeclarationFormData();
        }
        this.processing = false;
        this.isActiveYear = this.years.filter(y => y.id === this.declarationForm.value.year)[0].active;
      });
    }
  }

  getRandomTipBackGround() {
    return this.tipBackGround[Math.floor(Math.random() * this.tipBackGround.length)];
  }

  ngOnInit() {
    this.hide = false;
    this.ctcLess = false;
    this.errorMessage = '';
    this.rentAmount = 0;
    this.initialTax = 0;
    this.toast = false;
    this.isUpdateInfo = false;
    this.isNewUser = false;
    this.isActiveYear = false;
    this.getSuggestion = false;
    this.toastSuccessMessage = '';
    this.resetSuggestions();
    this.getYears();
  }
}
