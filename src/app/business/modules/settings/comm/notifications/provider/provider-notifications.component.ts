import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SharedFunctions } from '../../../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../../../ynw_provider/services/provider-services.service';
import { Messages } from '../../../../../../shared/constants/project-messages';
import { projectConstantsLocal } from '../../../../../../shared/constants/project-constants';
import { AddproviderAddonComponent } from '../../../../../../ynw_provider/components/add-provider-addons/add-provider-addons.component';
import { MatDialog } from '@angular/material/dialog';
import { UpdateProviderNotificationsComponent } from '../../update-provider-notifications/update-provider-notifications.component';
import { GroupStorageService } from '../../../../../../shared/services/group-storage.service';
import { WordProcessor } from '../../../../../../shared/services/word-processor.service';
import { SnackbarService } from '../../../../../../shared/services/snackbar.service';

@Component({
  selector: 'app-provider-notifications',
  templateUrl: './provider-notifications.component.html'
})
export class ProviderNotificationsComponent implements OnInit {

  breadcrumb_moreoptions: any = [];
  isCheckin;
  breadcrumbs_init = [
    {
      url: '/provider/settings',
      title: 'Settings'
    },
    {
      title: 'Communications And Notifications',
      url: '/provider/settings/comm',
    },
    {
      title: 'Notifications',
      url: '/provider/settings/comm/notifications',
    }
  ];
  breadcrumbs = this.breadcrumbs_init;

  sms = false;
  email = false;
  cheknPushph = false;
  cheknCancelPushph = false;
  // cheknpush = false;
  smsAppt = false;
  emailAppt = false;
  apptPushph = false;
  smsOrder = false;
  emailOrder = false;
  orderPushph = false;
  apptcancelPushph = false;
  // apptPush = false;
  smsDonate = false;
  pushAppDonate = false;
  smsSystem = false;
  pushSystem = false;
  emaildonate = false;
  emailsystem = false;
  systemPush = false;
  donatePush = false;
  cancelsmsAppt = false;
  cancelemailAppt = false;
  cancelpushAppt = false;
  cancelemailOrder = false;
  cancelsmsOrder = false;
  OrdercancelPushph = false;
  cancelsms = false;
  cancelemail = false;
  cancelpush = false;

  notifyphonenumber = '';
  notifycheknPushphonenumber = '';
  notifycheknCancelPushphonenumber = '';
  notifyemail = '';
  notifycanclphonenumber = '';
  notifycanclemail = '';
  notifyApptphonenumber = '';
  notifyOrderphonenumber = '';
  notifyApptemail = '';
  notifyOrderemail = '';
  notifyapptPushphonenumber = '';
  notifyorderPushphonenumber = '';
  notifyApptcanclphonenumber = '';
  notifyOrdercanclphonenumber = '';
  notifyapptcancelPushphonenumber = '';
  notifyOrdercancelPushphonenumber = '';
  notifyApptcanclemail = '';
  notifyOrdercanclemail = '';
  notifyDonatephonenumber = '';
  notifypushDonatephonenumber = '';
  notifySystemphonenumber = '';
  notifypushSystemphonenumber = '';
  notifydonateemail = '';
  notifysystememail = '';


  api_error = null;
  api_success = null;
  ph_arr: any = [];
  cheknPushph_arr: any = [];
  cheknCancelPushph_arr: any = [];
  em_arr: any = [];
  ph1_arr: any = [];
  em1_arr: any = [];

  apptph_arr: any = [];
  apptem_arr: any = [];
  apptPushph_arr: any = [];
  orderem_arr = [];
  orderph_arr = [];
  orderPushph_arr = [];
  apptcancelPushph_arr: any = [];
  ordercancelPushph_arr: any = [];
  apptph1_arr: any = [];
  apptem1_arr: any = [];
  orderph1_arr: any = [];
  orderem1_arr: any = [];
  donateem_arr: any = [];
  donateph_arr: any = [];
  donatepushph_arr: any = [];
  systemph_arr: any = [];
  pushsystemph_arr: any = [];
  systemem_arr: any = [];
  domain;
  provdr_domain_name = '';
  provider_label = '';
  savechekinNotification_json: any = {};
  savecancelNotification_json: any = {};
  notificationList: any = [];
  okCheckinStatus = false;
  okCancelStatus = false;
  okApptCancelStatus = false;
  okOrderCancelStatus = false;
  okApptStatus = false;
  okOrderStatus = false;
  okDonateStatus = false;
  okSystemStatus = false;
  selApptNotify = false;
  selOrderNotify = false;
  selApptCancelNotify = false;
  selOrderCancelNotify = false;
  SelchkinNotify = false;
  SelchkincnclNotify = false;
  selDonatnNotify = false;
  selSystemNotify = false;
  mode_of_notify = '';
  checkin_label = '';
  appointment_status: any;
  waitlistStatus: any;
  donations_status: any;
  order_status: any;
  settings: any = [];
  showToken = false;
  api_loading = true;
  crumbtitle;
  breadcrmbTitle;
  smsCredits;
  is_smsLow = false;
  smsWarnMsg: string;
  is_noSMS = false;
  corpSettings: any;
  addondialogRef: any;
  accountType;
  constructor(private sharedfunctionObj: SharedFunctions,
    private routerobj: Router,
    public route: ActivatedRoute,
    private snackbarService: SnackbarService,
        private wordProcessor: WordProcessor,
        private groupService: GroupStorageService,
    private dialog: MatDialog,
    public provider_services: ProviderServices) {
    this.provider_label = this.wordProcessor.getTerminologyTerm('provider');
    this.checkin_label = this.wordProcessor.getTerminologyTerm('waitlist');
    this.route.queryParams.subscribe(
      params => {
        this.crumbtitle = params.type;
      });
  }

  ngOnInit() {
    const user = this.groupService.getitemFromGroupStorage('ynw-user');
    this.domain = user.sector;
    this.accountType = user.accountType;
    this.breadcrumb_moreoptions = { 'actions': [{ 'title': 'Help', 'type': 'learnmore' }] };
    this.isCheckin = this.groupService.getitemFromGroupStorage('isCheckin');
    this.getGlobalSettingsStatus();
    // this.getNotificationList();
    // this.getSMSCredits();
    this.getOrderStatus();
    this.provdr_domain_name = Messages.PROVIDER_NAME.replace('[provider]', this.provider_label);
    if (this.crumbtitle === 'Hospital') {
      this.breadcrmbTitle = 'Hospital Notifications';
    } else {
      this.breadcrmbTitle = this.provider_label + ' Notifications';
    }
    const breadcrumbs = [];
    this.breadcrumbs_init.map((e) => {
      breadcrumbs.push(e);
    });
    breadcrumbs.push({
      title: this.breadcrmbTitle
    });
    this.breadcrumbs = breadcrumbs;
    this.getProviderSettings();
  }
  getProviderSettings() {
    this.provider_services.getWaitlistMgr()
      .subscribe(data => {
        this.settings = data;
        this.showToken = this.settings.showTokenId;
      }, () => {
      });
  }
  getGlobalSettingsStatus() {
    this.provider_services.getGlobalSettings().subscribe(
      (data: any) => {
        this.appointment_status = data.appointment;
        this.waitlistStatus = data.waitlist;
        this.donations_status = data.donationFundRaising;
        this.order_status = data.order;
        this.api_loading = false;
      });
  }
  getNotificationList() {
    this.provider_services.getUserNotificationList(0)
      .subscribe(
        data => {
          this.notificationList = data;
          this.setNotificationList(this.notificationList);
        },
        error => {
          this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
        }
      );
  }

