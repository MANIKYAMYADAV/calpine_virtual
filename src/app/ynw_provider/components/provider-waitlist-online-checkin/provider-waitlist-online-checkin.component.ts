import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { HeaderComponent } from '../../../shared/modules/header/header.component';

import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { SharedServices } from '../../../shared/services/shared-services';
import { ProviderServices } from '../../services/provider-services.service';
import { ProviderDataStorageService } from '../../services/provider-datastorage.service';
import { FormMessageDisplayService } from '../../../shared/modules/form-message-display/form-message-display.service';

import { Messages } from '../../../shared/constants/project-messages';

@Component({
  selector: 'app-provider-waitlist-online-checkin',
  templateUrl: './provider-waitlist-online-checkin.component.html'
})

export class ProviderWaitlistOnlineCheckinComponent implements OnInit {

  fixed_cap = Messages.FIXED_CAP;
  cancel_btn = Messages.CANCEL_BTN;
  save_btn = Messages.SAVE_BTN;
  wait_time_calc_cap = Messages.CHECKIN_CALCULATE_CAP;
  ml_cap = Messages.CHECKIN_ML_CAP;
  mins_cap = Messages.CHECKIN_MINS_CAP;
  do_not_show_cap = Messages.CHECKIN_NO_WAIT_TIME_CAP;
  toke_enable_cap = Messages.CHECKIN_TOKEN_ENABLE_CAP;
  toke_disable_cap = Messages.CHECKIN_TOKEN_DISABLE_CAP;
  accept_future_cap = Messages.CHECKIN_FUTURE_CAP;
  form = {
    'calculationMode': '',
    'trnArndTime': '',
    'futureDateWaitlist': false/*,
    'showTokenId': false*/
  };
  waitlist_manager: any = null;
  reset_waitlist_manager: any = null;
  formChange = 0;
  api_success = null;
  customer_label = '';
  checkin_label = '';
  frm_wait_cal_cap = '';
  ischecked = false;

  constructor(private provider_services: ProviderServices,
    private provider_datastorage: ProviderDataStorageService,
    private shared_functions: SharedFunctions) {
    this.customer_label = this.shared_functions.getTerminologyTerm('customer');
    this.checkin_label = this.shared_functions.getTerminologyTerm('waitlist');
  }

  ngOnInit() {

    this.waitlist_manager = this.reset_waitlist_manager = this.provider_datastorage.get('waitlistManage') || [];
    this.setValue(this.waitlist_manager);
    this.frm_wait_cal_cap = Messages.FRM_LEVEL_WAIT_TIME_CALC_MSG.replace('[customer]', this.customer_label);
  }

  enableRequest() {
    this.ischecked = true;
  }

  /**
   * To prevent typing number greater than 4 digit
   * @param number typed number
   */
  isValid(number) {
    if (number <= 0) {
      this.form.trnArndTime = '';
    } else if (number > 999) {
      console.log(number.toString());
      let numString = number.toString();
      if (numString.length > 3) {
        numString = numString.substr(0, numString.length - 1);
        this.form.trnArndTime = numString;
      }
    }
  }
  setValue(value) {
    let calcMode = value['calculationMode'] || '';
    const showToken = value['showTokenId'] || false;
    if (calcMode === 'NoCalc' && showToken) {
      calcMode = 'NoCalc_WithToken';
    } else if (calcMode === 'NoCalc' && !showToken) {
      calcMode = 'NoCalc_WithoutToken';
    }
    // this.form.calculationMode = value['calculationMode'] || '';
    this.form.calculationMode = calcMode || '';
    this.form.trnArndTime = value['trnArndTime'] || null;
    this.form.futureDateWaitlist = value['futureDateWaitlist'] || false;
    // this.form.showTokenId = value['showTokenId'] || false;

  }

  OnSubmit() {

    if (this.form.calculationMode === 'Fixed' && this.form.trnArndTime == null) {
      return false;
    }
    let calcMode = this.form.calculationMode;
    let showToken = false;
    if (calcMode === 'NoCalc_WithToken') {
      calcMode = 'NoCalc';
      showToken = true;
    } else if (calcMode === 'NoCalc_WithoutToken') {
      calcMode = 'NoCalc';
      showToken = false;
    } else if (calcMode === 'Fixed') {
      const turntime = this.form.trnArndTime || 0;
      if (turntime <= 0) {
        this.shared_functions.openSnackBar(Messages.WAITLIST_TURNTIME_INVALID, { 'panelClass': 'snackbarerror' });
        return;
      }
    }
    const postData = {
      calculationMode: calcMode,
      trnArndTime: this.form.trnArndTime || null,
      futureDateWaitlist: this.form.futureDateWaitlist,
      showTokenId: showToken
    };
    // console.log('formdata', postData);
    // this.provider_services.setWaitlistMgr(this.form)
    this.provider_services.setWaitlistMgr(postData)
      .subscribe(
        data => {
          this.getWaitlistMgr();
          // this.shared_functions.apiSuccessAutoHide(this, Messages.ONLINE_CHECKIN_SAVED);
          this.shared_functions.openSnackBar(Messages.ONLINE_CHECKIN_SAVED);
        },
        error => {
          // console.log('error', error);
          this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          // this.shared_functions.apiErrorAutoHide(this, error);
        });
  }


  getWaitlistMgr() {

    this.provider_services.getWaitlistMgr()
      .subscribe(
        data => {
          this.waitlist_manager = data;
          this.reset_waitlist_manager = data;
          this.setValue(this.waitlist_manager);
          this.provider_datastorage.set('waitlistManage', data);
          this.formChange = 0;
        },
        error => {

        }
      );
  }

  onFormChange() {
    this.formChange = 1;
  }

  cancelChange() {
    this.formChange = 0;
    this.setValue(this.reset_waitlist_manager);
  }
}
