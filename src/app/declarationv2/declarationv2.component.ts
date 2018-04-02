import { Component, OnInit } from '@angular/core';
import {ReturnsService} from '../service/returns.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Year} from '../model/year';
import {Section} from '../model/section';
import {User} from '../model/user';
import {Declaration} from '../model/declaration';
import {isUndefined} from 'util';
import {Suggestions} from '../model/suggestions';

@Component({
  selector: 'app-declarationv2',
  templateUrl: './declarationv2.component.html',
  styleUrls: ['./declarationv2.component.css']
})
export class Declarationv2Component implements OnInit {

  loginOrRegisterForm: FormGroup;
  personalInformationForm: FormGroup;
  financialYearForm: FormGroup;
  residenceInformationForm: FormGroup;
  sodexoCardForm: FormGroup;
  telephoneAndInternetBillsForm: FormGroup;
  savingsForm: FormGroup;
  insuranceForm: FormGroup;
  NPSAtalPensionYojanaForm: FormGroup;
  educationLoanForm: FormGroup;
  ctcForm: FormGroup;
  selectedSectionIndex: number;
  hide: boolean;
  user: User = new User();
  currentDeclaration: Declaration = new Declaration();
  isFinancialYearActive: boolean;
  processing: boolean;
  financialYears: Year[];
  isSignIn: boolean;
  isRegister: boolean;
  isNewDeclaration: boolean;
  editPersonalInfo: boolean;
  taxExcempted: number;
  initialTaxable: number;
  initialTax: number;
  errorMessage: string;
  suggestions: Suggestions = new Suggestions;
  allSections: Section[];
  footerMessage: string;
  locations: string[] = ['Hyderabad', 'Pune', 'Other'];
  sodexoAmounts: number[] = [1100, 2200];

  constructor(private fb: FormBuilder, private returnService: ReturnsService) {
    this.setAllSectionsData();
    this.createLoginOrRegisterForm();
    this.createPersonalInformationForm();
    this.createFinancialYearForm();
    this.createResidenceInformationForm();
    this.createSodexoCardForm();
    this.createTelephoneAndInternetBillsForm();
    this.createSavingsForm();
    this.createInsuranceForm();
    this.createNPSAtalPensionYojanaForm();
    this.createEducationLoanForm();
    this.createCTCForm();
  }

  createLoginOrRegisterForm() {
    this.loginOrRegisterForm = this.fb.group({
      id: '',
      password: ''
    });
  }

  createPersonalInformationForm() {
    this.personalInformationForm = this.fb.group({
      name: '',
      email: '',
      pan: ''
    });
  }

  createFinancialYearForm() {
    this.financialYearForm = this.fb.group({
      year: ''
    });
  }

  createResidenceInformationForm() {
    this.residenceInformationForm = this.fb.group({
      location: 'Hyderabad',
      isOwnHouse: false,
      rent: 0,
      ownerPan: '',
      haveHomeLoan: false,
      homeLoanInterest: 0,
      homeLoanPrincipal: 0
    });
  }

  createSodexoCardForm() {
    this.sodexoCardForm = this.fb.group({
      haveSodexoCard: false,
      sodexo: 0
    });
  }

  createTelephoneAndInternetBillsForm() {
    this.telephoneAndInternetBillsForm = this.fb.group({
      haveTelephoneAndInternetBills: false,
      phoneBill: 0
    });
  }

  createSavingsForm() {
    this.savingsForm = this.fb.group({
      savings: 0
    });
  }

  createInsuranceForm() {
    this.insuranceForm = this.fb.group({
      haveInsurance: false,
      insurance: 0
    });
  }

  createNPSAtalPensionYojanaForm() {
    this.NPSAtalPensionYojanaForm = this.fb.group({
      haveNPSAtalPensionYojana: false,
      NPSAtalPensionYojana: 0
    });
  }

