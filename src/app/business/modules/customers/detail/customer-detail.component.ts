import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { FormMessageDisplayService } from '../../../../shared/modules/form-message-display/form-message-display.service';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { Messages } from '../../../../shared/constants/project-messages';
import { projectConstants } from '../../../../shared/constants/project-constants';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Location } from '@angular/common';

@Component({
    selector: 'app-customer-detail',
    templateUrl: './customer-detail.component.html'
})
export class CustomerDetailComponent implements OnInit {

    create_cap = Messages.CREATE_CAP;
    mobile_cap = Messages.MOBILE_CAP;
    f_name_cap = Messages.F_NAME_CAP;
    l_name_cap = Messages.L_NAME_CAP;
    email_cap = Messages.EMAIL_ID_CAP;
    gender_cap = Messages.GENDER_CAP;
    male_cap = Messages.MALE_CAP;
    female_cap = Messages.FEMALE_CAP;
    dob_cap = Messages.DOB_CAP;
    adrress_cap = Messages.ADDRESS_CAP;
    cancel_btn = Messages.CANCEL_BTN;
    save_btn = Messages.SAVE_BTN;
    mob_prefix_cap = Messages.MOB_NO_PREFIX_CAP;
    amForm: FormGroup;
    api_error = null;
    api_success = null;
    step = 1;
    tday = new Date();
    minday = new Date(1900, 0, 1);
    search_data = null;
    disableButton = false;
    api_loading = true;
    customer_label = '';
    source;
    phoneNo: any;
    email: any;
    firstName: any;
    lastName: any;
    dob: any;
    action;
    breadcrumbs_init = [
        // {
        //     title: 'Check-ins',
        //     url: 'provider/check-ins'
        // },
        {
            title: 'Customers',
            url: 'provider/customers'
        },
        {
            title: 'Add'
        }
    ];
    breadcrumbs = this.breadcrumbs_init;
    breadcrumb_moreoptions: any = [];
    checkin_type;
    customidFormat;
    loading = false;
    haveMobile = true;
    customerId;
    customer;
    customerName;
    constructor(
        // public dialogRef: MatDialogRef<AddProviderCustomerComponent>,
        // @Inject(MAT_DIALOG_DATA) public data: any,
        private fb: FormBuilder,
        public fed_service: FormMessageDisplayService,
        public provider_services: ProviderServices,
        public shared_functions: SharedFunctions,
        private activated_route: ActivatedRoute,
        private _location: Location,
        private router: Router) {
             this.activated_route.params.subscribe(
            (params) => {
            this.customerId = params.id;
            this.customer_label = this.shared_functions.getTerminologyTerm('customer');
            if (this.customerId) {
                if (this.customerId === 'add') {
                    const breadcrumbs = [];
                    this.breadcrumbs_init.map((e) => {
                        breadcrumbs.push(e);
                    });
                    breadcrumbs.push({
                        title: 'Add'
                    });
                    this.breadcrumbs = breadcrumbs;
                    this.action = 'add';
                    this.createForm();
                } else {
                    this.activated_route.queryParams.subscribe(
                        (qParams) => {
                            this.action = qParams.action;
                            this.getCustomers(this.customerId).then(
                                (customer) => {
                                    this.customer = customer;
                                    console.log("Customer", this.customer);
                                    this.customerName = this.customer[0].firstName;
                                    if (this.action === 'edit') {
                                        const breadcrumbs = [];
                                        this.breadcrumbs_init.map((e) => {
                                            breadcrumbs.push(e);
                                        });
                                        breadcrumbs.push({
                                            title: this.customerName
                                        });
                                        this.breadcrumbs = breadcrumbs;
                                        this.createForm();
                                    } else if (this.action === 'view') {
                                        const breadcrumbs = [];
                                        this.breadcrumbs_init.map((e) => {
                                            breadcrumbs.push(e);
                                        });
                                        breadcrumbs.push({
                                            title: this.customerName
                                        });
                                        this.breadcrumbs = breadcrumbs;
                                    }
                                }
                            );
                        }
                    );
                }
                this.api_loading = false;
            }
        }
    );

        // this.search_data = this.data.search_data;
        this.customer_label = this.shared_functions.getTerminologyTerm('customer');
        this.activated_route.queryParams.subscribe(qparams => {
            this.source = qparams.source;
            if (qparams.phone) {
                this.phoneNo = qparams.phone;
            }
            if (qparams.email) {
                this.phoneNo = qparams.email;
            }
            if (qparams.checkinType) {
                this.checkin_type = qparams.checkinType;
            }
            if (qparams.noMobile) {
                this.haveMobile = false;
            }
        });
    }
    getCustomers(customerId){
        const _this = this;
        const filter = {'id-eq' : customerId}
        return new Promise(function (resolve, reject) {
            _this.provider_services.getProviderCustomers(filter)
                .subscribe(
                    data => {
                        resolve(data);
                        
                    },
                    () => {
                        reject();
                    }
                );
        });
    }

