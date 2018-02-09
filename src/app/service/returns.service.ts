import { Injectable } from '@angular/core';

@Injectable()
export class ReturnsService {

  constructor() { }

  public static typesOfSavings: String[] = ['LIC', 'Public Provident Fund', 'Deposit in NSC', 'Home Loan Principal Amount', 'Unit Linked Insurance Plan(ULIP)', 'Eligible Mutual Funds', 'Children Educational Expenses', 'Fixed Deposit', 'Other'];
  public static sodexoAmounts: number[] = [1100, 2200];

}
