import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { v4 as uuid } from 'uuid';
import { StoreService } from '../services/store.service';
import { Subject, takeUntil } from 'rxjs';
import { TradeData } from '../models/trade-data.interface';
import { checkDates } from '../validators/date.validator';

@Component({
  selector: 'app-trade-form',
  templateUrl: './trade-form.component.html',
  styleUrls: ['./trade-form.component.scss']
})
export class TradeFormComponent implements OnInit, OnDestroy {
  tradeForm: FormGroup;
  submitted = false;
  tradeData: TradeData | undefined;
  ngUnsubscribe = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private storeService: StoreService,
    private dialogRef: MatDialogRef<TradeFormComponent>,
    @Inject(MAT_DIALOG_DATA) data?: TradeData) {

      this.tradeForm = this.formBuilder.group({
        entry_date: ['', Validators.required],
        exit_date: ['', [Validators.required]],
        entry_price: ['', [Validators.required, Validators.min(1)]],
        exit_price: ['', [Validators.required, Validators.min(1)]],
        profit: ['', Validators.required],
      }, {validator: checkDates('entry_date', 'exit_date')});

      this.tradeData = data;
  }

  ngOnInit(): void {
    if (this.tradeData) {
      this.tradeForm.patchValue(this.tradeData)
    }

    this.tradeForm.get('entry_price')?.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(value  => {
        const profit = this.tradeForm.value.exit_price - value;
        this.tradeForm.patchValue({profit})
      })

    this.tradeForm.get('exit_price')?.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(value  => {
        const profit = value - this.tradeForm.value.entry_price;
        this.tradeForm.patchValue({profit})
      })
  }

  onSubmit() {
    this.submitted = true;

    if (this.tradeForm.invalid) {
      return;
    }

    if (this.tradeForm.valid) {
      const order = this.tradeForm.value
      order.profit = order.exit_price - order.entry_price;
      if (this.tradeData?.id) {
        const updatedOrder = { ...this.tradeData, ...order}
        this.storeService.updateList(updatedOrder);
      } else {
        order.id = uuid();
        this.storeService.pushOrder(order);
      }

      this.dialogRef.close();
    }

  }

  get f() {
    return this.tradeForm.controls;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
