import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormMessageDisplayService } from '../../modules/form-message-display/form-message-display.service';
import { SharedServices } from '../../services/shared-services';
import { SharedFunctions } from '../../functions/shared-functions';
import { Messages } from '../../constants/project-messages';
import { projectConstants } from '../../../app.component';
import { projectConstantsLocal } from '../../constants/project-constants';
import { Location } from '@angular/common';
import { WordProcessor } from '../../services/word-processor.service';
import { SnackbarService } from '../../services/snackbar.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { S3UrlProcessor } from '../../services/s3-url-processor.service';
import { isValidNumber  } from 'libphonenumber-js';

@Component({
  selector: 'app-change-mobile',
  templateUrl: './change-mobile.component.html',
  styleUrls: ['./change-mobile.component.css','../../../../assets/css/style.bundle.css', '../../../../assets/plugins/custom/datatables/datatables.bundle.css', '../../../../assets/plugins/global/plugins.bundle.css', '../../../../assets/plugins/custom/prismjs/prismjs.bundle.css']

})
export class ChangeMobileComponent implements OnInit {

  mobile_cap = Messages.CHANGEMOBILE_CAP;
  your_curmob_msg = Messages.CURRENTMOBMSG;
  verified_cap = Messages.PHONE_VERIFIED;
  save_btn_cap = Messages.SAVE_BTN;
  related_links_cap = Messages.RELATED_LINKS;
  user_profile_cap = Messages.USER_PROF_CAP;
  change_pass_cap = Messages.CHANGE_PASSWORD_CAP;
  add_change_email_cap = Messages.ADD_CHANGE_EMAIL;
  family_members_cap = Messages.FAMILY_MEMBERS;
  mob_prefix_cap = Messages.MOB_NO_PREFIX_CAP;
  changemob_cap = Messages.CHANGE_MOB_CAP;
  dashboard_cap = Messages.DASHBOARD_TITLE;
  spForm: FormGroup;
  api_error = null;
  api_success = null;
  is_verified = false;
  user_details;
  prev_phonenumber;
  countryCode = 91;
  currentcountryCode;
  step = 1;
  curtype;
  usertype;
  submit_data :any={};
  // breadcrumbs_init = [
  //   {
  //     title: this.changemob_cap,
  //     url: '/' + this.shared_functions.isBusinessOwner('returntyp') + '/change-mobile'
  //   }
  // ];
  // breadcrumbs = this.breadcrumbs_init;

  constructor(private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public shared_services: SharedServices,
    public shared_functions: SharedFunctions,
    public router: Router,
    private location: Location,
    private wordProcessor: WordProcessor,
    private snackbarService: SnackbarService,
    private lStorageService: LocalStorageService,
    private s3Processor: S3UrlProcessor,
  ) { }
  goBack () {
    this.location.back();
  }
  ngOnInit() {
    this.curtype = this.shared_functions.isBusinessOwner('returntyp');
    this.spForm = this.fb.group({
      countryCode:['',Validators.compose([
        Validators.required,
        Validators.maxLength(4),
        Validators.minLength(2),
      ])],
      phonenumber: ['', Validators.compose(
        [Validators.required,
        Validators.maxLength(10),
        Validators.minLength(10),
        Validators.pattern(projectConstantsLocal.VALIDATOR_NUMBERONLY)])]
    });
    this.getProfile();
  }
  getProfile() {
    const ob = this;
    this.shared_functions.getProfile()
      .then(
        success => {
          this.user_details = success;
          this.step = 1;
          if (this.shared_functions.isBusinessOwner('returntyp') === 'provider') {
            this.prev_phonenumber = success['basicInfo']['mobile'];
            this.currentcountryCode = success['basicInfo']['countryCode'];

            this.spForm.patchValue({
              'countryCode':this.currentcountryCode || null
            });
            this.is_verified = success['basicInfo']['phoneVerified'];
          } else {
            this.prev_phonenumber = success['userProfile']['primaryMobileNo'];
            this.currentcountryCode = success['userProfile']['countryCode'];
            this.spForm.patchValue({
              'countryCode': this.currentcountryCode || null
            });
            this.is_verified = success['userProfile']['phoneVerified'];
          }
        },
        error => { ob.api_error = this.wordProcessor.getProjectErrorMesssages(error); }
      );
  }
  onSubmit(submit_data) {
    console.log(submit_data.countryCode +submit_data.phonenumber);
    if (!submit_data.phonenumber) { return false; }
    if (!submit_data.countryCode) { return false; }  
    this.resetApiErrors();
if(isValidNumber(submit_data.countryCode +submit_data.phonenumber)){
    this.shared_services.verifyNewPhone(submit_data.phonenumber, this.shared_functions.isBusinessOwner('returntyp'), submit_data.countryCode)
      .subscribe(
        () => {
          this.step = 2;
          this.submit_data = submit_data;
          // this.api_success = Messages.OTP_SENT_MOBILE.replace('[your_mobile]', submit_data.phonenumber);
          // this.snackbarService.openSnackBar(Messages.PASSWORD_MISMATCH, {'panelClass': 'snackbarerror'});
          setTimeout(() => {
            this.api_success = '';
            this.spForm.reset();
          }, projectConstants.TIMEOUT_DELAY_LARGE6);
        },
        error => {
          this.api_error = this.wordProcessor.getProjectErrorMesssages(error);
        }
      );
}else{
  this.snackbarService.openSnackBar('Please recheck the country code and number', { 'panelClass': 'snackbarerror' });
}
  }

  isVerified(data) {
    if (this.shared_functions.isBusinessOwner('returntyp') === 'provider') {
      if (this.user_details.basicInfo.mobile === data) {
        this.is_verified = true;
      } else {
        this.is_verified = false;
      }
    } else {
      if (this.user_details.userProfile.primaryMobileNo === data) {
        this.is_verified = true;
      } else {
        this.is_verified = false;
      }
    }
  }

  resetApiErrors() {
    this.api_error = null;
  }

  resendOtp(phonenumber) {
    this.onSubmit(phonenumber);
  }
  isNumericSign(evt) {
    return this.shared_functions.isNumericSign(evt);
  }
  onOtpSubmit(submit_data) {

    this.resetApiErrors();

    const post_data = { 
      'countryCode': this.submit_data.countryCode,
      'loginId': this.submit_data.phonenumber
     };
    this.shared_services.verifyNewPhoneOTP(submit_data.phone_otp, post_data, this.shared_functions.isBusinessOwner('returntyp'))
      .subscribe(
        () => {
          // this.api_success = Messages.PHONE_VERIFIED;
          console.log(this.submit_data.phonenumber);
          this.api_success = null;
          this.snackbarService.openSnackBar(Messages.PHONE_VERIFIED);
          const ynw = this.s3Processor.getJson(this.lStorageService.getitemfromLocalStorage('ynw-credentials')); 
          console.log(ynw)// get the credentials from local storage variable
          ynw['loginId'] = this.submit_data.phonenumber; // change the phone number to the new one in the local storage variable
          ynw['countryCode'] = this.submit_data.countryCode; 
          console.log(ynw);
          this.lStorageService.setitemonLocalStorage('ynw-credentials', ynw); // saving the updation to the local storage variable
          // console.log('going back');
          // this.location.back();
          setTimeout(() => {
            this.location.back();
            // this.getProfile();
          }, projectConstants.TIMEOUT_DELAY);
        },
        error => {
          // this.api_error = error.error;
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );

  }

  isNumeric(evt) {
    return this.shared_functions.isNumeric(evt);
  }
  redirecToSettings() {
    this.router.navigate(['provider', 'settings', 'bprofile']);
  }
}