  createEducationLoanForm() {
    this.educationLoanForm = this.fb.group({
      haveEducationLoan: false,
      educationLoan: 0
    });
  }

  createCTCForm() {
    this.ctcForm = this.fb.group({
      ctc: 0,
      consultingPayRole: false
    });
  }

  setAllSectionsData() {
    this.allSections = [new Section('logInOrRegister', 'Login / Register', 'Provide your login credentials', true),
      new Section('personalInformation', 'Personal Information', 'Provide your personal information', false),
      new Section('financialYear', 'Financial Year', 'Select Financial Year', false),
      new Section('residenceInformation', 'Residence Information', 'Fill your Residence Information', false),
      new Section('sodexoCard', 'Sodexo Meal Pass', 'Fill Sodexo Meal Pass Information', false),
      new Section('telephoneAndInternetBills', 'Telephone and Internet Bills', 'Fill Telephone and Internet Bills Information', false),
      new Section('savings', 'Savings (80C)', 'How much do you want to save? (LIC, FD, NSC, Home Loan Principal, etc)', false),
      new Section('medicalInsurance', 'Medical Insurance (80D)', 'Fill Medical Insurance (80D) Information', false),
      new Section('NPSAtalPensionYojana', 'NPS Atal Pension Yojana', 'Fill NPS Atal Pension Yojana Information', false),
      new Section('educationLoan', 'Education Loan (80E)', 'Fill Education Loan (80E) Information', false),
      new Section('success', 'Submitted Successfully!!', 'Congratulations!! You have successfully submitted Declaration for ', false)];
  }

  getActiveSection(): Section {
    let found = this.allSections.filter(e => e.isActive);
    if (found.length > 0) {
      return found[0];
    }
  }

  changeActiveSection(name) {
    let s = this.allSections.filter(e => e.isActive);
    if (s.length > 0) {
      s[0].isActive = false;
    }
    let p = this.allSections.filter(e => e.name === name);
    if (p.length > 0) {
      p[0].isActive = true;
      this.selectedSectionIndex = this.allSections.indexOf(p[0], 0);
    }
  }

  loginOrRegisterUser() {
    this.processing = true;
    this.returnService.getUser(this.loginOrRegisterForm.value.id, this.loginOrRegisterForm.value.password).subscribe(userInfo => {
      if (userInfo === null) {
        this.errorMessage = 'Your password is invalid! Entered ID::'.concat(this.loginOrRegisterForm.value.id);
        this.loginOrRegisterForm.value.year = '';
        this.loginOrRegisterForm.value.password = '';
        this.createLoginOrRegisterForm();
      } else {
        this.errorMessage = '';
        this.user = userInfo;
        this.editPersonalInfo = this.isRegister = isUndefined(this.user.name) || this.user.name == null;
        this.changeActiveSection(this.isRegister ? 'personalInformation' : 'financialYear');
        // if (!this.isRegister) {
        this.isSignIn = !this.isRegister;
        this.personalInformationForm.setValue({
          name: this.user.name,
          email: this.user.email,
          pan: this.user.pan
        });
        // }
      }
      this.processing = false;
    });
  }

  resetCurrentDeclaration(de) {
    de.rent = 0;
    de.homeLoanInterest = 0;
    de.homeLoanPrincipal = 0;
    de.sodexo = 0;
    de.savings = 0;
    de.npspension = 0;
    de.insurance = 0;
    de.phoneBill = 0;
    de.educationLoan = 0;
  }

