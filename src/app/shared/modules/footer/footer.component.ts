
import {interval as observableInterval,  Observable ,  Subscription, SubscriptionLike as ISubscription } from 'rxjs';
import { Component, OnInit, Inject, Input, OnDestroy, DoCheck } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { SharedServices } from '../../services/shared-services';
import { SharedFunctions } from '../../functions/shared-functions';
import { projectConstants } from '../../../shared/constants/project-constants';
import { Messages } from '../../../shared/constants/project-messages';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    // styleUrls: ['./home.component.scss']
})


export class FooterComponent implements OnInit, OnDestroy, DoCheck {

  @Input() includedfrom: string;

  about_cap = Messages.ABOUT_CAP;
  about_jaldee_one = Messages.ABOUT_JALDEE_ONE;
  about_jaldee_two = Messages.ABOUT_JALDEE_TWO;
  contact_cap = Messages.CONTACT_CAP;
  netvarth_tech_pvt_ltd = Messages.NETVARTH_TECH_PVT_LTD;
  addr_one = Messages.ADDRESS_ONE;
  addr_two = Messages.ADDRESS_TWO;
  addr_three = Messages.ADDRESS_THREE;
  addr_four = Messages.ADDRESS_FOUR;
  support_email = Messages.SUPPORT_EMAIL;
  support_phone = Messages.SUPPORT_PHONE;
  terms_cap = Messages.TERMS_CAP;
  conditions_cap = Messages.CONDITIONS_CAP;
  privacy_policy_cap = Messages.PRIVACY_POLICY_CAP;
  pricing_cap = Messages.PRICING_CAP;
  about_us_cap = Messages.ABOUT_US_CAP;
  contact_us_cap = Messages.CONTACT_US_CAP;
  jaldee_cap = Messages.JALDEE_CAP;
  date_time_cap = Messages.DATE_TIME_CAP;
  text_cap = Messages.TEXT_CAP;
  subject_cap = Messages.SUBJECT_CAP;
  user_name_cap = Messages.USER_NAME_CAP;
  no_audit_log_cap = Messages.NO_AUDIT_LOGS_CAP;
  view_all_cap = Messages.VIEW_ALL_CAP;
  no_alerts_cap = Messages.NO_ALERTS_CAP;
  settings_not_found_cap = Messages.SETTINGS_NOT_FOUND_CAP;
  accept_online_checkin_cap = Messages.ACC_ONLINE_CHECKIN_CAP;


  curyear;
  ctype;
  auditlog: any = [];
  auditCnt = projectConstants.AUDITLOG_CNT;
  alerts: any = [];
  alertsCnt = projectConstants.ALERT_CNT;
  showbottompopup = false;
  selOpt;
  showCheckinDiv;
  showAlertDiv;
  showAuditDiv;
  bottomdivHeader;
  auditStatus = 1;
  alertStatus = 1;
  checkinStatus = 1;
  waitlistmgr: any = [];
  includedFrom;
  dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT;
  alert_count = 0;
  subscription: Subscription;

  refreshTime = projectConstants.INBOX_REFRESH_TIME;
  cronHandle: Subscription;
  show_prov_bottomicons = false;
  maximizeTooltip = '';
  constructor(
    private dialog: MatDialog,
    public shared_functions: SharedFunctions,
    public shared_services: SharedServices,
    public router: Router) {}

  ngOnInit() {
    // console.log('includedfrom1', this.includedfrom);
    // console.log('url', this.router.url.substr(-8));
    if (this.router.url.substr(-8) !== '/bwizard') {
      this.show_prov_bottomicons = true;
    }
    if (this.includedfrom !== undefined) {
      this.includedFrom = this.includedfrom;
    } else {
      this.includedFrom = '';
    }
    // console.log('includedfrom2', this.includedFrom);
    this.curyear = new Date().getFullYear();
    this.ctype = this.shared_functions.isBusinessOwner('returntyp');
    this.selOpt = '';
    this.clearDivs();
    if (this.ctype === 'provider') {
      this.getAlertCount();
    }
    if (this.ctype === 'provider') {
      this.cronHandle = observableInterval(this.refreshTime * 1000).subscribe(x => {
        this.reloadHandler();
      });
    } else {
      if (this.cronHandle) {
        this.cronHandle.unsubscribe();
      }
    }

    // Update from alert page
    this.subscription = this.shared_functions.getMessage()
    .subscribe(
      data => {

        if (data.ttype === 'alert_count_update') {
          this.reloadHandler('Alert');
        }
      },
      error => {

      }
    );

  }


  ngOnDestroy() {
     // unsubscribe to ensure no memory leaks
     this.subscription.unsubscribe();
     if (this.cronHandle) {
      this.cronHandle.unsubscribe();
     }
  }

  ngDoCheck() {
    if (this.ctype === 'provider') {
      if (this.router.url.substr(-8) !== '/bwizard') {
        this.show_prov_bottomicons = true;
      }
    }
  }

