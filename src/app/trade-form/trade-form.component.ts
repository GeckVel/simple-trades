import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { v4 as uuid } from 'uuid';
import { TradeData } from '../dashboard/dashboard.component';
import { checkDates } from '../services/date.validator';
import { StoreService } from '../services/store.service';

@Component({
  selector: 'app-trade-form',
  templateUrl: './trade-form.component.html',
  styleUrls: ['./trade-form.component.scss']
})
export class TradeFormComponent implements OnInit {
  tradeForm: FormGroup;
  submitted = false;
  tradeData: TradeData | undefined;

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
      console.log(data)
  }

  ngOnInit(): void {
    if (this.tradeData) {
      this.tradeForm.patchValue(this.tradeData)
    }

    this.tradeForm.get('entry_price')?.valueChanges.subscribe(value  => {
      const profit = this.tradeForm.value.exit_price - value;
      this.tradeForm.patchValue({profit})
    })

    this.tradeForm.get('exit_price')?.valueChanges.subscribe(value  => {
      const profit = value - this.tradeForm.value.entry_price;
      this.tradeForm.patchValue({profit})
    })
  }

  onSubmit() {
    this.submitted = true;
    console.log(this.tradeForm);

    if (this.tradeForm.invalid) {
      return;
    }

    if (this.tradeForm.valid) {
      const order = this.tradeForm.value
      order.profit = order.exit_price - order.entry_price;
      if (this.tradeData) {
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

}
