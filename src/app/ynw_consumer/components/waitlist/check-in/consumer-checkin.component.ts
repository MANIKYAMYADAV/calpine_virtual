import { Component, Inject, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormMessageDisplayService } from '../../../../shared/modules/form-message-display/form-message-display.service';
import { SharedServices } from '../../../../shared/services/shared-services';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { CommonDataStorageService } from '../../../../shared/services/common-datastorage.service';
import { Messages } from '../../../../shared/constants/project-messages';
import { projectConstants } from '../../../../app.component';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import * as moment from 'moment';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { DateFormatPipe } from '../../../../shared/pipes/date-format/date-format.pipe';
import { DOCUMENT, Location } from '@angular/common';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { ServiceDetailComponent } from '../../../../shared/components/service-detail/service-detail.component';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { WordProcessor } from '../../../../shared/services/word-processor.service';
import { LocalStorageService } from '../../../../shared/services/local-storage.service';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';
import { Razorpaymodel } from '../../../../shared/components/razorpay/razorpay.model';
import { DomSanitizer } from '@angular/platform-browser';
import { RazorpayService } from '../../../../shared/services/razorpay.service';
import { RazorpayprefillModel } from '../../../../shared/components/razorpay/razorpayprefill.model';
import { DateTimeProcessor } from '../../../../shared/services/datetime-processor.service';
import { JaldeeTimeService } from '../../../../shared/services/jaldee-time-service';
import { JcCouponNoteComponent } from '../../../../ynw_provider/components/jc-Coupon-note/jc-Coupon-note.component';
import { S3UrlProcessor } from '../../../../shared/services/s3-url-processor.service';
import { SubSink } from '../../../../../../node_modules/subsink';
import { VirtualFieldsComponent } from '../../virtualfields/virtualfields.component';
import { ConsumerEmailComponent } from '../../../shared/component/consumer-email/consumer-email.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';




@Component({
    selector: 'app-consumer-checkin',
    templateUrl: './consumer-checkin.component.html',
    styleUrls: ['./consumer-checkin.component.css', '../../../../../assets/css/style.bundle.css', '../../../../../assets/css/pages/wizard/wizard-1.css', '../../../../../assets/plugins/global/plugins.bundle.css', '../../../../../assets/plugins/custom/prismjs/prismjs.bundle.css'],
})
export class ConsumerCheckinComponent implements OnInit, OnDestroy {
    virtualForm: FormGroup;
    paymentBtnDisabled = false;
    tooltipcls = '';
    add_member_cap = Messages.ADD_MEMBER_CAP;
    cancel_btn = Messages.CANCEL_BTN;
    applied_inbilltime = Messages.APPLIED_INBILLTIME;
    domain;
    note_placeholder;
    details: any;

    s3url;
    api_cp_error = null;
    services: any = [];
    servicesjson: any = [];
    serviceslist: any = [];
    settingsjson: any = [];
    terminologiesjson: any = [];
    queuejson: any = [];
    businessjson: any = [];
    familymembers: any = [];
    partysizejson: any = [];
    sel_loc;
    sel_ser;
    sel_ser_det: any = [];
    prepaymentAmount = 0;
    sel_queue_id;
    queueId;
    sel_queue_waitingmins;
    waitingTime;
    sel_queue_servicetime = '';
    serviceTime;
    sel_queue_name;
    sel_queue_timecaption;
    sel_queue_indx;
    sel_queue_personaahead = 0;
    personsAhead;
    calc_mode;
    multipleMembers_allowed = false;
    partySize = false;
    api_loading = true;
    partySizeRequired = null;
    today;
    minDate;
    maxDate;
    consumerNote = '';
    enterd_partySize = 1;
    holdenterd_partySize = 0;
    sel_checkindate;
    hold_sel_checkindate;
    selectedDate;
    account_id;
    chosen_person: any;
    hideLanguages = true;

    retval;
    futuredate_allowed = false;
    step;
    waitlist_for: any = [];
    holdwaitlist_for: any = [];
    maxsize;
    isFuturedate = false;
    addmemberobj = { 'fname': '', 'lname': '', 'mobile': '', 'gender': '', 'dob': '' };
    userN = { 'id': 0, 'firstName': Messages.NOUSERCAP, 'lastName': '' };
    payment_popup = null;
    dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT_WITH_DAY;
    newDateFormat = projectConstantsLocal.DATE_EE_MM_DD_YY_FORMAT;
    customer_data: any = [];
    queueQryExecuted = false;
    todaydate;
    ddate;
    languages = [
        "Hindi",
        "Kannada",
        "Malayalam",
        "Tamil",
        "Telugu"
      ];
      disableButton;

    server_date;
    api_loading1 = true;
    departmentlist: any = [];
    departments: any = [];
    selected_dept;
    filterDepart = false;
    selectedCountryCode;
    userData: any = [];
    userEmail;
    userPhone;
    age: any;
    userId: any;
    currentPhone;
    users: any = [];
    emailExist = false;
    payEmail = '';
    emailerror = null;
    changePhno = false;
    selected_phone;
    trackUuid;
    selectedMessage = {
        files: [],
        base64: [],
        caption: []
    };
    apptTime: any;
    allSlots: any = [];
    availableSlots: any = [];
    data;
    provider_id: any;
    s3CouponsList: any = {
        JC: [], OWN: []
    };
    showCouponWB: boolean;
    change_date: any;
    liveTrack = false;
    lngknown = 'yes';
    mandatoryEmail: any;

    carouselOne;
    action: any = '';
    callingMode;
    virtualServiceArray;
    callingModes: any = [];
    countryCode;
    selectedUser;
    callingModesDisplayName = projectConstants.CALLING_MODES;
    tele_srv_stat: any;
    couponvalid = true;
    selected_coupons: any = [];
    selected_coupon;
    couponsList: any = [];
    coupon_status = null;
    is_wtsap_empty = false;
    selectedDeptParam;
    selectedUserParam;
    accountType;
    disable = false;
    selectedService: any;
    note_cap = 'Add Note';
    servicedialogRef: any;
    availableDates: any = [];
    type;
    locations;
    activeUser: any;
    memberObject: any;
    rescheduleUserId;
    waitlist: any = [];
    checkin_date;
    wtlst_for_fname;
    wtlst_for_lname;
    serviceCost;
    is_parent = true;
    loading = false;
    gender_cap = Messages.GENDER_CAP;


    phoneNumber;
    consumer_label:any;
    separateDialCode = true;
    SearchCountryField = SearchCountryField;
    selectedCountry = CountryISO.India;
    PhoneNumberFormat = PhoneNumberFormat;
    preferredCountries: CountryISO[] = [CountryISO.India, CountryISO.UnitedKingdom, CountryISO.UnitedStates];
    phoneError: string;
    dialCode;
    editBookingFields: boolean;
    bookingForm: FormGroup;
    whatsapperror = '';
    showmoreSpec = false;
    bookStep = 1;
    locationName;
    waitlistDetails: { 'amount': number; 'paymentMode': any; 'uuid': any; 'accountId': any; 'purpose': string; };
    pGateway: any;
    razorModel: Razorpaymodel;
    uuidList: any = [];
    prepayAmount;
    paymentDetails: any = [];
    paymentLength = 0;
    @ViewChild('closebutton') closebutton;
    @ViewChild('modal') modal;
    apiError = '';
    apiSuccess = '';
    questionnaireList: any = [];
    questionAnswers;
    googleMapUrl;
    private subs = new SubSink();
    selectedQTime;
    questionnaireLoaded = false;
    imgCaptions: any = [];
    virtualInfo: any;
    newMember: any;
    consumerType: string;
    heartfulnessAccount = false;
    theme: any;
    checkPolicy = true;
    customId: any; // To know the source whether the router came from Landing page or not
    businessId: any;
    newPhone;
    newEmail;
    newWhatsapp;
    submitbtndisabled=false;
    virtualFields: any;
    whatsappCountryCode;
    disablebutton = false;
    readMore = false;
    razorpayGatway = false;
    paytmGateway = false;
    checkJcash = false;
    checkJcredit = false;
    jaldeecash: any;
    jcashamount: any;
    jcreditamount: any;
    remainingadvanceamount;
    amounttopay: any;
    wallet: any;
    iseditLanguage=false;
    languageSelected: any = [];
    payAmount: number;
    constructor(public fed_service: FormMessageDisplayService,
        @Inject(MAT_DIALOG_DATA) public dialogData: any,

        private fb: FormBuilder,
        public shared_services: SharedServices,
        public sharedFunctionobj: SharedFunctions,
        private shared_functions: SharedFunctions,

        public router: Router,
        public route: ActivatedRoute,
        public dateformat: DateFormatPipe,
        public provider_services: ProviderServices,
        public datastorage: CommonDataStorageService,
        public location: Location,
        public dialog: MatDialog,
        private snackbarService: SnackbarService,
        private wordProcessor: WordProcessor,
        private lStorageService: LocalStorageService,
        private groupService: GroupStorageService,
        public _sanitizer: DomSanitizer,
        public razorpayService: RazorpayService,
        public prefillmodel: RazorpayprefillModel,
        private dateTimeProcessor: DateTimeProcessor,
        private jaldeeTimeService: JaldeeTimeService,
        private s3Processor: S3UrlProcessor,
        private sharedServices: SharedServices,

        @Inject(DOCUMENT) public document
    ) {
        this.subs.sink = this.route.queryParams.subscribe(
            params => {
                this.sel_loc = params.loc_id;
                this.locationName = params.locname;
                this.googleMapUrl = params.googleMapUrl;
                if (params.qid) {
                    this.sel_queue_id = params.qid;
                }
                this.change_date = params.cur;
                this.account_id = params.account_id;
                this.provider_id = params.unique_id;
                this.sel_checkindate = this.selectedDate = params.sel_date;
                this.hold_sel_checkindate = this.sel_checkindate;
                this.tele_srv_stat = params.tel_serv_stat;
                if (params.dept) {
                    this.selectedDeptParam = parseInt(params.dept);
                    this.filterDepart = true;
                }
                if (params.user) {
                    this.selectedUserParam = params.user;
                }
                if (params.service_id) {
                    this.selectedService = parseInt(params.service_id);
                }
                if (params.type === 'waitlistreschedule') {
                    this.type = params.type;
                    this.rescheduleUserId = params.uuid;
                    this.getRescheduleWaitlistDet();
                }
                if (params.virtual_info) {
                    this.virtualInfo = JSON.parse(params.virtual_info);

                }
                if (params.theme) {
                    this.theme = params.theme;
                    console.log(this.theme);
                }
                if (params.customId) {
                    this.customId = params.customId;
                    this.businessId = this.account_id;
                }
            });


             this.age = this.lStorageService.getitemfromLocalStorage('age');
             this.userId = this.lStorageService.getitemfromLocalStorage('userId');
             this.activeUser = this.groupService.getitemFromGroupStorage('ynw-user');
             this.consumer_label = this.wordProcessor.getTerminologyTerm('customer');
             this.getActiveUserInfo().then(data => {
                this.customer_data = data;
                this.countryCode = this.customer_data.userProfile.countryCode;
          
                this.mandatoryEmail = this.customer_data.userProfile.email;
                this.createForm();
                this.getFamilyMember();
              });
    }


    createForm() {
        this.virtualForm = this.fb.group({
            firstName: [''],
            lastName: [''],
            serviceFor: ['', Validators.compose([Validators.required])],
            countryCode_whtsap: [this.countryCode],
            countryCode_telegram: [this.countryCode],
            // dob: ['', Validators.compose([Validators.required])],
            // date: [''],
            // month: [''],
            // year: [''],
            age: ['', Validators.compose([Validators.required, Validators.min(0), Validators.max(150)])],
            pincode: ['', Validators.compose([Validators.required])],
            email: ['', Validators.compose([Validators.pattern(projectConstantsLocal.VALIDATOR_EMAIL)])],
            // whatsappnumber: ['', Validators.compose([Validators.pattern(projectConstantsLocal.VALIDATOR_PHONENUMBERCOUNT10)])],
            whatsappnumber: [''],
            telegramnumber: [''],
            // telegramnumber: ['', Validators.compose([Validators.pattern(projectConstantsLocal.VALIDATOR_PHONENUMBERCOUNT10)])],
            preferredLanguage: [[], Validators.compose([Validators.required])],
            islanguage: ['', Validators.compose([Validators.required])],
            gender: ['', Validators.compose([Validators.required])],
            location: ['', Validators.compose([Validators.required])],
            localarea: [''],
            state: [''],
            country: [''],
            updateEmail: [false]
        });

        this.virtualForm.patchValue({ islanguage: 'yes' });
        this.virtualForm.patchValue({ date: 'dd' });
        this.virtualForm.patchValue({ month:'mm' });
        this.virtualForm.patchValue({ year: 'yyyy' });
        if (this.dialogData.type !== 'member') {
            this.virtualForm.patchValue({ serviceFor: this.customer_data.id });
        } else {
            this.virtualForm.patchValue({ serviceFor: this.dialogData.consumer });

        }

        if (this.dialogData) {

            this.updateForm();
        }
        this.api_loading = false;
    }


    updateForm() {

        if (this.dialogData.type && this.dialogData.type === 'member') {
            this.details = this.dialogData.consumer
        } else {
            this.details = this.customer_data;
        }
        if (this.details.parent) {
            this.setMemberDetails(this.details);
        } else {
            this.setparentDetails(this.details);

        }

    }


