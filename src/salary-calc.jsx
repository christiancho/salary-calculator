import React from 'react';
import ReactDOM from 'react-dom';

class SalaryForm extends React.Component {

  constructor() {
    super();

    this.state = {
      deposit: 5000,
      repayPercent: 18,
      baseSalary: 0,
      signingBonus: 0,
    };

    this.updateContent = this.updateContent.bind(this);
  }

  updateContent(e, prop) {

    this.setState({
      [prop]: e.currentTarget.value ? e.currentTarget.value : 0
    });

  }

  totalComp() {
    return parseInt(this.state.baseSalary) + parseInt(this.state.signingBonus);
  }

  taxBracketCalculator(bracketInfo){
    const salary = this.totalComp();
    let taxes = 0;
    let salaryTaxed = 0;
    Object.keys(bracketInfo).forEach( bracket => {
      let remainder = 0;
      if ( parseInt(bracket) > parseInt(salary) ) {
        remainder = salary - salaryTaxed;
      } else {
        remainder = bracket - salaryTaxed;
      }
      taxes += bracketInfo[bracket] * remainder;
      salaryTaxed += remainder;
    });
    return parseInt(taxes.toFixed(2));
  }

  federalTax() {
    return this.taxBracketCalculator({
      9325: 0.10,
      37950: 0.15,
      91900: 0.25,
      191650: 0.28,
      416700: 0.33,
      418400: 0.35
    });
  }

  FICATax() {
    return this.taxBracketCalculator({
      118500: 0.0765,
      200000: 0.0855
    });
  }

  NYSTax() {
    return this.taxBracketCalculator({
      8450: 0.04,
      11650: 0.045,
      13850: 0.0525,
      21300: 0.059,
      80150: 0.0645,
      214000: 0.0665,
      1070350: 0.0685
    });
  }

  NYCTax() {
    return this.taxBracketCalculator({
      21600: 0.02907,
      45000: 0.03534,
      90000: 0.03591,
      500000: 0.03648
    });
  }

  generateResults() {

    const federalTax = this.federalTax();
    const FICATax = this.FICATax();
    const NYSTax = this.NYSTax();
    const NYCTax = this.NYCTax();

    const totalTax = federalTax + FICATax + NYSTax + NYCTax;

    const firstPayment = (this.totalComp() * this.state.repayPercent * 0.25 / 100);
    const monthlyPayment = (this.totalComp() * this.state.repayPercent * 0.125 / 100);

    const unpaid = (firstPayment > this.state.deposit) ? (firstPayment - this.state.deposit) : 0;

    const takeHome = (((this.totalComp() - totalTax) / 12).toFixed(2) - monthlyPayment);

    return (
      <table>
        <tbody>

          <tr className="headings">
            <th>Category</th>
            <th>Amount</th>
          </tr>

          <tr className="tax">
            <td>Federal Tax Liability</td>
            <td className="money">{ "$ " + federalTax.toFixed(2) }</td>
          </tr>
          <tr className="tax">
            <td>FICA</td>
            <td className="money">{ "$ " + FICATax.toFixed(2) }</td>
          </tr>
          <tr className="tax">
            <td>NY State Tax</td>
            <td className="money">{ "$ " + NYSTax.toFixed(2) }</td>
          </tr>
          <tr className="tax">
            <td>NYC Tax</td>
            <td className="money">{ "$ " + NYCTax.toFixed(2) }</td>
          </tr>

          <tr className="payment">
            <td>App Academy First Payment</td>
            <td className="money">{ "$ " + firstPayment.toFixed(2) }</td>
          </tr>

          <tr className="payment detail">
            <td>Amount of First Payment Unpaid by Deposit</td>
            <td className="money">{ "$ " + unpaid.toFixed(2) }</td>
          </tr>

          <tr className="payment">
            <td>Next 6 Payments</td>
            <td className="money">{ "$ " + monthlyPayment.toFixed(2) }</td>
          </tr>

          <tr className="take-home">
            <td>Monthly Net (With a/A Payments)</td>
            <td className="money">{ "$ " + takeHome.toFixed(2) }</td>
          </tr>

          <tr className="take-home detail">
            <td>Monthly Net (After a/A Payments)</td>
            <td className="money">{ "$ " + (takeHome + monthlyPayment).toFixed(2) }</td>
          </tr>

        </tbody>
      </table>
    );
  }

  render() {

    return (
      <form>

        <h2>App Academy Payment Terms</h2>

        <label>Deposit
          <input
            type="text"
            defaultValue={ this.state.deposit }
            onChange={ e => this.updateContent(e, "deposit") }/>
        </label>

        <label>Repayment %
          <input
            type="text"
            defaultValue={ this.state.repayPercent }
            onChange={ e => this.updateContent(e, "repayPercent") } />
        </label>

        <hr />

        <h2>Offer Terms</h2>

        <label>Base Salary
          <input
            type="text"
            defaultValue={ this.state.baseSalary }
            onChange={ e => this.updateContent(e, "baseSalary") }/>
        </label>

        <label>Signing Bonus
          <input
            type="text"
            defaultValue={ this.state.signingBonus }
            onChange={ e => this.updateContent(e, "signingBonus") }/>
        </label>

        <hr />

        <h2>Results</h2>

        { this.generateResults() }

      </form>
    );

  }

}

document.addEventListener("DOMContentLoaded", () => {

  const main = document.getElementById("root");
  ReactDOM.render(<SalaryForm/>, main);

});