  setUserAndDeclarationFormData() {
    let de: Declaration = new Declaration;
    if (this.user.declaration != null) {
      let missing = this.user.declaration.filter(item => item.year === this.currentDeclaration.year);
      if (missing.length > 0) {
        de = missing[0];
      } else {
        this.resetCurrentDeclaration(de);
      }
      this.isRegister = missing.length === 0;
    } else {
      this.user.declaration = [];
      this.isRegister = true;
      this.resetCurrentDeclaration(de);
    }
    this.currentDeclaration = de;
    this.residenceInformationForm.setValue({
      location: (this.user.location !== null ? this.user.location : this.locations[0]),
      isOwnHouse: !(this.currentDeclaration.rent > 0),
      rent: this.currentDeclaration.rent,
      ownerPan: (this.currentDeclaration.rent > 100000 ? this.currentDeclaration.ownerPan : ''),
      haveHomeLoan: this.currentDeclaration.homeLoanInterest > 0,
      homeLoanInterest: this.currentDeclaration.homeLoanInterest,
      homeLoanPrincipal: this.currentDeclaration.homeLoanPrincipal
    });
    this.sodexoCardForm.setValue({
      haveSodexoCard: this.currentDeclaration.sodexo > 0,
      sodexo: this.currentDeclaration.sodexo
    });
    this.telephoneAndInternetBillsForm.setValue({
      haveTelephoneAndInternetBills: this.currentDeclaration.phoneBill > 0,
      phoneBill: this.currentDeclaration.phoneBill
    });
    this.savingsForm.setValue({
      savings: this.currentDeclaration.savings
    });
    this.insuranceForm.setValue({
      haveInsurance: this.currentDeclaration.insurance > 0,
      insurance: this.currentDeclaration.insurance
    });
    this.NPSAtalPensionYojanaForm.setValue({
      haveNPSAtalPensionYojana: this.currentDeclaration.npspension > 0,
      NPSAtalPensionYojana: this.currentDeclaration.npspension
    });
    this.educationLoanForm.setValue({
      haveEducationLoan: this.currentDeclaration.educationLoan > 0,
      educationLoan: this.currentDeclaration.educationLoan
    });
  }

  changeUserDeclarationInformation() {
    this.user.email = this.personalInformationForm.value.email;
    this.user.name = this.personalInformationForm.value.name;
    this.user.pan = this.personalInformationForm.value.pan;
  }

  savePersonalInformation() {
    this.processing = true;
    this.user.name = this.personalInformationForm.value.name;
    this.user.email = this.personalInformationForm.value.email;
    this.user.pan = this.personalInformationForm.value.pan.toUpperCase();
    this.changeActiveSection('financialYear');
    this.processing = false;
  }

  isPreviewDisplay(): boolean {
    return this.isValid(this.currentDeclaration.rent)
      || this.isValid(this.currentDeclaration.sodexo)
      || this.isValid(this.currentDeclaration.homeLoanInterest)
      || this.isValid(this.currentDeclaration.homeLoanPrincipal)
      || this.isValid(this.currentDeclaration.savings)
      || this.isValid(this.currentDeclaration.phoneBill)
      || this.isValid(this.currentDeclaration.insurance)
      || this.isValid(this.currentDeclaration.npspension)
      || this.isValid(this.currentDeclaration.educationLoan);
  }

  selectFinancialYear() {
    this.processing = true;
    this.currentDeclaration = new Declaration();
    this.currentDeclaration.year = this.financialYearForm.value.year;
    this.isFinancialYearActive = this.financialYears.filter(y => y.id === this.financialYearForm.value.year)[0].active;
    this.setUserAndDeclarationFormData();
    if (this.isFinancialYearActive) {
      this.errorMessage = '';
      this.changeActiveSection('residenceInformation');
    } else {
      this.errorMessage = 'Declaration submission for Financial '.concat(this.financialYearForm.value.year).concat(' is closed!!');
    }
    this.processing = false;
  }

