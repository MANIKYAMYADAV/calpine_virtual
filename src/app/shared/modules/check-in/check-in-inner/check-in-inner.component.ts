import { Component, Input, Output, Inject, OnInit, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

import {FormMessageDisplayService} from '../../../modules/form-message-display/form-message-display.service';
import { SharedServices } from '../../../services/shared-services';
import { SharedFunctions } from '../../../functions/shared-functions';
import { Messages } from '../../../constants/project-messages';
import { projectConstants } from '../../../../shared/constants/project-constants';
import { CommonDataStorageService } from '../../../../shared/services/common-datastorage.service';

@Component({
  selector: 'app-check-in-inner',
  templateUrl: './check-in-inner.component.html',
})
export class CheckInInnerComponent implements OnInit {

    s3url;
    provider_id;
    api_success = null;
    api_error = null;
    partyapi_error = null;
    servicesjson: any = [];
    galleryjson: any = [];
    settingsjson: any = [];
    locationjson: any = [];
    terminologiesjson: any = [];
    queuejson: any = [];
    businessjson: any = [];
    familymembers: any = [];
    partysizejson: any = [];
    sel_loc;
    sel_ser;
    sel_ser_det: any = [];
    sel_que;
    search_obj;
    checkinenable = false;
    checkindisablemsg = '';
    pass_loc;
    sel_queue_id;
    sel_queue_waitingmins;
    sel_queue_servicetime = '';
    sel_queue_name;
    sel_queue_timecaption;
    sel_queue_indx;
    sel_queue_det;
    showfuturediv;
    multipleMembers_allowed = false;
    partySize = false;
    partySizeRequired = null;
    maxPartySize = 1;
    revealphonenumber;
    today;
    minDate;
    maxDate;
    consumerNote;
    enterd_partySize = 1;
    holdenterd_partySize = 0;
    showCreateMember = false;
    sel_checkindate;
    hold_sel_checkindate;
    sel_dayname;
    account_id;
    retval;
    futuredate_allowed = false;
    step;
    waitlist_for: any = [];
    holdwaitlist_for: any = [];
    paymentModes: any = [];
    payModesExists = false;
    payModesQueried = false;
    loggedinuser;
    maxsize;
    paytype = '';
    isFuturedate = false;
    addmemberobj = {'fname': '', 'lname': '', 'mobile': '', 'gender': '', 'dob': ''};
    payment_popup = null;
    dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT_WITH_DAY;
    fromKiosk = false;

    customer_data: any = [];
    page_source = null;
    main_heading;
    dispCustomernote = false;
    CweekDays = {0: 'Sun', 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat'};
    queueQryExecuted = false;
    todaydate;
    estimateCaption = Messages.EST_WAIT_TIME_CAPTION;
    nextavailableCaption = Messages.NXT_AVAILABLE_TIME_CAPTION;
    checkinCaption = Messages.CHECKIN_TIME_CAPTION;
    checkinLabel;
    CheckedinLabel;
    ddate;

    @Input() data: any =  [];
    @Output() returntoParent = new EventEmitter<any>();

    constructor(private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public shared_services: SharedServices,
    public sharedFunctionobj: SharedFunctions,
    public router: Router,
    public provider_datastorage: CommonDataStorageService,
    // public dialogRef: MatDialogRef<CheckInInnerComponent>,
    public _sanitizer: DomSanitizer,
    @Inject(DOCUMENT) public document,
    // @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    }
    ngOnInit() {
      // console.log('check-inpassed data', this.data);
      this.customer_data = this.data.customer_data || [];
      if (this.data.moreparams.terminologies) {
        this.terminologiesjson = this.data.moreparams.terminologies;
        // console.log('reached here', this.terminologiesjson);
        this.setTerminologyLabels();
      }
      // // console.log('init', this.customer_data);
      if (this.data.fromKiosk !== undefined) {
        if (this.data.fromKiosk) {
          this.fromKiosk = true;
        }
      }
      this.page_source = this.data.moreparams.source;
      this.main_heading = this.checkinLabel; // 'Check-in';
      this.maxsize = 1;
      this.step = 1;
      this.loggedinuser = this.sharedFunctionobj.getitemfromLocalStorage('ynw-user');
      this.gets3curl();
      this.getFamilyMembers();
      this.consumerNote = '';
      this.today = new Date();
      this.minDate = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate());

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


      // console.log('custdata', this.customer_data, 'loggedinuser', this.loggedinuser, 'kiosk', this.fromKiosk);
      if (this.page_source === 'provider_checkin') {
          // this.waitlist_for.push ({id: this.customer_data.id, name: 'Self'});
          if (this.fromKiosk) {
            this.waitlist_for.push ({id: this.customer_data.id, name: this.customer_data.name});
          } else {
            this.waitlist_for.push ({id: this.customer_data.id, name: this.customer_data.userProfile.firstName + ' ' + this.customer_data.userProfile.lastName});
          }
      } else {
       // this.waitlist_for.push ({id: this.loggedinuser.id, name: 'Self'});
        this.waitlist_for.push ({id: this.loggedinuser.id, name: this.loggedinuser.firstName + ' ' + this.loggedinuser.lastName});
      }
      if (this.page_source === 'searchlist_checkin') { // case check-in from search result page

        this.search_obj = this.data.srchprovider;
        // console.log('locs', this.search_obj);
        this.provider_id = this.search_obj.fields.unique_id;
        const providarr = this.search_obj.id.split('-');
        this.account_id = providarr[0];
        this.sel_queue_id = this.search_obj.fields.waitingtime_res.nextAvailableQueue.id;
        // this.sel_queue_name = this.search_obj.fields.waitingtime_res.nextAvailableQueue.name || '';
        this.sel_loc = this.search_obj.fields.location_id1;
        this.sel_checkindate = this.search_obj.fields.waitingtime_res.nextAvailableQueue.availableDate;
        this.minDate = this.sel_checkindate;

      } else if (this.page_source === 'provdet_checkin'
      || this.page_source === 'provider_checkin') { // case check-in from provider details page or provider dashboard

        // this.search_obj = this.data.srchprovider;
        this.provider_id = this.data.moreparams.provider.unique_id;
        this.account_id = this.data.moreparams.provider.account_id;

        const srch_fields = {
                              fields: {
                                title: this.data.moreparams.provider.name,
                                place1: this.data.moreparams.location.name,
                              }
        };
        this.search_obj = srch_fields;
        // this.sel_queue_id = this.search_obj.fields.waitingtime_res.nextAvailableQueue.id;
        this.sel_loc = this.data.moreparams.location.id;
        this.sel_checkindate = this.data.moreparams.sel_date;
        this.minDate = this.sel_checkindate; // done to set the min date in the calendar view
      }
      if (this.page_source !== 'provider_checkin') { // not came from provider, but came by clicking "Do you want to check in for a different date"
        // console.log('check in source', this.page_source, this.data.datechangereq, this.sel_checkindate);
        if (this.data.datechangereq) {
          const seldate_checker = new Date(this.sel_checkindate);
          const todaydate_checker = new Date(this.todaydate);
          if (seldate_checker.getTime() === todaydate_checker.getTime()) { // if the next available date is today itself, then add 1 day to the date and use it
            const nextdate = new Date(seldate_checker.setDate(seldate_checker.getDate() + 1));
            // console.log('same day', nextdate.getFullYear() + '-' + (nextdate.getMonth() + 1) + '-' + nextdate.getDate());
            this.sel_checkindate = nextdate.getFullYear() + '-' + (nextdate.getMonth() + 1) + '-' + nextdate.getDate();
            this.minDate = this.sel_checkindate; // done to set the min date in the calendar view
            // console.log('reached here');
          }
        }

      }
      const ddd = new Date(this.sel_checkindate);
      this.ddate = new Date(ddd.getFullYear() + '-' + this.sharedFunctionobj.addZero(ddd.getMonth() + 1) + '-' + this.sharedFunctionobj.addZero(ddd.getDate()));

      this.hold_sel_checkindate = this.sel_checkindate;
      // console.log('passed seldate', this.hold_sel_checkindate);
      this.getServicebyLocationId (this.sel_loc, this.sel_checkindate);

      // if ( this.page_source !== 'provider_checkin') {
      //   this.getPaymentModesofProvider(this.account_id);
      // }
      const date1 = new Date(this.sel_checkindate);
      const date2 = new Date(this.todaydate);
      // console.log('selcheckindate', this.sel_checkindate);
      // if (this.sel_checkindate !== this.todaydate) { // this is to decide whether future date selection is to be displayed. This is displayed if the sel_checkindate is a future date
      if (date1.getTime() !== date2.getTime()) { // this is to decide whether future date selection is to be displayed. This is displayed if the sel_checkindate is a future date
        this.isFuturedate = true;
        // console.log('future', this.isFuturedate);
      }
      // const retdatedet = this.getQueueDateTimeDetails(this.search_obj.fields.waitingtime_res.nextAvailableQueue);
     // this.sel_queue_det = retdatedet;
      this.showfuturediv = false;
      this.revealphonenumber = true;
    }
    setTerminologyLabels() {
      this.checkinLabel = this.sharedFunctionobj.firstToUpper(this.terminologiesjson['waitlist']);
      this.CheckedinLabel = this.sharedFunctionobj.firstToUpper(this.terminologiesjson['waitlisted']);
      this.main_heading = this.checkinLabel;
        // console.log('checkinlabel', this.checkinLabel);
    }
    getPaymentModesofProvider(provid) {
      if (this.paymentModes.length === 0) {
        this.shared_services.getPaymentModesofProvider(provid)
          .subscribe (data => {
            this.paymentModes = data;
            this.payModesQueried = true;
            if (this.paymentModes.length <= 2) { // **** This is a condition added as per suggestion from Manikandan to avoid showing modes such as Cash, wallet etc in consumer area
              this.payModesExists = false;
            } else {
              this.payModesExists = true;
            }
            // console.log ('paymodes', this.paymentModes);
          },
        error => {
          this.payModesQueried = true;
          this.api_error = this.sharedFunctionobj.getProjectErrorMesssages(error);
          // console.log ('error', error);
        });
      }
    }
    getFamilyMembers() {

      let fn;
      let self_obj;

      if (this.page_source === 'provider_checkin') {
        fn = this.shared_services.getProviderCustomerFamilyMembers(this.customer_data.id);
        /*self_obj = {
          'userProfile': {
            'id': this.customer_data.id,
            'firstName': 'Self',
            'lastName' : ''
          }
        };*/
        if (this.fromKiosk) {
          self_obj = {
            'userProfile': {
              'id': this.customer_data.id,
              'firstName': this.customer_data.name,
              'lastName' : ''
            }
          };
        } else {
          self_obj = {
            'userProfile': {
              'id': this.customer_data.id,
              'firstName': this.customer_data.userProfile.firstName,
              'lastName' : this.customer_data.userProfile.lastName
            }
          };
        }
      } else {
        fn = this.shared_services.getConsumerFamilyMembers();
         /*self_obj = {
          'userProfile': {
            'id': this.loggedinuser.id,
            'firstName': 'Self',
            'lastName' : ''
          }
         };*/
        self_obj = {
          'userProfile': {
            'id': this.loggedinuser.id,
            'firstName': this.loggedinuser.firstName,
            'lastName' : this.loggedinuser.lastName
          }
        };
      }

      fn.subscribe( data => {
        this.familymembers = [];
        this.familymembers.push(self_obj);
        for ( const mem of data) {
          if (mem.userProfile.id !== self_obj.userProfile.id) {
            this.familymembers.push(mem);
          }
        }
       // console.log('family', this.familymembers);
      },
      error => {
      });

    }
    gets3curl() {
      this.retval = this.sharedFunctionobj.getS3Url()
                  .then(
                    res => {
                      this.s3url = res;
                      this.getbusinessprofiledetails_json('businessProfile', true);
                      this.getbusinessprofiledetails_json('settings', true);
                      // console.log('terminologies ext', this.terminologiesjson);
                      if (!this.terminologiesjson) {
                        this.getbusinessprofiledetails_json('terminologies', true);
                        // console.log('term1');
                      } else {
                        if (this.terminologiesjson.length === 0) {
                          this.getbusinessprofiledetails_json('terminologies', true);
                          // console.log('term2');
                        } else {
                          // console.log('term3');
                          this.provider_datastorage.set('terminologies', this.terminologiesjson);
                          this.sharedFunctionobj.setTerminologies(this.terminologiesjson);
                        }
                      }
                    },
                    error => { }
                  );
    }

    // gets the various json files based on the value of "section" parameter
    getbusinessprofiledetails_json(section, modDateReq: boolean) {
      let  UTCstring = null ;
      if (modDateReq) {
         UTCstring = this.sharedFunctionobj.getCurrentUTCdatetimestring();
      }
      this.shared_services.getbusinessprofiledetails_json(this.provider_id, this.s3url, section, UTCstring)
      .subscribe (res => {
          switch (section) {
            case 'settings':
              this.settingsjson = res;
              this.futuredate_allowed = (this.settingsjson.futureDateWaitlist === true) ? true : false;
              /*this.maxsize = this.settingsjson.maxPartySize;
              if (this.maxsize === undefined) {
                this.maxsize = 1;
              }*/
            break;
            case 'terminologies':
              this.terminologiesjson = res;
              // console.log('reached here1', this.terminologiesjson);
              this.provider_datastorage.set('terminologies', this.terminologiesjson);
              this.sharedFunctionobj.setTerminologies(this.terminologiesjson);
              this.setTerminologyLabels();
              // console.log('term datastorage', this.sharedFunctionobj.getTerminologies());
            break;
            case 'businessProfile':
              this.businessjson = res;
              this.getPartysizeDetails(this.businessjson.serviceSector.domain, this.businessjson.serviceSubSector.subDomain);
            break;
          }
      },
      error => {

      }
     );
    }

    getServicebyLocationId(locid, pdate) {
      this.resetApi();
      this.shared_services.getServicesByLocationId (locid)
        .subscribe ( data => {
            this.servicesjson = data;
            this.sel_ser_det = [];
            if (this.servicesjson.length > 0) {
              this.sel_ser = this.servicesjson[0].id; // set the first service id to the holding variable
             // this.setServiceDetails(this.servicesjson[0]); // setting the details of the first service to the holding variable
              this.setServiceDetails(this.sel_ser); // setting the details of the first service to the holding variable
              this.getQueuesbyLocationandServiceId(locid, this.sel_ser, pdate, this.account_id);
            }
        },
      error => {
        this.sel_ser = '';
      });
    }
    setServiceDetails(curservid) {
    // console.log('serdet', curservid, this.servicesjson);
     let serv;
     for (let i = 0; i < this.servicesjson.length; i++) {
       // console.log('compare', this.servicesjson[i].id, curservid);
       if (this.servicesjson[i].id === curservid) {
         serv = this.servicesjson[i];
         // console.log('serv', serv, serv.serviceDuration);
       }
     }
      this.sel_ser_det = [];
      // if (serv.serviceDuration) {
        this.sel_ser_det = {
            name: serv.name,
            duration: serv.serviceDuration,
            description: serv.description,
            price: serv.totalAmount,
            isPrePayment:	serv.isPrePayment,
            minPrePaymentAmount: serv.minPrePaymentAmount,
            status: serv.status,
            taxable: serv.taxable
          };
          if (this.page_source !== 'provider_checkin') {
            if (serv.isPrePayment) {
              this.getPaymentModesofProvider(this.account_id);
            }
          }
       // }
    }

    getQueuesbyLocationandServiceId(locid, servid, pdate?, accountid?) {
      this.queueQryExecuted = false;
       this.shared_services.getQueuesbyLocationandServiceId(locid, servid, pdate, accountid)
        .subscribe( data => {
          this.queuejson = data;
          this.queueQryExecuted = true;
          // console.log('q json', this.queuejson);
          if (this.queuejson.length > 0) {
            let selindx = 0;
              for (let i = 0; i < this.queuejson.length; i++) {
                if (this.queuejson[i]['queueWaitingTime'] !== undefined) {
                  selindx = i;
                }
              }
              this.sel_queue_id = this.queuejson[selindx].id;
              this.sel_queue_indx = selindx;
              // this.sel_queue_waitingmins = this.queuejson[0].queueWaitingTime + ' Mins';
              this.sel_queue_waitingmins = this.sharedFunctionobj.convertMinutesToHourMinute(this.queuejson[selindx].queueWaitingTime);
              this.sel_queue_servicetime = this.queuejson[selindx].serviceTime || '';
              this.sel_queue_name = this.queuejson[selindx].name;
              this.sel_queue_timecaption = '[ ' + this.queuejson[selindx].queueSchedule.timeSlots[0]['sTime'] + ' - ' + this.queuejson[selindx].queueSchedule.timeSlots[0]['eTime'] + ' ]';

          } else {
              this.sel_queue_indx = -1;
              this.sel_queue_id = 0;
              this.sel_queue_waitingmins = 0;
              this.sel_queue_servicetime = '';
              this.sel_queue_name = '';
              this.sel_queue_timecaption = '';
          }

        });
    }

  handleServiceSel(obj) {
   // console.log('serv', obj);
    // this.sel_ser = obj.id;
    this.sel_ser = obj;
    this.setServiceDetails(obj);
    this.queuejson = [];
    this.sel_queue_id = 0;
    this.sel_queue_waitingmins = 0;
    this.sel_queue_servicetime = '';
    this.sel_queue_name = '';
    this.resetApi();
    this.getQueuesbyLocationandServiceId(this.sel_loc, this.sel_ser, this.sel_checkindate, this.account_id);
  }

  isSelectedService(id) {
    let clr = false;
    if (id === this.sel_ser) {
      clr = true;
    } else {
      clr = false;
    }
    return clr;
  }

  isSelectedQueue(id) {
    let clr = false;
    if (id === this.sel_queue_id) {
      clr = true;
    } else {
      clr = false;
    }
    return clr;
  }

  // handleQueueSel(obj) {
  //   this.resetApi();
  //   // this.queueReloaded = false;
  //   this.sel_queue_id = obj.id;
  //   this.sel_queue_waitingmins = this.sharedFunctionobj.convertMinutesToHourMinute(obj.queueWaitingTime);
  //   this.sel_queue_servicetime = obj.serviceTime || '';
  //   this.sel_queue_name = obj.name;
  //   // this.queueReloaded = true;
  // }

  handleQueueSel(mod) {
    this.resetApi();
    if (mod === 'next') {
      if ((this.queuejson.length - 1) > this.sel_queue_indx) {
        this.sel_queue_indx = this.sel_queue_indx + 1;
      }
    } else if (mod === 'prev') {
      if ((this.queuejson.length > 0) && (this.sel_queue_indx > 0)) {
        this.sel_queue_indx = this.sel_queue_indx - 1;
      }
    }
    if (this.sel_queue_indx !== -1) {
      this.sel_queue_id = this.queuejson[this.sel_queue_indx].id;
      this.sel_queue_waitingmins = this.sharedFunctionobj.convertMinutesToHourMinute(this.queuejson[this.sel_queue_indx].queueWaitingTime);
      this.sel_queue_servicetime = this.queuejson[this.sel_queue_indx].serviceTime || '';
      this.sel_queue_name = this.queuejson[this.sel_queue_indx].name;
      this.sel_queue_timecaption = '[ ' + this.queuejson[this.sel_queue_indx].queueSchedule.timeSlots[0]['sTime'] + ' - ' + this.queuejson[this.sel_queue_indx].queueSchedule.timeSlots[0]['eTime'] + ' ]';
      // this.queueReloaded = true;
    }
  }
  handleFuturetoggle() {
    this.showfuturediv = !this.showfuturediv;
  }

  isCheckinenable() {
    // console.log('enable', this.sel_loc, this.sel_ser, this.sel_queue_id , this.sel_checkindate);
    if (this.sel_loc && this.sel_ser && this.sel_queue_id && this.sel_checkindate) {
      return true;
    } else {
      return false;
    }
  }
  revealChk() {
    this.revealphonenumber = !this.revealphonenumber;
  }

  handleConsumerNote(vale) {
    this.consumerNote = vale;
  }
  handleFutureDateChange(e) {
    const obtmonth = (e._i.month + 1);
    let cmonth = '' + obtmonth;
    if ( obtmonth < 10) {
      cmonth = '0' + obtmonth;
    }
    const seldate = e._i.year + '-' + cmonth + '-' + e._i.date;
    // console.log('date changed', seldate, e);
    this.sel_checkindate = seldate;
    this.handleFuturetoggle();
    this.getQueuesbyLocationandServiceId(this.sel_loc, this.sel_ser, this.sel_checkindate, this.account_id);
  }
  handleServiceForWhom() {
    this.holdwaitlist_for = this.waitlist_for;
    this.step = 3;
    this.main_heading = 'Family Members';
  }
  handleCheckinClicked() {
    this.resetApi();
    let error = '';
    // if (this.step === 1) {
    //  this.step = 2;
    // } else
    if (this.step === 1) {
      if (this.sel_ser_det.isPrePayment && this.page_source !== 'provider_checkin') {
        /*if (this.paytype === '') {
          error = 'Please select the payment mode';
        }*/
        this.paytype = 'DC'; // deleberately giving this value as per request from Manikandan.
      }
      if (this.partySizeRequired) {
        this.clearerrorParty();
        error = this.validatorPartysize(this.enterd_partySize);
      }
      if (error === '') {
        this.saveCheckin();
      } else {
        this.api_error = error;
      }
    }
  }
  saveCheckin() {
    const waitlistarr = [];
    for (let i = 0; i < this.waitlist_for.length; i++) {
      waitlistarr.push({id: this.waitlist_for[i].id});
    }
    const post_Data = {
        'queue': {
          'id': this.sel_queue_id
        },
        'date': this.sel_checkindate,
        'service': {
          'id': this.sel_ser
        },
        'consumerNote': this.consumerNote,
        'waitlistingFor': JSON.parse(JSON.stringify(waitlistarr))/*,
        'revealPhone': this.revealphonenumber*/
    };
    if (this.partySizeRequired) {
      this.holdenterd_partySize = this.enterd_partySize;
      post_Data['partySize'] = Number(this.holdenterd_partySize);
    }

    if (this.page_source === 'provider_checkin') {
      post_Data['consumer'] =  {id : this.customer_data.id };
      post_Data['ignorePrePayment'] = true;
      this.addCheckInProvider(post_Data);
    } else {
      this.addCheckInConsumer(post_Data);
    }

    // console.log('postdata', JSON.stringify(post_Data));
  }

  addCheckInConsumer(post_Data) {
    this.shared_services.addCheckin(this.account_id, post_Data)
    .subscribe(data => {
      const retData = data;
     // console.log('check-in returned', retData);
      let toKen;
      let retUUID;
      Object.keys(retData).forEach(key => {
        toKen = key;
        retUUID =  retData[key];
      });
    //  console.log('token', toKen);
    //  console.log('uuid', retUUID);
      if (this.sel_ser_det.isPrePayment) { // case if prepayment is to be done
        if (this.paytype !== '' && retUUID && this.sel_ser_det.isPrePayment && this.sel_ser_det.minPrePaymentAmount > 0) {
          const payData = {
            'amount': this.sel_ser_det.minPrePaymentAmount,
            'paymentMode': this.paytype,
            'uuid': retUUID,
            'accountId':this.account_id
          };
          this.shared_services.consumerPayment(payData)
            .subscribe (pData => {
                if (pData['response']) {
                  this.payment_popup = this._sanitizer.bypassSecurityTrustHtml(pData['response']);
                  this.api_success = this.sharedFunctionobj.getProjectMesssages('CHECKIN_SUCC_REDIRECT');
                    setTimeout(() => {
                      this.document.getElementById('payuform').submit();
                    }, 2000);
                } else {
                  this.api_error = this.sharedFunctionobj.getProjectMesssages('CHECKIN_ERROR');
                }
            },
            error => {
              this.api_error = this.sharedFunctionobj.getProjectErrorMesssages(error);
            });
        } else {
          this.api_error = this.sharedFunctionobj.getProjectMesssages('CHECKIN_ERROR');
        }
      } else {
        this.api_success = this.sharedFunctionobj.getProjectMesssages('CHECKIN_SUCC');
        setTimeout(() => {
          // this.dialogRef.close('reloadlist');
          this.returntoParent.emit('reloadlist');
        }, projectConstants.TIMEOUT_DELAY);
      }
    },
    error => {
      this.api_error = this.sharedFunctionobj.getProjectErrorMesssages(error);
    });
  }

  addCheckInProvider(post_Data) {
    this.shared_services.addProviderCheckin(post_Data)
    .subscribe(data => {
      this.api_success = this.sharedFunctionobj.getProjectMesssages('CHECKIN_SUCC');
      setTimeout(() => {
        // this.dialogRef.close('reloadlist');
        this.returntoParent.emit('reloadlist');
      }, projectConstants.TIMEOUT_DELAY);
    },
    error => {
      this.api_error = this.sharedFunctionobj.getProjectErrorMesssages(error);
    });
  }

  handleGoBack(cstep) {
    this.resetApi();
    switch (cstep) {
      case 1:
      case 2:
        this.main_heading = this.checkinLabel;
      break;
      case 3:
      this.main_heading = 'Family Members';
      this.showCreateMember = false;
      this.addmemberobj.fname = '';
      this.addmemberobj.lname = '';
      this.addmemberobj.mobile = '';
      this.addmemberobj.gender = '';
      this.addmemberobj.dob =  '';
      break;
    }
    this.step = cstep;
    if (this.waitlist_for.length === 0) { // if there is no members selected, then default to self
      // this.waitlist_for.push ({id: this.loggedinuser.id, name: 'Self'});

      if (this.page_source === 'provider_checkin') {
        // this.waitlist_for.push ({id: this.customer_data.id, name: 'Self'});
        if (this.fromKiosk) {
          this.waitlist_for.push ({id: this.customer_data.id, name: this.customer_data.name});
        } else {
          this.waitlist_for.push ({id: this.customer_data.id, name: this.customer_data.userProfile.firstName + ' ' + this.customer_data.userProfile.lastName});
        }
      } else {
      // this.waitlist_for.push ({id: this.loggedinuser.id, name: 'Self'});
        this.waitlist_for.push ({id: this.loggedinuser.id, name: this.loggedinuser.firstName + ' ' + this.loggedinuser.lastName});
      }

    }
  }
  showCheckinButtonCaption() {
    let caption = '';
    /*if (this.step === 1) {
      caption = 'Proceed to Check-in';
    } else if (this.step === 2) {*/
      caption = 'Confirm ' + this.checkinLabel;
   // }
    return caption;
  }

  handleOneMemberSelect(id, name, obj) {
    this.resetApi();
    this.waitlist_for = [];
    this.waitlist_for.push({ id: id, name: name });
  }

  handleMemberSelect(id, name, obj) {
    this.resetApi();
   // console.log('mem select', obj);
   // console.log('changed');
    if (this.waitlist_for.length === 0) {
      this.waitlist_for.push({ id: id, name: name });
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
          this.waitlist_for.push({ id: id, name: name });
        } else {
          obj.source.checked = false; // preventing the current checkbox from being checked
          if  (this.maxsize > 1) {
            this.api_error = 'Only ' + this.maxsize + ' member(s) can be selected';
          } else if (this.maxsize === 1) {
            this.api_error = 'Only ' + this.maxsize + ' member can be selected';
          }
        }
      }
    }
    // console.log('selected members', this.waitlist_for);
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
        if (this.waitlist_for[i].id === id) {
         // console.log('ischecked');
          retval = true;
        }
      }
    }
    return retval;
  }

  addMember() {
    this.resetApi();
    this.showCreateMember = true;
    // this.step = 4; // show add member section
    // this.main_heading = 'Add Family Member';
  }

  resetApi() {
    this.api_error = null;
    this.api_success = null;
  }

  handleReturnDetails(obj) {
    this.resetApi();
    this.addmemberobj.fname = obj.fname || '';
    this.addmemberobj.lname = obj.lname || '';
    this.addmemberobj.mobile = obj.mobile || '';
    this.addmemberobj.gender = obj.gender || '';
    this.addmemberobj.dob = obj.dob || '';
    // console.log('add member return', this.addmemberobj);
  }
  handleSaveMember() {
    this.resetApi();
    let derror = '';
    const namepattern =   new RegExp(projectConstants.VALIDATOR_CHARONLY);
    const phonepattern =   new RegExp(projectConstants.VALIDATOR_NUMBERONLY);
    const phonecntpattern =   new RegExp(projectConstants.VALIDATOR_PHONENUMBERCOUNT10);
    const blankpattern = new RegExp(projectConstants.VALIDATOR_BLANK);

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
          derror = 'Phone number should have 10 digits';
        }
      }
    }

    /*if (derror === '' && this.addmemberobj.gender === '') {
      derror = 'Please select the gender';
    }
    if (derror === '' && this.addmemberobj.dob === '') {
      derror = 'Please select the date of birth';
    }*/

    if (derror === '') {
      const post_data = {
        'userProfile': {
                          'firstName': this.addmemberobj.fname,
                          'lastName':  this.addmemberobj.lname
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
        // console.log('postdata', post_data);

        let fn;
        if (this.page_source === 'provider_checkin') {
         post_data['parent'] = this.customer_data.id;
         fn = this.shared_services.addProviderCustomerFamilyMember(post_data);
        } else {
          fn =   this.shared_services.addMembers(post_data);
        }

        fn.subscribe(data => {
            this.api_success = this.sharedFunctionobj.getProjectMesssages('MEMBER_CREATED');
            this.getFamilyMembers();
            setTimeout(() => {
              this.handleGoBack(3);
            }, projectConstants.TIMEOUT_DELAY);
          },
          error => {
            this.api_error = error.error;
          } );

    } else {
       this.api_error = derror;
    }
  }
  handleNote() {
    if (this.dispCustomernote) {
      this.dispCustomernote = false;
    } else {
      this.dispCustomernote = true;
    }
  }

  calculateDate(days) {
    this.resetApi();
    const date = new Date(this.sel_checkindate);
    const newdate = new Date(date);
    newdate.setDate(newdate.getDate() + days);
    const dd = newdate.getDate();
    const mm = newdate.getMonth() + 1;
    const y = newdate.getFullYear();

    const ndate = y + '-' + mm + '-' + dd;

    const strtDt = new Date(this.hold_sel_checkindate + ' 00:00:00');
    const nDt = new Date(ndate);
    // console.log('dates', strtDt, nDt, this.hold_sel_checkindate);
    if (nDt.getTime() >= strtDt.getTime() ) {
      this.sel_checkindate =  ndate;
      this.getQueuesbyLocationandServiceId(this.sel_loc, this.sel_ser, this.sel_checkindate, this.account_id);
    }
   // console.log('date compare', this.sel_checkindate, this.todaydate);
    const date1 = new Date(this.sel_checkindate);
    const date2 = new Date(this.todaydate);
 // console.log('date compare2', date1, date2);
    // if (this.sel_checkindate !== this.todaydate) { // this is to decide whether future date selection is to be displayed. This is displayed if the sel_checkindate is a future date
    if (date1.getTime() !== date2.getTime()) { // this is to decide whether future date selection is to be displayed. This is displayed if the sel_checkindate is a future date
      this.isFuturedate = true;
    } else {
      this.isFuturedate = false;
    }
    // console.log('new date', this.hold_sel_checkindate, this.sel_checkindate);
    const ddd = new Date(this.sel_checkindate);
    this.ddate = new Date(ddd.getFullYear() + '-' + this.sharedFunctionobj.addZero(ddd.getMonth() + 1) + '-' + this.sharedFunctionobj.addZero(ddd.getDate()));
  }
  /*convertToDate(dt) {
    const splt = dt.split('-');
    const ndate = new Date(splt[2] + '/' + splt[1] + '/' + splt[0]);
    return ndate;
  }*/
  disableMinus() {
    const seldate = new Date(this.sel_checkindate);
    const strtDt  = new Date(this.hold_sel_checkindate);
    // console.log(strtDt, strtDt);
    if (strtDt.getTime() >= seldate.getTime() ) {
      return true;
    } else {
      return false;
    }
  }
  getPartysizeDetails(domain, subdomain) {
    this.shared_services.getPartysizeDetails(domain, subdomain)
      .subscribe (data => {
        this.partysizejson = data;
        this.partySize = false;
        // console.log('partysize', this.partysizejson);
        this.maxsize = 1;
        if (this.partysizejson.partySize) {
          this.partySize = true;
          this.maxsize = (this.partysizejson.maxPartySize) ? this.partysizejson.maxPartySize : 1;
        }

        if (this.partySize && !this.partysizejson.partySizeForCalculation ) { // check whether partysize box is to be displayed to the user
          // console.log('iamhere', this.partySize, this.partysizejson.partySizeForCalculation);
          this.partySizeRequired = true;
        }

        if (this.partysizejson.partySizeForCalculation) { // check whether multiple members are allowed to be selected
          this.multipleMembers_allowed = true;
        }

      },
      error => {

      });
  }
  checkPartySize(pVal) {
    this.clearerrorParty();
    const error = this.validatorPartysize(pVal);
    if (error !== '') {
      this.partyapi_error = error;
    }
  }
  validatorPartysize(pVal) {
    this.resetApi();
    let errmsg = '';
    const numbervalidator = projectConstants.VALIDATOR_NUMBERONLY;
    const blankvalidator = projectConstants.VALIDATOR_BLANK;
    this.enterd_partySize = pVal;
    if (!numbervalidator.test(pVal)) {
      errmsg  = 'Please enter a valid party size';
    } else {
      if (pVal > this.maxsize) {
        errmsg = 'Sorry ... the maximum party size allowed is '  + this.maxsize;
      }
    }
    return errmsg;
  }

  clearerrorParty() {
    this.partyapi_error = '';
  }
}
