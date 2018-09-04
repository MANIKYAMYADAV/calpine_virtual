import {Component, OnInit, ViewChild, ElementRef, Inject} from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import {HeaderComponent} from '../../../shared/modules/header/header.component';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { SharedServices } from '../../../shared/services/shared-services';
import { ProviderServices } from '../../services/provider-services.service';
import { FormMessageDisplayService } from '../../../shared/modules/form-message-display/form-message-display.service';
import { Router, ActivatedRoute } from '@angular/router';
import { projectConstants } from '../../../shared/constants/project-constants';
import { post } from 'selenium-webdriver/http';

import { Messages } from '../../../shared/constants/project-messages';


@Component({
    selector: 'app-provider-paymentsettings',
    templateUrl: './provider-payment-settings.component.html'
})

export class ProviderPaymentSettingsComponent implements OnInit {

    @ViewChild('paymobref') private paymobrefRef: ElementRef;
    @ViewChild('acholdernameref') private acholdernameRef: ElementRef;
    paytmenabled;
    paytmmobile;
    ccenabled;
    pannumber;
    panname;
    bankacname;
    bankacnumber;
    bankname;
    bankifsc;
    bankbranch;
    bankfiling;
    bankactype;
    paystatus = false;
    saveEnabled = true;
    savetaxEnabled = true;
    paySettings: any = [];
    taxDetails: any = [];
    showError: any = [];
    errorExist = false;
    taxpercentage;
    gstnumber;
    paytmverified = false;
    payuverified = false;
    tabid = 0;
    emailidVerified = false;
    profileQueryExecuted = false;
    ineditMode = false;
    maxcnt100 = projectConstants.VALIDATOR_MAX100;
    maxcnt10 = 10;
    maxcnt11 = 11;
    breadcrumbs = [
        {
          title: 'Settings',
          url: '/provider/settings'
        },
        {
        title: 'Payment Settings'
        }
      ];
      constructor(
        private provider_services: ProviderServices,
        private shared_Functionsobj: SharedFunctions,
        private router: Router,
        private activated_route: ActivatedRoute
      ) {
            this.activated_route.params.subscribe(params => {
                this.tabid = (params.id) ? params.id : 0;
            });

      }
    ngOnInit() {
        this.resetApi();
        this.getPaymentSettings(2);
        this.getTaxpercentage();
        this.getProviderProfile();
    }
    getPaymentSettings(showmsg) {
        this.provider_services.getPaymentSettings()
            .subscribe(data => {
                this.paySettings = data;
                this.paystatus = this.paySettings.onlinePayment || false;
                this.paytmenabled = this.paySettings.payTm || false;
                this.ccenabled = this.paySettings.dcOrCcOrNb || false;
                this.paytmmobile = this.paySettings.payTmLinkedPhoneNumber || '';
                this.pannumber = this.paySettings.panCardNumber || '';
                this.panname = this.paySettings.nameOnPanCard || '';
                this.bankacname = this.paySettings.accountHolderName || '';
                this.bankacnumber = this.paySettings.bankAccountNumber || '';
                this.bankname = this.paySettings.bankName || '';
                this.bankifsc = this.paySettings.ifscCode || '';
                this.bankbranch = this.paySettings.branchCity || '';
                this.bankfiling = this.paySettings.businessFilingStatus || '';
                this.bankactype = this.paySettings.accountType || '';
                this.paytmverified = this.paySettings.payTmVerified	 || false;
                this.payuverified = this.paySettings.payUVerified	 || false;
            });
            if (showmsg === 1) {
                this.tabid = 0;
                let showmsgs = '';
                if ((this.paytmenabled && !this.paytmverified) || (this.ccenabled && !this.payuverified)) {
                    showmsgs = this.shared_Functionsobj.getProjectMesssages('PAYSETTING_SAV_SUCC') + '. ' + this.shared_Functionsobj.getProjectMesssages('PAYSETTING_CONTACTADMIN');
                } else {
                    showmsgs = this.shared_Functionsobj.getProjectMesssages('PAYSETTING_SAV_SUCC');
                }
                this.shared_Functionsobj.openSnackBar (showmsgs);
                this.tabid = 1;
            }
    }
    getTaxpercentage() {
        this.provider_services.getTaxpercentage()
            .subscribe (data => {
                this.taxDetails = data;
                this.taxpercentage = this.taxDetails.taxPercentage;
                this.gstnumber = this.taxDetails.gstNumber || '';
            },
        error => {

        });
    }
    showhidepaytype() {
        this.saveEnabled = true;
        console.log('paystatus', this.paystatus);
        if (this.paystatus) {
            this.paystatus = false;
        } else {
            this.paystatus = true;
        }
        this.savePaySettings(true);
        /*const postData = {
            onlinePayment: this.paystatus
        };
        this.provider_services.setPaymentSettings(postData)
            .subscribe(data => {
               console.log('submit ret', data);
               this.provider_shared_functions.openSnackBar(Messages.PAYSETTING_SAV_SUCC);
            },
        error => {
                this.provider_shared_functions.openSnackBar (error.error, {'panelClass': 'snackbarerror'});
                this.paystatus = this.paySettings.onlinePayment || false; // setting the old status
        });*/
    }
    handleChange(obj) {
        this.resetApi();
        this.saveEnabled = true;
        if (obj === 'pay') {
            if (this.paytmenabled) {
                this.paytmenabled = false;
            } else {
                this.paytmenabled = true;
            }
        } else if (obj === 'cc') {
            if (this.ccenabled) {
                this.ccenabled = false;
            } else {
                this.ccenabled = true;
            }
        }
    }
    paytmBlur() {
        const numberpattern = projectConstants.VALIDATOR_NUMBERONLY;
        const numbercntpattern = projectConstants.VALIDATOR_PHONENUMBERCOUNT10;
        const blankpattern = projectConstants.VALIDATOR_BLANK;
        if (this.paytmenabled === true) {
            if (blankpattern.test(this.paytmmobile)) {
                this.showError['paytmmobile'] = {status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_BLANKNUM')};
            } else if (!numberpattern.test(this.paytmmobile)) {
                this.showError['paytmmobile'] = {status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_ONLYNUM')};
            } else {
                if (!numbercntpattern.test(this.paytmmobile)) {
                    this.showError['paytmmobile'] = {status: true, msg: this.shared_Functionsobj.getProjectMesssages('BPROFILE_PRIVACY_PHONE_10DIGITS')};
                }
            }
        }
    }
    panCardBlur() {
        const blankpattern = projectConstants.VALIDATOR_BLANK;
        const alphanumericpattern = projectConstants.VALIDATOR_ALPHANUMERIC;
        if (blankpattern.test(this.pannumber)) {
            this.errorExist = true;
            this.showError['pannumber'] = {status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_PAN')};
        } else if (!alphanumericpattern.test(this.pannumber)) {
            this.errorExist = true;
            this.showError['pannumber'] = {status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_PANPHANUMERIC')};
        } else if (this.pannumber.length > this.maxcnt10) {
            this.errorExist = true;
            this.showError['pannumber'] = {status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_PANMAXLEN10')};
        }
    }
    ifscBlur() {
        const blankpattern = projectConstants.VALIDATOR_BLANK;
        const charonly = projectConstants.VALIDATOR_CHARONLY;
        const alphanumericpattern = projectConstants.VALIDATOR_ALPHANUMERIC;
        if (blankpattern.test(this.bankifsc)) {
            this.errorExist = true;
            this.showError['bankifsc'] = {status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_IFSC')};
        } else if (!alphanumericpattern.test(this.bankifsc)) {
            this.errorExist = true;
            this.showError['bankifsc'] = {status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_IFSCALPHANUMERIC')};
        } else if (this.bankifsc.length > this.maxcnt11) {
            this.errorExist = true;
            this.showError['bankifsc'] = {status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_IFSCMAXLEN11')};
        }
    }
    panNameBlur() {
        const blankpattern = projectConstants.VALIDATOR_BLANK;
        const charonly = projectConstants.VALIDATOR_CHARONLY;
        if (this.panname.length > this.maxcnt100) {
            this.errorExist = true;
            this.showError['panname'] = {status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_MAXLEN').replace('[maxlen]', this.maxcnt100)};
        } else if (blankpattern.test(this.panname)) {
            this.errorExist = true;
            this.showError['panname'] = {status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_PANNAME')};
        } else  if (!charonly.test(this.panname)) {
            this.errorExist = true;
            this.showError['panname'] = {status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_CHARONLY')};
        }
    }
    acholderNameBlur() {
        const blankpattern = projectConstants.VALIDATOR_BLANK;
        const charonly = projectConstants.VALIDATOR_CHARONLY;
        if (this.bankacname.length > this.maxcnt100) {
            this.errorExist = true;
            this.showError['bankacname'] = {status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_MAXLEN').replace('[maxlen]', this.maxcnt100)};
        } else if (blankpattern.test(this.bankacname)) {
            this.errorExist = true;
            this.showError['bankacname'] = {status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_ACMNAME')};
        } else  if (!charonly.test(this.bankacname)) {
            this.errorExist = true;
            this.showError['bankacname'] = {status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_CHARONLY')};
        }
    }
    bankAcnumberBlur() {
        const blankpattern = projectConstants.VALIDATOR_BLANK;
        const charonly = projectConstants.VALIDATOR_CHARONLY;
        const numberpattern = projectConstants.VALIDATOR_NUMBERONLY;
        if (blankpattern.test(this.bankacnumber)) {
            this.errorExist = true;
            this.showError['bankacnumber'] = {status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_ACCNO')};
        } else {
            if (!numberpattern.test(this.bankacnumber)) {
                this.errorExist = true;
                this.showError['bankacnumber'] = {status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_ACCNO_NUMONLY')};
            }
        }
    }
    bankNameBlur() {
        const blankpattern = projectConstants.VALIDATOR_BLANK;
        const charonly = projectConstants.VALIDATOR_CHARONLY;
        if (this.bankname.length > this.maxcnt100) {
            this.errorExist = true;
            this.showError['bankname'] = {status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_MAXLEN').replace('[maxlen]', this.maxcnt100)};
        } else if (blankpattern.test(this.bankname)) {
            this.errorExist = true;
            this.showError['bankname'] = {status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_BANKNAME')};
        } else  if (!charonly.test(this.bankname)) {
            this.errorExist = true;
            this.showError['bankname'] = {status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_CHARONLY')};
        }
    }
    bankBranchBlur() {
        const blankpattern = projectConstants.VALIDATOR_BLANK;
        const charonly = projectConstants.VALIDATOR_CHARONLY;
        if (this.bankbranch.length > this.maxcnt100) {
            this.errorExist = true;
            this.showError['bankbranch'] = {status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_MAXLEN').replace('[maxlen]', this.maxcnt100)};
        } else if (blankpattern.test(this.bankbranch)) {
            this.errorExist = true;
            this.showError['bankbranch'] = {status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_BRANCH')};
        } else  if (!charonly.test(this.bankbranch)) {
            this.errorExist = true;
            this.showError['bankbranch'] = {status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_CHARONLY')};
        }
    }
    savePaySettings(includepaystatus) {
        this.resetApi();
        const postData = {'dcOrCcOrNb': false, 'payTm': false};
        // if (includepaystatus) {
           postData['onlinePayment'] =  this.paystatus;
        // }
        const numberpattern = projectConstants.VALIDATOR_NUMBERONLY;
        const numbercntpattern = projectConstants.VALIDATOR_PHONENUMBERCOUNT10;
        const blankpattern = projectConstants.VALIDATOR_BLANK;
        const charonly = projectConstants.VALIDATOR_CHARONLY;
        if (this.paytmenabled === true) {
            postData['payTm'] = true;
            if (!numberpattern.test(this.paytmmobile)) {
                this.showError['paytmmobile'] = {status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_ONLYNUM')};
                this.errorExist = true;
            } else {
                if (!numbercntpattern.test(this.paytmmobile)) {
                    this.showError['paytmmobile'] = {status: true, msg: this.shared_Functionsobj.getProjectMesssages('BPROFILE_PRIVACY_PHONE_10DIGITS')};
                    this.errorExist = true;
                } else {
                    postData['payTmLinkedPhoneNumber'] = this.paytmmobile;
                }
            }
        } else {
            postData.payTm = false;
        }

        if (this.ccenabled === true) {
            postData.dcOrCcOrNb = true;

            this.panCardBlur();
            /*if (blankpattern.test(this.pannumber)) {
                this.errorExist = true;
                this.showError['pannumber'] = {status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_PAN')};
            }*/

            this.bankAcnumberBlur();
            /*if (blankpattern.test(this.bankacnumber)) {
                this.errorExist = true;
                this.showError['bankacnumber'] = {status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_ACCNO')};
            } else {
                if (!numberpattern.test(this.bankacnumber)) {
                    this.errorExist = true;
                    this.showError['bankacnumber'] = {status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_ACCNO_NUMONLY')};
                }
            }*/

            this.bankNameBlur();
            /*if (this.bankname.length > this.maxcnt100) {
                this.errorExist = true;
                this.showError['bankname'] = {status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_MAXLEN').replace('[maxlen]', this.maxcnt100)};
            } else if (blankpattern.test(this.bankname)) {
                this.errorExist = true;
                this.showError['bankname'] = {status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_BANKNAME')};
            } else if (!charonly.test(this.bankname)) {
                this.errorExist = true;
                this.showError['bankname'] = {status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_CHARONLY')};
            }*/

            this.ifscBlur();
            /*if (blankpattern.test(this.bankifsc)) {
                this.errorExist = true;
                this.showError['bankifsc'] = {status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_IFSC')};
            }*/

            this.panNameBlur();

            /*if (blankpattern.test(this.panname)) {
                this.errorExist = true;
                this.showError['panname'] = {status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_PANNAME')};
            } else if (this.panname.length > this.maxcnt100) {
                this.errorExist = true;
                this.showError['panname'] = {status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_MAXLEN').replace('[maxlen]', this.maxcnt100)};
            } else if (!charonly.test(this.panname)) {
                this.errorExist = true;
                this.showError['panname'] = {status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_CHARONLY')};
            }*/

            this.acholderNameBlur();
            /*if (this.bankacname.length > this.maxcnt100) {
                this.errorExist = true;
                this.showError['bankacname'] = {status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_MAXLEN').replace('[maxlen]', this.maxcnt100)};
            } else if (blankpattern.test(this.bankacname)) {
                this.errorExist = true;
                this.showError['bankacname'] = {status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_ACMNAME')};
            } else if (!charonly.test(this.bankacname)) {
                this.errorExist = true;
                this.showError['bankacname'] = {status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_CHARONLY')};
            }*/

            this.bankBranchBlur();
            /*if (blankpattern.test(this.bankbranch)) {
                this.errorExist = true;
                this.showError['bankbranch'] = {status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_BRANCH')};
            } else if (!charonly.test(this.bankbranch)) {
                this.errorExist = true;
                this.showError['bankbranch'] = {status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_CHARONLY')};
            }*/

            if (blankpattern.test(this.bankfiling)) {
                this.errorExist = true;
                this.showError['bankfiling'] = {status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_FILING')};
            }

            if (blankpattern.test(this.bankactype)) {
                this.errorExist = true;
                this.showError['bankactype'] = {status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_ACTYPE')};
            }
            postData['panCardNumber'] = this.pannumber;
            postData['bankAccountNumber'] = this.bankacnumber;
            postData['bankName'] = this.bankname;
            postData['ifscCode'] = this.bankifsc;
            postData['nameOnPanCard'] = this.panname;
            postData['accountHolderName'] = this.bankacname;
            postData['branchCity'] = this.bankbranch;
            postData['businessFilingStatus'] = this.bankfiling;
            postData['accountType'] = this.bankactype;
        } else {
            postData['dcOrCcOrNb'] = false;
        }
        if (!this.errorExist) {
           // console.log('postdata', JSON.stringify(postData));
            this.saveEnabled = false;
            this.provider_services.setPaymentSettings(postData)
                .subscribe (data => {
                    // console.log('save ret', data);
                    this.getPaymentSettings(1);
                    this.saveEnabled = true;
                    this.handleEditPaySettings(false);
                },
            error => {
                this.shared_Functionsobj.openSnackBar (error, {'panelClass': 'snackbarerror'});
                this.getPaymentSettings(2);
                this.saveEnabled = true;
            });
        }
    }
    taxfieldValidation(setmsgs?) {
        const floatpattern = projectConstants.VALIDATOR_FLOAT;
        const blankpattern = projectConstants.VALIDATOR_BLANK;
        this.errorExist = false;
        if (!floatpattern.test(this.taxpercentage)) {
            this.errorExist = true;
            if (setmsgs) {
                this.showError['taxpercentage'] = {status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_TAXPER')};
            }
        } else if (this.taxpercentage < 0 || this.taxpercentage > 100) {
            this.errorExist = true;
            if (setmsgs) {
                this.showError['taxpercentage'] = {status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_TAXPER')};
            }
        }
        if (blankpattern.test(this.gstnumber)) {
            this.errorExist = true;
            if (setmsgs) {
                this.showError['gstnumber'] = {status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_GSTNUM')};
            }
        }
        if (!setmsgs) {
            return this.errorExist;
        }
    }
    saveTaxSettings() {
        /*const floatpattern = projectConstants.VALIDATOR_FLOAT;
        const blankpattern = projectConstants.VALIDATOR_BLANK;
        this.errorExist = false;
        if (!floatpattern.test(this.taxpercentage)) {
            this.errorExist = true;
            this.showError['taxpercentage'] = {status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_TAXPER')};
        } else if (this.taxpercentage < 0 || this.taxpercentage > 100) {
            this.errorExist = true;
            this.showError['taxpercentage'] = {status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_TAXPER')};
        }
        if (blankpattern.test(this.gstnumber)) {
            this.errorExist = true;
            this.showError['gstnumber'] = {status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_GSTNUM')};
        }*/
        this.taxfieldValidation(true);
        if (!this.errorExist) {
            this.savetaxEnabled = false;
            const postData = {
                    'taxPercentage': this.taxpercentage,
                    'gstNumber': this.gstnumber || ''
            };
            // this.provider_services.setTaxpercentage(this.taxpercentage)
            this.provider_services.setTaxpercentage(postData)
                .subscribe (data => {
                    this.shared_Functionsobj.openSnackBar (this.shared_Functionsobj.getProjectMesssages('PAYSETTING_SAV_TAXPER'));
                    this.savetaxEnabled = true;
                },
            error => {
                this.shared_Functionsobj.openSnackBar (error, {'panelClass': 'snackbarerror'});
                this.savetaxEnabled = true;
            });
        }
    }
    getProviderProfile() {
        const ob = this;
        this.shared_Functionsobj.getProfile()
        .then(
          success =>  {
           // console.log('succ', success);
           this.profileQueryExecuted = true;
           this.emailidVerified =  success['basicInfo']['emailVerified'];
          },
          error => {
            this.shared_Functionsobj.openSnackBar(error, {'panelClass': 'snackbarerror'});
          }
        );
    }
    redirectToEmail() {
        this.shared_Functionsobj.setitemonLocalStorage('e_ret', 'pset');
        this.router.navigate(['provider', 'change-email']);
    }
    resetApi(code?) {
        this.errorExist = false;
        if (code !== undefined) {
            this.showError[code] = {status: false, msg: '' };
        } else {
            this.showError = {
                'paytmmobile' : {status: false, msg: ''},
                'pannumber' : {status: false, msg: ''},
                'panname' : {status: false, msg: ''},
                'bankacname' : {status: false, msg: ''},
                'bankacnumber' : {status: false, msg: ''},
                'bankname' : {status: false, msg: ''},
                'bankifsc' : {status: false, msg: ''},
                'bankbranch' : {status: false, msg: ''},
                'bankfiling' : {status: false, msg: ''},
                'bankactype' : {status: false, msg: ''},
                'taxpercentage' : {status: false, msg: ''},
                'gstnumber' : {status: false, msg: ''}
            };
        }
    }
    handleEditPaySettings (mod) {
        if (this.ineditMode && mod === false) {
            this.getPaymentSettings(2);
        }
        this.ineditMode = mod;
        if (mod === true) {
            setTimeout(() => {
                if (this.paymobrefRef) {
                    if (this.paymobrefRef.nativeElement) { // adding a small delay to field disabled get off before setting the focus
                        this.paymobrefRef.nativeElement.focus();
                    }
                } else if (this.acholdernameRef) {
                    if (this.acholdernameRef.nativeElement) {
                        this.acholdernameRef.nativeElement.focus();
                    }
                }
            }, 50);
        }
    }
    checkTaxbuttonDisabled() {
        return true;
    }
    selectedIndexChange(val: number) {
        this.tabid = val;
      }
}
