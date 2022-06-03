import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-trade-form',
  templateUrl: './trade-form.component.html',
  styleUrls: ['./trade-form.component.scss']
})
export class TradeFormComponent implements OnInit {
  tradeForm;
  submitted = false;
  tradeId;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<TradeFormComponent>,
    @Inject(MAT_DIALOG_DATA) data?: string) {

      this.tradeForm = this.formBuilder.group({
        entry_date: ['', Validators.required],
        exit_date: ['', [Validators.required]],
        entry_price: ['', Validators.required],
        exit_price: ['', Validators.required],
        profit: ['', Validators.required],
      });

      this.tradeId = data;
  }

  ngOnInit(): void {
    if (this.tradeId) {
      // const tradeData = this.shareService.getTradeData()

    }
  }

  onSubmit() {
    this.submitted = true;
    console.log(this.tradeForm);


    if (this.tradeForm.invalid) {
      return;
    }

    if (this.tradeForm.valid) {
      if (this.tradeId) {

      } else {
      }
    }

  }

  get f() {
    return this.tradeForm.controls;
  }

  public gen() {
    console.log(typeof uuid());

  }

}
