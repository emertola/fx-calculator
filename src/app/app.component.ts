import { Component, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { FxRequestsService } from './services/fx-requests.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'fx-calculator';

  subscribe = new Subscription();
  symbolOptions: string[] = [];

  baseCurr: string = 'USD';
  otherCurr: string = 'EUR';
  baseInput: number;
  otherInput: number;
  baseInputTemp: number;
  otherInputTemp: number;
  baseInputSubject = new Subject();

  constructor(
    private fxs: FxRequestsService
  ) {}

  ngOnInit() {
    this.loadSymbols();
    this.baseInputChange();
  }

  loadSymbols() {
    this.subscribe = this.fxs.getSymbols()
      .subscribe((response) => {
        const toArray = Object.keys(response.symbols);
        this.symbolOptions = toArray;

        this.baseInput = 1;
        this.baseInputTemp = 1;

        this.calculateFx();
      });
  }

  calculateFx() {
    this.fxs.getExchange(this.baseCurr, this.otherCurr, this.baseInput)
      .subscribe((response) => {
        if (response && response.success) {
          this.baseInput = response.query.amount;
          this.baseInput = response.query.amount;
          this.otherInput = response.result;
          this.otherInputTemp = response.result;
        }
      })
  }

  baseInputChange() {
    this.baseInputSubject
      .pipe(
        debounceTime(500)
      )
      .subscribe(() => {
        this.calculateFx();
      });
  }

  otherInputChange(event) {
    this.baseInput = event / this.otherInputTemp;
  }
}