  saveResidenceInformation() {
    this.processing = true;
    this.user.location = this.residenceInformationForm.value.location;
    this.currentDeclaration.rent = this.residenceInformationForm.value.isOwnHouse ? 0 : this.residenceInformationForm.value.rent;
    this.residenceInformationForm.value.rent =
      this.residenceInformationForm.value.isOwnHouse ? 0 : this.residenceInformationForm.value.rent;
    this.currentDeclaration.homeLoanInterest =
      this.residenceInformationForm.value.haveHomeLoan ? Math.min(this.residenceInformationForm.value.homeLoanInterest, 200000) : 0;
    this.residenceInformationForm.value.homeLoanInterest =
      this.residenceInformationForm.value.haveHomeLoan ? this.residenceInformationForm.value.homeLoanInterest : 0;
    this.currentDeclaration.homeLoanPrincipal =
      this.residenceInformationForm.value.haveHomeLoan ? Math.min(this.residenceInformationForm.value.homeLoanPrincipal, 150000) : 0;
    this.residenceInformationForm.value.homeLoanPrincipal =
      this.residenceInformationForm.value.haveHomeLoan ? this.residenceInformationForm.value.homeLoanPrincipal : 0;
    this.currentDeclaration.year = this.financialYearForm.value.year;
    this.currentDeclaration.ownerPan =
      this.residenceInformationForm.value.rent > 100000 ? this.residenceInformationForm.value.ownerPan.toUpperCase() : '';
    this.residenceInformationForm.value.ownerPan =
      this.residenceInformationForm.value.rent > 100000 ? this.residenceInformationForm.value.ownerPan.toUpperCase() : '';
    this.currentDeclaration.savings = this.isUndefined(this.currentDeclaration.savings) ? 0 : this.currentDeclaration.savings;
    this.changeActiveSection('sodexoCard');
    this.isNewDeclaration = true;
    this.processing = false;
  }

  getSavingsAmount(): number {
    return Math.min(this.currentDeclaration.savings + this.currentDeclaration.homeLoanPrincipal, 150000);
  }

  saveSodexoCardInformation() {
    this.processing = true;
    this.currentDeclaration.sodexo = this.sodexoCardForm.value.haveSodexoCard ? this.sodexoCardForm.value.sodexo : 0;
    this.sodexoCardForm.value.sodexo = this.sodexoCardForm.value.haveSodexoCard ? this.sodexoCardForm.value.sodexo : 0;
    this.changeActiveSection('telephoneAndInternetBills');
    this.processing = false;
  }

  saveTelephoneAndInternetBills() {
    this.processing = true;
    this.currentDeclaration.phoneBill =
      this.telephoneAndInternetBillsForm.value.haveTelephoneAndInternetBills ?
        Math.min(this.telephoneAndInternetBillsForm.value.phoneBill, 18000) : 0;
    this.telephoneAndInternetBillsForm.value.phoneBills =
      this.telephoneAndInternetBillsForm.value.haveTelephoneAndInternetBills ? this.telephoneAndInternetBillsForm.value.phoneBill : 0;
    this.changeActiveSection('savings');
    this.processing = false;
  }

  saveSavingsForm() {
    this.processing = true;
    this.currentDeclaration.savings = Math.min(this.savingsForm.value.savings, 150000);
    this.changeActiveSection('medicalInsurance');
    this.processing = false;
  }

  saveInsuranceForm() {
    this.processing = true;
    this.currentDeclaration.insurance = this.insuranceForm.value.haveInsurance ? Math.min(this.insuranceForm.value.insurance, 25000) : 0;
    this.changeActiveSection('NPSAtalPensionYojana');
    this.processing = false;
  }

  saveNPSAtalPensionYojanaForm() {
    this.processing = true;
    this.currentDeclaration.npspension =
      this.NPSAtalPensionYojanaForm.value.haveNPSAtalPensionYojana ?
        Math.min(this.NPSAtalPensionYojanaForm.value.NPSAtalPensionYojana, 50000) : 0;
    this.changeActiveSection('educationLoan');
    this.processing = false;
  }