    getActiveUserInfo() {
        const _this = this;
        return new Promise(function (resolve, reject) {
          _this.sharedServices.getProfile(_this.activeUser.id, 'consumer')
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


      onServiceForChange(event) {
        this.serviceFormReset();
    
        this.is_parent = true;
        if (event !== 'new_member') {
          const chosen_Object = this.familymembers.filter(memberObj => memberObj.user === event);
          if (chosen_Object.length !== 0) {
            this.is_parent = false;
            this.chosen_person = chosen_Object[0]
            this.setMemberDetails(chosen_Object[0]);
          } else {
            this.chosen_person = this.customer_data
            this.setparentDetails(this.customer_data);
          }
        } else {
          this.is_parent = false;
          this.chosen_person = 'new_member'
    
        }
    
      }

      cancelLanguageSelection() {
        if (this.virtualForm.get('preferredLanguage').value.length == 0) {
          this.virtualForm.get('preferredLanguage').setValue(['English']);
          this.lngknown = 'yes';
          this.virtualForm.patchValue({ islanguage: 'yes' });
        } else {
          this.languageSelected = [];
    
        }
        this.hideLanguages = true;
        // let elmnt = document.getElementById("plng");
        // elmnt.scrollIntoView();
      }

      saveLanguages() {
        if (this.lngknown === 'yes') {
          this.virtualForm.get('preferredLanguage').setValue(['English']);
          this.hideLanguages = true;
          this.languageSelected = [];
          this.iseditLanguage=false;
        }
      else{
        this.virtualForm.patchValue({ 'preferredLanguage': this.languageSelected });
        if (this.virtualForm.get('preferredLanguage').value.length === 0) {
          this.snackbarService.openSnackBar('Please select one', { 'panelClass': 'snackbarerror' });
          return false;
        }
        this.hideLanguages = true;
        this.languageSelected = [];
        // let elmnt = document.getElementById("plng");
        // elmnt.scrollIntoView()
      }
    }


      editLanguage() {
        this.iseditLanguage=true;
        this.languageSelected = this.virtualForm.get('preferredLanguage').value.slice();
        this.hideLanguages = false;
      }
      checklangExists(lang) {
        if (this.languageSelected.length > 0) {
          const existindx = this.languageSelected.indexOf(lang);
          if (existindx !== -1) {
            return true;
          }
        } else {
          return false;
        }
      }

      langSel(sel) {

        if (this.languageSelected.length > 0) {
          const existindx = this.languageSelected.indexOf(sel);
          if (existindx === -1) {
            this.languageSelected.push(sel);
          } else {
            this.languageSelected.splice(existindx, 1);
          }
        } else {
          this.languageSelected.push(sel);
        }
    
      }
      onChange(event) {
        this.lngknown = event.value
        if (this.lngknown === 'yes') {
          this.virtualForm.get('preferredLanguage').setValue(['English']);
        }
        if (this.lngknown === 'no' && this.virtualForm.get('preferredLanguage').value.length === 0) {
          this.hideLanguages = false;
        }
        if (this.lngknown === 'no' && this.virtualForm.get('preferredLanguage').value.length > 0 && this.virtualForm.get('preferredLanguage').value[0] === 'English') {
          this.virtualForm.get('preferredLanguage').setValue([]);
          this.hideLanguages = false;
        }
      }


      fetchLocationByPincode(pincode) {
        const _this = this;
        return new Promise(function (resolve, reject) {
          _this.sharedServices.getLocationsByPincode(pincode).subscribe(
            (locations: any) => {
              resolve(locations);
            },
            error => {
              resolve([]);
            }
          );
        });
      }

      showLocations(event) {
        let pincode = this.virtualForm.get('pincode').value;
        if (pincode.length === 6) {
          this.loading = true;
          this.fetchLocationByPincode(pincode).then(
            (locations: any) => {
              if (locations.length > 0) {
                this.locations = locations[0];
                this.virtualForm.patchValue({ location: locations[0]['PostOffice'][0] });
              } else {
                this.locations = [];
              }
              this.loading = false;
            }
          )
        } else {
          this.locations = [];
        }
      }


      getFamilyMember() {
        this.api_loading1 = true;
        let fn;
        fn = this.sharedServices.getConsumerFamilyMembers();
        this.subs.sink = fn.subscribe(data => {
          this.familymembers = [];
          for (const mem of data) {
            this.familymembers.push(mem);
          }
          if (this.dialogData.id) {
            this.virtualForm.patchValue({ 'serviceFor': this.dialogData.id });
            this.onServiceForChange(this.dialogData.id);
          }
          this.api_loading1 = false;
        },
          () => {
            this.api_loading1 = false;
          });
      }


    setparentDetails(customer) {


        // if (customer.userProfile && customer.userProfile.dob!==undefined) {

        //   const dob = customer.userProfile.dob.split('-');
        //   this.virtualForm.patchValue({ date: dob[2] });
        //   this.virtualForm.patchValue({ month: dob[1] });
        //   this.virtualForm.patchValue({ year: dob[0] });
        //   this.virtualForm.patchValue({ dob: customer.userProfile.dob });
        // }else{
        //   this.virtualForm.patchValue({ date:'dd' });
        //   this.virtualForm.patchValue({ month: 'mm' });
        //   this.virtualForm.patchValue({ year: 'yyyy' });
        // }
        if (customer.userProfile.age) {
            this.virtualForm.patchValue({ age: customer.userProfile.age });
        }
        if (customer.userProfile.id === this.userId && this.age) {
            this.virtualForm.patchValue({ age: this.age });
        }


        if (customer.userProfile && customer.userProfile.gender) {
            this.virtualForm.patchValue({ gender: customer.userProfile.gender });
        }
        if (customer.userProfile && customer.userProfile.email) {
            this.virtualForm.patchValue({ email: customer.userProfile.email });
        }
        if (customer.userProfile.preferredLanguages && customer.userProfile.preferredLanguages !== null) {
            const preferredLanguage = this.s3Processor.getJson(customer.userProfile.preferredLanguages);
            if (preferredLanguage !== null && preferredLanguage.length > 0) {
                let defaultEnglish = (preferredLanguage[0] === 'English') ? 'yes' : 'no';
                this.virtualForm.patchValue({ islanguage: defaultEnglish });
                this.lngknown = defaultEnglish;
                this.virtualForm.patchValue({ preferredLanguage: preferredLanguage });
            } else {
                this.virtualForm.patchValue({ islanguage: 'yes' });
            }
        }
        if (customer.userProfile && customer.userProfile.pinCode) {
            this.virtualForm.patchValue({ pincode: customer.userProfile.pinCode });
        }
        if (customer.userProfile && customer.userProfile.city) {
            this.virtualForm.patchValue({ localarea: customer.userProfile.city });
        }
        if (customer.userProfile && customer.userProfile.state) {
            this.virtualForm.patchValue({ state: customer.userProfile.state });
        }
        if (customer.userProfile && customer.userProfile.whatsAppNum && customer.userProfile.whatsAppNum.number) {
            this.virtualForm.patchValue({ whatsappnumber: customer.userProfile.whatsAppNum.number });
            this.virtualForm.patchValue({ countryCode_whtsap: customer.userProfile.whatsAppNum.countryCode });

        } else {
            this.virtualForm.patchValue({ whatsappnumber: this.customer_data.userProfile.primaryMobileNo });
            this.virtualForm.patchValue({ countryCode_whtsap: this.customer_data.userProfile.countryCode });
        }
        if (customer.userProfile && customer.userProfile.telegramNum && customer.userProfile.telegramNum.number) {
            this.virtualForm.patchValue({ telegramnumber: customer.userProfile.telegramNum.number });
            this.virtualForm.patchValue({ countryCode_telegram: customer.userProfile.telegramNum.countryCode });
        }
        else {
            this.virtualForm.patchValue({ telegramnumber: this.customer_data.userProfile.primaryMobileNo });
            this.virtualForm.patchValue({ countryCode_telegram: this.customer_data.userProfile.countryCode });
        }

    }
    setMemberDetails(memberObj) {
        this.serviceFormReset();
        // if (memberObj.userProfile && memberObj.userProfile.dob!==undefined) {
        //   const dob = memberObj.userProfile.dob.split('-');
        //   this.virtualForm.patchValue({ date: dob[2] });
        //   this.virtualForm.patchValue({ month: dob[1] });
        //   this.virtualForm.patchValue({ year: dob[0] });
        //   this.virtualForm.patchValue({ dob: memberObj.userProfile.dob });
        // }else{
        //   this.virtualForm.patchValue({ date: 'dd' });
        //   this.virtualForm.patchValue({ month:'mm' });
        //   this.virtualForm.patchValue({ year: 'yyyy' });
        // }
        if (memberObj.userProfile.age) {
            this.virtualForm.patchValue({ age: memberObj.userProfile.age });
        } if (memberObj.userProfile.id === this.userId && this.age) {
            this.virtualForm.patchValue({ age: this.age });
        }
        if (memberObj.userProfile && memberObj.userProfile.gender) {
            this.virtualForm.patchValue({ gender: memberObj.userProfile.gender });
        }
        if (memberObj.userProfile && memberObj.userProfile.email) {
            this.virtualForm.patchValue({ email: memberObj.userProfile.email });
        } else {
            this.virtualForm.patchValue({ email: this.customer_data.userProfile.email });
        }
        if (memberObj.preferredLanguages && memberObj.preferredLanguages !== null) {
            const preferredLanguage = this.s3Processor.getJson(memberObj.preferredLanguages);
            if (preferredLanguage !== null && preferredLanguage.length > 0) {
                let defaultEnglish = (preferredLanguage[0] === 'English') ? 'yes' : 'no';
                if (defaultEnglish === 'no') {
                    if (memberObj.preferredLanguages.length > 0) {
                        this.virtualForm.patchValue({ islanguage: defaultEnglish });
                        this.lngknown = defaultEnglish;
                    } else {
                        this.virtualForm.patchValue({ islanguage: '' });
                    }
                } else {
                    this.virtualForm.patchValue({ islanguage: defaultEnglish });
                    this.lngknown = defaultEnglish;
                }
                this.virtualForm.patchValue({ preferredLanguage: preferredLanguage });
            }
        } else {
            this.virtualForm.patchValue({ islanguage: 'yes' });
        }
        if (memberObj.bookingLocation && memberObj.bookingLocation.pincode) {
            this.virtualForm.patchValue({ pincode: memberObj.bookingLocation.pincode });
        }
        if (memberObj.bookingLocation && memberObj.bookingLocation.district) {
            this.virtualForm.patchValue({ localarea: memberObj.bookingLocation.district });
        }
        if (memberObj.bookingLocation && memberObj.bookingLocation.state) {
            this.virtualForm.patchValue({ state: memberObj.bookingLocation.state });
        }
        if (memberObj.userProfile && memberObj.userProfile.whatsAppNum && memberObj.userProfile.whatsAppNum.number) {
            this.virtualForm.patchValue({ whatsappnumber: memberObj.userProfile.whatsAppNum.number });
            this.virtualForm.patchValue({ countryCode_whtsap: memberObj.userProfile.whatsAppNum.countryCode });
        } else {
            this.virtualForm.patchValue({ whatsappnumber: this.customer_data.userProfile.primaryMobileNo });
            this.virtualForm.patchValue({ countryCode_whtsap: this.customer_data.userProfile.countryCode });
        }
        if (memberObj.userProfile && memberObj.userProfile.telegramNum && memberObj.userProfile.telegramNum.number) {
            this.virtualForm.patchValue({ telegramnumber: memberObj.userProfile.telegramNum.number });
            this.virtualForm.patchValue({ countryCode_telegram: memberObj.userProfile.telegramNum.countryCode });
        } else {
            this.virtualForm.patchValue({ telegramnumber: this.customer_data.userProfile.primaryMobileNo });
            this.virtualForm.patchValue({ countryCode_telegram: this.customer_data.userProfile.countryCode })
        }
    }


    serviceFormReset() {

        // this.virtualForm.patchValue({ date: 'dd' });
        //   this.virtualForm.patchValue({ month:'mm' });
        //   this.virtualForm.patchValue({ year: 'yyyy' });
        // this.virtualForm.controls['dob'].setValue('');
        this.virtualForm.controls['countryCode_whtsap'].setValue(this.countryCode);
        this.virtualForm.controls['countryCode_telegram'].setValue(this.countryCode);
        this.virtualForm.controls['age'].setValue('');
        this.virtualForm.controls['gender'].setValue('');
        this.virtualForm.controls['islanguage'].setValue('yes');
        this.virtualForm.controls['preferredLanguage'].setValue([]);
        this.virtualForm.controls['pincode'].setValue('');
        this.virtualForm.controls['localarea'].setValue('');
        this.virtualForm.controls['state'].setValue('');
        this.lngknown = 'yes';
        if (this.customer_data.userProfile.email) {
            this.virtualForm.patchValue({ email: this.customer_data.userProfile.email });
        } else {
            this.virtualForm.patchValue({ email: '' });
        }

        this.virtualForm.patchValue({ whatsappnumber: this.customer_data.userProfile.primaryMobileNo });
        this.virtualForm.patchValue({ telegramnumber: this.customer_data.userProfile.primaryMobileNo });
    }
    validateFields() {
        let isinvalid = false;
        if (this.countryCode === '+91') {
          if (this.virtualForm.get('pincode').value === '' || this.virtualForm.get('pincode').value.length !== 6) {
            isinvalid = true;
          }
        }
        if (this.countryCode !== '+91') {
          if (this.virtualForm.get('localarea').value === ''||this.virtualForm.get('state').value==='') {
            isinvalid = true;
            
          }
        }
        if (this.virtualForm.get('gender').value === '') {
          isinvalid = true;
        }
        if (this.virtualForm.get('age').value === '') {
          isinvalid = true;
        }
    
        if (this.virtualForm.get('islanguage').value === 'no') {
          if (this.virtualForm.get('preferredLanguage').value.length === 0) {
            isinvalid = true;
          }
        }
       
        if (this.virtualForm.get('serviceFor').value === 'new_member') {
    
          if (this.virtualForm.get('firstName').value == '') {
            isinvalid = true;
          }
          if (this.virtualForm.get('lastName').value == '') {
            isinvalid = true;
    
          }
        }
        // if (this.virtualForm.get('date').value === 'dd') {
        //   isinvalid = true;
        // }
        // if (this.virtualForm.get('month').value === 'mm') {
        //   isinvalid = true;
        // }
        // if (this.virtualForm.get('year').value === 'yyyy') {
        //   isinvalid = true;
        // }
    
        return isinvalid;
      }



      updateParentInfo(formdata) {

        const _this = this;
        const firstName = _this.customer_data.userProfile.firstName
        const lastName = _this.customer_data.userProfile.lastName;
        return new Promise(function (resolve, reject) {
          const userObj = {};
          userObj['id'] = _this.customer_data.id;
          if (  formdata.whatsappnumber !== undefined &&formdata.whatsappnumber.trim().length>0  && formdata.countryCode_whtsap !== undefined && formdata.countryCode_whtsap.trim().length>0) {
            const whatsup = {}
            if (formdata.countryCode_whtsap.startsWith('+')) {
              whatsup["countryCode"] = formdata.countryCode_whtsap
            } else {
              whatsup["countryCode"] = '+' + formdata.countryCode_whtsap
            }
            whatsup["number"] = formdata.whatsappnumber
            userObj['whatsAppNum'] = whatsup;
          }
      
          if (formdata.telegramnumber !== undefined && formdata.telegramnumber.trim().length>0 &&  formdata.countryCode_telegram !== undefined&&formdata.countryCode_telegram.trim().length>0) {
            const telegram = {}
            if (formdata.countryCode_telegram.startsWith('+')) {
              telegram["countryCode"] = formdata.countryCode_telegram
            } else {
              telegram["countryCode"] = '+' + formdata.countryCode_telegram
            }
            telegram["number"] = formdata.telegramnumber
            userObj['telegramNum'] = telegram;
          }
       
          
          if (formdata.email !== ''&& formdata.updateEmail) {
            userObj['email'] = formdata.email
          }
          userObj['gender'] = formdata.gender;
          userObj['firstName'] = firstName;
          userObj['lastName'] = lastName;
          // userObj['dob'] = formdata.dob;
          userObj['pinCode'] = formdata.pincode;
          if (formdata.islanguage === 'yes') {
            userObj['preferredLanguages'] = ['English'];
          } else {
            userObj['preferredLanguages'] = formdata.preferredLanguage;
          }
          userObj['bookingLocation']= {}
          if (_this.countryCode!=='+91'&&formdata.localarea!=='') {
            userObj['bookingLocation']['district'] = formdata.localarea;
            userObj['city']=formdata.localarea;
          }
          if (_this.countryCode!=='+91'&&formdata.state ) {
            userObj['bookingLocation']['state'] = formdata.state;
            userObj['state'] = formdata.state;
          }
          _this.lStorageService.setitemonLocalStorage('userId', _this.customer_data.id);
          _this.sharedServices.updateProfile(userObj, 'consumer').subscribe(
            () => {
    
              resolve(true);
            }, (error) => {
              _this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
              resolve(false);
            }
          )
        });
      }

    onSubmit(formdata) {
        this.submitbtndisabled = true;
        formdata['phoneno'] = this.customer_data.userProfile.primaryMobileNo;
         if(this.virtualForm.controls.email.invalid){
           return false;
         }
        if (this.validateFields() === true) {
          this.snackbarService.openSnackBar('Please fill  all required fields', { 'panelClass': 'snackbarerror' });
        } else if(formdata.countryCode_whtsap.trim().length === 0 && formdata.whatsappnumber.trim().length > 0){
          this.snackbarService.openSnackBar('Please fill whatsapp countrycode', { 'panelClass': 'snackbarerror' });
        } else if(formdata.countryCode_telegram.trim().length === 0 && formdata.telegramnumber.trim().length > 0){
          this.snackbarService.openSnackBar('Please fill telegram countrycode', { 'panelClass': 'snackbarerror' });
        } else  {
    
          if (this.is_parent) {
            this.updateParentInfo(formdata).then(
              (result) => {
                if (result !== false) {
                  this.lStorageService.setitemonLocalStorage('age', formdata.age);
                  this.submitbtndisabled = false;
                 // this.dialogRef.close(formdata);
                }
              },
              (error) => {
                this.submitbtndisabled = false;
                return false;
              }
            );
          } else {
            if (formdata.serviceFor === 'new_member') {
              this.saveMember(formdata).then(data => {
                if (data !== false) {
                  this.lStorageService.setitemonLocalStorage('age', formdata.age);
                  formdata['newMemberId'] = data;
                  this.submitbtndisabled = false;
                  //this.dialogRef.close(formdata);
                }
              },
                () => {
                  this.submitbtndisabled = false;
                  return false;
                })
            } else {
              this.updateMemberInfo(formdata).then(
                (data) => {
                  if (data !== false) {
                    this.submitbtndisabled = false;
                    this.lStorageService.setitemonLocalStorage('age', formdata.age);
                   // this.dialogRef.close(formdata);
                  }
                },
                () => {
                  this.submitbtndisabled = false;
                  return false;
                }
              );
            }
    
    
          
        
    
        }
      }
    
    
    
      }

      updateMemberInfo(formdata) {
   
        const _this = this;;
        const firstName = _this.chosen_person.userProfile.firstName;
        const lastName = _this.chosen_person.userProfile.lastName;
        let memberInfo: any = {};
        memberInfo.userProfile = {}
        if (  formdata.whatsappnumber !== undefined &&formdata.whatsappnumber.trim().length>0  && formdata.countryCode_whtsap !== undefined && formdata.countryCode_whtsap.trim().length>0) {
          const whatsup = {}
          if (formdata.countryCode_whtsap.startsWith('+')) {
            whatsup["countryCode"] = formdata.countryCode_whtsap
          } else {
            whatsup["countryCode"] = '+' + formdata.countryCode_whtsap
          }
          whatsup["number"] = formdata.whatsappnumber
          memberInfo.userProfile['whatsAppNum'] = whatsup;
        }
        if (formdata.telegramnumber !== undefined && formdata.telegramnumber.trim().length>0 &&  formdata.countryCode_telegram !== undefined&&formdata.countryCode_telegram.trim().length>0) {
          const telegram = {}
          if (formdata.countryCode_telegram.startsWith('+')) {
            telegram["countryCode"] = formdata.countryCode_telegram
          } else {
            telegram["countryCode"] = '+' + formdata.countryCode_telegram
          }
          telegram["number"] = formdata.telegramnumber
          memberInfo.userProfile['telegramNum'] = telegram;
    
        }
        if (formdata.email !== '' && formdata.updateEmail) {
          memberInfo['userProfile']['email'] = formdata.email
        }
    
    
        memberInfo.bookingLocation = {}
        memberInfo.userProfile['id'] = formdata.serviceFor;
        memberInfo.userProfile['gender'] = formdata.gender;
        memberInfo.userProfile['firstName'] = firstName;
        memberInfo.userProfile['lastName'] = lastName;
        // memberInfo.userProfile['dob'] = formdata.dob;
        memberInfo.bookingLocation['pincode'] = formdata.pincode;
        if (formdata.islanguage === 'yes') {
          memberInfo['preferredLanguages'] = ['English'];
        } else {
          memberInfo['preferredLanguages'] = formdata.preferredLanguage;
        }
        if (this.countryCode!=='+91'&&formdata.localarea && formdata.localarea!=='') {
          memberInfo['bookingLocation']['district'] = formdata.localarea;
        }
        if (this.countryCode!=='+91'&&formdata.state ) {
          memberInfo['bookingLocation']['state'] = formdata.state;
        }
        this.lStorageService.setitemonLocalStorage('userId', formdata.serviceFor);
        return new Promise(function (resolve, reject) {
          _this.sharedServices.editMember(memberInfo).subscribe(
            () => {
              resolve(true);
            }, (error) => {
              _this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
              resolve(false);
            }
          )
        });
    
    
    
      }


      saveMember(formdata) {
        const _this = this;
        const memberInfo = {};
        memberInfo['userProfile'] = {}
        if (  formdata.whatsappnumber !== undefined &&formdata.whatsappnumber.trim().length>0  && formdata.countryCode_whtsap !== undefined && formdata.countryCode_whtsap.trim().length>0) {
    
          const whatsup = {}
          if (formdata.countryCode_whtsap.startsWith('+')) {
            whatsup["countryCode"] = formdata.countryCode_whtsap
          } else {
            whatsup["countryCode"] = '+' + formdata.countryCode_whtsap
          }
          whatsup["number"] = formdata.whatsappumber
          memberInfo['userProfile']['whatsAppNum'] = whatsup;
        }
        if (formdata.telegramnumber !== undefined && formdata.telegramnumber.trim().length>0 &&  formdata.countryCode_telegram !== undefined&&formdata.countryCode_telegram.trim().length>0) {
          const telegram = {}
          if (formdata.countryCode_telegram.startsWith('+')) {
            telegram["countryCode"] = formdata.countryCode_telegram
          } else {
            telegram["countryCode"] = '+' + formdata.countryCode_telegram
          }
          telegram["countryCode"] = formdata.countryCode_telegram
          telegram["number"] = formdata.telegramnumber
          memberInfo['userProfile']['telegramNum'] = telegram;
        }
        if (formdata.email !== '' && formdata.updateEmail) {
          memberInfo['userProfile']['email'] = formdata.email
        }
    
    
        memberInfo['bookingLocation'] = {}
        memberInfo['userProfile']['gender'] = formdata.gender;
        memberInfo['userProfile']['firstName'] = formdata.firstName;
        memberInfo['userProfile']['lastName'] = formdata.lastName;
        // memberInfo['userProfile']['dob'] = formdata.dob;
        memberInfo['bookingLocation']['pincode'] = formdata.pincode;
        if (formdata.islanguage === 'yes') {
          memberInfo['preferredLanguages'] = ['English'];
        } else {
          memberInfo['preferredLanguages'] = formdata.preferredLanguage;
        }
    
        if (this.countryCode!=='+91'&&formdata.localarea && formdata.localarea!=='') {
          memberInfo['bookingLocation']['district'] = formdata.localarea;
        }
        if (this.countryCode!=='+91'&&formdata.state ) {
          memberInfo['bookingLocation']['state'] = formdata.state;
        }
        return new Promise(function (resolve, reject) {
          _this.sharedServices.addMembers(memberInfo).subscribe(
            (data) => {
              _this.lStorageService.setitemonLocalStorage('userId', data);
              resolve(data);
            }, (error) => {
              _this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
              resolve(false);
            }
          )
        });
    
    
      }

    // isNumeric(evt) {
    //     return this.shared_functions.isNumeric(evt);
    //   }
      isNumericSign(evt) {
        return this.shared_functions.isNumericSign(evt);
      }

    ngOnInit() {
        const _this = this;
        this.bookingForm = this.fb.group({
            newEmail: ['', Validators.pattern(new RegExp(projectConstantsLocal.VALIDATOR_MOBILE_AND_EMAIL))],
            newWhatsapp: new FormControl(undefined),
            newPhone: new FormControl(undefined)
        });
        this.server_date = this.lStorageService.getitemfromLocalStorage('sysdate');
        this.carouselOne = {
            dots: false,
            nav: true,
            navContainer: '.checkin-nav',
            navText: [
                '<i class="fa fa-angle-left" aria-hidden="true"></i>',
                '<i class="fa fa-angle-right" aria-hidden="true"></i>'
            ],
            autoplay: false,
            mouseDrag: false,
            touchDrag: true,
            pullDrag: false,
            loop: false,
            responsive: { 0: { items: 1 }, 700: { items: 2 }, 991: { items: 2 }, 1200: { items: 3 } }
        };
        const activeUser = this.groupService.getitemFromGroupStorage('ynw-user');
        this.api_loading1 = true;
        if (activeUser) {
            this.customer_data = activeUser;
        }
        this.maxsize = 1;
        this.step = 1;
        this.gets3curl();
        this.today = new Date(this.server_date.split(' ')[0]).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
        this.today = new Date(this.today);
        this.minDate = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate()).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
        this.minDate = new Date(this.minDate);
        const dd = this.today.getDate();
        const mm = this.today.getMonth() + 1; // January is 0!
        const yyyy = this.today.getFullYear();
        let cday = '';
        if (dd < 10) {
            cday = '0' + dd;
        } else {
            cday = '' + dd;
        }
        let cmon;
        if (mm < 10) {
            cmon = '0' + mm;
        } else {
            cmon = '' + mm;
        }
        const dtoday = yyyy + '-' + cmon + '-' + cday;
        this.todaydate = dtoday;
        this.maxDate = new Date((this.today.getFullYear() + 4), 12, 31);
        this.waitlist_for.push({ id: this.customer_data.id, firstName: this.customer_data.firstName, lastName: this.customer_data.lastName });
        this.minDate = this.todaydate;
        if (this.change_date === 'true') {
            const seldateChecker = new Date(this.sel_checkindate).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
            const seldate_checker = new Date(seldateChecker);
            const todaydateChecker = new Date(this.todaydate).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
            const todaydate_checker = new Date(todaydateChecker);
            if (seldate_checker.getTime() === todaydate_checker.getTime()) { // if the next available date is today itself, then add 1 day to the date and use it
                const server = this.server_date.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
                const serverdate = moment(server).format();
                const servdate = new Date(serverdate);
                const nextdate = new Date(seldate_checker.setDate(servdate.getDate() + 1));
                this.sel_checkindate = this.selectedDate = nextdate.getFullYear() + '-' + (nextdate.getMonth() + 1) + '-' + nextdate.getDate();
            }
        }
        const day = new Date(this.sel_checkindate).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
        const ddd = new Date(day);
        this.ddate = new Date(ddd.getFullYear() + '-' + this.dateTimeProcessor.addZero(ddd.getMonth() + 1) + '-' + this.dateTimeProcessor.addZero(ddd.getDate()));
        this.hold_sel_checkindate = this.sel_checkindate;
        this.getProfile().then(
            () => {
                _this.getFamilyMembers();
                _this.getServicebyLocationId(_this.sel_loc, _this.sel_checkindate);
                const dt1 = new Date(_this.sel_checkindate).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
                const date1 = new Date(dt1);
                const dt2 = new Date(_this.todaydate).toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
                const date2 = new Date(dt2);
                if (date1.getTime() !== date2.getTime()) { // this is to decide whether future date selection is to be displayed. This is displayed if the sel_checkindate is a future date
                    _this.isFuturedate = true;
                }
                _this.getQueuesbyLocationandServiceIdavailability(_this.sel_loc, _this.selectedService, _this.account_id);

            }
        );
    }
    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }
    getRescheduleWaitlistDet() {
        this.subs.sink = this.shared_services.getCheckinByConsumerUUID(this.rescheduleUserId, this.account_id).subscribe(
            (waitlst: any) => {
                this.waitlist = waitlst;
                if (this.type === 'waitlistreschedule') {
                    this.waitlist_for.push({ id: this.waitlist.waitlistingFor[0].id, firstName: this.waitlist.waitlistingFor[0].firstName, lastName: this.waitlist.waitlistingFor[0].lastName, phoneNo: this.waitlist.phoneNumber });
                    this.wtlst_for_fname = this.waitlist.waitlistingFor[0].firstName;
                    this.wtlst_for_lname = this.waitlist.waitlistingFor[0].lastName;
                    this.userPhone = this.waitlist.waitlistPhoneNumber;
                    this.countryCode = this.waitlist.countryCode;
                    this.consumerNote = this.waitlist.consumerNote;
                }
                this.checkin_date = this.waitlist.date;
                if (this.checkin_date !== this.todaydate) {
                    this.isFuturedate = true;
                }
                this.sel_loc = this.waitlist.queue.location.id;
                this.selectedService = this.waitlist.service.id;
                this.sel_checkindate = this.selectedDate = this.hold_sel_checkindate = this.waitlist.date;
                this.sel_ser = this.waitlist.service.id;
                this.getServicebyLocationId(this.sel_loc, this.sel_checkindate);
                this.getQueuesbyLocationandServiceIdavailability(this.sel_loc, this.selectedService, this.account_id);
            });
    }
    rescheduleWaitlist() {
        const post_Data = {
            'ynwUuid': this.rescheduleUserId,
            'date': this.selectedDate,
            'queue': this.queueId,
            'consumerNote': this.consumerNote
        };
        this.subs.sink = this.shared_services.rescheduleConsumerWaitlist(this.account_id, post_Data)
            .subscribe(
                () => {
                    if (this.selectedMessage.files.length > 0) {
                        const uid = [];
                        uid.push(this.rescheduleUserId);
                        this.consumerNoteAndFileSave(uid);
                    }
                    setTimeout(() => {
                        let queryParams = {
                            account_id: this.account_id,
                            uuid: this.rescheduleUserId,
                            type: 'waitlistreschedule',
                            theme: this.theme
                        }
                        if (this.businessId) {
                            queryParams['customId'] = this.customId;
                        }
                        let navigationExtras: NavigationExtras = {
                            queryParams: queryParams
                        };
                        this.router.navigate(['consumer', 'checkin', 'confirm'], navigationExtras);
                    }, 500);
                },
                error => {
                    this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                });
    }
    getWaitlistMgr() {
        const _this = this;
        return new Promise<void>(function (resolve, reject) {
            _this.subs.sink = _this.provider_services.getWaitlistMgr()
                .subscribe(
                    data => {
                        _this.settingsjson = data;
                        resolve();
                    },
                    () => {
                        reject();
                    }
                );
        });
    }
    getBussinessProfileApi() {
        const _this = this;
        return new Promise(function (resolve, reject) {
            _this.subs.sink = _this.provider_services.getBussinessProfile()
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

    getFamilyMembers() {
        this.api_loading1 = true;
        let fn;
        let self_obj;
        fn = this.shared_services.getConsumerFamilyMembers();
        self_obj = {
            'userProfile': {
                'id': this.customer_data.id,
                'firstName': this.customer_data.firstName,
                'lastName': this.customer_data.lastName
            }
        };
        this.subs.sink = fn.subscribe(data => {
            this.familymembers = [];
            console.log(this.familymembers);
            this.familymembers.push(self_obj);
            for (const mem of data) {
                if (mem.userProfile.id !== self_obj.userProfile.id) {
                    this.familymembers.push(mem);
                }
            }
            this.api_loading1 = false;

        },
            () => {
                this.api_loading1 = false;
            });
    }
    resetApiErrors() {
        this.emailerror = null;
    }
    setServiceDetails(curservid) {
        let serv;
        for (let i = 0; i < this.servicesjson.length; i++) {
            if (this.servicesjson[i].id === curservid) {
                serv = this.servicesjson[i];
                if (serv.virtualCallingModes) {
                    if (serv.virtualCallingModes[0].callingMode === 'WhatsApp' || serv.virtualCallingModes[0].callingMode === 'Phone') {
                        if (this.type === 'waitlistreschedule') {
                            this.callingModes = this.waitlist.virtualService['WhatsApp'];
                            const phNumber = this.waitlist.countryCode + this.waitlist.waitlistPhoneNumber;
                            const callMode = '+' + serv.virtualCallingModes[0].value;
                            if (callMode === phNumber) {
                                this.changePhno = false;
                            } else {
                                this.changePhno = true;
                                this.currentPhone = this.waitlist.waitlistPhoneNumber;
                            }
                        } else {
                            const unChangedPhnoCountryCode = this.countryCode.split('+')[1];
                            this.callingModes = unChangedPhnoCountryCode + '' + this.customer_data.primaryPhoneNumber;
                            if (serv.serviceType === 'virtualService' && this.virtualInfo) {
                                if (this.virtualInfo.countryCode_whtsap && this.virtualInfo.whatsappnumber !== '' && this.virtualInfo.countryCode_whtsap !== undefined && this.virtualInfo.whatsappnumber !== undefined) {
                                    const whtsappcountryCode = this.virtualInfo.countryCode_whtsap.split('+')[1];
                                    this.callingModes = whtsappcountryCode + '' + this.virtualInfo.whatsappnumber;
                                    console.log(this.callingModes);
                                }
                            }
                        }
                    }
                }
                break;
            }
        }
        this.sel_ser_det = [];
        this.selectedUser = null;
        this.selected_dept = null;
        this.selectedUserParam = null;
        this.selectedDeptParam = null;
        if (serv.provider) {
            this.selectedUserParam = serv.provider.id;
            this.setUserDetails(this.selectedUserParam);
        }
        if (this.filterDepart) {
            this.selectedDeptParam = serv.department;
            this.getDepartmentById(this.selectedDeptParam);
        }
        this.sel_ser_det = {
            name: serv.name,
            duration: serv.serviceDuration,
            description: serv.description,
            price: serv.totalAmount,
            isPrePayment: serv.isPrePayment,
            minPrePaymentAmount: serv.minPrePaymentAmount,
            status: serv.status,
            taxable: serv.taxable,
            serviceType: serv.serviceType,
            virtualServiceType: serv.virtualServiceType,
            virtualCallingModes: serv.virtualCallingModes,
            livetrack: serv.livetrack,
            postInfoEnabled: serv.postInfoEnabled,
            postInfoText: serv.postInfoText,
            postInfoTitle: serv.postInfoTitle,
            preInfoEnabled: serv.preInfoEnabled,
            preInfoTitle: serv.preInfoTitle,
            preInfoText: serv.preInfoText,
            consumerNoteMandatory: serv.consumerNoteMandatory,
            consumerNoteTitle: serv.consumerNoteTitle
        };
        if (serv.provider) {
            this.sel_ser_det.provider = serv.provider;
        }
        this.prepaymentAmount = this.waitlist_for.length * this.sel_ser_det.minPrePaymentAmount || 0;
        this.serviceCost = this.sel_ser_det.price;
    }
    getQueuesbyLocationandServiceIdavailability(locid, servid, accountid) {
        const _this = this;
        if (locid && servid && accountid) {
            _this.subs.sink = _this.shared_services.getQueuesbyLocationandServiceIdAvailableDates(locid, servid, accountid)
                .subscribe((data: any) => {
                    const availables = data.filter(obj => obj.isAvailable);
                    const availDates = availables.map(function (a) { return a.date; });
                    _this.availableDates = availDates.filter(function (elem, index, self) {
                        return index === self.indexOf(elem);
                    });
                });
        }
    }
    dateClass(date: Date): MatCalendarCellCssClasses {
        return (this.availableDates.indexOf(moment(date).format('YYYY-MM-DD')) !== -1) ? 'example-custom-date-class' : '';
    }
    getQueuesbyLocationandServiceId(locid, servid, pdate, accountid, type?) {
        this.queueQryExecuted = false;
        if (locid && servid) {
            this.subs.sink = this.shared_services.getQueuesbyLocationandServiceId(locid, servid, pdate, accountid)
                .subscribe(data => {
                    this.queuejson = data;
                    this.queueQryExecuted = true;
                    if (this.queuejson.length > 0) {
                        let selindx = 0;
                        for (let i = 0; i < this.queuejson.length; i++) {
                            if (this.queuejson[i]['queueWaitingTime'] !== undefined) {
                                selindx = i;
                            }
                        }
                        this.sel_queue_id = this.queuejson[selindx].id;
                        this.sel_queue_indx = selindx;
                        this.sel_queue_waitingmins = this.dateTimeProcessor.providerConvertMinutesToHourMinute(this.queuejson[selindx].queueWaitingTime);
                        this.sel_queue_servicetime = this.queuejson[selindx].serviceTime || '';
                        this.sel_queue_name = this.queuejson[selindx].name;
                        this.sel_queue_timecaption = this.queuejson[selindx].queueSchedule.timeSlots[0]['sTime'] + ' - ' + this.queuejson[selindx].queueSchedule.timeSlots[0]['eTime'];
                        this.sel_queue_personaahead = this.queuejson[this.sel_queue_indx].queueSize;
                        this.calc_mode = this.queuejson[this.sel_queue_indx].calculationMode;
                        if (this.calc_mode === 'Fixed' && this.queuejson[this.sel_queue_indx].timeInterval && this.queuejson[this.sel_queue_indx].timeInterval !== 0) {
                            this.getAvailableTimeSlots(this.queuejson[this.sel_queue_indx].queueSchedule.timeSlots[0]['sTime'], this.queuejson[this.sel_queue_indx].queueSchedule.timeSlots[0]['eTime'], this.queuejson[this.sel_queue_indx].timeInterval);
                        }
                    } else {
                        this.sel_queue_indx = -1;
                        this.sel_queue_id = 0;
                        this.sel_queue_waitingmins = 0;
                        this.sel_queue_servicetime = '';
                        this.sel_queue_name = '';
                        this.sel_queue_timecaption = '';
                        this.sel_queue_personaahead = 0;
                    }
                    if (type) {
                        this.selectedQTime = this.queuejson[this.sel_queue_indx].queueSchedule.timeSlots[0]['sTime'] + ' - ' + this.queuejson[this.sel_queue_indx].queueSchedule.timeSlots[0]['eTime'];
                        this.personsAhead = this.sel_queue_personaahead;
                        this.waitingTime = this.sel_queue_waitingmins;
                        this.serviceTime = this.sel_queue_servicetime;
                        this.queueId = this.sel_queue_id;
                    }
                });
        }
    }
    handleServiceSel(obj) {
        this.callingModes = [];
        this.sel_ser = obj;
        this.setServiceDetails(obj);
        this.queuejson = [];
        this.sel_queue_id = 0;
        this.sel_queue_waitingmins = 0;
        this.sel_queue_servicetime = '';
        this.sel_queue_personaahead = 0;
        this.sel_queue_name = '';
        this.getQueuesbyLocationandServiceIdavailability(this.sel_loc, this.sel_ser, this.account_id);
        this.getQueuesbyLocationandServiceId(this.sel_loc, this.sel_ser, this.sel_checkindate, this.account_id);
        this.action = '';
    }
    handleQueueSelection(queue, index) {
        this.sel_queue_indx = index;
        this.sel_queue_id = queue.id;
        this.sel_queue_waitingmins = this.dateTimeProcessor.convertMinutesToHourMinute(queue.queueWaitingTime);
        this.sel_queue_servicetime = queue.serviceTime || '';
        this.sel_queue_name = queue.name;
        this.sel_queue_timecaption = queue.queueSchedule.timeSlots[0]['sTime'] + ' - ' + queue.queueSchedule.timeSlots[0]['eTime'];
        this.sel_queue_personaahead = queue.queueSize;
        if (this.calc_mode === 'Fixed' && queue.timeInterval && queue.timeInterval !== 0) {
            this.getAvailableTimeSlots(queue.queueSchedule.timeSlots[0]['sTime'], queue.queueSchedule.timeSlots[0]['eTime'], queue.timeInterval);
        }
    }
    handleConsumerNote(vale) {
        this.consumerNote = vale;
    }
    handleFutureDateChange(e) {
        const tdate = e.targetElement.value;
        const newdate = tdate.split('/').reverse().join('-');
        const futrDte = new Date(newdate);
        const obtmonth = (futrDte.getMonth() + 1);
        let cmonth = '' + obtmonth;
        if (obtmonth < 10) {
            cmonth = '0' + obtmonth;
        }
        const seldate = futrDte.getFullYear() + '-' + cmonth + '-' + futrDte.getDate();
        this.sel_checkindate = seldate;
        this.getQueuesbyLocationandServiceId(this.sel_loc, this.sel_ser, this.sel_checkindate, this.account_id);
    }
    checkFutureorToday() {
        const dt0 = this.todaydate.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
        const dt2 = moment(dt0, 'YYYY-MM-DD HH:mm').format();
        const date2 = new Date(dt2);
        const dte0 = this.selectedDate.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
        const dte2 = moment(dte0, 'YYYY-MM-DD HH:mm').format();
        const datee2 = new Date(dte2);
        if (datee2.getTime() !== date2.getTime()) { // this is to decide whether future date selection is to be displayed. This is displayed if the sel_checkindate is a future date
            this.isFuturedate = true;
        } else {
            this.isFuturedate = false;
        }
    }
    handleCheckinClicked() {
        let error = '';
        if (this.step === 1) {
            if (this.partySizeRequired) {
                error = this.validatorPartysize(this.enterd_partySize);
            }
            if (error === '') {
                this.saveCheckin();
            } else {
                this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            }
        }
    }
    confirmcheckin(type?) {
        if (type === 'checkin' && this.sel_ser_det.isPrePayment && this.payEmail === '') {
            this.paymentBtnDisabled = true;
            const emaildialogRef = this.dialog.open(ConsumerEmailComponent, {
                width: '40%',
                panelClass: ['loginmainclass', 'popup-class'],


            });
            emaildialogRef.afterClosed().subscribe(result => {
                if (result !== '' && result !== undefined) {
                    this.payEmail = result;
                    this.confirmcheckin(type);
                } else {
                    this.paymentBtnDisabled = false;
                }

            });

        } else {
            if (this.waitlist_for.length !== 0) {
                for (const list of this.waitlist_for) {
                    if (list.id === this.customer_data.id) {
                        list['id'] = 0;
                    }
                }
            }
            this.virtualServiceArray = {};
            if (this.callingModes !== '') {
                this.is_wtsap_empty = false;
                if (this.sel_ser_det.serviceType === 'virtualService') {
                    if (this.sel_ser_det.virtualCallingModes[0].callingMode === 'GoogleMeet' || this.sel_ser_det.virtualCallingModes[0].callingMode === 'Zoom') {
                        this.virtualServiceArray[this.sel_ser_det.virtualCallingModes[0].callingMode] = this.sel_ser_det.virtualCallingModes[0].value;
                    } else {
                        console.log(this.callingModes);
                        this.virtualServiceArray[this.sel_ser_det.virtualCallingModes[0].callingMode] = this.callingModes;
                    }
                }
            } else if (this.callingModes === '' || this.callingModes.length < 10) {
                if (this.sel_ser_det.serviceType === 'virtualService') {
                    for (const i in this.sel_ser_det.virtualCallingModes) {
                        if (this.sel_ser_det.virtualCallingModes[i].callingMode === 'WhatsApp' || this.sel_ser_det.virtualCallingModes[i].callingMode === 'Phone') {
                            this.snackbarService.openSnackBar('Please enter valid mobile number', { 'panelClass': 'snackbarerror' });
                            this.is_wtsap_empty = true;
                            break;
                        }
                    }
                }
            }
            let phNumber;
            if (this.currentPhone && this.changePhno) {
                phNumber = this.currentPhone;
            } else {
                phNumber = this.userPhone;
            }
            let post_Data = {
                'queue': {
                    'id': this.queueId
                },
                'date': this.selectedDate,
                'service': {
                    'id': this.sel_ser,
                    'serviceType': this.sel_ser_det.serviceType
                },
                'consumerNote': this.consumerNote,
                'countryCode': this.countryCode,
                'coupons': this.selected_coupons
            };
            if (this.sel_ser_det.serviceType === 'virtualService') {
                for (const i in this.virtualServiceArray) {
                    if (i === 'WhatsApp') {
                        post_Data['virtualService'] = this.virtualServiceArray;
                    } else if (i === 'GoogleMeet') {
                        post_Data['virtualService'] = this.virtualServiceArray;
                    } else if (i === 'Zoom') {
                        post_Data['virtualService'] = this.virtualServiceArray;
                    } else if (i === 'Phone') {
                        post_Data['virtualService'] = this.virtualServiceArray;
                    } else if (i === 'VideoCall') {
                        post_Data['virtualService'] = { 'VideoCall': '' };
                    }
                }
                //     if(this.virtualInfo){
                //         console.log(this.virtualInfo);
                //     const momentDate = new Date(this.virtualInfo.dob); // Replace event.value with your date value
                //     const formattedDate = moment(momentDate).format("YYYY-MM-DD");
                //     console.log(formattedDate);
                //     this.waitlist_for[0]['dob']=formattedDate;
                //     if(this.virtualInfo.islanguage==='yes'){
                //         this.waitlist_for[0]['preferredLanguage']=['English'];
                //     }else{
                //         this.waitlist_for[0]['preferredLanguage']=[this.virtualInfo.preferredLanguage];
                //     }
                //     const bookingLocation={};
                //     bookingLocation['pincode']=this.virtualInfo.pincode;
                //     this.waitlist_for[0]['bookingLocation']=bookingLocation;
                //     if(this.virtualInfo.gender!==''){
                //         this.waitlist_for[0]['gender']=this.virtualInfo.gender;
                //     }

                // }
                if (this.virtualInfo) {
                    // console.log(this.virtualInfo);
                    // const momentDate = new Date(this.virtualInfo.dob); // Replace event.value with your date value
                    // const formattedDate = moment(momentDate).format("YYYY-MM-DD");
                    // console.log(formattedDate);
                    // this.waitlist_for[0]['dob'] = formattedDate;
                    this.waitlist_for[0]['whatsAppNum'] = {
                        'countryCode': this.virtualInfo.countryCode_whtsap,
                        'number': this.virtualInfo.whatsappnumber
                    }
                    this.waitlist_for[0]['telegramNum'] = {
                        'countryCode': this.virtualInfo.countryCode_telegram,
                        'number': this.virtualInfo.telegramnumber
                    }
                    this.waitlist_for[0]['age'] = this.virtualInfo.age;
                    if (this.virtualInfo.islanguage === 'yes') {
                        let langs = [];
                        langs.push('English');
                        this.waitlist_for[0]['preferredLanguage'] = langs;
                    } else {
                        let langs = [];
                        langs = this.virtualInfo.preferredLanguage;
                        this.waitlist_for[0]['preferredLanguage'] = langs;
                    }
                    const bookingLocation = {};
                    bookingLocation['pincode'] = this.virtualInfo.pincode;
                    if (this.virtualInfo.pincode === '') {
                        bookingLocation['district'] = this.virtualInfo.localarea;
                        bookingLocation['state'] = this.virtualInfo.state;
                    }

                    this.waitlist_for[0]['bookingLocation'] = bookingLocation;
                    if (this.virtualInfo.gender !== '') {
                        this.waitlist_for[0]['gender'] = this.virtualInfo.gender;

                    }

                }
            }
            if (this.payEmail !== '') {
                this.waitlist_for[0]['email'] = this.payEmail;
            }

            post_Data['waitlistingFor'] = JSON.parse(JSON.stringify(this.waitlist_for));
            if (this.apptTime) {
                post_Data['appointmentTime'] = this.apptTime;
            }
            if (this.selectedUser && this.selectedUser.firstName !== Messages.NOUSERCAP) {
                post_Data['provider'] = { 'id': this.selectedUser.id };
            }
            if (this.partySizeRequired) {
                this.holdenterd_partySize = this.enterd_partySize;
                post_Data['partySize'] = Number(this.holdenterd_partySize);
            }
            post_Data['waitlistPhoneNumber'] = phNumber;
            post_Data['consumer'] = { id: this.customer_data.id };
            if (this.jcashamount > 0 && this.checkJcash) {
                post_Data['useCredit'] = this.checkJcredit
                post_Data['useJcash'] = this.checkJcash
            }
            if (!this.is_wtsap_empty) {
                if (type === 'checkin') {
                    if (this.jcashamount > 0 && this.checkJcash) {
                        this.shared_services.getRemainingPrepaymentAmount(this.checkJcash, this.checkJcredit, this.paymentDetails.amountRequiredNow)
                            .subscribe(data => {
                                this.remainingadvanceamount = data;
                                this.addCheckInConsumer(post_Data);
                            });
                    }
                    else {
                        this.disablebutton = true;
                        this.addCheckInConsumer(post_Data);
                    }
                } else if (this.sel_ser_det.isPrePayment) {
                    this.addWaitlistAdvancePayment(post_Data);
                }
            }
        }
    }
    confirmVirtualServiceinfo(memberObject, type?) {
        const virtualdialogRef = this.dialog.open(VirtualFieldsComponent, {
            width: '40%',
            panelClass: ['loginmainclass', 'popup-class'],
            disableClose: true,
            data: memberObject[0]

        });
        virtualdialogRef.afterClosed().subscribe(result => {

            if (result !== '') {
                this.virtualInfo = result;
                this.confirmcheckin(type);

            } else {
                this.goToStep('prev');
            }

        });
    }
    saveCheckin(type?) {
        console.log('insaide');
        if (this.sel_ser_det.serviceType === 'virtualService' && type === 'next') {
            if (this.waitlist_for.length !== 0) {
                for (const list of this.waitlist_for) {
                    console.log(list['id']);
                    console.log(this.familymembers);
                    const memberObject = this.familymembers.filter(member => member.userProfile.id === list['id']);
                    console.log(memberObject);
                    if (list['id'] !== this.customer_data.id) {
                        // this.confirmVirtualServiceinfo(memberObject, type);
                        this.confirmcheckin(type);
                    } else {
                        this.confirmcheckin(type);
                    }
                }
            }
        } else {
            this.confirmcheckin(type);
        }

    }
    virtualModal() {
        const virtualdialogRef = this.dialog.open(VirtualFieldsComponent, {
            width: '40%',
            panelClass: ['loginmainclass', 'popup-class', this.theme],
            disableClose: true,
            data: { 'id': this.virtualInfo.serviceFor, theme: this.theme }

        });
        virtualdialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.virtualInfo = result;
                this.setVirtualTeleserviceCustomer();
            }


        });

    }
    addCheckInConsumer(postData) {
        this.subs.sink = this.shared_services.addCheckin(this.account_id, postData)
            .subscribe(data => {
                this.lStorageService.removeitemfromLocalStorage('age');
                this.lStorageService.removeitemfromLocalStorage('userId');
                const retData = data;
                this.uuidList = [];
                let parentUid;
                Object.keys(retData).forEach(key => {
                    if (key === '_prepaymentAmount') {
                        this.prepayAmount = retData['_prepaymentAmount'];
                    } else {
                        this.trackUuid = retData[key];
                        if (key !== 'parent_uuid') {
                            this.uuidList.push(retData[key]);
                        }
                    }
                    parentUid = retData['parent_uuid'];
                });
                if (this.selectedMessage.files.length > 0) {
                    this.consumerNoteAndFileSave(this.uuidList, parentUid);
                }
                if (this.questionnaireList.labels && this.questionnaireList.labels.length > 0) {
                    this.submitQuestionnaire(parentUid);
                } else {
                    if (this.paymentDetails && this.paymentDetails.amountRequiredNow > 0) {
                        this.payuPayment();
                    } else {
                        this.paymentOperation();
                    }
                }

                const member = [];
                for (const memb of this.waitlist_for) {
                    member.push(memb.firstName + ' ' + memb.lastName);
                }
            },
                error => {
                    this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                    this.disablebutton = false;
                    this.paytmGateway = false;
                    this.razorpayGatway = false;
                });
    }
    submitQuestionnaire(uuid) {
        const dataToSend: FormData = new FormData();
        if (this.questionAnswers.files) {
            for (const pic of this.questionAnswers.files) {
                dataToSend.append('files', pic, pic['name']);
            }
        }
        const blobpost_Data = new Blob([JSON.stringify(this.questionAnswers.answers)], { type: 'application/json' });
        dataToSend.append('question', blobpost_Data);
        this.subs.sink = this.shared_services.submitConsumerWaitlistQuestionnaire(dataToSend, uuid, this.account_id).subscribe((data: any) => {
            let postData = {
                urls: []
            };
            if (data.urls && data.urls.length > 0) {
                for (const url of data.urls) {
                    const file = this.questionAnswers.filestoUpload[url.labelName][url.document];
                    this.provider_services.videoaudioS3Upload(file, url.url)
                        .subscribe(() => {
                            postData['urls'].push({ uid: url.uid, labelName: url.labelName });
                            if (data.urls.length === postData['urls'].length) {
                                this.shared_services.consumerWaitlistQnrUploadStatusUpdate(uuid, this.account_id, postData)
                                    .subscribe((data) => {
                                        this.paymentOperation();
                                    },
                                        error => {
                                            this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                                            this.disablebutton = false;
                                        });
                            }
                        },
                            error => {
                                this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                                this.disablebutton = false;
                            });
                }
            } else {
                this.paymentOperation();
            }
        },
            error => {
                this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                this.disablebutton = false;
            });
    }
    paymentOperation() {
        if (this.paymentDetails && this.paymentDetails.amountRequiredNow > 0) {
            this.payuPayment();
        } else {
            let multiple;
            if (this.uuidList.length > 1) {
                multiple = true;
            } else {
                multiple = false;
            }
            let queryParams = {
                account_id: this.account_id,
                uuid: this.uuidList,
                multiple: multiple,
                theme: this.theme
            }
            if (this.businessId) {
                queryParams['customId'] = this.customId;
            }
            let navigationExtras: NavigationExtras = {
                queryParams: queryParams
            };
            this.router.navigate(['consumer', 'checkin', 'confirm'], navigationExtras);
        }
    }
    showCheckinButtonCaption() {
        let caption = '';
        if (this.settingsjson.showTokenId) {
            caption = 'Token';
        } else {
            caption = 'Check-in';
        }
        return caption;
    }
    handleOneMemberSelect(id, firstName, lastName, email) {

        this.waitlist_for = [];
        this.newEmail = this.payEmail = '';
        this.waitlist_for.push({ id: id, firstName: firstName, lastName: lastName });
        if (email && email.trim() !== '') {
            this.payEmail = this.waitlist_for[0]['email'] = this.newEmail = email;

        } else if (this.userData.userProfile.email.trim() !== '') {
            this.waitlist_for[0]['email'] = this.newEmail = this.payEmail = this.userData.userProfile.email;

        } else {
            this.waitlist_for[0]['email'] = this.newEmail = this.payEmail = '';
        }
        // this.getConsumerQuestionnaire();
    }
    handleMemberSelect(id, firstName, lastName, obj) {
        if (this.payEmail !== '' && this.waitlist_for[0]) {
            this.waitlist_for[0]['email'] = this.payEmail;
        }
        if (this.waitlist_for.length === 0) {
            this.waitlist_for.push({ id: id, firstName: firstName, lastName: lastName });
        } else {
            let exists = false;
            let existindx = -1;
            for (let i = 0; i < this.waitlist_for.length; i++) {
                if (this.waitlist_for[i].id === id) {
                    exists = true;
                    existindx = i;
                }
            }
            if (exists) {
                this.waitlist_for.splice(existindx, 1);
            } else {
                if (this.ismoreMembersAllowedtopush()) {
                    this.waitlist_for.push({ id: id, lastName: lastName, firstName: firstName });
                } else {
                    obj.source.checked = false; // preventing the current checkbox from being checked
                    if (this.maxsize > 1) {
                        this.snackbarService.openSnackBar('Only ' + this.maxsize + ' member(s) can be selected', { 'panelClass': 'snackbarerror' });
                    } else if (this.maxsize === 1) {
                        this.snackbarService.openSnackBar('Only ' + this.maxsize + ' member can be selected', { 'panelClass': 'snackbarerror' });
                    }
                }
            }
        }
        if (this.sel_ser_det && this.sel_ser_det.minPrePaymentAmount) {
            this.prepaymentAmount = this.waitlist_for.length * this.sel_ser_det.minPrePaymentAmount || 0;
        }
        this.serviceCost = this.waitlist_for.length * this.sel_ser_det.price;
        // this.getConsumerQuestionnaire();
    }
    ismoreMembersAllowedtopush() {
        if (this.maxsize > this.waitlist_for.length) {
            return true;
        } else {
            return false;
        }
    }
    isChecked(id) {
        let retval = false;
        if (this.waitlist_for.length > 0) {
            for (let i = 0; i < this.waitlist_for.length; i++) {
                if (this.waitlist_for[i].id == 0) {
                    this.waitlist_for[i].id = this.customer_data.id;
                }
                if (this.waitlist_for[i].id === id) {
                    retval = true;
                }
            }
        }
        return retval;
    }
    addMember() {
        this.action = 'addmember';
        this.disable = false;
    }
    handleReturnDetails(obj) {
        this.addmemberobj.fname = obj.fname || '';
        this.addmemberobj.lname = obj.lname || '';
        this.addmemberobj.mobile = obj.mobile || '';
        this.addmemberobj.gender = obj.gender || '';
        this.addmemberobj.dob = obj.dob || '';
        this.disable = false;
    }
    handleSaveMember() {
        this.disable = true;
        let derror = '';
        const namepattern = new RegExp(projectConstantsLocal.VALIDATOR_CHARONLY);
        const phonepattern = new RegExp(projectConstantsLocal.VALIDATOR_NUMBERONLY);
        const phonecntpattern = new RegExp(projectConstantsLocal.VALIDATOR_PHONENUMBERCOUNT10);
        const blankpattern = new RegExp(projectConstantsLocal.VALIDATOR_BLANK);
        if (!namepattern.test(this.addmemberobj.fname) || blankpattern.test(this.addmemberobj.fname)) {
            derror = 'Please enter a valid first name';
        }
        if (derror === '' && (!namepattern.test(this.addmemberobj.lname) || blankpattern.test(this.addmemberobj.lname))) {
            derror = 'Please enter a valid last name';
        }
        if (derror === '') {
            if (this.addmemberobj.mobile !== '') {
                if (!phonepattern.test(this.addmemberobj.mobile)) {
                    derror = 'Phone number should have only numbers';
                } else if (!phonecntpattern.test(this.addmemberobj.mobile)) {
                    derror = 'Enter a 10 digit mobile number';
                }
            }
        }
        if (derror === '') {
            const post_data = {
                'userProfile': {
                    'firstName': this.addmemberobj.fname.trim(),
                    'lastName': this.addmemberobj.lname.trim()
                }
            };
            if (this.addmemberobj.mobile !== '') {
                post_data.userProfile['primaryMobileNo'] = this.addmemberobj.mobile;
                post_data.userProfile['countryCode'] = '+91';
            }
            if (this.addmemberobj.gender !== '') {
                post_data.userProfile['gender'] = this.addmemberobj.gender;
            }
            if (this.addmemberobj.dob !== '') {
                post_data.userProfile['dob'] = this.addmemberobj.dob;
            }
            let fn;
            post_data['parent'] = this.customer_data.id;
            fn = this.shared_services.addMembers(post_data);
            this.subs.sink = fn.subscribe(() => {
                this.apiSuccess = this.wordProcessor.getProjectMesssages('MEMBER_CREATED');
                // this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('MEMBER_CREATED'), { 'panelclass': 'snackbarerror' });
                this.getFamilyMembers();
                setTimeout(() => {
                    this.goBack();
                }, projectConstants.TIMEOUT_DELAY);
            },
                error => {
                    this.apiError = this.wordProcessor.getProjectErrorMesssages(error);
                    // this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                    this.disable = false;
                });
        } else {
            this.apiError = derror;
            // this.snackbarService.openSnackBar(derror, { 'panelClass': 'snackbarerror' });
        }
        setTimeout(() => {
            this.apiError = '';
            this.apiSuccess = '';
        }, 2000);
    }
    setVirtualTeleserviceCustomer() {
        console.log(this.virtualInfo);
        if (this.virtualInfo && this.virtualInfo.email && this.virtualInfo.email !== '') {
            // this.payEmail = this.virtualInfo.email;
            this.newEmail = this.payEmail = this.virtualInfo.email;
        }
        if (this.virtualInfo && this.virtualInfo.newMemberId) {
            this.waitlist_for = [];
            this.newMember = this.virtualInfo.newMemberId;
            this.virtualInfo.serviceFor = this.virtualInfo.newMemberId;
            const current_member = this.familymembers.filter(member => member.userProfile.id === this.newMember);
            this.waitlist_for.push({ id: this.newMember, firstName: current_member[0]['userProfile'].firstName, lastName: current_member[0]['userProfile'].lastName });
            if (this.virtualInfo.countryCode_whtsap && this.virtualInfo.whatsappnumber !== '' && this.virtualInfo.countryCode_whtsap !== undefined && this.virtualInfo.whatsappnumber !== undefined) {
                this.whatsappCountryCode = this.virtualInfo.countryCode_whtsap;
                console.log(this.whatsappCountryCode);
                this.newWhatsapp = this.virtualInfo.whatsappnumber
                if (this.virtualInfo.countryCode_whtsap.includes('+')) {
                    this.callingModes = this.virtualInfo.countryCode_whtsap.split('+')[1] + '' + this.virtualInfo.whatsappnumber;

                } else {
                    this.callingModes = this.virtualInfo.countryCode_whtsap + '' + this.virtualInfo.whatsappnumber;

                }
                this.currentPhone = this.virtualInfo.phoneno;
                this.userPhone = this.virtualInfo.phoneno;
                this.changePhno = true;
            }

        } if (this.virtualInfo && this.virtualInfo.serviceFor) {
            this.consumerType = 'member';
            this.waitlist_for = [];
            const current_member = this.familymembers.filter(member => member.userProfile.id === this.virtualInfo.serviceFor);
            console.log(current_member);
            this.waitlist_for.push({ id: this.virtualInfo.serviceFor, firstName: current_member[0]['userProfile'].firstName, lastName: current_member[0]['userProfile'].lastName });
            if (this.virtualInfo.countryCode_whtsap && this.virtualInfo.whatsappnumber !== '' && this.virtualInfo.countryCode_whtsap !== undefined && this.virtualInfo.whatsappnumber !== undefined) {
                this.whatsappCountryCode = this.virtualInfo.countryCode_whtsap;
                console.log(this.whatsappCountryCode);
                this.newWhatsapp = this.virtualInfo.whatsappnumber
                if (this.virtualInfo.countryCode_whtsap.includes('+')) {
                    this.callingModes = this.virtualInfo.countryCode_whtsap.split('+')[1] + '' + this.virtualInfo.whatsappnumber;
                } else {
                    this.callingModes = this.virtualInfo.countryCode_whtsap + ' ' + this.virtualInfo.whatsappnumber;

                }
                this.currentPhone = this.virtualInfo.phoneno;
                this.userPhone = this.virtualInfo.phoneno;
                this.changePhno = true;
            }

        }


    }
    calculateDate(days) {
        const dte = this.sel_checkindate.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
        const date = moment(dte, 'YYYY-MM-DD HH:mm').format();
        const newdate = new Date(date);
        newdate.setDate(newdate.getDate() + days);
        const dd = newdate.getDate();
        const mm = newdate.getMonth() + 1;
        const y = newdate.getFullYear();
        const ndate1 = y + '-' + mm + '-' + dd;
        const ndate = moment(ndate1, 'YYYY-MM-DD HH:mm').format();
        const strtDt1 = this.todaydate + ' 00:00:00';
        const strtDt = moment(strtDt1, 'YYYY-MM-DD HH:mm').toDate();
        const nDt = new Date(ndate);
        if (nDt.getTime() >= strtDt.getTime()) {
            this.sel_checkindate = ndate;
            this.getQueuesbyLocationandServiceId(this.sel_loc, this.sel_ser, this.sel_checkindate, this.account_id);
        }
        const day1 = this.sel_checkindate.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
        const day = moment(day1, 'YYYY-MM-DD HH:mm').format();
        const ddd = new Date(day);
        this.ddate = new Date(ddd.getFullYear() + '-' + this.dateTimeProcessor.addZero(ddd.getMonth() + 1) + '-' + this.dateTimeProcessor.addZero(ddd.getDate()));
    }
    disableMinus() {
        const seldate1 = this.sel_checkindate.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
        const seldate2 = moment(seldate1, 'YYYY-MM-DD HH:mm').format();
        const seldate = new Date(seldate2);
        const selecttdate = new Date(seldate.getFullYear() + '-' + this.dateTimeProcessor.addZero(seldate.getMonth() + 1) + '-' + this.dateTimeProcessor.addZero(seldate.getDate()));
        const strtDt1 = this.hold_sel_checkindate.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
        const strtDt2 = moment(strtDt1, 'YYYY-MM-DD HH:mm').format();
        const strtDt = new Date(strtDt2);
        const startdate = new Date(strtDt.getFullYear() + '-' + this.dateTimeProcessor.addZero(strtDt.getMonth() + 1) + '-' + this.dateTimeProcessor.addZero(strtDt.getDate()));
        if (startdate >= selecttdate) {
            return true;
        } else {
            return false;
        }
    }
    getPartysizeDetails(domain, subdomain) {
        this.subs.sink = this.shared_services.getPartysizeDetails(domain, subdomain)
            .subscribe(data => {
                this.partysizejson = data;
                this.partySize = false;
                this.maxsize = 1;
                if (this.partysizejson.partySize) {
                    this.partySize = true;
                    this.maxsize = (this.partysizejson.maxPartySize) ? this.partysizejson.maxPartySize : 1;
                }
                if (this.partySize && !this.partysizejson.partySizeForCalculation) { // check whether partysize box is to be displayed to the user
                    this.partySizeRequired = true;
                }
                if (this.partysizejson.partySizeForCalculation) { // check whether multiple members are allowed to be selected
                    this.multipleMembers_allowed = true;
                }
            },
                () => {
                });
    }
    validatorPartysize(pVal) {
        let errmsg = '';
        const numbervalidator = projectConstantsLocal.VALIDATOR_NUMBERONLY;
        this.enterd_partySize = pVal;
        if (!numbervalidator.test(pVal)) {
            errmsg = 'Please enter a valid party size';
        } else {
            if (pVal > this.maxsize) {
                errmsg = 'Sorry ... the maximum party size allowed is ' + this.maxsize;
            }
        }
        return errmsg;
    }
    setUserDetails(selectedUserId) {
        const userDetail = this.users.filter(user => user.id === selectedUserId);
        this.selectedUser = userDetail[0];
    }
    getDepartmentById(deptId) {
        for (let i = 0; i < this.departments.length; i++) {
            if (deptId === this.departments[i].departmentId) {
                this.selected_dept = this.departments[i];
                break;
            }
        }
    }
    getProviderDepart(id) {
        this.subs.sink = this.shared_services.getProviderDept(id).
            subscribe(data => {
                this.departmentlist = data;
                this.filterDepart = this.departmentlist.filterByDept;
                for (let i = 0; i < this.departmentlist['departments'].length; i++) {
                    if (this.departmentlist['departments'][i].departmentStatus !== 'INACTIVE') {
                        this.departments.push(this.departmentlist['departments'][i]);
                        if (this.selectedDeptParam && this.selectedDeptParam === this.departmentlist['departments'][i].departmentId) {
                            this.selected_dept = this.departmentlist['departments'][i];
                        }
                    }
                }
                if (!this.selectedDeptParam) {
                    this.selected_dept = this.departments[0];
                }
            });
    }
    getServicebyLocationId(locid, pdate) {
        const _this = this;
        _this.api_loading1 = true;
        _this.subs.sink = _this.shared_services.getServicesByLocationId(locid)
            .subscribe(data => {
                _this.servicesjson = data;
                _this.serviceslist = _this.servicesjson;
                _this.sel_ser_det = [];
                if (_this.selectedService) {
                    _this.sel_ser = _this.selectedService;
                } else {
                    if (_this.servicesjson.length > 0) {
                        _this.sel_ser = _this.servicesjson[0].id; // set the first service id to the holding variable
                    }
                }
                if (_this.sel_ser) {
                    _this.setServiceDetails(_this.sel_ser);
                    _this.getQueuesbyLocationandServiceId(locid, _this.sel_ser, pdate, _this.account_id, 'init');
                    if (_this.type != 'waitlistreschedule') {
                        _this.getConsumerQuestionnaire();
                    } else {
                        _this.questionnaireLoaded = true;
                        if (_this.sel_ser_det.serviceType === 'virtualService') {
                            _this.setVirtualTeleserviceCustomer();
                        }

                    }
                }
                _this.api_loading1 = false;
            },
                () => {
                    _this.api_loading1 = false;
                    _this.sel_ser = '';
                });
    }
    filesSelected(event, type?) {
        const input = event.target.files;
        if (input) {
            for (const file of input) {
                if (projectConstants.FILETYPES_UPLOAD.indexOf(file.type) === -1) {
                    this.snackbarService.openSnackBar('Selected image type not supported', { 'panelClass': 'snackbarerror' });
                    return;
                } else if (file.size > projectConstants.FILE_MAX_SIZE) {
                    this.snackbarService.openSnackBar('Please upload images with size < 10mb', { 'panelClass': 'snackbarerror' });
                    return;
                } else {
                    this.selectedMessage.files.push(file);
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        this.selectedMessage.base64.push(e.target['result']);
                    };
                    reader.readAsDataURL(file);
                    this.action = 'attachment';
                }
            }
            if (type && this.selectedMessage.files && this.selectedMessage.files.length > 0 && input.length > 0) {
                this.modal.nativeElement.click();
            }
        }
    }
    deleteTempImage(i) {
        this.selectedMessage.files.splice(i, 1);
        this.selectedMessage.base64.splice(i, 1);
        this.selectedMessage.caption.splice(i, 1);
        this.imgCaptions[i] = '';
    }
    consumerNoteAndFileSave(uuids, parentUid?) {
        const dataToSend: FormData = new FormData();
        const captions = {};
        let i = 0;
        if (this.selectedMessage) {
            for (const pic of this.selectedMessage.files) {
                dataToSend.append('attachments', pic, pic['name']);
                captions[i] = (this.imgCaptions[i]) ? this.imgCaptions[i] : '';
                i++;
            }
        }
        const blobPropdata = new Blob([JSON.stringify(captions)], { type: 'application/json' });
        dataToSend.append('captions', blobPropdata);
        let count = 0;
        for (const uuid of uuids) {
            this.subs.sink = this.shared_services.addConsumerWaitlistAttachment(this.account_id, uuid, dataToSend)
                .subscribe(
                    () => {
                        if (this.type !== 'waitlistreschedule') {
                            count++;
                            if (count === uuids.length) {
                                if (this.questionnaireList.labels && this.questionnaireList.labels.length > 0) {
                                    this.submitQuestionnaire(parentUid);
                                } else {
                                    this.paymentOperation();
                                }
                            }
                        }
                    },
                    error => {
                        this.wordProcessor.apiErrorAutoHide(this, error);
                        this.disablebutton = false;
                    }
                );
        }
    }
    getAvailableTimeSlots(QStartTime, QEndTime, interval) {
        const _this = this;
        const allSlots = _this.jaldeeTimeService.getTimeSlotsFromQTimings(interval, QStartTime, QEndTime);
        this.availableSlots = allSlots;
        const filter = {};
        const activeSlots = [];
        filter['queue-eq'] = _this.sel_queue_id;
        filter['location-eq'] = _this.sel_loc;
        let future = false;
        const waitlist_date = new Date(this.sel_checkindate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        waitlist_date.setHours(0, 0, 0, 0);
        if (today.valueOf() < waitlist_date.valueOf()) {
            future = true;
        }
        this.apptTime = '';
        if (!future) {
            _this.subs.sink = _this.provider_services.getTodayWaitlist(filter).subscribe(
                (waitlist: any) => {
                    for (let i = 0; i < waitlist.length; i++) {
                        if (waitlist[i]['appointmentTime']) {
                            activeSlots.push(waitlist[i]['appointmentTime']);
                        }
                    }
                    const slots = allSlots.filter(x => !activeSlots.includes(x));
                    this.availableSlots = slots;
                    this.apptTime = this.availableSlots[0];
                }
            );
        } else {
            filter['date-eq'] = _this.sel_checkindate;
            _this.subs.sink = _this.provider_services.getFutureWaitlist(filter).subscribe(
                (waitlist: any) => {
                    for (let i = 0; i < waitlist.length; i++) {
                        if (waitlist[i]['appointmentTime']) {
                            activeSlots.push(waitlist[i]['appointmentTime']);
                        }
                    }
                    const slots = allSlots.filter(x => !activeSlots.includes(x));
                    this.availableSlots = slots;
                    this.apptTime = this.availableSlots[0];
                }
            );
        }
    }
    getProfile() {
        const _this = this;
        return new Promise(function (resolve, reject) {
            _this.sharedFunctionobj.getProfile()
                .then(
                    data => {
                        _this.userData = data;
                        if (_this.type !== 'waitlistreschedule') {
                            _this.countryCode = _this.whatsappCountryCode = _this.userData.userProfile.countryCode;
                        }
                        if (_this.selectedCountryCode) {
                            if (_this.countryCode != _this.selectedCountryCode) {
                                _this.countryCode = _this.whatsappCountryCode = _this.selectedCountryCode;
                            }
                        } else {
                            _this.selectedCountryCode = _this.countryCode;
                        }
                        if (_this.userData.userProfile !== undefined) {
                            _this.userEmail = _this.userData.userProfile.email || '';
                            if (_this.type !== 'waitlistreschedule') {
                                _this.userPhone = _this.newPhone = _this.newWhatsapp = _this.userData.userProfile.primaryMobileNo || '';
                                _this.countryCode = _this.whatsappCountryCode = _this.userData.userProfile.countryCode || '';
                            }
                        }
                        if (_this.userData.userProfile.email) {
                            _this.waitlist_for[0]['email'] = _this.userData.userProfile.email;
                            _this.payEmail = _this.userData.userProfile.email;
                            _this.newEmail = _this.userData.userProfile.email;
                        }
                        if (_this.userEmail) {
                            _this.emailExist = true;
                        } else {
                            _this.emailExist = false;
                        }
                        resolve(true);
                    });
        });
    }


    gets3curl() {

        let accountS3List = 'settings,terminologies,coupon,providerCoupon,businessProfile,departmentProviders';
        this.subs.sink = this.s3Processor.getJsonsbyTypes(this.provider_id,
            null, accountS3List).subscribe(
                (accountS3s) => {
                    if (accountS3s['settings']) {
                        this.processS3s('settings', accountS3s['settings']);
                    }
                    if (accountS3s['terminologies']) {
                        this.processS3s('terminologies', accountS3s['terminologies']);
                    }
                    if (accountS3s['coupon']) {
                        this.processS3s('coupon', accountS3s['coupon']);
                    }
                    if (accountS3s['providerCoupon']) {
                        this.processS3s('providerCoupon', accountS3s['providerCoupon']);
                    }
                    if (accountS3s['departmentProviders']) {
                        this.processS3s('departmentProviders', accountS3s['departmentProviders']);
                    }
                    if (accountS3s['businessProfile']) {
                        this.processS3s('businessProfile', accountS3s['businessProfile']);
                    }
                }
            );
    }

    processS3s(type, res) {
        let result = this.s3Processor.getJson(res);
        switch (type) {
            case 'settings': {
                this.settingsjson = result;
                this.futuredate_allowed = (this.settingsjson.futureDateWaitlist === true) ? true : false;
                break;
            }
            case 'terminologies': {
                this.terminologiesjson = result;
                this.wordProcessor.setTerminologies(this.terminologiesjson);
                break;
            }
            case 'businessProfile': {
                this.businessjson = result;
                if (this.businessjson.uniqueId === 128007) {
                    this.heartfulnessAccount = true;
                }
                this.accountType = this.businessjson.accountType;
                if (this.accountType === 'BRANCH') {
                    // this.getbusinessprofiledetails_json('departmentProviders', true);
                    this.getProviderDepart(this.businessjson.id);
                }
                this.domain = this.businessjson.serviceSector.domain;
                if (this.domain === 'foodJoints') {
                    this.note_placeholder = 'Item No Item Name Item Quantity';
                    this.note_cap = 'Add Note / Delivery address';
                } else {
                    this.note_placeholder = '';
                    this.note_cap = 'Add Note';
                }
                this.getPartysizeDetails(this.businessjson.serviceSector.domain, this.businessjson.serviceSubSector.subDomain);
                break;
            }
            case 'coupon': {
                if (result != undefined) {
                    this.s3CouponsList.JC = result;
                } else {
                    this.s3CouponsList.JC = [];
                }

                if (this.s3CouponsList.JC.length > 0) {
                    this.showCouponWB = true;
                }
                break;
            }
            case 'providerCoupon': {
                if (result != undefined) {
                    this.s3CouponsList.OWN = result;
                } else {
                    this.s3CouponsList.OWN = [];
                }

                if (this.s3CouponsList.OWN.length > 0) {
                    this.showCouponWB = true;
                }
                break;
            }
            case 'departmentProviders': {
                let deptProviders: any = [];
                deptProviders = result;
                if (!this.filterDepart) {
                    this.users = deptProviders;
                } else {
                    deptProviders.forEach(depts => {
                        if (depts.users.length > 0) {
                            this.users = this.users.concat(depts.users);
                        }
                    });
                }
                if (this.selectedUserParam) {
                    this.setUserDetails(this.selectedUserParam);
                }
                break;
            }
        }
    }


    // gets3curl() {
    //     this.api_loading1 = true;
    //     this.retval = this.sharedFunctionobj.getS3Url()
    //         .then(
    //             res => {
    //                 this.s3url = res;
    //                 this.getbusinessprofiledetails_json('businessProfile', true);
    //                 this.getbusinessprofiledetails_json('settings', true);
    //                 this.getbusinessprofiledetails_json('coupon', true);
    //                 this.getbusinessprofiledetails_json('providerCoupon', true);
    //                 if (!this.terminologiesjson) {
    //                     this.getbusinessprofiledetails_json('terminologies', true);
    //                 } else {
    //                     if (this.terminologiesjson.length === 0) {
    //                         this.getbusinessprofiledetails_json('terminologies', true);
    //                     } else {
    //                         this.wordProcessor.setTerminologies(this.terminologiesjson);
    //                     }
    //                 }
    //                 this.api_loading1 = false;
    //             },
    //             () => {
    //                 this.api_loading1 = false;
    //             }
    //         );
    // }
    // gets the various json files based on the value of "section" parameter
    // getbusinessprofiledetails_json(section, modDateReq: boolean) {
    //     let UTCstring = null;
    //     if (modDateReq) {
    //         UTCstring = this.sharedFunctionobj.getCurrentUTCdatetimestring();
    //     }
    //     this.subs.sink = this.shared_services.getbusinessprofiledetails_json(this.provider_id, this.s3url, section, UTCstring)
    //         .subscribe(res => {
    //             switch (section) {
    //                 case 'settings':
    //                     this.settingsjson = res;
    //                     this.futuredate_allowed = (this.settingsjson.futureDateWaitlist === true) ? true : false;
    //                     break;
    //                 case 'terminologies':
    //                     this.terminologiesjson = res;
    //                     this.wordProcessor.setTerminologies(this.terminologiesjson);
    //                     break;
    //                 case 'businessProfile':
    //                     this.businessjson = res;
    //                     this.accountType = this.businessjson.accountType;
    //                     if (this.accountType === 'BRANCH') {
    //                         this.getbusinessprofiledetails_json('departmentProviders', true);
    //                         this.getProviderDepart(this.businessjson.id);
    //                     }
    //                     this.domain = this.businessjson.serviceSector.domain;
    //                     if (this.domain === 'foodJoints') {
    //                         this.note_placeholder = 'Item No Item Name Item Quantity';
    //                         this.note_cap = 'Add Note / Delivery address';
    //                     } else {
    //                         this.note_placeholder = '';
    //                         this.note_cap = 'Add Note';
    //                     }
    //                     this.getPartysizeDetails(this.businessjson.serviceSector.domain, this.businessjson.serviceSubSector.subDomain);
    //                     break;
    //                 case 'coupon':
    //                     if (res != undefined) {
    //                         this.s3CouponsList.JC = res;
    //                     } else {
    //                         this.s3CouponsList.JC = [];
    //                     }

    //                     if (this.s3CouponsList.JC.length > 0) {
    //                         this.showCouponWB = true;
    //                     }
    //                     break;
    //                 case 'providerCoupon':
    //                     if (res != undefined) {
    //                         this.s3CouponsList.OWN = res;
    //                     } else {
    //                         this.s3CouponsList.OWN = [];
    //                     }

    //                     if (this.s3CouponsList.OWN.length > 0) {
    //                         this.showCouponWB = true;
    //                     }
    //                     break
    //                 case 'departmentProviders': {
    //                     let deptProviders: any = [];
    //                     deptProviders = res;
    //                     if (!this.filterDepart) {
    //                         this.users = deptProviders;
    //                     } else {
    //                         deptProviders.forEach(depts => {
    //                             if (depts.users.length > 0) {
    //                                 this.users = this.users.concat(depts.users);
    //                             }
    //                         });
    //                     }
    //                     if (this.selectedUserParam) {
    //                         this.setUserDetails(this.selectedUserParam);
    //                     }
    //                     break;
    //                 }
    //             }
    //         },
    //             () => {
    //             }
    //         );
    // }
    handleSideScreen(action) {
        this.action = action;
        this.selected_phone = this.userPhone;
        this.newEmail = this.payEmail;
        // this.newPhone = this.newWhatsapp = this.selected_phone;
    }
    clearCouponErrors() {
        this.couponvalid = true;
        this.api_cp_error = null;
    }
    checkCouponExists(couponCode) {
        let found = false;
        for (let index = 0; index < this.selected_coupons.length; index++) {
            if (couponCode === this.selected_coupons[index]) {
                found = true;
                break;
            }
        }
        return found;
    }
    applyCoupons() {
        this.api_cp_error = null;
        this.couponvalid = true;
        const couponInfo = {
            'couponCode': '',
            'instructions': ''
        };
        if (this.selected_coupon) {
            const jaldeeCoupn = this.selected_coupon.trim();
            if (this.checkCouponExists(jaldeeCoupn)) {
                this.api_cp_error = 'Coupon already applied';
                this.couponvalid = false;
                return false;
            }
            this.couponvalid = false;
            let found = false;
            for (let couponIndex = 0; couponIndex < this.s3CouponsList.JC.length; couponIndex++) {
                if (this.s3CouponsList.JC[couponIndex].jaldeeCouponCode.trim() === jaldeeCoupn) {
                    this.selected_coupons.push(this.s3CouponsList.JC[couponIndex].jaldeeCouponCode);
                    couponInfo.couponCode = this.s3CouponsList.JC[couponIndex].jaldeeCouponCode;
                    couponInfo.instructions = this.s3CouponsList.JC[couponIndex].consumerTermsAndconditions;
                    this.couponsList.push(couponInfo);
                    found = true;
                    this.selected_coupon = '';
                    break;
                }
            }
            for (let couponIndex = 0; couponIndex < this.s3CouponsList.OWN.length; couponIndex++) {
                if (this.s3CouponsList.OWN[couponIndex].couponCode.trim() === jaldeeCoupn) {
                    this.selected_coupons.push(this.s3CouponsList.OWN[couponIndex].couponCode);
                    couponInfo.couponCode = this.s3CouponsList.OWN[couponIndex].couponCode;
                    if (this.s3CouponsList.OWN[couponIndex].consumerTermsAndconditions) {
                        couponInfo.instructions = this.s3CouponsList.OWN[couponIndex].consumerTermsAndconditions;
                    }
                    this.couponsList.push(couponInfo);
                    found = true;
                    this.selected_coupon = '';
                    break;
                }
            }
            if (found) {
                this.couponvalid = true;
                this.snackbarService.openSnackBar('Promocode accepted', { 'panelclass': 'snackbarerror' });
                setTimeout(() => {
                    this.action = '';
                }, 500);
                this.closebutton.nativeElement.click();
                this.checkCouponvalidity();

            } else {
                this.api_cp_error = 'Coupon invalid';
            }
        } else {
            // this.api_cp_error = 'Enter a Coupon';
            this.closebutton.nativeElement.click();
        }
    }
    checkCouponvalidity() {
        console.log('inside validaity');
        if (this.waitlist_for.length !== 0) {
            for (const list of this.waitlist_for) {
                if (list.id === this.customer_data.id) {
                    list['id'] = 0;
                }
            }
        }
        this.virtualServiceArray = {};
        if (this.callingModes !== '') {
            this.is_wtsap_empty = false;
            if (this.sel_ser_det.serviceType === 'virtualService') {
                if (this.sel_ser_det.virtualCallingModes[0].callingMode === 'GoogleMeet' || this.sel_ser_det.virtualCallingModes[0].callingMode === 'Zoom') {
                    this.virtualServiceArray[this.sel_ser_det.virtualCallingModes[0].callingMode] = this.sel_ser_det.virtualCallingModes[0].value;
                } else {
                    console.log(this.callingModes);
                    this.virtualServiceArray[this.sel_ser_det.virtualCallingModes[0].callingMode] = this.callingModes;
                }
            }
        } else if (this.callingModes === '' || this.callingModes.length < 10) {
            if (this.sel_ser_det.serviceType === 'virtualService') {
                for (const i in this.sel_ser_det.virtualCallingModes) {
                    if (this.sel_ser_det.virtualCallingModes[i].callingMode === 'WhatsApp' || this.sel_ser_det.virtualCallingModes[i].callingMode === 'Phone') {
                        this.snackbarService.openSnackBar('Please enter valid mobile number', { 'panelClass': 'snackbarerror' });
                        this.is_wtsap_empty = true;
                        break;
                    }
                }
            }
        }
        let phNumber;
        if (this.currentPhone && this.changePhno) {
            phNumber = this.currentPhone;
        } else {
            phNumber = this.userPhone;
        }
        const post_Data = {
            'queue': {
                'id': this.queueId
            },
            'date': this.selectedDate,
            'service': {
                'id': this.sel_ser,
                'serviceType': this.sel_ser_det.serviceType
            },
            'consumerNote': this.consumerNote,
            'countryCode': this.countryCode,
            'waitlistingFor': JSON.parse(JSON.stringify(this.waitlist_for)),
            'coupons': this.selected_coupons
        };
        if (this.sel_ser_det.serviceType === 'virtualService') {
            for (const i in this.virtualServiceArray) {
                if (i === 'WhatsApp') {
                    post_Data['virtualService'] = this.virtualServiceArray;
                } else if (i === 'GoogleMeet') {
                    post_Data['virtualService'] = this.virtualServiceArray;
                } else if (i === 'Zoom') {
                    post_Data['virtualService'] = this.virtualServiceArray;
                } else if (i === 'Phone') {
                    post_Data['virtualService'] = this.virtualServiceArray;
                } else if (i === 'VideoCall') {
                    post_Data['virtualService'] = { 'VideoCall': '' };
                }
            }
        }
        if (this.apptTime) {
            post_Data['appointmentTime'] = this.apptTime;
        }
        if (this.selectedUser && this.selectedUser.firstName !== Messages.NOUSERCAP) {
            post_Data['provider'] = { 'id': this.selectedUser.id };
        }
        if (this.partySizeRequired) {
            this.holdenterd_partySize = this.enterd_partySize;
            post_Data['partySize'] = Number(this.holdenterd_partySize);
        }
        post_Data['waitlistPhoneNumber'] = phNumber;
        post_Data['consumer'] = { id: this.customer_data.id };
        const param = { 'account': this.account_id };
        this.subs.sink = this.shared_services.addWaitlistAdvancePayment(param, post_Data)
            .subscribe(data => {
                this.paymentDetails = data;
            },
                error => {
                    this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                });
    }
    toggleterms(i) {
        if (this.couponsList[i].showme) {
            this.couponsList[i].showme = false;
        } else {
            this.couponsList[i].showme = true;
        }
    }
    removeJCoupon(i) {
        this.selected_coupons.splice(i, 1);
        this.couponsList.splice(i, 1);
        this.checkCouponvalidity()
    }
    getPic(user) {
        if (user.profilePicture) {
            return this.s3Processor.getJson(user.profilePicture)['url'];
        }
        return 'assets/images/img-null.svg';
    }
    changeService() {
        if (this.filterDepart) {
            this.handleDepartment(this.selected_dept);
        }
        this.action = 'service';
        for (let i = 0; i < this.servicesjson.length; i++) {
            if (this.servicesjson[i].provider) {
                this.servicesjson[i].provider['businessName'] = this.getUserName(this.servicesjson[i].provider.id);
            }
        }
    }
    goBack(type?) {
        if (type) {
            if (this.bookStep === 1) {
                this.location.back();
            } else {
                this.bookStep = 1;
            }
        }
        if (this.action !== 'addmember') {
            this.closebutton.nativeElement.click();
        }
        setTimeout(() => {
            if (this.action === 'note' || this.action === 'members' || (this.action === 'service' && !this.filterDepart)
                || this.action === 'attachment' || this.action === 'coupons' || this.action === 'departments' ||
                this.action === 'phone' || this.action === 'email') {
                this.action = '';
            } else if (this.action === 'addmember') {
                this.action = 'members';
            } else if (this.action === 'service' && this.filterDepart) {
                this.action = '';
            } else if (this.action === 'preInfo') {
                this.action = '';
            } else if (this.action === 'timeChange') {
                this.action = '';
            }
        }, 500);
    }
    applyPromocode() {
        this.action = 'coupons';
        this.selected_coupon = '';
        this.clearCouponErrors();
    }
    handleDepartment(dept) {
        this.servicesjson = this.serviceslist;
        const deptServices = [];
        for (let i = 0; i < this.servicesjson.length; i++) {
            if (this.servicesjson[i].department === dept.departmentId) {
                deptServices.push(this.serviceslist[i]);
            }
        }
        for (let i = 0; i < deptServices.length; i++) {
            if (deptServices[i].provider) {
                deptServices[i].provider['businessName'] = this.getUserName(deptServices[i].provider.id);
            }
        }
        this.servicesjson = deptServices;
        this.action = 'service';
    }
    getUserName(id) {
        let selectedUser = '';
        for (let i = 0; i < this.users.length; i++) {
            if (this.users[i].id === id) {
                selectedUser = this.users[i];
                break;
            }
        }
        if (selectedUser['businessName']) {
            return selectedUser['businessName'];
        } else {
            if (selectedUser['firstName'] && selectedUser['lastName']) {
                return (selectedUser['firstName'] + ' ' + selectedUser['lastName']);
            } else {
                return '';
            }
        }
    }
    showServiceDetail(serv, busname) {
        let servData;
        if (serv.serviceType && serv.serviceType === 'donationService') {
            servData = {
                bname: busname,
                serdet: serv,
                serv_type: 'donation'
            };
        } else {
            servData = {
                bname: busname,
                serdet: serv
            };
        }
        this.servicedialogRef = this.dialog.open(ServiceDetailComponent, {
            width: '50%',
            panelClass: ['commonpopupmainclass', 'popup-class', 'specialclass'],
            disableClose: true,
            data: servData
        });
        this.servicedialogRef.afterClosed().subscribe(() => {
        });
    }
    changeTime() {
        this.action = 'timeChange';
    }
    saveMemberDetails() {
        this.resetApiErrors();
        this.emailerror = '';
        this.phoneError = '';
        this.whatsapperror = '';
        // this.currentPhone = this.selected_phone;
        // this.userPhone = this.selected_phone;
        this.changePhno = true;
        // if (this.editBookingFields) {
        // if (this.newPhone && !this.newPhone.e164Number.startsWith(this.newPhone.dialCode + '55')) {
        //     this.phoneError = 'Phone number is invalid';
        //     return false;
        // } else {
        if (!this.countryCode || (this.countryCode && this.countryCode.trim() === '')) {
            this.snackbarService.openSnackBar('Please enter country code', { 'panelClass': 'snackbarerror' });
            return false;
        }
        if (this.newPhone && this.newPhone.trim() !== '') {
            this.userPhone = this.currentPhone = this.selected_phone = this.newPhone;
        } else {
            this.snackbarService.openSnackBar('Please enter phone number', { 'panelClass': 'snackbarerror' });
            return false;
        }
        // }
        // if (this.newWhatsapp && !this.newWhatsapp.e164Number.startsWith(this.newWhatsapp.dialCode + '55')) {
        //     this.whatsapperror = 'WhatsApp number is invalid';
        //     return false;
        // } else {
        if (this.sel_ser_det && this.sel_ser_det.virtualCallingModes && this.sel_ser_det.virtualCallingModes[0].callingMode === 'WhatsApp') {
            if (!this.whatsappCountryCode || (this.whatsappCountryCode && this.whatsappCountryCode.trim() === '')) {
                this.snackbarService.openSnackBar('Please enter country code', { 'panelClass': 'snackbarerror' });
                return false;
            }
            if (this.newWhatsapp && this.newWhatsapp.trim() !== '') {
                const countryCode = this.whatsappCountryCode.replace('+', '');
                this.callingModes = countryCode + this.newWhatsapp;
            } else {
                this.snackbarService.openSnackBar('Please enter whatsapp number', { 'panelClass': 'snackbarerror' });
                return false;
            }
        }
        // }
        if (this.newEmail && this.newEmail.trim() !== '') {
            const pattern = new RegExp(projectConstantsLocal.VALIDATOR_EMAIL);
            const result = pattern.test(this.newEmail);
            if (!result) {
                this.emailerror = "Email is invalid";
                return false;
            } else {
                this.payEmail = this.newEmail;
                this.waitlist_for[0]['email'] = this.payEmail;
            }
        }
        // if (this.bookingForm.get('newEmail').errors) {
        //     this.emailerror = "Email is invalid";
        //     return false;
        // } else {
        //     emailId = this.newEmail;
        // if (emailId && emailId != "") {
        //     this.payEmail = emailId;
        //     const post_data = {
        //         'id': this.userData.userProfile.id || null,
        //         'firstName': this.userData.userProfile.firstName || null,
        //         'lastName': this.userData.userProfile.lastName || null,
        //         'dob': this.userData.userProfile.dob || null,
        //         'gender': this.userData.userProfile.gender || null,
        //         'email': this.payEmail.trim() || ''
        //     };
        //     this.updateEmail(post_data).then(
        //         () => {
        //             this.closebutton.nativeElement.click();
        //             setTimeout(() => {
        //                 this.action = '';
        //             }, 500);
        //         },
        //         error => {
        //             this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        //             this.payEmail = this.userData.userProfile.email;
        //             return false;
        //         }
        //     )
        // } else {
        //     this.closebutton.nativeElement.click();
        //     setTimeout(() => {
        //         this.action = '';
        //     }, 500);
        // }
        // }
        // } else {
        //     this.closebutton.nativeElement.click();
        //     setTimeout(() => {
        //         this.action = '';
        //     }, 500);
        // }
        this.closebutton.nativeElement.click();
        setTimeout(() => {
            this.action = '';
        }, 500);
        this.editBookingFields = false;
    }
    updateEmail(post_data) {
        const _this = this;
        const passtyp = 'consumer';
        return new Promise(function (resolve, reject) {
            _this.subs.sink = _this.shared_services.updateProfile(post_data, passtyp)
                .subscribe(
                    () => {
                        _this.getProfile();
                        resolve(true);
                    },
                    error => {
                        reject(error);
                    });
        });
    }
    disableButn() {
        if (moment(this.sel_checkindate).format('YYYY-MM-DD') === this.hold_sel_checkindate && this.waitlist.queue && this.queuejson[this.sel_queue_indx] && this.waitlist.queue.id === this.queuejson[this.sel_queue_indx].id) {
            return true;
        } else {
            return false;
        }
    }
    changeBookingFields() {
        this.editBookingFields = true;
    }
    showSpec() {
        if (this.showmoreSpec) {
            this.showmoreSpec = false;
        } else {
            this.showmoreSpec = true;
        }
    }
    goToStep(type) {
        if (type === 'next') {
            if (this.queuejson.length !== 0 && !this.api_loading1 && this.waitlist_for.length !== 0) {
                if (this.questionnaireList.labels && this.questionnaireList.labels.length > 0) {
                    if (this.bookStep === 3) {
                        this.validateQuestionnaire();
                    } else {
                        this.bookStep++;
                    }
                } else {
                    if (this.sel_ser_det.consumerNoteMandatory && this.consumerNote == '') {
                        this.snackbarService.openSnackBar('Please provide ' + this.sel_ser_det.consumerNoteTitle, { 'panelClass': 'snackbarerror' });
                    } else {
                        this.bookStep = 3;
                    }
                }
            }
        } else if (type === 'prev') {
            if (this.questionnaireList.labels && this.questionnaireList.labels.length > 0) {
                this.bookStep--;
            } else {
                this.bookStep = 1;
            }
        } else {
            this.bookStep = type;
        }
        if (this.bookStep === 3) {
            this.saveCheckin('next');
        }
    }
    addWaitlistAdvancePayment(post_Data) {
        const param = { 'account': this.account_id };
        this.subs.sink = this.shared_services.addWaitlistAdvancePayment(param, post_Data)
            .subscribe(data => {
                this.paymentDetails = data;
                this.paymentLength = Object.keys(this.paymentDetails).length;
                this.checkJcash = true
                this.jcashamount = this.paymentDetails.eligibleJcashAmt.jCashAmt;
                this.jcreditamount = this.paymentDetails.eligibleJcashAmt.creditAmt;
                console.log(this.paymentDetails.amountRequiredNow);
                console.log(this.jcashamount);
                if (this.checkJcash && this.paymentDetails.amountRequiredNow > this.jcashamount) {
                    this.payAmount = this.paymentDetails.amountRequiredNow - this.jcashamount;
                    console.log(this.payAmount);
                } else if (this.checkJcash && this.paymentDetails.amountRequiredNow <= this.jcashamount) {
                    this.payAmount = 0;
                    console.log(this.payAmount)
                }
            },
                error => {
                    this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
                });
    }
    payuPayment() {
        let paymentWay;
        paymentWay = 'DC';
        this.makeFailedPayment(paymentWay);
    }
    makeFailedPayment(paymentMode) {
        this.waitlistDetails = {
            'amount': this.paymentDetails.amountRequiredNow,
            'paymentMode': null,
            'uuid': this.trackUuid,
            'accountId': this.account_id,
            'purpose': 'prePayment'
        };
        this.waitlistDetails.paymentMode = paymentMode;
        this.lStorageService.setitemonLocalStorage('uuid', this.trackUuid);
        this.lStorageService.setitemonLocalStorage('acid', this.account_id);
        this.lStorageService.setitemonLocalStorage('p_src', 'c_c');

        if (this.remainingadvanceamount == 0 && this.checkJcash) {
            const postData = {
                'amountToPay': this.paymentDetails.amountRequiredNow,
                'accountId': this.account_id,
                'uuid': this.trackUuid,
                'paymentPurpose': 'prePayment',
                'isJcashUsed': true,
                'isreditUsed': false,
                'isRazorPayPayment': false,
                'isPayTmPayment': false,
                'paymentMode': "JCASH"
            };
            this.shared_services.PayByJaldeewallet(postData)
                .subscribe(data => {
                    this.wallet = data;
                    if (!this.wallet.isGateWayPaymentNeeded && this.wallet.isJCashPaymentSucess) {
                        let multiple;
                        if (this.uuidList.length > 1) {
                            multiple = true;
                        } else {
                            multiple = false;
                        }
                        setTimeout(() => {
                            this.router.navigate(['consumer', 'checkin', 'confirm'], { queryParams: { account_id: this.account_id, uuid: this.uuidList, multiple: multiple } });
                        }, 500);
                    }
                },
                    error => {
                        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    });
        }
        else if (this.remainingadvanceamount > 0 && this.checkJcash) {
            const postData = {
                'amountToPay': this.paymentDetails.amountRequiredNow,
                'accountId': this.account_id,
                'uuid': this.trackUuid,
                'paymentPurpose': 'prePayment',
                'isJcashUsed': true,
                'isreditUsed': false,
                'isRazorPayPayment': true,
                'isPayTmPayment': false,
                'paymentMode': "DC"
            };
            this.shared_services.PayByJaldeewallet(postData)
                .subscribe((pData: any) => {
                    if (pData.isGateWayPaymentNeeded && pData.isJCashPaymentSucess) {
                        this.paywithRazorpay(pData.response);
                    }
                },
                    error => {
                        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                    });
        }
        else {
            this.subs.sink = this.shared_services.consumerPayment(this.waitlistDetails)
                .subscribe((pData: any) => {
                    this.pGateway = pData.paymentGateway;
                    if (this.pGateway === 'RAZORPAY') {
                        this.paywithRazorpay(pData);
                    } else {
                        if (pData['response']) {
                            this.payment_popup = this._sanitizer.bypassSecurityTrustHtml(pData['response']);
                            this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('CHECKIN_SUCC_REDIRECT'));
                            setTimeout(() => {
                                if (paymentMode === 'DC') {
                                    this.document.getElementById('payuform').submit();
                                } else {
                                    this.document.getElementById('paytmform').submit();
                                }
                            }, 2000);
                        } else {
                            this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('CHECKIN_ERROR'), { 'panelClass': 'snackbarerror' });
                        }
                    }
                },
                    error => {
                        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                        this.disablebutton = false;
                    });
        }
    }
    paywithRazorpay(pData: any) {
        this.prefillmodel.name = pData.consumerName;
        this.prefillmodel.email = pData.ConsumerEmail;
        this.prefillmodel.contact = pData.consumerPhoneumber;
        this.razorModel = new Razorpaymodel(this.prefillmodel);
        this.razorModel.key = pData.razorpayId;
        this.razorModel.amount = pData.amount;
        this.razorModel.order_id = pData.orderId;
        this.razorModel.name = pData.providerName;
        this.razorModel.description = pData.description;
        this.razorpayService.payWithRazor(this.razorModel, 'consumer', 'checkin_prepayment', this.trackUuid, this.sel_ser_det.livetrack, this.account_id, this.paymentDetails.amountRequiredNow, this.uuidList, this.customId);
    }
    getImage(url, file) {
        if (file.type == 'application/pdf') {
            return '../../../../../assets/images/pdf.png';
        } else {
            return url;
        }
    }
    getThumbUrl(attachment) {
        if (attachment && attachment.s3path) {
            if (attachment.s3path.indexOf('.pdf') !== -1) {
                return attachment.thumbPath;
            } else {
                return attachment.s3path;
            }
        }
    }
    getAttachLength() {
        let length = this.selectedMessage.files.length;
        if (this.type == 'waitlistreschedule' && this.waitlist && this.waitlist.attchment && this.waitlist.attchment[0] && this.waitlist.attchment[0].thumbPath) {
            length = length + this.waitlist.attchment.length;
        }
        return length;
    }
    actionCompleted() {
        console.log(this.action);
        if (this.action === 'timeChange') {
            if (this.queuejson[this.sel_queue_indx]) {
                this.selectedQTime = this.queuejson[this.sel_queue_indx].queueSchedule.timeSlots[0]['sTime'] + ' - ' + this.queuejson[this.sel_queue_indx].queueSchedule.timeSlots[0]['eTime'];
            }
            this.selectedDate = this.sel_checkindate;
            this.checkFutureorToday();
            this.personsAhead = this.sel_queue_personaahead;
            this.waitingTime = this.sel_queue_waitingmins;
            this.serviceTime = this.sel_queue_servicetime;
            this.queueId = this.sel_queue_id;
        }
        if (this.action === 'members') {
            this.saveMemberDetails();
        } else if (this.action === 'addmember') {
            this.handleSaveMember();
        } else if (this.action === 'note' || this.action === 'timeChange' || this.action === 'attachment') {
            this.goBack();
        } else if (this.action === 'coupons') {
            this.applyCoupons();
        }
    }
    popupClosed() {
        this.sel_checkindate = this.selectedDate;
        this.checkFutureorToday();
        this.sel_queue_personaahead = this.personsAhead;
        this.sel_queue_waitingmins = this.waitingTime;
        this.sel_queue_servicetime = this.serviceTime;
        this.sel_queue_id = this.queueId;
        const que = this.queuejson.filter(q => q.id === this.queueId);
        this.sel_queue_indx = this.queuejson.indexOf(que[0]);
        this.getQueuesbyLocationandServiceId(this.sel_loc, this.sel_ser, this.sel_checkindate, this.account_id);
    }
    getQuestionAnswers(event) {
        this.questionAnswers = event;
    }
    getConsumerQuestionnaire() {
        const consumerid = (this.waitlist_for[0].id === this.customer_data.id) ? 0 : this.waitlist_for[0].id;
        this.subs.sink = this.shared_services.getConsumerQuestionnaire(this.sel_ser, consumerid, this.account_id).subscribe(data => {
            this.questionnaireList = data;
            this.questionnaireLoaded = true;
            console.log(this.sel_ser);
            if (this.sel_ser_det.serviceType === 'virtualService') {
                this.setVirtualTeleserviceCustomer();
            }
        });
    }
    showJCCouponNote(coupon) {
        if (coupon.value.systemNote.length === 1 && coupon.value.systemNote.includes('COUPON_APPLIED')) {
        } else {
            if (coupon.value.value === '0.0') {
                this.dialog.open(JcCouponNoteComponent, {
                    width: '50%',
                    panelClass: ['commonpopupmainclass', 'confirmationmainclass', 'jcouponmessagepopupclass'],
                    disableClose: true,
                    data: {
                        jCoupon: coupon
                    }
                });
            }
        }
    }
    validateQuestionnaire() {
        if (!this.questionAnswers) {
            this.questionAnswers = {
                answers: {
                    answerLine: [],
                    questionnaireId: this.questionnaireList.id
                }
            }
        }
        if (this.questionAnswers.answers) {
            this.shared_services.validateConsumerQuestionnaire(this.questionAnswers.answers, this.account_id).subscribe((data: any) => {
                if (data.length === 0) {
                    if (this.sel_ser_det.consumerNoteMandatory && this.consumerNote == '') {
                        this.snackbarService.openSnackBar('Please provide ' + this.sel_ser_det.consumerNoteTitle, { 'panelClass': 'snackbarerror' });
                    } else {
                        this.bookStep++;
                        this.saveCheckin();
                    }
                }
                this.sharedFunctionobj.sendMessage({ type: 'qnrValidateError', value: data });
            }, error => {
                this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
            });
        }
    }
    changePolicy(event) {
        console.log(event.target.checked);
        this.checkPolicy = event.target.checked;
    }
    isNumeric(evt) {
        return this.sharedFunctionobj.isNumeric(evt);
    }
    viewAttachments() {
        this.action = 'attachment';
        this.modal.nativeElement.click();
    }
    showText() {
        this.readMore = !this.readMore;
    }

    changeJcashUse(event) {
        if (event.checked) {
            this.checkJcash = true;
        } else {
            this.checkJcash = false;
        }
    }
}