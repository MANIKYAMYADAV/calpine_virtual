import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ProviderServices } from '../../services/provider-services.service';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { SharedServices } from '../../../shared/services/shared-services';
import { projectConstants } from '../../../app.component';
import { Messages } from '../../../shared/constants/project-messages';
import { Router } from '@angular/router';
import { DateFormatPipe } from '../../../shared/pipes/date-format/date-format.pipe';
import { projectConstantsLocal } from '../../../shared/constants/project-constants';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { GroupStorageService } from '../../../shared/services/group-storage.service';
import { DateTimeProcessor } from '../../../shared/services/datetime-processor.service';
@Component({
  selector: 'app-provider-system-alerts',
  templateUrl: './provider-system-alerts.component.html'
})
export class ProviderSystemAlertComponent implements OnInit {
  tooltipcls = '';
  filtericonTooltip = '';
  acknow_status_cap = Messages.SYS_ALERTS_ACKNOWLEDGEMENT_STATUS;
  any_cap = Messages.SYS_ALERTS_ANY_CAP;
  acknowledged_cap = Messages.SYS_ALERTS_ACKNOWLEDGED_CAP;
  not_acknowledged_cap = Messages.SYS_ALERTS_NOT_ACKNOWLEDGED_CAP;
  select_date_cap = Messages.SYS_ALERTS_SELECT_DATE_CAP;
  search_cap = Messages.SYS_ALERTS_SEARCH_CAP;
  subject_cap = Messages.SYS_ALERTS_SUBJECT_CAP;
  details_cap = Messages.SYS_ALERTS_DETAILS_CAP;
  date_cap = Messages.SYS_ALERTS_DATE_CAP;
  action_cap = Messages.SYS_ALERTS_ACTION_CAP;
  no_alerts_found_cap = Messages.SYS_ALERTS_NO_ALERTS_FOUND_CAP;

