import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';


import { Messages } from '../../../../constants/project-messages';
import { projectConstants } from '../../../../constants/project-constants';
import { SharedFunctions } from '../../../../functions/shared-functions';
import { SharedServices } from '../../../../services/shared-services';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-consumer-waitlist-checkin-payment',
  templateUrl: './consumer-waitlist-checkin-payment.component.html'
})

export class ConsumerWaitlistCheckInPaymentComponent implements OnInit {

  checkin = null;
  bill_data = null;
  payment_options: any = [
  ];

  pay_data = {
    'uuid': null,
    'paymentMode': 'cash',
    'amount': 0
  };
  payment_popup = null;

  constructor(
    public dialogRef: MatDialogRef<ConsumerWaitlistCheckInPaymentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public shared_services: SharedServices,
    public sharedfunctionObj: SharedFunctions,
    public _sanitizer: DomSanitizer,
    @Inject(DOCUMENT) public document

  ) {

      this.checkin = this.data.checkin || null;
      this.bill_data = this.data.bill_data || null;
      console.log( this.checkin, this.bill_data);
      this.getPaymentModes();
      if ( !this.bill_data) {
        setTimeout(() => {
          this.dialogRef.close('error');
          }, projectConstants.TIMEOUT_DELAY);
      }

      this.pay_data.uuid = this.bill_data.uuid;
      this.pay_data.amount = this.bill_data.amount_to_pay;


    }

  ngOnInit() {
    this.dialogRef.backdropClick().subscribe(result => {
      this.dialogRef.close();
    });
  }

  getPaymentModes() {
    this.shared_services.getPaymentModesofProvider(this.checkin.provider.id)
    .subscribe(
      data => {
        this.payment_options = data;
        console.log(this.payment_options);
      },
      error => {
        this.sharedfunctionObj.openSnackBar(error.error, {'panelClass': 'snackbarerror'});
      }
    );
  }

  makePayment() {
    if ( this.pay_data.uuid != null &&
    this.pay_data.paymentMode != null &&
    this.pay_data.amount !== 0) {
      this.shared_services.consumerPayment(this.pay_data)
      .subscribe(
        data => {

          this.payment_popup = this._sanitizer.bypassSecurityTrustHtml(data['response']);
          setTimeout(() => {
            console.log(this.document.getElementById('payuform'));
            this.document.getElementById('payuform').submit();
          }, 2000);

        },
        error => {
          this.sharedfunctionObj.openSnackBar(error.error, {'panelClass': 'snackbarerror'});
        }
      );
    }

  }


}
