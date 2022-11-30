import {
  Component,
  Input,
  KeyValueDiffer,
  KeyValueDiffers,
  OnInit,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-rates',
  templateUrl: './app-rates.component.html',
  styleUrls: ['./app-rates.component.css'],
})
export class AppRatesComponent implements OnInit {
  @Input() rates: { inr: number } = { inr: 0 };
  diff: number | undefined = undefined;
  oldRate = 0;

  @Input() cosica: number = 0;

  // As the rates object has the key of type string and value of type number, we are passing two types, string and number respectively with KeyValueDiffer
  differ!: KeyValueDiffer<string, number>;

  // inject KeyValueDiffers service
  constructor(private _differsService: KeyValueDiffers) {}

  ngOnInit(): void {
    // initialize the differ from service
    // This method internally first checks if the object passed as argument is either a Map or JSON and if the check is successful then it returns KeyValueDiffersFactory
    // After find(), we are calling the create() method of KeyValueDiffersFactory, which creates a KeyValueDiffer object.
    this.differ = this._differsService.find(this.rates).create();
  }

  // El ngOnChanges SOLO captará los cambios en el objeto rates, pero SÓLO si cambia el objeto por referencia
  ngOnChanges(changes: SimpleChanges) {
    console.log('Is first change?', changes['rates'].firstChange);
  }

  // el ngDoCheck tracks all the changes, whether they are by reference or not and even more
  // uso tradicional del ngDoCheck
  /*
  ngDoCheck() {
    console.log('ngDoCheck');
    if (this.rates.inr != this.oldRate) {
      this.diff = this.rates.inr - this.oldRate;
      this.oldRate = this.rates.inr;
    }
  }
  */

  // But Angular provides few utilities to efficiently track changes made to an object over time.
  // --> KeyValueDiffer
  /*
    1 - We will inject the service KeyValueDiffers and use its find() method to get a KeyValueDifferFactory
    2 - Next, we will use KeyValueDifferFactory’s create() method to create KeyValueDiffer
    3 - We will track the changes through the KeyValueDiffer’s diff() method. It returns KeyValueChanges
    4 - we will analyse the changes from KeyValueChanges using one of its methods, for example forEachChangedItem
        4.1 - All methods provide access to change-record KeyValueChangeRecord
        4.2 - The KeyValueChangeRecord interface is a record representing the item change information
  */
  ngDoCheck() {
    // we will use the differ and call it’s diff() method inside ngDoCheck
    if (this.differ) {
      const changes = this.differ.diff(this.rates);
      if (changes) {
        changes.forEachChangedItem((r) => {
          this.diff = r.currentValue!.valueOf() - r.previousValue!.valueOf();
          console.log(r);
        });
      }
    }
  }
}
