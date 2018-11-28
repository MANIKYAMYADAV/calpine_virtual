import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { HeaderComponent } from '../../../shared/modules/header/header.component';
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
    templateUrl: './provider-payment-settings.component.html',
    styleUrls: ['./provider-payment-settings.component.css']
})

export class ProviderPaymentSettingsComponent implements OnInit {


    jaldee_account_cap = Messages.PAY_SET_JALDEE_ACCOUNT_CAP;
    my_own_account_cap = Messages.PAY_SET_MY_OWN_ACCOUNT_CAP;
    pay_if_mail_verified_cap = Messages.PAY_SET_ONLY_IF_MAIL_VERIFIED_CAP;
    go_to_mail_settings_cap = Messages.PAY_SET_GO_TO_EMAIL_SET_CAP;
    revisit_this_page_cap = Messages.PAY_SET_REVISIT_THIS_PAGE_CAP;
    pay_tm_cap = Messages.PAY_SET_PAYTM_CAP;
    verified_cap = Messages.PAY_SET_VERIFIED_CAP;
    not_verified_cap = Messages.PAY_SET_NOT_VERIFIED_CAP;
    enter_mob_no_cap = Messages.PAY_SET_ENTER_MOB_NO_CAP;
    cc_dc_netbanking_cap = Messages.PAY_SET_CC_DC_NETBANKING_CAP;
    pan_card_number_cap = Messages.PAY_SET_PAN_CARD_NO_CAP;
    name_on_pan_card_cap = Messages.PAY_SET_NAME_ON_PAN_CAP;
    account_holder_name_cap = Messages.PAY_SET_ACCNT_HOLDER_NAME_CAP;
    bank_account_number_cap = Messages.PAY_SET_BANK_ACCNT_NO_CAP;
    bank_name_cap = Messages.PAY_SET_BANK_NAME_CAP;
    ifsc_code_cap = Messages.PAY_SET_IFSC_CAODE_CAP;
    branch_name_cap = Messages.PAY_SET_BRANCH_NAME_CAP;
    business_filing_status_cap = Messages.PAY_SET_BUSINESS_FILING_STATUS_CAP;
    select_cap = Messages.PAY_SET_SELECT_CAP;
    proprietorship_cap = Messages.PAY_SET_PROPRIETORSHIP_CAP;
    individual_cap = Messages.PAY_SET_INDIVIDUAL_CAP;
    partnership_cap = Messages.PAY_SET_PARTNERSHIP_CAP;
    pvt_ltd_cap = Messages.PAY_SET_PRIVATE_LTD_CAP;
    public_ltd_cap = Messages.PAY_SET_PUBLIC_LTD_CAP;
    llp_cap = Messages.PAY_SET_LLP_CAP;
    trust_cap = Messages.PAY_SET_TRUST_CAP;
    societies_cap = Messages.PAY_SET_SOCIETIES_CAP;
    account_type_cap = Messages.PAY_SET_ACCOUNT_TYPE_CAP;
    current_cap = Messages.PAY_SET_CURRENT_CAP;
    savings_cap = Messages.PAY_SET_SAVINGS_CAP;
    cancel_edit_cap = Messages.PAY_SET_CANCEL_EDIT_CAP;
    save_settings_cap = Messages.PAY_SET_SAVE_SETTINGS_CAP;
    change_pay_settings_cap = Messages.PAY_SET_CHANGE_PAYMENT_SETTINGS_CAP;
    save_btn_cap = Messages.SAVE_BTN;
    gst_no_cap = Messages.PAY_SET_GST_NUMBER_CAP;
    tax_percentage_cap = Messages.PAY_SET_TAX_PER_CAP;
    update_tax_cap = Messages.PAY_SET_UPDATE_TAX_CAP;
    




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
    isJaldeeAccount: Boolean = true;
    optJaldeeAccount;
    maxcnt100 = projectConstants.VALIDATOR_MAX100;
    maxcnt10 = 10;
    maxcnt11 = 11;
    activeLicPkg;
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
        this.activeLicPkg = this.shared_Functionsobj.getitemfromLocalStorage('ynw-user').accountLicenseDetails.accountLicense.licPkgOrAddonId;
    }
    getPaymentSettings(showmsg) {
        this.provider_services.getPaymentSettings()
            .subscribe(data => {
                this.paySettings = data;
                console.log(JSON.stringify(this.paySettings));
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
                this.paytmverified = this.paySettings.payTmVerified || false;
                this.payuverified = this.paySettings.payUVerified || false;
                this.isJaldeeAccount = this.paySettings.isJaldeeAccount;
                this.optJaldeeAccount = (this.isJaldeeAccount) ? 'enable' : 'disable';
            });
        if (showmsg === 1) {
            this.tabid = 0;
            let showmsgs = '';
            let panelclass = '';
            let params;
            const duration = projectConstants.TIMEOUT_DELAY_LARGE10;
            if ((this.paytmenabled && !this.paytmverified) || (this.ccenabled && !this.payuverified)) {
                showmsgs = this.shared_Functionsobj.getProjectMesssages('PAYSETTING_SAV_SUCC') + '. ' + this.shared_Functionsobj.getProjectMesssages('PAYSETTING_CONTACTADMIN');
                panelclass = 'snackbarnormal'; // 'snackbarerror';
                params = { 'duration': duration, 'panelClass': panelclass };
            } else {
                showmsgs = this.shared_Functionsobj.getProjectMesssages('PAYSETTING_SAV_SUCC');
                panelclass = 'snackbarnormal';
                params = { 'duration': duration, 'panelClass': panelclass };
            }
            console.log('params', params);
            this.shared_Functionsobj.openSnackBar(showmsgs, params);
            this.tabid = 1;
                            if (document.getElementById('gstno')) {
                    document.getElementById('gstno').focus();
                }
        }
    }
    getTaxpercentage() {
        this.provider_services.getTaxpercentage()
            .subscribe(data => {
                this.taxDetails = data;
                this.taxpercentage = this.taxDetails.taxPercentage;
                this.gstnumber = this.taxDetails.gstNumber || '';
            },
                error => {

                });
    }
    showhidepaytype() {
        this.saveEnabled = true;
        // console.log('paystatus', this.paystatus);
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
                this.showError['paytmmobile'] = { status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_BLANKNUM') };
            } else if (!numberpattern.test(this.paytmmobile)) {
                this.showError['paytmmobile'] = { status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_ONLYNUM') };
            } else {
                if (!numbercntpattern.test(this.paytmmobile)) {
                    this.showError['paytmmobile'] = { status: true, msg: this.shared_Functionsobj.getProjectMesssages('BPROFILE_PRIVACY_PHONE_10DIGITS') };
                }
            }
        }
    }
    panCardBlur() {
        const blankpattern = projectConstants.VALIDATOR_BLANK;
        const alphanumericpattern = projectConstants.VALIDATOR_ALPHANUMERIC;
        if (blankpattern.test(this.pannumber)) {
            this.errorExist = true;
            this.showError['pannumber'] = { status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_PAN') };
        } else if (!alphanumericpattern.test(this.pannumber)) {
            this.errorExist = true;
            this.showError['pannumber'] = { status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_PANPHANUMERIC') };
        } else if (this.pannumber.length > this.maxcnt10) {
            this.errorExist = true;
            this.showError['pannumber'] = { status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_PANMAXLEN10') };
        }
    }
    ifscBlur() {
        const blankpattern = projectConstants.VALIDATOR_BLANK;
        const charonly = projectConstants.VALIDATOR_CHARONLY;
        const alphanumericpattern = projectConstants.VALIDATOR_ALPHANUMERIC;
        if (blankpattern.test(this.bankifsc)) {
            this.errorExist = true;
            this.showError['bankifsc'] = { status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_IFSC') };
        } else if (!alphanumericpattern.test(this.bankifsc)) {
            this.errorExist = true;
            this.showError['bankifsc'] = { status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_IFSCALPHANUMERIC') };
        } else if (this.bankifsc.length > this.maxcnt11) {
            this.errorExist = true;
            this.showError['bankifsc'] = { status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_IFSCMAXLEN11') };
        }
    }
    panNameBlur() {
        const blankpattern = projectConstants.VALIDATOR_BLANK;
        const charonly = projectConstants.VALIDATOR_CHARONLY;
        if (this.panname.length > this.maxcnt100) {
            this.errorExist = true;
            this.showError['panname'] = { status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_MAXLEN').replace('[maxlen]', this.maxcnt100) };
        } else if (blankpattern.test(this.panname)) {
            this.errorExist = true;
            this.showError['panname'] = { status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_PANNAME') };
        } else if (!charonly.test(this.panname)) {
            this.errorExist = true;
            this.showError['panname'] = { status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_CHARONLY') };
        }
    }
    acholderNameBlur() {
        const blankpattern = projectConstants.VALIDATOR_BLANK;
        const charonly = projectConstants.VALIDATOR_CHARONLY;
        if (this.bankacname.length > this.maxcnt100) {
            this.errorExist = true;
            this.showError['bankacname'] = { status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_MAXLEN').replace('[maxlen]', this.maxcnt100) };
        } else if (blankpattern.test(this.bankacname)) {
            this.errorExist = true;
            this.showError['bankacname'] = { status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_ACMNAME') };
        } else if (!charonly.test(this.bankacname)) {
            this.errorExist = true;
            this.showError['bankacname'] = { status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_CHARONLY') };
        }
    }
    bankAcnumberBlur() {
        const blankpattern = projectConstants.VALIDATOR_BLANK;
        const charonly = projectConstants.VALIDATOR_CHARONLY;
        const numberpattern = projectConstants.VALIDATOR_NUMBERONLY;
        if (blankpattern.test(this.bankacnumber)) {
            this.errorExist = true;
            this.showError['bankacnumber'] = { status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_ACCNO') };
        } else {
            if (!numberpattern.test(this.bankacnumber)) {
                this.errorExist = true;
                this.showError['bankacnumber'] = { status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_ACCNO_NUMONLY') };
            }
        }
    }
    bankNameBlur() {
        const blankpattern = projectConstants.VALIDATOR_BLANK;
        const charonly = projectConstants.VALIDATOR_CHARONLY;
        if (this.bankname.length > this.maxcnt100) {
            this.errorExist = true;
            this.showError['bankname'] = { status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_MAXLEN').replace('[maxlen]', this.maxcnt100) };
        } else if (blankpattern.test(this.bankname)) {
            this.errorExist = true;
            this.showError['bankname'] = { status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_BANKNAME') };
        } else if (!charonly.test(this.bankname)) {
            this.errorExist = true;
            this.showError['bankname'] = { status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_CHARONLY') };
        }
    }
    bankBranchBlur() {
        const blankpattern = projectConstants.VALIDATOR_BLANK;
        const charonly = projectConstants.VALIDATOR_CHARONLY;
        if (this.bankbranch.length > this.maxcnt100) {
            this.errorExist = true;
            this.showError['bankbranch'] = { status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_MAXLEN').replace('[maxlen]', this.maxcnt100) };
        } else if (blankpattern.test(this.bankbranch)) {
            this.errorExist = true;
            this.showError['bankbranch'] = { status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_BRANCH') };
        } else if (!charonly.test(this.bankbranch)) {
            this.errorExist = true;
            this.showError['bankbranch'] = { status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_CHARONLY') };
        }
    }
    saveAccountPaymentSettings(status) {
        this.provider_services.setPaymentAccountSettings(status)
            .subscribe(data => {
                // console.log('save ret', data);
                this.getPaymentSettings(1);
                this.saveEnabled = true;
                this.handleEditPaySettings(false);
            },
                error => {
                    this.shared_Functionsobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    this.getPaymentSettings(2);
                    this.saveEnabled = true;
                });
    }
    savePaySettings(includepaystatus) {
        this.resetApi();
        const postData = { 'dcOrCcOrNb': false, 'payTm': false };
        // if (includepaystatus) {
        postData['onlinePayment'] = this.paystatus;
        // }
        const numberpattern = projectConstants.VALIDATOR_NUMBERONLY;
        const numbercntpattern = projectConstants.VALIDATOR_PHONENUMBERCOUNT10;
        const blankpattern = projectConstants.VALIDATOR_BLANK;
        const charonly = projectConstants.VALIDATOR_CHARONLY;
        if (this.paytmenabled === true) {
            postData['payTm'] = true;
            if (!numberpattern.test(this.paytmmobile)) {
                this.showError['paytmmobile'] = { status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_ONLYNUM') };
                this.errorExist = true;
            } else {
                if (!numbercntpattern.test(this.paytmmobile)) {
                    this.showError['paytmmobile'] = { status: true, msg: this.shared_Functionsobj.getProjectMesssages('BPROFILE_PRIVACY_PHONE_10DIGITS') };
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
                this.showError['bankfiling'] = { status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_FILING') };
            }

            if (blankpattern.test(this.bankactype)) {
                this.errorExist = true;
                this.showError['bankactype'] = { status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_ACTYPE') };
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
                .subscribe(data => {
                    // console.log('save ret', data);
                    this.getPaymentSettings(1);
                    this.saveEnabled = true;
                    this.handleEditPaySettings(false);
                },
                    error => {
                        this.shared_Functionsobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
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
                this.showError['taxpercentage'] = { status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_TAXPER') };
            }
        } else if (this.taxpercentage < 0 || this.taxpercentage > 100) {
            this.errorExist = true;
            if (setmsgs) {
                this.showError['taxpercentage'] = { status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_TAXPER') };
            }
        }
        if (blankpattern.test(this.gstnumber)) {
            this.errorExist = true;
            if (setmsgs) {
                this.showError['gstnumber'] = { status: true, msg: this.shared_Functionsobj.getProjectMesssages('PAYSETTING_GSTNUM') };
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
                .subscribe(data => {
                    this.shared_Functionsobj.openSnackBar(this.shared_Functionsobj.getProjectMesssages('PAYSETTING_SAV_TAXPER'));
                    this.savetaxEnabled = true;
                },
                    error => {
                        this.shared_Functionsobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                        this.savetaxEnabled = true;
                    });
        }
    }
    getProviderProfile() {
        const ob = this;
        this.shared_Functionsobj.getProfile()
            .then(
                success => {
                    // console.log('succ', success);
                    this.profileQueryExecuted = true;
                    this.emailidVerified = success['basicInfo']['emailVerified'];
                },
                error => {
                    this.shared_Functionsobj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
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
            this.showError[code] = { status: false, msg: '' };
        } else {
            this.showError = {
                'paytmmobile': { status: false, msg: '' },
                'pannumber': { status: false, msg: '' },
                'panname': { status: false, msg: '' },
                'bankacname': { status: false, msg: '' },
                'bankacnumber': { status: false, msg: '' },
                'bankname': { status: false, msg: '' },
                'bankifsc': { status: false, msg: '' },
                'bankbranch': { status: false, msg: '' },
                'bankfiling': { status: false, msg: '' },
                'bankactype': { status: false, msg: '' },
                'taxpercentage': { status: false, msg: '' },
                'gstnumber': { status: false, msg: '' }
            };
        }
    }
    handleEditPaySettings(mod) {
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