  alert_details: any = [];
  load_complete = 0;
  dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT;
  newDateFormat = projectConstantsLocal.DATE_MM_DD_YY_FORMAT;
  alertSelAck = [];
  alertStartdate = null;
  alertEnddate = null;
  holdalertSelAck = null;
  holdalertStartdate = null;
  holdalertEnddate = null;
  filterapplied = true;
  filter_sidebar = false;
  open_filter = false;
  api_loading = true;
  alertStatus = 1;
  startpageval;
  totalCnt;
  domain;
  perPage = projectConstants.PERPAGING_LIMIT;
  breadcrumbs = [
    {
      title: 'System Alerts'
    }
  ];
  tday = new Date();
  minday = new Date(1900, 0, 1);
  endminday = new Date(1900, 0, 1);
  maxDate = new Date();
  isCheckin;
  breadcrumb_moreoptions: any = [];
  filters: any = {
    'date': false
  };
  ackStatus=false;
  notAckStatus = false;
  constructor(private provider_servicesobj: ProviderServices,
    private sharedfunctionObj: SharedFunctions,
    private locationobj: Location,
    private routerobj: Router,
    private shared_services: SharedServices,
    public date_format: DateFormatPipe,
    private snackbarService: SnackbarService,
    private groupService: GroupStorageService,
    private dateTimeProcessor: DateTimeProcessor
  ) { }
  ngOnInit() {
    const user = this.groupService.getitemFromGroupStorage('ynw-user');
    this.domain = user.sector;
    this.alertSelAck = []; // default becuase maximise from footer alert panel
    this.alertStartdate = null;
    this.alertEnddate = null;
    this.alertStatus = 4;
    this.holdalertSelAck = this.alertSelAck.join(',');
    this.holdalertStartdate = this.alertStartdate;
    this.holdalertEnddate = this.alertEnddate;
    this.getAlertListTotalCnt('false', '', '');
    this.isCheckin = this.groupService.getitemFromGroupStorage('isCheckin');
    this.breadcrumb_moreoptions = { 'actions': [{ 'title': 'Help', 'type': 'learnmore' }] };
  }
  getAlertListTotalCnt(ackStatus, sdate, edate) {
    this.shared_services.getAlertsTotalCnt(ackStatus, sdate, edate)
      .subscribe(data => {
        this.totalCnt = data;
        this.sharedfunctionObj.sendMessage({ 'ttype': 'alertCount', alertCnt: this.totalCnt });
        if (this.totalCnt === 0) {
          this.alertStatus = 2;
          this.alert_details = [];
        } else {
          this.alertStatus = 1;
          this.getAlertList(this.alertSelAck.join(','), sdate, edate);
        }
        this.api_loading = false;
      },
        () => {
          this.api_loading = false;
        });
  }
  getAlertList(ackStatus, sdate, edate) {
    let pageval;
    if (this.startpageval) {
      pageval = (this.startpageval - 1) * this.perPage;
    } else {
      pageval = 0;
    }
    this.alert_details = [];
    this.shared_services.getAlerts(ackStatus, sdate, edate, Number(pageval), this.perPage)
      .subscribe(data => {
        this.alert_details = data;
        if (this.alert_details.length > 0) {
          this.alertStatus = 3;
        } else {
          this.alertStatus = 2;
        }
      },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          this.load_complete = 2;
          this.alertStatus = 0;
        });
  }
  performActions(action) {
    if (action === 'learnmore') {
      this.routerobj.navigate(['/provider/' + this.domain + '/alert']);
    }
  }
  clearFilter() {
    this.resetFilter();
    this.do_search(false);
    this.filterapplied = false;
  }
  toggleFilter() {
    this.open_filter = !this.open_filter;
  }
  resetFilter() {
    this.filters = {
      'date': false
    };
    this.alertEnddate = null;
    this.alertStartdate = null;
    this.alertSelAck = [];
    this.holdalertStartdate = null;
    this.holdalertEnddate = null;
    this.ackStatus = false;
    this.notAckStatus = false;
  }
  goback() {
    this.locationobj.back();
  }
  do_search(pagecall, status?) {
    this.endminday = this.alertStartdate;
    this.alertStatus = 1;
    if (status === 'ackStatus') {
      if (this.ackStatus === true) {
        if (this.alertSelAck.indexOf('true') === -1) {
          this.alertSelAck.push('true');
        }
      } else {
        this.alertSelAck.splice(this.alertSelAck.indexOf('true'), 1);
      }
    }
    if (status === 'notAckStatus') {
      if (this.notAckStatus === true) {
        if (this.alertSelAck.indexOf('false') === -1) {
          this.alertSelAck.push('false');
        }
      } else {
        this.alertSelAck.splice(this.alertSelAck.indexOf('false'), 1);
      }
    }
    if (pagecall === false) {
      this.startpageval = 1;
      this.holdalertSelAck = this.alertSelAck.join(',');
      this.holdalertStartdate = this.alertStartdate;
      this.holdalertEnddate = this.alertEnddate;
    }
    let startseldate = '';
    let endseldate = '';
    if (this.holdalertStartdate) {
      startseldate = this.dateTimeProcessor.transformToYMDFormat(this.holdalertStartdate);
    }
    if (this.holdalertEnddate) {
      endseldate = this.dateTimeProcessor.transformToYMDFormat(this.holdalertEnddate);
    }
    this.getAlertList(this.holdalertSelAck || '', startseldate, endseldate);
    if (endseldate !== '' || startseldate !== '' || this.notAckStatus || this.ackStatus) {
      this.filterapplied = true;
    } else {
      this.filterapplied = false;
    }
  }
  redirecToHelp() {
    this.routerobj.navigate(['/provider/' + this.domain + '/alert']);
  }
  handle_pageclick(pg) {
    this.startpageval = pg;
    this.do_search(true);
  }
  getperPage() {
    return this.perPage;
  }
  gettotalCnt() {
    return this.totalCnt;
  }
  getcurpageVal() {
    return this.startpageval;
  }
  alertAcknowledge(obj) {
    this.provider_servicesobj.acknowledgeAlert(obj.id)
      .subscribe(() => {
        this.snackbarService.openSnackBar(Messages.PROVIDER_ALERT_ACK_SUCC);
        this.getAlertListTotalCnt('false', this.holdalertStartdate, this.holdalertEnddate);
      },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        });
  }
  showFilterSidebar() {
    this.filter_sidebar = true;
  }
  hideFilterSidebar() {
    this.filter_sidebar = false;
  }
}