    ngOnInit() {
        this.loading = true;
        this.getGlobalSettingsStatus();
        this.breadcrumbs = [{
            title: this.shared_functions.firstToUpper(this.customer_label) + 's',
            url: 'provider/customers'
        },
        {
            title: 'Add'
        }
        ];
    }

    getGlobalSettingsStatus() {
        this.provider_services.getGlobalSettings().subscribe(
            (data: any) => {
                this.customidFormat = data.jaldeeIdFormat;
                this.createForm();
            });
    }
    createForm() {
        console.log(this.haveMobile);
        if (!this.haveMobile) {
            this.amForm = this.fb.group({
                first_name: ['', Validators.compose([Validators.required, Validators.pattern(projectConstants.VALIDATOR_CHARONLY)])],
                last_name: ['', Validators.compose([Validators.required, Validators.pattern(projectConstants.VALIDATOR_CHARONLY)])],
                email_id: ['', Validators.compose([Validators.pattern(projectConstants.VALIDATOR_EMAIL)])],
                dob: [''],
                gender: [''],
                address: ['']
            });
            this.loading = false;
        } else {
            this.amForm = this.fb.group({
                mobile_number: ['', Validators.compose([Validators.required, Validators.maxLength(10),
                Validators.minLength(10), Validators.pattern(projectConstants.VALIDATOR_NUMBERONLY)])],
                first_name: ['', Validators.compose([Validators.required, Validators.pattern(projectConstants.VALIDATOR_CHARONLY)])],
                last_name: ['', Validators.compose([Validators.required, Validators.pattern(projectConstants.VALIDATOR_CHARONLY)])],
                email_id: ['', Validators.compose([Validators.pattern(projectConstants.VALIDATOR_EMAIL)])],
                dob: [''],
                gender: [''],
                address: ['']
            });
            if (this.action === 'edit') {
                this.updateForm();
            }
            this.loading = false;
        }
        if (this.customidFormat && this.customidFormat.customerSeriesEnum && this.customidFormat.customerSeriesEnum === 'MANUAL') {
        this.amForm.addControl('customer_id', new FormControl('', Validators.required));
        }
        if (this.phoneNo) {
            this.amForm.get('mobile_number').setValue(this.phoneNo);
        }
        if (this.email) {
            this.amForm.get('email_id').setValue(this.email);
        }
    }
        updateForm() {
        this.amForm.setValue({
            'first_name': this.customer[0].firstName || null,
            'last_name': this.customer[0].lastName || null,
            'email_id' : this.customer[0].emailId || null,
            'dob': this.customer[0].dob || null,
            'gender': this.customer[0].gender || null,
            'mobile_number': this.customer[0].phoneNo || null,
            'address': this.customer[0].address || null,
        });
        }
    onSubmit(form_data) {
        this.disableButton = true;
        if (this.action === 'add') {
        const post_data = {
            //   'userProfile': {
            'firstName': form_data.first_name,
            'lastName': form_data.last_name,
            'dob': form_data.dob,
            'gender': form_data.gender,
            'phoneNo': form_data.mobile_number,
            'address': form_data.address,
            //   }
        };
        if (form_data.mobile_number) {
            post_data['countryCode'] = '+91';
        }
        if (form_data.email_id && form_data.email_id !== '') {
            post_data['email'] = form_data.email_id;
        }
        if (form_data.customer_id) {
            post_data['jaldeeId'] = form_data.customer_id;
        }
        this.provider_services.createProviderCustomer(post_data)
            .subscribe(
                data => {
                    this.shared_functions.apiSuccessAutoHide(this, Messages.PROVIDER_CUSTOMER_CREATED);
                    this.shared_functions.openSnackBar(Messages.PROVIDER_CUSTOMER_CREATED);
                    const qParams = {};
                    qParams['pid'] = data;
                    if (this.source === 'checkin') {
                        const navigationExtras: NavigationExtras = {
                            queryParams: {
                                ph: form_data.mobile_number,
                                checkin_type: this.checkin_type
                            }
                        };
                        this.router.navigate(['provider', 'check-ins', 'add'], navigationExtras);
                    } else if (this.source === 'appointment') {
                        const navigationExtras: NavigationExtras = {
                            queryParams: {
                                ph: form_data.mobile_number,
                                checkin_type: this.checkin_type
                            }
                        };
                        this.router.navigate(['provider', 'settings', 'appointmentmanager', 'appointments'], navigationExtras);
                    } else {
                        const navigationExtras: NavigationExtras = {
                            queryParams: {
                                phoneNo: this.phoneNo
                            }
                        };
                        this.router.navigate(['provider', 'customers', 'find'], navigationExtras);
                    }
                },
                error => {
                    this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    this.disableButton = false;
                });
            }
            else if (this.action === 'edit') {
                const post_data = {
                    //   'userProfile': {
                    'firstName': form_data.first_name,
                    'lastName': form_data.last_name,
                    'dob': form_data.dob,
                    'gender': form_data.gender,
                    'phoneNo': form_data.mobile_number,
                    'address': form_data.address,
                    //   }
                };if (form_data.mobile_number) {
                    post_data['countryCode'] = '+91';
                }
                if (form_data.email_id && form_data.email_id !== '') {
                    post_data['email'] = form_data.email_id;
                }
                if (form_data.customer_id) {
                    post_data['jaldeeId'] = form_data.customer_id;
                }
                this.provider_services.updateProviderCustomer(post_data)
                    .subscribe(
                        data => {
                            this.shared_functions.apiSuccessAutoHide(this, Messages.PROVIDER_CUSTOMER_CREATED);
                            this.shared_functions.openSnackBar(Messages.PROVIDER_CUSTOMER_CREATED);
                            const qParams = {};
                            qParams['pid'] = data;
                            if (this.source === 'checkin') {
                                const navigationExtras: NavigationExtras = {
                                    queryParams: {
                                        ph: form_data.mobile_number,
                                        checkin_type: this.checkin_type
                                    }
                                };
                                this.router.navigate(['provider', 'check-ins', 'add'], navigationExtras);
                            } else if (this.source === 'appointment') {
                                const navigationExtras: NavigationExtras = {
                                    queryParams: {
                                        ph: form_data.mobile_number,
                                        checkin_type: this.checkin_type
                                    }
                                };
                                this.router.navigate(['provider', 'settings', 'appointmentmanager', 'appointments'], navigationExtras);
                            } else {
                                const navigationExtras: NavigationExtras = {
                                    queryParams: {
                                        phoneNo: this.phoneNo
                                    }
                                };
                                this.router.navigate(['provider', 'customers', 'find'], navigationExtras);
                            }
                        },
                        error => {
                            this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                        });
            
            }

    }
    onCancel() {
        this._location.back();
    }
    resetApiErrors() {
        this.api_error = null;
        this.api_success = null;
    }
    onFieldBlur(key) {
        this.amForm.get(key).setValue(this.toCamelCase(this.amForm.get(key).value));
    }
    toCamelCase(word) {
        if (word) {
            return this.shared_functions.toCamelCase(word);
        } else {
            return word;
        }
    }
    isNumeric(evt) {
        return this.shared_functions.isNumeric(evt);
    }
}
