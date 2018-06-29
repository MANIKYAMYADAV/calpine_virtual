import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {FormMessageDisplayService} from '../../../shared//modules/form-message-display/form-message-display.service';

import {ConsumerServices} from '../../services/consumer-services.service';
import { Messages } from '../../../shared/constants/project-messages';
import { projectConstants } from '../../../shared/constants/project-constants';
import { SharedFunctions } from '../../../shared/functions/shared-functions';

@Component({
  selector: 'app-consumer-rate-service-popup',
  templateUrl: './consumer-rate-service-popup.html'
})
export class ConsumerRateServicePopupComponent implements OnInit {

  api_error = null;
  api_success = null;
  message = null;
  rate_value = 0;
  waitlist = null;
  newrating = true;

  constructor(
    public dialogRef: MatDialogRef<ConsumerRateServicePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public consumer_services: ConsumerServices,
    public sharedfunctionObj: SharedFunctions,

    ) {
      this.waitlist = data;
     }

  ngOnInit() {
    this.getRateByUser();
  }

  getRateByUser() {
    const params = {
      account : this.waitlist.provider.id
    };

    this.consumer_services.getConsumerRateService(params)
    .subscribe(
      data => {
        if (data[0]) {
          this.message = data[0]['feedback'][0]['comments'];
          this.rate_value = data[0]['stars'];
          this.newrating = false;
        }

      },
      error => {

      });
  }

  setRate() {

    this.resetApiErrors();

    const params = {
      account : this.waitlist.provider.id
    };

    const post_data = {
      'uuid': this.waitlist.ynwUuid,
      'stars': this.rate_value,
      'feedback': this.message
    };

    if (this.newrating) {
      this.addRateService(params, post_data);
    } else {
      this.updateRateService(params, post_data);
    }
  }

  addRateService(params, post_data ) {

    this.consumer_services.postConsumerRateService(params, post_data)
    .subscribe(
      data => {
        this.sharedfunctionObj.apiSuccessAutoHide(this, Messages.SERVICE_RATE_UPDATE);
      },
      error => {
        this.sharedfunctionObj.apiErrorAutoHide(this, error);
      });
  }

  updateRateService(params, post_data ) {

    this.consumer_services.updateConsumerRateService(params, post_data)
    .subscribe(
      data => {
        this.sharedfunctionObj.apiSuccessAutoHide(this, Messages.SERVICE_RATE_UPDATE);
      },
      error => {
        this.sharedfunctionObj.apiErrorAutoHide(this, error);
     });
   }

  handleratingClick(val) {
    this.rate_value = val.selectedrating;
  }

  resetApiErrors () {
    this.api_error = null;
    this.api_success = null;
  }



}
