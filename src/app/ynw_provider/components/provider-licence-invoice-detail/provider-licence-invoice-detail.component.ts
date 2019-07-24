import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormMessageDisplayService } from '../../../shared//modules/form-message-display/form-message-display.service';
import { ProviderServices } from '../../services/provider-services.service';
import { Messages } from '../../../shared/constants/project-messages';
import { projectConstants } from '../../../shared/constants/project-constants';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { DomSanitizer } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-provider-licence-invoice-detail',
  templateUrl: './provider-licence-invoice-detail.component.html'
})
export class ProviderLicenceInvoiceDetailComponent implements OnInit {

  service_cap = Messages.SERVICES_CAP;
  amount_cap = Messages.AMOUNT_CAP;
  mode_cap = Messages.MODE_CAP;
  date_cap = Messages.DATE_COL_CAP;
  status_cap = Messages.COUPONS_STATUS_CAP;
  cancel_btn = Messages.CANCEL_BTN;
  make_payment = Messages.MAKE_PAYMENT_CAP;
  invoice_cap = Messages.INVOICE_CAP;
  invoice_summry_cap = Messages.INVOICE_SUMMRY_CAP;
  serv_period = Messages.SERV_PERIOD_CAP;
  gateway_cap = Messages.GATEWAY_CAP;
  payment_cap = Messages.PAYMENT_CAP;
  subsc_pack_cap = Messages.SUBSC_PACKAGE;
  id_cap = Messages.ID_CAP;
  ref_id_cap = Messages.REF_ID_CAP;
  @ViewChild('div') div: ElementRef;
  api_error = null;
  api_success = null;
  invoice: any = null;
  payMentShow = 0;
  payment_modes: any = [];
  payment_detail: any = [];
  payment_status = null;
  credt_debtJson: any = null;
  credt_debtDetls = '';
  licenseDiscounts: any = null;
  discounts;
  loading = true;
  dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT;
  pay_data = {
    amount: 0,
    paymentMode: 'DC', // 'null', changes as per request from Manikandan
    uuid: null
  };
  payment_popup = null;
  source = 'payment-history';
  payment_loading = false;
  disablebutton = false;
  details: any = null;
  paymentDetlId;

  constructor(
    public dialogRef: MatDialogRef<ProviderLicenceInvoiceDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public fed_service: FormMessageDisplayService,
    public provider_services: ProviderServices,
    public shared_functions: SharedFunctions,
    public _sanitizer: DomSanitizer,
    @Inject(DOCUMENT) public document
  ) {
    this.invoice = data.invoice || null;
    this.source = data.source || 'payment-history';
 this.payMentShow = data.payMent;
    this.pay_data.amount = this.invoice.amount;
    this.pay_data.uuid = this.invoice.ynwUuid;
  }

  ngOnInit() {
   // alert('data is'+JSON.stringify(this.datas));
   // alert(JSON.stringify(this.invoice));
   this.loading = true;
    this.payment_status = this.invoice.licensePaymentStatus || null;

    this.invoiceDetail();

    if (this.payment_status === 'NotPaid' && this.source !== 'payment-history') {
      this.payment_loading = true;
      this.getPaymentModes();
    } else if (this.payment_status === 'Paid') {
      this.getPaymentDetails();
    } else if (this.source === 'payment-history') {
      this.getPaymentDetails();
    } else {
      this.dialogRef.close();
    }
    this.loading = false;
  }

  invoiceDetail() {
    this.provider_services.getInvoice(this.invoice.ynwUuid)
      .subscribe(
        data => {
          this.invoice = data;
          if (this.invoice.creditDebitJson) {
            this.credt_debtJson = JSON.parse(this.invoice.creditDebitJson);
            this.credt_debtDetls = this.credt_debtJson.creditDebitDetails;
          }
          if (this.invoice.discount) {
            this.licenseDiscounts = JSON.parse(this.invoice.discount);
            this.discounts = this.licenseDiscounts.discount;
            }
        },
        error => {
          this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }

  getPaymentModes() {
    this.provider_services.getPaymentModes()
      .subscribe(
        data => {
          this.payment_modes = data;
          this.payment_loading = false;
        },
        error => {
          this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }

  getPaymentDetails() {
    this.provider_services.getPaymentDetail(this.invoice.ynwUuid)
      .subscribe(
        data => {
          this.payment_detail = data;
          this.paymentDetlId = this.getJsonPaymentId(this.payment_detail);
        },
        error => {
          this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }

  getJsonPaymentId(paymentdetail){
      for(const payment of paymentdetail){
        this.details = JSON.parse(payment.paymentId);
      }
      return this.details;
  }

  makePayment() {
    this.disablebutton = true;

    if (this.pay_data.uuid && this.pay_data.amount &&
      this.pay_data.amount !== 0 && this.pay_data.paymentMode) {

      this.payment_loading = true;

      this.provider_services.providerPayment(this.pay_data)
        .subscribe(
          data => {
            if (data['response']) {
              this.payment_popup = this._sanitizer.bypassSecurityTrustHtml(data['response']);
              this.api_success = this.shared_functions.getProjectMesssages('PAYMENT_REDIRECT');
              setTimeout(() => {
                this.document.getElementById('payuform').submit();
              }, 2000);
            } else {
              this.api_error = this.shared_functions.getProjectMesssages('CHECKIN_ERROR');
            }
          },
          error => {
            this.payment_loading = false;
            this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          }
        );
    }
  }
}