  performActions(action) {
    if (action === 'learnmore') {
      this.routerobj.navigate(['/provider/' + this.domain + '/comm->notifications']);
    }
  }
  setNotificationList(notificationList) {
    if (notificationList.length !== 0) {
      for (const notifyList of notificationList) {
        if (notifyList.eventType && notifyList.eventType === 'WAITLISTADD') {
          if (notifyList.email.length === 0 && notifyList.sms.length === 0 && notifyList.pushMsg.length === 0) {
            // console.log(this.SelchkinNotify);
            this.SelchkinNotify = false;
          }
          if (notifyList.email && notifyList.email.length !== 0) {
            this.em_arr = notifyList.email;
            this.SelchkinNotify = true;
          }
          if (notifyList.sms && notifyList.sms.length !== 0) {
            this.ph_arr = notifyList.sms;
            this.SelchkinNotify = true;
          }
          if (notifyList.pushMsg && notifyList.pushMsg.length !== 0) {
            this.cheknPushph_arr = notifyList.pushMsg;
            this.SelchkinNotify = true;
          }
        } else if (notifyList.eventType && notifyList.eventType === 'WAITLISTCANCEL') {
          if (notifyList.email.length === 0 && notifyList.sms.length === 0 && notifyList.pushMsg.length === 0) {
            this.SelchkincnclNotify = false;
          }
          if (notifyList.email && notifyList.email.length !== 0) {
            this.em1_arr = notifyList.email;
            this.SelchkincnclNotify = true;
          }
          if (notifyList.sms && notifyList.sms.length !== 0) {
            this.ph1_arr = notifyList.sms;
            this.SelchkincnclNotify = true;
          }
          if (notifyList.pushMsg && notifyList.pushMsg.length !== 0) {
            this.cheknCancelPushph_arr = notifyList.pushMsg;
            this.SelchkincnclNotify = true;
          }
        } else if (notifyList.eventType && notifyList.eventType === 'APPOINTMENTADD') {
          if (notifyList.email.length === 0 && notifyList.sms.length === 0 && notifyList.pushMsg.length === 0) {
            this.selApptNotify = false;
          }
          if (notifyList.email && notifyList.email.length !== 0) {
            this.apptem_arr = notifyList.email;
            this.selApptNotify = true;
          }
          if (notifyList.sms && notifyList.sms.length !== 0) {
            this.apptph_arr = notifyList.sms;
            this.selApptNotify = true;
          }
          if (notifyList.pushMsg && notifyList.pushMsg.length !== 0) {
            this.apptPushph_arr = notifyList.pushMsg;
            this.selApptNotify = true;
          }
        } else if (notifyList.eventType && notifyList.eventType === 'ORDERCONFIRM') {
          if (notifyList.email.length === 0 && notifyList.sms.length === 0 && notifyList.pushMsg.length === 0) {
            this.selOrderNotify = false;
          }
          if (notifyList.email && notifyList.email.length !== 0) {
            this.orderem_arr = notifyList.email;
            this.selOrderNotify = true;
          }
          if (notifyList.sms && notifyList.sms.length !== 0) {
            this.orderph_arr = notifyList.sms;
            this.selOrderNotify = true;
          }
          if (notifyList.pushMsg && notifyList.pushMsg.length !== 0) {
            this.orderPushph_arr = notifyList.pushMsg;
            this.selOrderNotify = true;
          }
        } else if (notifyList.eventType && notifyList.eventType === 'ORDERCANCEL') {
          if (notifyList.email.length === 0 && notifyList.sms.length === 0 && notifyList.pushMsg.length === 0) {
            this.selOrderCancelNotify = false;
          }
          if (notifyList.email && notifyList.email.length !== 0) {
            this.orderem1_arr = notifyList.email;
            this.selOrderCancelNotify = true;
          }
          if (notifyList.sms && notifyList.sms.length !== 0) {
            this.orderph1_arr = notifyList.sms;
            this.selOrderCancelNotify = true;
          }
          if (notifyList.pushMsg && notifyList.pushMsg.length !== 0) {
            this.ordercancelPushph_arr = notifyList.pushMsg;
            this.selOrderCancelNotify = true;
          }
        } else if (notifyList.eventType && notifyList.eventType === 'APPOINTMENTCANCEL') {
          if (notifyList.email.length === 0 && notifyList.sms.length === 0 && notifyList.pushMsg.length === 0) {
            this.selApptCancelNotify = false;
          }
          if (notifyList.email && notifyList.email.length !== 0) {
            this.apptem1_arr = notifyList.email;
            this.selApptCancelNotify = true;
          }
          if (notifyList.sms && notifyList.sms.length !== 0) {
            this.apptph1_arr = notifyList.sms;
            this.selApptCancelNotify = true;
          }
          if (notifyList.pushMsg && notifyList.pushMsg.length !== 0) {
            this.apptcancelPushph_arr = notifyList.pushMsg;
            this.selApptCancelNotify = true;
          }
        }
        else if (notifyList.eventType && notifyList.eventType === 'DONATIONSERVICE') {
          if (notifyList.email.length === 0 && notifyList.sms.length === 0 && notifyList.pushMsg.length === 0) {
            this.selDonatnNotify = false;
          }
          if (notifyList.email && notifyList.email.length !== 0) {
            this.donateem_arr = notifyList.email;
            this.selDonatnNotify = true;
          }
          if (notifyList.sms && notifyList.sms.length !== 0) {
            this.donateph_arr = notifyList.sms;
            this.selDonatnNotify = true;
          }
          if (notifyList.pushMsg && notifyList.pushMsg.length !== 0) {
            this.donatepushph_arr = notifyList.pushMsg;
            this.selDonatnNotify = true;
          }
        } else if (notifyList.eventType && notifyList.eventType === 'LICENSE') {
          if (notifyList.email.length === 0 && notifyList.sms.length === 0 && notifyList.pushMsg.length === 0) {
            this.selSystemNotify = false;
          }
          if (notifyList.email && notifyList.email.length !== 0) {
            this.systemem_arr = notifyList.email;
            this.selSystemNotify = true;
          }
          if (notifyList.sms && notifyList.sms.length !== 0) {
            this.systemph_arr = notifyList.sms;
            this.selSystemNotify = true;
          }
          if (notifyList.pushMsg && notifyList.pushMsg.length !== 0) {
            this.pushsystemph_arr = notifyList.pushMsg;
            this.selSystemNotify = true;
          }
        }
      }
    }
  }
  selectChekinNotify(event) {
    this.SelchkinNotify = event.checked;
    if (!this.SelchkinNotify) {
      this.chekinNotifications('newcheckin');
    }
  }
  selectChekinCanclNotify(event) {
    this.SelchkincnclNotify = event.checked;
    if (!this.SelchkincnclNotify) {
      this.checkinCancelNotifications('cancelcheckin');
    }
  }
  selectApptNotify(event) {
    this.selApptNotify = event.checked;
    if (!this.selApptNotify) {
      this.apptNotifications('newappointment');
    }
  }
  selectOrderNotify(event) {
    this.selOrderNotify = event.checked;
    if (!this.selOrderNotify) {
      this.orderNotifications('neworder');
    }
  }
  selectApptCanclNotify(event) {
    this.selApptCancelNotify = event.checked;
    if (!this.selApptCancelNotify) {
      this.apptCancelNotifications('cancelappointment');
    }
  }
  selectOrderCanclNotify(event) {
    this.selOrderCancelNotify = event.checked;
    if (!this.selOrderCancelNotify) {
      this.OrderCancelNotifications('cancelorder');
    }
  }
  selectDonatinNotify(event) {
    this.selDonatnNotify = event.checked;
    if (!this.selDonatnNotify) {
      this.donateNotifications('newdonation');
    }
  }
  selectSystemNotify(event) {
    this.selSystemNotify = event.checked;
    if (!this.selSystemNotify) {
      this.systemNotifications('newdonation');
    }
  }