  saveEducationLoanForm() {
    this.processing = true;
    this.currentDeclaration.educationLoan =
      this.educationLoanForm.value.haveEducationLoan ? this.educationLoanForm.value.educationLoan : 0;
    this.getDeclarationFormData();
    this.returnService.saveUser(this.user).subscribe(result => {
      if (!result) {
        this.errorMessage = 'An error occured while saving your information!!';
      } else {
        this.errorMessage = '';
        this.changeActiveSection('success');
      }
      this.processing = false;
      document.documentElement.scrollTop = 0;
    });
    this.editPersonalInfo = false;
    this.isFinancialYearActive = false;
  }

  getDeclarationFormData() {
    let de: Declaration = new Declaration;
    de.year = this.currentDeclaration.year;
    de.rent = this.currentDeclaration.rent;
    de.ownerPan = this.currentDeclaration.ownerPan;
    de.sodexo = +this.currentDeclaration.sodexo;
    de.homeLoanInterest = this.currentDeclaration.homeLoanInterest;
    de.homeLoanPrincipal = this.currentDeclaration.homeLoanPrincipal;
    de.phoneBill = this.currentDeclaration.phoneBill;
    de.savings = this.currentDeclaration.savings;
    de.insurance = this.currentDeclaration.insurance;
    de.npspension = this.currentDeclaration.npspension;
    de.educationLoan = this.currentDeclaration.educationLoan;
    de.year = this.financialYearForm.value.year;
    if (this.user.declaration.length > 0) {
      let missing = this.user.declaration.filter(item => item.year !== this.financialYearForm.value.year);
      missing.push(de);
      this.user.declaration = missing;
    } else {
      this.user.declaration = [de];
    }
  }

  getFinancialYears() {
    this.processing = true;
    this.returnService.getYears().subscribe(years => {
      this.financialYears = years;
      this.processing = false;
    });
  }

  showTaxableAmount() {
    this.updatePayStructure();
    this.initialTaxable = this.getInitialTaxableIncome();
    this.initialTax = this.getTaxAmount(this.initialTaxable);
    this.getSuggestions();
  }