  reloadHandler(type = '') {
    this.getAlertCount();
    if (this.selOpt === 'Alert') {
      this.getAlerts();
    }
  }

  showAuditlog() {
    this.maximizeTooltip = 'Go To System Audit Logs';
    if (this.showAuditDiv === true) {
      this.showbottompopup = false;
      this.clearDivs();
      return;
    }
    this.clearDivs();
    this.auditStatus = 1;
    this.showbottompopup = true;
    this.showAuditDiv = true;
    this.bottomdivHeader = 'Audit Logs';
    this.selOpt = 'Audit';
    this.auditlog = [];
    this.shared_services.getAuditLogs('', '', '', '', 0, this.auditCnt)
      .subscribe(data => {
        this.auditlog = data;
        if (this.auditlog.length > 0) {
          this.auditStatus = 3;
        } else {
          this.auditStatus = 2;
        }
      },
    error => {

    });
  }

  showAlert() {
    // console.log('bottompopup', this.showbottompopup);
    this.maximizeTooltip = 'Go To System Alerts';
    if (this.showAlertDiv === true) {
      this.showbottompopup = false;
      this.clearDivs();
      return;
    }
    this.clearDivs();
    this.showbottompopup = true;
    this.showAlertDiv = true;
    this.bottomdivHeader = 'Alerts';
    this.selOpt = 'Alert';
    this.getAlerts();
  }

  alertAcknowlege(alert) {
    this.shared_services.acknowledgeAlert(alert.id)
      .subscribe (data => {
        this.shared_functions.openSnackBar(Messages.PROVIDER_ALERT_ACK_SUCC);
          this.getAlertCount();
          this.getAlerts();
      },
    error => {
      this.shared_functions.openSnackBar(error, {'panelClass': 'snackbarerror'});
    });
  }

  getAlertCount() {
    this.shared_services.getAlertsTotalCnt('false' , '')
    .subscribe((data: any) => {
      this.alert_count = data;
    },
    error => {

    });
  }

  getAlerts() {
    // this.alerts = [];
    this.shared_services.getAlerts('false', '', 0, this.alertsCnt)
      .subscribe(data => {
        this.alerts = data;
        if (this.alerts.length > 0) {
          this.alertStatus = 3;
        } else {
          this.alertStatus = 2;
        }
        // console.log('alerts', this.alerts);
      },
    error => {

    });
  }

  showCheckinED() {
    this.maximizeTooltip = 'Go To Waitlist Manager';
    if (this.showCheckinDiv === true) {
      this.showbottompopup = false;
      this.clearDivs();
      return;
    }
    this.clearDivs();
    this.showbottompopup = true;
    this.showCheckinDiv = true;
    this.bottomdivHeader = 'Check-in Enable / Disable';
    this.selOpt = 'Checkin';
    this.waitlistmgr = [];
    this.shared_services.getWaitlistMgr()
      .subscribe(data => {
        this.waitlistmgr = data;
        this.checkinStatus = 3;
      },
    error => {

    });
  }

  showLicense() {
    this.selOpt = '';
    this.showbottompopup = false;
    this.clearDivs();
    this.router.navigate(['/provider/settings/license']);
  }

  handleMaximize() {
    this.showbottompopup = false;
    switch (this.selOpt) {
      case 'Audit':
        this.router.navigate(['/provider/auditlog']);
        this.selOpt = '';
        this.clearDivs();
      break;
      case 'Alert':
        this.router.navigate(['/provider/alerts']);
        this.selOpt = '';
        this.clearDivs();
      break;
      case 'Checkin':
        this.router.navigate(['/provider/settings/waitlist-manager']);
        this.selOpt = '';
        this.clearDivs();
      break;
    }
  }

  closebottompopup() {
    this.clearDivs();
    this.showbottompopup = false;
    this.selOpt = '';
    this.bottomdivHeader = '';
  }

  clearDivs() {
    this.showAlertDiv = false;
    this.showAuditDiv = false;
    this.showCheckinDiv = false;
    this.selOpt = '';
  }

  changeOnlinestatus(curstat) {
    const changestatus = (curstat) ? 'Disable' : 'Enable';
    this.shared_services.setAcceptOnlineCheckin(changestatus)
      .subscribe (data => {
        if (changestatus === 'Enable') {
          this.waitlistmgr.onlineCheckIns = true;
        } else {
          this.waitlistmgr.onlineCheckIns = false;
        }

        this.shared_functions.sendMessage({ttype: 'online_checkin_status', action: this.waitlistmgr.onlineCheckIns});
      },
    error => {

    });
  }
showStatic(mode) {
  switch (mode) {
    case 'terms':
      this.router.navigate(['terms']);
      window.scroll(0, 0);
    break;
    case 'privacy':
      this.router.navigate(['privacy']);
      window.scroll(0, 0);
    break;
  }
}
  /*terms() {
    this.router.navigate(['terms']);
    window.scroll(0, 0);
  }

  dataprivacy() {
    this.router.navigate(['privacy']);
    window.scroll(0, 0);
  }*/
}