  addChkinPh() {
    this.resetApiErrors();
    if (this.notifyphonenumber === '') {
      this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PHONENO'), { 'panelClass': 'snackbarerror' });
      // 'Please enter mobile phone number';
      return;
    }
    if (this.notifyphonenumber !== '') {
      const curphone = this.notifyphonenumber;
      const pattern = new RegExp(projectConstantsLocal.VALIDATOR_NUMBERONLY);
      const result = pattern.test(curphone);
      if (!result) {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_INVALID'), { 'panelClass': 'snackbarerror' });
        // 'Please enter a valid mobile phone number';
        return;
      }
      const pattern1 = new RegExp(projectConstantsLocal.VALIDATOR_PHONENUMBERCOUNT10);
      const result1 = pattern1.test(curphone);
      if (!result1) {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_10DIGITS'), { 'panelClass': 'snackbarerror' });
        // 'Mobile number should have 10 digits';
        return;
      }

      if (this.ph_arr.indexOf(curphone) === -1) {
        this.ph_arr.push(curphone);
      } else {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_DUPLICATE'), { 'panelClass': 'snackbarerror' });
        // 'Phone number already exists'
      }
      this.okCheckinStatus = true;
      this.notifyphonenumber = '';
    }
  }
  addcheknPushPh() {
    this.resetApiErrors();
    if (this.notifycheknPushphonenumber === '') {
      this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PHONENO'), { 'panelClass': 'snackbarerror' });
      // 'Please enter mobile phone number';
      return;
    }
    if (this.notifycheknPushphonenumber !== '') {
      const curphone = this.notifycheknPushphonenumber;
      const pattern = new RegExp(projectConstantsLocal.VALIDATOR_NUMBERONLY);
      const result = pattern.test(curphone);
      if (!result) {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_INVALID'), { 'panelClass': 'snackbarerror' });
        // 'Please enter a valid mobile phone number';
        return;
      }
      const pattern1 = new RegExp(projectConstantsLocal.VALIDATOR_PHONENUMBERCOUNT10);
      const result1 = pattern1.test(curphone);
      if (!result1) {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_10DIGITS'), { 'panelClass': 'snackbarerror' });
        // 'Mobile number should have 10 digits';
        return;
      }

      if (this.cheknPushph_arr.indexOf(curphone) === -1) {
        this.cheknPushph_arr.push(curphone);
      } else {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_DUPLICATE'), { 'panelClass': 'snackbarerror' });
        // 'Phone number already exists'
      }
      this.okCheckinStatus = true;
      this.notifycheknPushphonenumber = '';
      this.cheknPushph = false;
    }
  }
  addChkinemil() {
    this.resetApiErrors();
    if (this.notifyemail === '') {
      this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_EMAIL_INVALID'), { 'panelClass': 'snackbarerror' });
      // 'Please enter a valid email id';
      return;
    }
    if (this.notifyemail !== '') {
      const curemail = this.notifyemail.trim();
      const pattern2 = new RegExp(projectConstantsLocal.VALIDATOR_EMAIL);
      const result2 = pattern2.test(curemail);
      if (!result2) {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_EMAIL_INVALID'), { 'panelClass': 'snackbarerror' });
        // 'Please enter a valid email id';
        return;
      }
      if (this.em_arr.indexOf(curemail) === -1) {
        this.em_arr.push(curemail);
      } else {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_EMAIL_DUPLICATE'), { 'panelClass': 'snackbarerror' });
        // 'Email already exists'
      }
      this.okCheckinStatus = true;
      this.notifyemail = '';
    }
  }
  addCheknCanclph() {
    this.resetApiErrors();
    if (this.notifycanclphonenumber === '') {
      this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PHONENO'), { 'panelClass': 'snackbarerror' });
      // 'Please enter mobile phone number';
      return;
    }
    if (this.notifycanclphonenumber !== '') {
      const curphone1 = this.notifycanclphonenumber;
      const pattern = new RegExp(projectConstantsLocal.VALIDATOR_NUMBERONLY);
      const result = pattern.test(curphone1);
      if (!result) {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_INVALID'), { 'panelClass': 'snackbarerror' });
        // 'Please enter a valid mobile phone number';
        return;
      }
      const pattern1 = new RegExp(projectConstantsLocal.VALIDATOR_PHONENUMBERCOUNT10);
      const result1 = pattern1.test(curphone1);
      if (!result1) {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_10DIGITS'), { 'panelClass': 'snackbarerror' });
        // 'Mobile number should have 10 digits';
        return;
      }
      if (this.ph1_arr.indexOf(curphone1) === -1) {
        this.ph1_arr.push(curphone1);
      } else {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_DUPLICATE'), { 'panelClass': 'snackbarerror' });
        // 'Phone number already exists'
      }
      // this.ph1_arr.push(curphone1);
      this.okCancelStatus = true;
      this.notifycanclphonenumber = '';
    }
  }
  addcheknCancelPushPh() {
    this.resetApiErrors();
    if (this.notifycheknCancelPushphonenumber === '') {
      this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PHONENO'), { 'panelClass': 'snackbarerror' });
      // 'Please enter mobile phone number';
      return;
    }
    if (this.notifycheknCancelPushphonenumber !== '') {
      const curphone = this.notifycheknCancelPushphonenumber;
      const pattern = new RegExp(projectConstantsLocal.VALIDATOR_NUMBERONLY);
      const result = pattern.test(curphone);
      if (!result) {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_INVALID'), { 'panelClass': 'snackbarerror' });
        // 'Please enter a valid mobile phone number';
        return;
      }
      const pattern1 = new RegExp(projectConstantsLocal.VALIDATOR_PHONENUMBERCOUNT10);
      const result1 = pattern1.test(curphone);
      if (!result1) {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_10DIGITS'), { 'panelClass': 'snackbarerror' });
        // 'Mobile number should have 10 digits';
        return;
      }

      if (this.cheknCancelPushph_arr.indexOf(curphone) === -1) {
        this.cheknCancelPushph_arr.push(curphone);
      } else {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_DUPLICATE'), { 'panelClass': 'snackbarerror' });
        // 'Phone number already exists'
      }
      this.okCancelStatus = true;
      this.notifycheknCancelPushphonenumber = '';
      this.cheknCancelPushph = false;
    }
  }
  addCheknCanclemil() {
    this.resetApiErrors();
    if (this.notifycanclemail === '') {
      this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_EMAIL_INVALID'), { 'panelClass': 'snackbarerror' }); // 'Please enter a valid email id';
      return;
    }
    if (this.notifycanclemail !== '') {
      const curemail1 = this.notifycanclemail.trim();
      const pattern2 = new RegExp(projectConstantsLocal.VALIDATOR_EMAIL);
      const result2 = pattern2.test(curemail1);
      if (!result2) {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_EMAIL_INVALID'), { 'panelClass': 'snackbarerror' }); // 'Please enter a valid email id';
        return;
      }
      if (this.em1_arr.indexOf(curemail1) === -1) {
        this.em1_arr.push(curemail1);
      } else {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_EMAIL_DUPLICATE'), { 'panelClass': 'snackbarerror' });
        // 'Email already exists'
      }
      this.notifycanclemail = '';
      this.okCancelStatus = true;
    }
  }
  addApptPh() {
    this.resetApiErrors();
    if (this.notifyApptphonenumber === '') {
      this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PHONENO'), { 'panelClass': 'snackbarerror' });
      // 'Please enter mobile phone number';
      return;
    }
    if (this.notifyApptphonenumber !== '') {
      const curphone = this.notifyApptphonenumber;
      const pattern = new RegExp(projectConstantsLocal.VALIDATOR_NUMBERONLY);
      const result = pattern.test(curphone);
      if (!result) {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_INVALID'), { 'panelClass': 'snackbarerror' });
        // 'Please enter a valid mobile phone number';
        return;
      }
      const pattern1 = new RegExp(projectConstantsLocal.VALIDATOR_PHONENUMBERCOUNT10);
      const result1 = pattern1.test(curphone);
      if (!result1) {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_10DIGITS'), { 'panelClass': 'snackbarerror' });
        // 'Mobile number should have 10 digits';
        return;
      }

      if (this.apptph_arr.indexOf(curphone) === -1) {
        this.apptph_arr.push(curphone);
      } else {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_DUPLICATE'), { 'panelClass': 'snackbarerror' });
        // 'Phone number already exists'
      }
      this.okApptStatus = true;
      this.notifyApptphonenumber = '';
    }
  }
  addOrderPh() {
    this.resetApiErrors();
    if (this.notifyOrderphonenumber === '') {
      this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PHONENO'), { 'panelClass': 'snackbarerror' });
      // 'Please enter mobile phone number';
      return;
    }
    if (this.notifyOrderphonenumber !== '') {
      const curphone = this.notifyOrderphonenumber;
      const pattern = new RegExp(projectConstantsLocal.VALIDATOR_NUMBERONLY);
      const result = pattern.test(curphone);
      if (!result) {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_INVALID'), { 'panelClass': 'snackbarerror' });
        // 'Please enter a valid mobile phone number';
        return;
      }
      const pattern1 = new RegExp(projectConstantsLocal.VALIDATOR_PHONENUMBERCOUNT10);
      const result1 = pattern1.test(curphone);
      if (!result1) {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_10DIGITS'), { 'panelClass': 'snackbarerror' });
        // 'Mobile number should have 10 digits';
        return;
      }

      if (this.orderph_arr.indexOf(curphone) === -1) {
        this.orderph_arr.push(curphone);
      } else {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_DUPLICATE'), { 'panelClass': 'snackbarerror' });
        // 'Phone number already exists'
      }
      this.okOrderStatus = true;
      this.notifyOrderphonenumber = '';
    }
  }
  addapptPushPh() {
    this.resetApiErrors();
    if (this.notifyapptPushphonenumber === '') {
      this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PHONENO'), { 'panelClass': 'snackbarerror' });
      // 'Please enter mobile phone number';
      return;
    }
    if (this.notifyapptPushphonenumber !== '') {
      const curphone = this.notifyapptPushphonenumber;
      const pattern = new RegExp(projectConstantsLocal.VALIDATOR_NUMBERONLY);
      const result = pattern.test(curphone);
      if (!result) {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_INVALID'), { 'panelClass': 'snackbarerror' });
        // 'Please enter a valid mobile phone number';
        return;
      }
      const pattern1 = new RegExp(projectConstantsLocal.VALIDATOR_PHONENUMBERCOUNT10);
      const result1 = pattern1.test(curphone);
      if (!result1) {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_10DIGITS'), { 'panelClass': 'snackbarerror' });
        // 'Mobile number should have 10 digits';
        return;
      }

      if (this.apptPushph_arr.indexOf(curphone) === -1) {
        this.apptPushph_arr.push(curphone);
      } else {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_DUPLICATE'), { 'panelClass': 'snackbarerror' });
        // 'Phone number already exists'
      }
      this.okApptStatus = true;
      this.notifyapptPushphonenumber = '';
      this.apptPushph = false;
    }
  }
  addorderPushPh() {
    this.resetApiErrors();
    if (this.notifyorderPushphonenumber === '') {
      this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PHONENO'), { 'panelClass': 'snackbarerror' });
      // 'Please enter mobile phone number';
      return;
    }
    if (this.notifyorderPushphonenumber !== '') {
      const curphone = this.notifyorderPushphonenumber;
      const pattern = new RegExp(projectConstantsLocal.VALIDATOR_NUMBERONLY);
      const result = pattern.test(curphone);
      if (!result) {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_INVALID'), { 'panelClass': 'snackbarerror' });
        // 'Please enter a valid mobile phone number';
        return;
      }
      const pattern1 = new RegExp(projectConstantsLocal.VALIDATOR_PHONENUMBERCOUNT10);
      const result1 = pattern1.test(curphone);
      if (!result1) {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_10DIGITS'), { 'panelClass': 'snackbarerror' });
        // 'Mobile number should have 10 digits';
        return;
      }

      if (this.orderPushph_arr.indexOf(curphone) === -1) {
        this.orderPushph_arr.push(curphone);
      } else {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_DUPLICATE'), { 'panelClass': 'snackbarerror' });
        // 'Phone number already exists'
      }
      this.okOrderStatus = true;
      this.notifyorderPushphonenumber = '';
    }
  }
  addApptemail() {
    this.resetApiErrors();
    if (this.notifyApptemail === '') {
      this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_EMAIL_INVALID'), { 'panelClass': 'snackbarerror' });
      // 'Please enter a valid email id';
      return;
    }
    if (this.notifyApptemail !== '') {
      const curemail = this.notifyApptemail.trim();
      const pattern2 = new RegExp(projectConstantsLocal.VALIDATOR_EMAIL);
      const result2 = pattern2.test(curemail);
      if (!result2) {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_EMAIL_INVALID'), { 'panelClass': 'snackbarerror' });
        // 'Please enter a valid email id';
        return;
      }
      if (this.apptem_arr.indexOf(curemail) === -1) {
        this.apptem_arr.push(curemail);
      } else {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_EMAIL_DUPLICATE'), { 'panelClass': 'snackbarerror' });
        // 'Email already exists'
      }
      this.okApptStatus = true;
      this.notifyApptemail = '';
    }
  }
  addOrderemail() {
    this.resetApiErrors();
    if (this.notifyOrderemail === '') {
      this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_EMAIL_INVALID'), { 'panelClass': 'snackbarerror' });
      // 'Please enter a valid email id';
      return;
    }
    if (this.notifyOrderemail !== '') {
      const curemail = this.notifyOrderemail.trim();
      const pattern2 = new RegExp(projectConstantsLocal.VALIDATOR_EMAIL);
      const result2 = pattern2.test(curemail);
      if (!result2) {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_EMAIL_INVALID'), { 'panelClass': 'snackbarerror' });
        // 'Please enter a valid email id';
        return;
      }
      if (this.orderem_arr.indexOf(curemail) === -1) {
        this.orderem_arr.push(curemail);
      } else {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_EMAIL_DUPLICATE'), { 'panelClass': 'snackbarerror' });
        // 'Email already exists'
      }
      this.okOrderStatus = true;
      this.notifyOrderemail = '';
    }
  }
  addApptCanclph() {
    this.resetApiErrors();
    if (this.notifyApptcanclphonenumber === '') {
      this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PHONENO'), { 'panelClass': 'snackbarerror' });
      // 'Please enter mobile phone number';
      return;
    }
    if (this.notifyApptcanclphonenumber !== '') {
      const curphone1 = this.notifyApptcanclphonenumber;
      const pattern = new RegExp(projectConstantsLocal.VALIDATOR_NUMBERONLY);
      const result = pattern.test(curphone1);
      if (!result) {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_INVALID'), { 'panelClass': 'snackbarerror' });
        // 'Please enter a valid mobile phone number';
        return;
      }
      const pattern1 = new RegExp(projectConstantsLocal.VALIDATOR_PHONENUMBERCOUNT10);
      const result1 = pattern1.test(curphone1);
      if (!result1) {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_10DIGITS'), { 'panelClass': 'snackbarerror' });
        // 'Mobile number should have 10 digits';
        return;
      }
      if (this.apptph1_arr.indexOf(curphone1) === -1) {
        this.apptph1_arr.push(curphone1);
      } else {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_DUPLICATE'), { 'panelClass': 'snackbarerror' });
        // 'Phone number already exists'
      }
      // this.ph1_arr.push(curphone1);
      this.okApptCancelStatus = true;
      this.notifyApptcanclphonenumber = '';
    }
  }
  addOrderCanclph() {
    this.resetApiErrors();
    if (this.notifyOrdercanclphonenumber === '') {
      this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PHONENO'), { 'panelClass': 'snackbarerror' });
      // 'Please enter mobile phone number';
      return;
    }
    if (this.notifyOrdercanclphonenumber !== '') {
      const curphone1 = this.notifyOrdercanclphonenumber;
      const pattern = new RegExp(projectConstantsLocal.VALIDATOR_NUMBERONLY);
      const result = pattern.test(curphone1);
      if (!result) {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_INVALID'), { 'panelClass': 'snackbarerror' });
        // 'Please enter a valid mobile phone number';
        return;
      }
      const pattern1 = new RegExp(projectConstantsLocal.VALIDATOR_PHONENUMBERCOUNT10);
      const result1 = pattern1.test(curphone1);
      if (!result1) {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_10DIGITS'), { 'panelClass': 'snackbarerror' });
        // 'Mobile number should have 10 digits';
        return;
      }
      if (this.orderph1_arr.indexOf(curphone1) === -1) {
        this.orderph1_arr.push(curphone1);
      } else {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_DUPLICATE'), { 'panelClass': 'snackbarerror' });
        // 'Phone number already exists'
      }
      // this.ph1_arr.push(curphone1);
      this.okOrderCancelStatus = true;
      this.notifyOrdercanclphonenumber = '';
    }
  }
  addapptcancelPushPh() {
    this.resetApiErrors();
    if (this.notifyapptcancelPushphonenumber === '') {
      this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PHONENO'), { 'panelClass': 'snackbarerror' });
      // 'Please enter mobile phone number';
      return;
    }
    if (this.notifyapptcancelPushphonenumber !== '') {
      const curphone = this.notifyapptcancelPushphonenumber;
      const pattern = new RegExp(projectConstantsLocal.VALIDATOR_NUMBERONLY);
      const result = pattern.test(curphone);
      if (!result) {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_INVALID'), { 'panelClass': 'snackbarerror' });
        // 'Please enter a valid mobile phone number';
        return;
      }
      const pattern1 = new RegExp(projectConstantsLocal.VALIDATOR_PHONENUMBERCOUNT10);
      const result1 = pattern1.test(curphone);
      if (!result1) {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_10DIGITS'), { 'panelClass': 'snackbarerror' });
        // 'Mobile number should have 10 digits';
        return;
      }

      if (this.apptcancelPushph_arr.indexOf(curphone) === -1) {
        this.apptcancelPushph_arr.push(curphone);
      } else {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_DUPLICATE'), { 'panelClass': 'snackbarerror' });
        // 'Phone number already exists'
      }
      this.okApptCancelStatus = true;
      this.notifyapptcancelPushphonenumber = '';
      this.apptcancelPushph = false;
    }
  }
  addOrdercancelPushPh() {
    this.resetApiErrors();
    if (this.notifyOrdercancelPushphonenumber === '') {
      this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PHONENO'), { 'panelClass': 'snackbarerror' });
      // 'Please enter mobile phone number';
      return;
    }
    if (this.notifyOrdercancelPushphonenumber !== '') {
      const curphone = this.notifyOrdercancelPushphonenumber;
      const pattern = new RegExp(projectConstantsLocal.VALIDATOR_NUMBERONLY);
      const result = pattern.test(curphone);
      if (!result) {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_INVALID'), { 'panelClass': 'snackbarerror' });
        // 'Please enter a valid mobile phone number';
        return;
      }
      const pattern1 = new RegExp(projectConstantsLocal.VALIDATOR_PHONENUMBERCOUNT10);
      const result1 = pattern1.test(curphone);
      if (!result1) {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_10DIGITS'), { 'panelClass': 'snackbarerror' });
        // 'Mobile number should have 10 digits';
        return;
      }

      if (this.ordercancelPushph_arr.indexOf(curphone) === -1) {
        this.ordercancelPushph_arr.push(curphone);
      } else {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_DUPLICATE'), { 'panelClass': 'snackbarerror' });
        // 'Phone number already exists'
      }
      this.okOrderCancelStatus = true;
      this.notifyOrdercancelPushphonenumber = '';
    }
  }
  addApptCancelemail() {
    this.resetApiErrors();
    if (this.notifyApptcanclemail === '') {
      this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_EMAIL_INVALID'), { 'panelClass': 'snackbarerror' }); // 'Please enter a valid email id';
      return;
    }
    if (this.notifyApptcanclemail !== '') {
      const curemail1 = this.notifyApptcanclemail.trim();
      const pattern2 = new RegExp(projectConstantsLocal.VALIDATOR_EMAIL);
      const result2 = pattern2.test(curemail1);
      if (!result2) {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_EMAIL_INVALID'), { 'panelClass': 'snackbarerror' }); // 'Please enter a valid email id';
        return;
      }
      if (this.apptem1_arr.indexOf(curemail1) === -1) {
        this.apptem1_arr.push(curemail1);
      } else {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_EMAIL_DUPLICATE'), { 'panelClass': 'snackbarerror' });
        // 'Email already exists'
      }
      this.notifyApptcanclemail = '';
      this.okApptCancelStatus = true;
    }
  }
  addOrderCancelemail() {
    this.resetApiErrors();
    if (this.notifyOrdercanclemail === '') {
      this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_EMAIL_INVALID'), { 'panelClass': 'snackbarerror' }); // 'Please enter a valid email id';
      return;
    }
    if (this.notifyOrdercanclemail !== '') {
      const curemail1 = this.notifyOrdercanclemail.trim();
      const pattern2 = new RegExp(projectConstantsLocal.VALIDATOR_EMAIL);
      const result2 = pattern2.test(curemail1);
      if (!result2) {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_EMAIL_INVALID'), { 'panelClass': 'snackbarerror' }); // 'Please enter a valid email id';
        return;
      }
      if (this.orderem1_arr.indexOf(curemail1) === -1) {
        this.orderem1_arr.push(curemail1);
      } else {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_EMAIL_DUPLICATE'), { 'panelClass': 'snackbarerror' });
        // 'Email already exists'
      }
      this.notifyOrdercanclemail = '';
      this.okOrderCancelStatus = true;
    }
  }
  addDonatePh() {
    this.resetApiErrors();
    if (this.notifyDonatephonenumber === '') {
      this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PHONENO'), { 'panelClass': 'snackbarerror' });
      // 'Please enter mobile phone number';
      return;
    }
    if (this.notifyDonatephonenumber !== '') {
      const curphone = this.notifyDonatephonenumber;
      const pattern = new RegExp(projectConstantsLocal.VALIDATOR_NUMBERONLY);
      const result = pattern.test(curphone);
      if (!result) {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_INVALID'), { 'panelClass': 'snackbarerror' });
        // 'Please enter a valid mobile phone number';
        return;
      }
      const pattern1 = new RegExp(projectConstantsLocal.VALIDATOR_PHONENUMBERCOUNT10);
      const result1 = pattern1.test(curphone);
      if (!result1) {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_10DIGITS'), { 'panelClass': 'snackbarerror' });
        // 'Mobile number should have 10 digits';
        return;
      }

      if (this.donateph_arr.indexOf(curphone) === -1) {
        this.donateph_arr.push(curphone);
      } else {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_DUPLICATE'), { 'panelClass': 'snackbarerror' });
        // 'Phone number already exists'
      }
      this.okDonateStatus = true;
      this.notifyDonatephonenumber = '';
    }
  }
  addpushDonatePh() {
    this.resetApiErrors();
    if (this.notifypushDonatephonenumber === '') {
      this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PHONENO'), { 'panelClass': 'snackbarerror' });
      // 'Please enter mobile phone number';
      return;
    }
    if (this.notifypushDonatephonenumber !== '') {
      const curphone = this.notifypushDonatephonenumber;
      const pattern = new RegExp(projectConstantsLocal.VALIDATOR_NUMBERONLY);
      const result = pattern.test(curphone);
      if (!result) {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_INVALID'), { 'panelClass': 'snackbarerror' });
        // 'Please enter a valid mobile phone number';
        return;
      }
      const pattern1 = new RegExp(projectConstantsLocal.VALIDATOR_PHONENUMBERCOUNT10);
      const result1 = pattern1.test(curphone);
      if (!result1) {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_10DIGITS'), { 'panelClass': 'snackbarerror' });
        // 'Mobile number should have 10 digits';
        return;
      }

      if (this.donatepushph_arr.indexOf(curphone) === -1) {
        this.donatepushph_arr.push(curphone);
      } else {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_DUPLICATE'), { 'panelClass': 'snackbarerror' });
        // 'Phone number already exists'
      }
      this.okDonateStatus = true;
      this.notifypushDonatephonenumber = '';
      this.pushAppDonate = false;
    }
  }
  addDonatemail() {
    this.resetApiErrors();
    if (this.notifydonateemail === '') {
      this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_EMAIL_INVALID'), { 'panelClass': 'snackbarerror' });
      // 'Please enter a valid email id';
      return;
    }
    if (this.notifydonateemail !== '') {
      const curemail = this.notifydonateemail.trim();
      const pattern2 = new RegExp(projectConstantsLocal.VALIDATOR_EMAIL);
      const result2 = pattern2.test(curemail);
      if (!result2) {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_EMAIL_INVALID'), { 'panelClass': 'snackbarerror' });
        // 'Please enter a valid email id';
        return;
      }
      if (this.donateem_arr.indexOf(curemail) === -1) {
        this.donateem_arr.push(curemail);
      } else {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_EMAIL_DUPLICATE'), { 'panelClass': 'snackbarerror' });
        // 'Email already exists'
      }
      this.okDonateStatus = true;
      this.notifydonateemail = '';
    }
  }