  getInsuranceAmount() {
    if (this.ctcForm.value.consultingPayRole) {
      this.suggestions.insurance = 6684.0;
    } else {
      this.suggestions.insurance = 7644.0;
    }
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
    this.suggestions.sodexo = 0;
    this.suggestions.spl =
      this.ctcForm.value.ctc
        - (this.suggestions.insurance + this.suggestions.sodexo + this.suggestions.pf + this.suggestions.gratuity + sum);
    this.suggestions.gross = sum + this.suggestions.spl;
    this.suggestions.esi = Math.round((this.suggestions.gross / 12) >= 21000 ? 0 : (this.suggestions.gross / 12) * 0.0175);
    this.suggestions.pt = 2400;
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

  isValid(val) {
    return (isUndefined(val) ? false : (val > 0));
  }

  getInitialTaxableIncome(): number {
    let taxable: number = 0;
    if (this.ctcForm.value.ctc > 250000) {
      let gross: number = this.suggestions.basic
        + this.suggestions.stand + this.suggestions.phone + this.suggestions.spl + this.suggestions.hra;
      let remaining: number = gross - this.suggestions.stand;
      taxable = remaining - this.suggestions.pt;
      taxable = taxable - (this.isValid(this.suggestions.pf) ? this.suggestions.pf : 0);
    }
    return taxable;
  }

  get taxable(): number {
    let taxable: number = 0;
    if (this.ctcForm.value.ctc > 250000) {
      taxable = this.getInitialTaxableIncome() + (this.isValid(this.suggestions.pf) ? this.suggestions.pf : 0);
      taxable = taxable - (this.isValid(this.currentDeclaration.sodexo) ? this.currentDeclaration.sodexo * 12 : 0);
      let save: number = 0;
      if (this.isValid(this.currentDeclaration.rent)) {
        let basic: number = ((this.isValid(this.suggestions.basic) ? this.suggestions.basic : 0) * 0.1);
        let rent: number = this.isValid(this.currentDeclaration.rent) ? this.currentDeclaration.rent : 0;
        save = save
          + ((rent > 0 && rent > basic) ? Math.min(this.suggestions.hra, rent, (rent - basic)) : 0);
      }
      save = save +
        Math.min(200000, (this.isValid(this.currentDeclaration.homeLoanInterest) ? this.currentDeclaration.homeLoanInterest : 0));
      let savings: number = this.isValid(this.suggestions.pf) ? this.suggestions.pf : 0;
      savings = savings + (this.isValid(this.currentDeclaration.homeLoanPrincipal) ? this.currentDeclaration.homeLoanPrincipal : 0);
      savings = savings + (this.isValid(this.currentDeclaration.savings) ? this.currentDeclaration.savings : 0);
      save = save + Math.min(150000, savings);
      save = save + Math.min(18000, (this.isValid(this.currentDeclaration.phoneBill) ? this.currentDeclaration.phoneBill : 0));
      save = save + Math.min(25000, (this.isValid(this.currentDeclaration.insurance) ? this.currentDeclaration.insurance : 0));
      save = save + Math.min(50000, (this.isValid(this.currentDeclaration.npspension) ? this.currentDeclaration.npspension : 0));
      save = save + (this.isValid(this.currentDeclaration.educationLoan) ? this.currentDeclaration.educationLoan : 0);
      taxable = taxable - save;
    }
    return taxable;
  }

  getSuggestions() {
    if (this.ctcForm.value.ctc > 250000) {
      let remaining: number = 0;
      if (this.initialTaxable > 0) {
        this.suggestions.rent = Math.round(this.suggestions.basic * 0.5);
        remaining = this.initialTaxable - 250000 - this.suggestions.hra;
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
        let saved = this.suggestions.pf;
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

  getMonth(val) {
    return Math.round(val / 12);
  }

  ngOnChanges() {
    this.loginOrRegisterForm.reset({
      id: '',
      password: ''
    });
    this.personalInformationForm.reset({
      name: '',
      email: '',
      pan: ''
    });
    this.financialYearForm.reset({
      year: ''
    });
    this.residenceInformationForm.reset({
      location: this.locations[0],
      isOwnHouse: false,
      rent: 0,
      ownerPan: '',
      haveHomeLoan: false,
      homeLoanInterest: 0,
      homeLoanPrincipal: 0
    });
    this.sodexoCardForm.reset({
      haveSodexoCard: false,
      sodexo: 0
    });
    this.telephoneAndInternetBillsForm.reset({
      haveTelephoneAndInternetBills: false,
      phoneBill: 0
    });
    this.savingsForm.reset({
      savings: 0
    });
    this.insuranceForm.reset({
      haveInsurance: false,
      insurance: 0
    });
    this.NPSAtalPensionYojanaForm.reset({
      haveNPSAtalPensionYojana: false,
      NPSAtalPensionYojana: 0
    });
    this.educationLoanForm.reset({
      haveEducationLoan: false,
      educationLoan: 0
    });
    this.ctcForm.reset({
      ctc: 0,
      consultingPayRole: false
    });
  }

  isUndefined(val) {
    return isUndefined(val);
  }

  showhide(val) {
    this.hide = val;
    document.getElementById('ctc').setAttribute('type', !this.hide ? 'password' : 'number');
  }

  ngOnInit() {
    this.hide = false;
    this.getFinancialYears();
    // this.allSections = new Section[10];
    this.setAllSectionsData();
    this.isSignIn = false;
    this.taxExcempted = 0;
    this.isRegister = false;
    this.isNewDeclaration = false;
    this.editPersonalInfo = false;
    this.isFinancialYearActive = false;
    this.initialTax = 0;
    this.initialTaxable = 0;
    this.errorMessage = '';
    this.selectedSectionIndex = 0;
    this.footerMessage = 'Last Date for IT Declaration is extended to 30-Apr-2018!!';
    // this.currentSectionIndex = 0;
    // this.selectedSectionName = this.allSections[1];
  }

}
