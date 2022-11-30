import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  rates: { inr: number } = { inr: 0 };
  cosica: number = 20;
  firstValue: number = 70;

  updateRates() {
    //this.rates.inr = 75; // si  hacaemos esto el onchange no se entera, porque no estamos cambiando el objeto por referencia!!!
    this.firstValue++;
    this.rates = { ...this.rates, inr: this.firstValue };
    this.cosica++;
  }
}