  addSystemPh() {
    this.resetApiErrors();
    if (this.notifySystemphonenumber === '') {
      this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PHONENO'), { 'panelClass': 'snackbarerror' });
      // 'Please enter mobile phone number';
      return;
    }
    if (this.notifySystemphonenumber !== '') {
      const curphone = this.notifySystemphonenumber;
      const pattern = new RegExp(projectConstantsLocal.VALIDATOR_NUMBERONLY);
      const result = pattern.test(curphone);
      if (!result) {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_INVALID'), { 'panelClass': 'snackbarerror' });
        // 'Please enter a valid mobile phone number';
        return;
      }
      const pattern1 = new RegExp(projectConstantsLocal.VALIDATOR_PHONENUMBERCOUNT10);
      const result1 = pattern1.test(curphone);
      if (!result1) {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_10DIGITS'), { 'panelClass': 'snackbarerror' });
        // 'Mobile number should have 10 digits';
        return;
      }

      if (this.systemph_arr.indexOf(curphone) === -1) {
        this.systemph_arr.push(curphone);
      } else {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_DUPLICATE'), { 'panelClass': 'snackbarerror' });
        // 'Phone number already exists'
      }
      this.okSystemStatus = true;
      this.notifySystemphonenumber = '';
    }
  }
  addpushSystemPh() {
    this.resetApiErrors();
    if (this.notifypushSystemphonenumber === '') {
      this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PHONENO'), { 'panelClass': 'snackbarerror' });
      // 'Please enter mobile phone number';
      return;
    }
    if (this.notifypushSystemphonenumber !== '') {
      const curphone = this.notifypushSystemphonenumber;
      const pattern = new RegExp(projectConstantsLocal.VALIDATOR_NUMBERONLY);
      const result = pattern.test(curphone);
      if (!result) {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_INVALID'), { 'panelClass': 'snackbarerror' });
        // 'Please enter a valid mobile phone number';
        return;
      }
      const pattern1 = new RegExp(projectConstantsLocal.VALIDATOR_PHONENUMBERCOUNT10);
      const result1 = pattern1.test(curphone);
      if (!result1) {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_10DIGITS'), { 'panelClass': 'snackbarerror' });
        // 'Mobile number should have 10 digits';
        return;
      }

      if (this.pushsystemph_arr.indexOf(curphone) === -1) {
        this.pushsystemph_arr.push(curphone);
      } else {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_PHONE_DUPLICATE'), { 'panelClass': 'snackbarerror' });
        // 'Phone number already exists'
      }
      this.okSystemStatus = true;
      this.notifypushSystemphonenumber = '';
      this.pushSystem = false;
    }
  }

  addSystemmail() {
    this.resetApiErrors();
    if (this.notifysystememail === '') {
      this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_EMAIL_INVALID'), { 'panelClass': 'snackbarerror' });
      // 'Please enter a valid email id';
      return;
    }
    if (this.notifysystememail !== '') {
      const curemail = this.notifysystememail.trim();
      const pattern2 = new RegExp(projectConstantsLocal.VALIDATOR_EMAIL);
      const result2 = pattern2.test(curemail);
      if (!result2) {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_EMAIL_INVALID'), { 'panelClass': 'snackbarerror' });
        // 'Please enter a valid email id';
        return;
      }
      if (this.systemem_arr.indexOf(curemail) === -1) {
        this.systemem_arr.push(curemail);
      } else {
        this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('BPROFILE_PRIVACY_EMAIL_DUPLICATE'), { 'panelClass': 'snackbarerror' });
        // 'Email already exists'
      }
      this.okSystemStatus = true;
      this.notifysystememail = '';
    }
  }
  resetApiErrors() {
    this.api_error = null;
    this.api_success = null;
  }
  chekinNotifications(source) {
    this.savechekinNotification_json = {};
    let chekinMode = 'ADD';
    if (this.notificationList.length === 0) {
      chekinMode = 'ADD';
    }
    for (const notifyList of this.notificationList) {
      if (notifyList.eventType && notifyList.eventType === 'WAITLISTADD') {
        chekinMode = 'UPDATE';
      }
    }
    if (!this.SelchkinNotify) {
      this.em_arr = [];
      this.ph_arr = [];
      this.cheknPushph_arr = [];
      // this.cheknpush = false;
    }
    this.savechekinNotification_json.resourceType = 'CHECKIN';
    this.savechekinNotification_json.eventType = 'WAITLISTADD';
    this.savechekinNotification_json.sms = this.ph_arr;
    this.savechekinNotification_json.email = this.em_arr;
    this.savechekinNotification_json.pushMsg = this.cheknPushph_arr;
    this.savechekinNotification_json.providerId = 0;
    this.saveNotifctnJson(this.savechekinNotification_json, chekinMode, source);
  }

  checkinCancelNotifications(source) {
    this.savecancelNotification_json = {};
    let chekincancelMode = 'ADD';
    if (this.notificationList.length === 0) {
      chekincancelMode = 'ADD';
    }
    for (const notifyList of this.notificationList) {
      if (notifyList.eventType && notifyList.eventType === 'WAITLISTCANCEL') {
        chekincancelMode = 'UPDATE';
      }
    }
    // console.log(this.SelchkincnclNotify);
    if (!this.SelchkincnclNotify) {
      this.em1_arr = [];
      this.ph1_arr = [];
      this.cheknCancelPushph_arr = [];
      // this.cancelpush = false;
    }
    this.savecancelNotification_json.resourceType = 'CHECKIN';
    this.savecancelNotification_json.eventType = 'WAITLISTCANCEL';
    this.savecancelNotification_json.sms = this.ph1_arr;
    this.savecancelNotification_json.email = this.em1_arr;
    this.savecancelNotification_json.pushMsg = this.cheknCancelPushph_arr;
    this.savecancelNotification_json.providerId = 0;
    this.saveNotifctnJson(this.savecancelNotification_json, chekincancelMode, source);
  }
  apptNotifications(source) {
    this.savechekinNotification_json = {};
    let chekinMode = 'ADD';
    if (this.notificationList.length === 0) {
      chekinMode = 'ADD';
    }
    for (const notifyList of this.notificationList) {
      if (notifyList.eventType && notifyList.eventType === 'APPOINTMENTADD') {
        chekinMode = 'UPDATE';
      }
    }
    if (!this.selApptNotify) {
      this.apptem_arr = [];
      this.apptph_arr = [];
      this.apptPushph_arr = [];
    }
    this.savechekinNotification_json.resourceType = 'APPOINTMENT';
    this.savechekinNotification_json.eventType = 'APPOINTMENTADD';
    this.savechekinNotification_json.sms = this.apptph_arr;
    this.savechekinNotification_json.email = this.apptem_arr;
    this.savechekinNotification_json.pushMsg = this.apptPushph_arr;
    this.savechekinNotification_json.providerId = 0;
    this.saveNotifctnJson(this.savechekinNotification_json, chekinMode, source);
  }
  orderNotifications(source) {
    this.savechekinNotification_json = {};
    let chekinMode = 'ADD';
    if (this.notificationList.length === 0) {
      chekinMode = 'ADD';
    }
    for (const notifyList of this.notificationList) {
      if (notifyList.eventType && notifyList.eventType === 'ORDERCONFIRM') {
        chekinMode = 'UPDATE';
      }
    }
    if (!this.selOrderNotify) {
      this.orderem_arr = [];
      this.orderph_arr = [];
      this.orderPushph_arr = [];
    }
    this.savechekinNotification_json.resourceType = 'ORDER';
    this.savechekinNotification_json.eventType = 'ORDERCONFIRM';
    this.savechekinNotification_json.sms = this.orderph_arr;
    this.savechekinNotification_json.email = this.orderem_arr;
    this.savechekinNotification_json.pushMsg = this.orderPushph_arr;
    this.savechekinNotification_json.providerId = 0;
    this.saveNotifctnJson(this.savechekinNotification_json, chekinMode, source);
  }

  apptCancelNotifications(source) {
    this.savecancelNotification_json = {};
    let chekincancelMode = 'ADD';
    if (this.notificationList.length === 0) {
      chekincancelMode = 'ADD';
    }
    for (const notifyList of this.notificationList) {
      if (notifyList.eventType && notifyList.eventType === 'APPOINTMENTCANCEL') {
        chekincancelMode = 'UPDATE';
      }
    }
    if (!this.selApptCancelNotify) {
      this.apptem1_arr = [];
      this.apptph1_arr = [];
      this.apptcancelPushph_arr = [];
    }
    this.savecancelNotification_json.resourceType = 'APPOINTMENT';
    this.savecancelNotification_json.eventType = 'APPOINTMENTCANCEL';
    this.savecancelNotification_json.sms = this.apptph1_arr;
    this.savecancelNotification_json.email = this.apptem1_arr;
    this.savecancelNotification_json.pushMsg = this.apptcancelPushph_arr;
    this.savecancelNotification_json.providerId = 0;
    this.saveNotifctnJson(this.savecancelNotification_json, chekincancelMode, source);
  }
  OrderCancelNotifications(source) {
    this.savecancelNotification_json = {};
    let chekincancelMode = 'ADD';
    if (this.notificationList.length === 0) {
      chekincancelMode = 'ADD';
    }
    for (const notifyList of this.notificationList) {
      if (notifyList.eventType && notifyList.eventType === 'ORDERCANCEL') {
        chekincancelMode = 'UPDATE';
      }
    }
    if (!this.selOrderCancelNotify) {
      this.orderph1_arr = [];
      this.orderem1_arr = [];
      this.ordercancelPushph_arr = [];
    }
    this.savecancelNotification_json.resourceType = 'ORDER';
    this.savecancelNotification_json.eventType = 'ORDERCANCEL';
    this.savecancelNotification_json.sms = this.orderph1_arr;
    this.savecancelNotification_json.email = this.orderem1_arr;
    this.savecancelNotification_json.pushMsg = this.ordercancelPushph_arr;
    this.savecancelNotification_json.providerId = 0;
    this.saveNotifctnJson(this.savecancelNotification_json, chekincancelMode, source);
  }
  donateNotifications(source) {
    this.savechekinNotification_json = {};
    let chekinMode = 'ADD';
    if (this.notificationList.length === 0) {
      chekinMode = 'ADD';
    }
    for (const notifyList of this.notificationList) {
      if (notifyList.eventType && notifyList.eventType === 'DONATIONSERVICE') {
        chekinMode = 'UPDATE';
      }
    }
    if (!this.selDonatnNotify) {
      this.donateem_arr = [];
      this.donateph_arr = [];
      this.donatepushph_arr = [];
    }
    this.savechekinNotification_json.resourceType = 'DONATION';
    this.savechekinNotification_json.eventType = 'DONATIONSERVICE';
    this.savechekinNotification_json.sms = this.donateph_arr;
    this.savechekinNotification_json.email = this.donateem_arr;
    this.savechekinNotification_json.pushMsg = this.donatepushph_arr;
    this.savechekinNotification_json.providerId = 0;
    this.saveNotifctnJson(this.savechekinNotification_json, chekinMode, source);
  }
  systemNotifications(source) {
    this.savechekinNotification_json = {};
    let chekinMode = 'ADD';
    if (this.notificationList.length === 0) {
      chekinMode = 'ADD';
    }
    for (const notifyList of this.notificationList) {
      if (notifyList.eventType && notifyList.eventType === 'LICENSE') {
        chekinMode = 'UPDATE';
      }
    }
    if (!this.selSystemNotify) {
      this.systemem_arr = [];
      this.systemph_arr = [];
      this.pushsystemph_arr = [];
    }
    this.savechekinNotification_json.resourceType = 'ACCOUNT';
    this.savechekinNotification_json.eventType = 'LICENSE';
    this.savechekinNotification_json.sms = this.systemph_arr;
    this.savechekinNotification_json.email = this.systemem_arr;
    this.savechekinNotification_json.pushMsg = this.pushsystemph_arr;
    this.savechekinNotification_json.providerId = 0;
    this.saveNotifctnJson(this.savechekinNotification_json, chekinMode, source);
  }
  saveNotifctnJson(saveNotification_json, mode, source) {
    this.sms = false;
    this.email = false;
    this.cheknPushph = false;
    this.cheknCancelPushph = false;
    this.cancelemail = false;
    this.cancelsms = false;
    this.smsAppt = false;
    this.smsDonate = false;
    this.pushAppDonate = false;
    this.smsSystem = false;
    this.pushSystem = false;
    this.emailAppt = false;
    this.apptPushph = false;
    this.apptcancelPushph = false;
    this.emaildonate = false;
    this.emailsystem = false;
    this.cancelemailAppt = false;
    this.cancelsmsAppt = false;
    this.cancelemailOrder = false;
    this.cancelsmsOrder = false;
    this.OrdercancelPushph = false;
    this.smsOrder = false;
    this.emailOrder = false;
    this.orderPushph = false;
    if (mode === 'ADD') {
      this.provider_services.addNotificationList(saveNotification_json)
        .subscribe(
          () => {
            this.getNotificationList();
            if (source === 'newcheckin') {
              this.okCheckinStatus = false;
            }
            if (source === 'cancelcheckin') {
              this.okCancelStatus = false;
            }
            if (source === 'newappointment') {
              this.okApptStatus = false;
            }
            if (source === 'neworder') {
              this.okOrderStatus = false;
            }
            if (source === 'cancelappointment') {
              this.okApptCancelStatus = false;
            }
            if (source === 'cancelorder') {
              this.okOrderCancelStatus = false;
            }
            if (source === 'newdonation') {
              this.okDonateStatus = true;
            }
            if (source === 'newsystem') {
              this.okSystemStatus = true;
            }
            this.api_success = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('ADD NOTIFICATIONS'));
          },
          error => {
            this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
          }
        );
    } else {
      this.provider_services.updateNotificationList(saveNotification_json)
        .subscribe(
          () => {
            this.getNotificationList();
            if (source === 'newcheckin') {
              this.okCheckinStatus = false;
            }
            if (source === 'cancelcheckin') {
              this.okCancelStatus = false;
            }
            if (source === 'newappointment') {
              this.okApptStatus = false;
            }
            if (source === 'neworder') {
              this.okOrderStatus = false;
            }
            if (source === 'cancelappointment') {
              this.okApptCancelStatus = false;
            }
            if (source === 'cancelorder') {
              this.okOrderCancelStatus = false;
            }
            if (source === 'newdonation') {
              this.okDonateStatus = true;
            }
            if (source === 'newsystem') {
              this.okSystemStatus = true;
            }
            this.api_success = this.snackbarService.openSnackBar(this.wordProcessor.getProjectMesssages('UPDATED NOTIFICATIONS'));
          },
          error => {
            this.api_error = this.snackbarService.openSnackBar(this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
          }
        );
    }
  }
  removePhEmail(phemail, array, source) {
    const index = array.indexOf(phemail);
    if (index > -1) {
      array.splice(index, 1);
    }
    if (source === 'newcheckin') {
      this.okCheckinStatus = true;
    }
    if (source === 'cancelcheckin') {
      this.okCancelStatus = true;
    }
    if (source === 'newappointment') {
      this.okApptStatus = true;
    }
    if (source === 'neworder') {
      this.okOrderStatus = true;
    }
    if (source === 'cancelappointment') {
      this.okApptCancelStatus = true;
    }
    if (source === 'cancelorder') {
      this.okOrderCancelStatus = true;
    }
    if (source === 'newdonation') {
      this.okDonateStatus = true;
    }
    if (source === 'newsystem') {
      this.okSystemStatus = true;
    }
  }
  smsAddClicked() {
    if (this.sms) {
      this.sms = false;
    } else {
      this.sms = true;
    }
  }
  cheknPushAddClicked() {
    if (this.cheknPushph) {
      this.cheknPushph = false;
    } else {
      this.cheknPushph = true;
    }
  }
  cancelledCheckinsmsAddClicked() {
    if (this.cancelsms) {
      this.cancelsms = false;
    } else {
      this.cancelsms = true;
    }
  }
  cheknCancelPushAddClicked() {
    if (this.cheknCancelPushph) {
      this.cheknCancelPushph = false;
    } else {
      this.cheknCancelPushph = true;
    }
  }
  smsApptAddClicked() {
    if (this.smsAppt) {
      this.smsAppt = false;
    } else {
      this.smsAppt = true;
    }
  }
  smsOrderAddClicked() {
    if (this.smsOrder) {
      this.smsOrder = false;
    } else {
      this.smsOrder = true;
    }
  }
  apptPushAddClicked() {
    if (this.apptPushph) {
      this.apptPushph = false;
    } else {
      this.apptPushph = true;
    }
  }
  orderPushAddClicked() {
    if (this.orderPushph) {
      this.orderPushph = false;
    } else {
      this.orderPushph = true;
    }
  }
  apptcancelPushAddClicked() {
    if (this.apptcancelPushph) {
      this.apptcancelPushph = false;
    } else {
      this.apptcancelPushph = true;
    }
  }
  ordercancelPushAddClicked() {
    if (this.OrdercancelPushph) {
      this.OrdercancelPushph = false;
    } else {
      this.OrdercancelPushph = true;
    }
  }
  smsDonateAddClicked() {
    if (this.smsDonate) {
      this.smsDonate = false;
    } else {
      this.smsDonate = true;
    }
  }
  pushAppDonateAddClicked() {
    if (this.pushAppDonate) {
      this.pushAppDonate = false;
    } else {
      this.pushAppDonate = true;
    }
  }

  smsSystemAddClicked() {
    if (this.smsSystem) {
      this.smsSystem = false;
    } else {
      this.smsSystem = true;
    }
  }
  pushSystemAddClicked() {
    if (this.pushSystem) {
      this.pushSystem = false;
    } else {
      this.pushSystem = true;
    }
  }
  cancelledApptsmsAddClicked() {
    if (this.cancelsmsAppt) {
      this.cancelsmsAppt = false;
    } else {
      this.cancelsmsAppt = true;
    }
  }
  cancelleOrdersmsAddClicked() {
    if (this.cancelsmsOrder) {
      this.cancelsmsOrder = false;
    } else {
      this.cancelsmsOrder = true;
    }
  }
  emailAddClicked() {
    if (this.email) {
      this.email = false;
    } else {
      this.email = true;
    }
  }
  cancelledCheckinemailAddClicked() {
    if (this.cancelemail) {
      this.cancelemail = false;
    } else {
      this.cancelemail = true;
    }
  }
  emailApptAddClicked() {
    if (this.emailAppt) {
      this.emailAppt = false;
    } else {
      this.emailAppt = true;
    }
  }
  emailOrderAddClicked() {
    if (this.emailOrder) {
      this.emailOrder = false;
    } else {
      this.emailOrder = true;
    }
  }
  cancelledApptemailAddClicked() {
    if (this.cancelemailAppt) {
      this.cancelemailAppt = false;
    } else {
      this.cancelemailAppt = true;
    }
  }
  cancelledOrderemailAddClicked() {
    if (this.cancelemailOrder) {
      this.cancelemailOrder = false;
    } else {
      this.cancelemailOrder = true;
    }
  }

  emaildonateAddClicked() {
    if (this.emaildonate) {
      this.emaildonate = false;
    } else {
      this.emaildonate = true;
    }
  }
  emailsystemAddClicked() {
    if (this.emailsystem) {
      this.emailsystem = false;
    } else {
      this.emailsystem = true;
    }
  }
  changePushMsgStatus(source) {
    if (source === 'newcheckin') {
      this.okCheckinStatus = true;
    }
    if (source === 'cancelcheckin') {
      this.okCancelStatus = true;
    }
    if (source === 'cancelappointment') {
      this.okApptCancelStatus = true;
    }
    if (source === 'cancelorder') {
      this.okOrderCancelStatus = true;
    }
    if (source === 'newappointment') {
      this.okApptStatus = true;
    }
    if (source === 'neworder') {
      this.okOrderStatus = true;
    }
    if (source === 'newdonation') {
      this.okDonateStatus = true;
    }
    if (source === 'newsystem') {
      this.okSystemStatus = true;
    }
  }
  learnmore_clicked(mod, e) {
    e.stopPropagation();
    this.routerobj.navigate(['/provider/' + this.domain + '/comm->' + mod]);
  }
  isNumeric(evt) {
    return this.sharedfunctionObj.isNumeric(evt);
  }
  goBack() {
    this.routerobj.navigate(['provider', 'settings', 'comm']);
  }

  getSMSCredits() {
    this.provider_services.getSMSCredits().subscribe(data => {
      this.smsCredits = data;
      if (this.smsCredits < 5 && this.smsCredits > 0) {
        this.is_smsLow = true;
        this.smsWarnMsg = Messages.LOW_SMS_CREDIT;
        this.getLicenseCorpSettings();
      } else if (this.smsCredits === 0) {
        this.is_smsLow = true;
        this.is_noSMS = true;
        this.smsWarnMsg = Messages.NO_SMS_CREDIT;
        this.getLicenseCorpSettings();
      } else {
        this.is_smsLow = false;
        this.is_noSMS = false;
      }
    });
  }
  getLicenseCorpSettings() {
    this.provider_services.getLicenseCorpSettings().subscribe(
      (data: any) => {
        this.corpSettings = data;
      }
    );
  }
  gotoSmsAddon() {
    if (this.corpSettings && this.corpSettings.isCentralised) {
      this.snackbarService.openSnackBar(Messages.CONTACT_SUPERADMIN, { 'panelClass': 'snackbarerror' });
    } else {
      this.addondialogRef = this.dialog.open(AddproviderAddonComponent, {
        width: '50%',
        data: {
          type: 'addons'
        },
        panelClass: ['popup-class', 'commonpopupmainclass'],
        disableClose: true
      });
      this.addondialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.getSMSCredits();
        }
      });
    }
  }
  getOrderStatus() {
    this.provider_services.getProviderOrderSettings().subscribe((data: any) => {
      this.order_status = data.enableOrder;
    });
  }
  showNotificationPopup(type) {
    if ((type === 'Token' || type === 'Check-in') && !this.waitlistStatus) {
      this.snackbarService.openSnackBar('Jaldee QManager is disabled in your settings', { 'panelClass': 'snackbarerror' });
    } else if (type === 'Appointment' && !this.appointment_status) {
      this.snackbarService.openSnackBar('Jaldee Appointment Manager is disabled in your settings', { 'panelClass': 'snackbarerror' });
    } else if (type === 'Order' && !this.order_status) {
      this.snackbarService.openSnackBar('Jaldee Order Manager is disabled in your settings', { 'panelClass': 'snackbarerror' });
    } else if (type === 'Donation' && !this.donations_status) {
      this.snackbarService.openSnackBar('Donation Manager is disabled in your settings', { 'panelClass': 'snackbarerror' });
    } else {
      const dialogref = this.dialog.open(UpdateProviderNotificationsComponent, {
        width: '40%',
        panelClass: ['popup-class', 'commonpopupmainclass'],
        disableClose: true,
        data: {
          type: type
        }
      });
      dialogref.afterClosed().subscribe(
        result => {

        });
    }
  }
}
