import { Component, OnInit, OnDestroy, AfterViewInit, HostListener, QueryList, ElementRef, ViewChildren, ViewChild } from '@angular/core';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { SharedServices } from '../../../shared/services/shared-services';
import { projectConstants } from '../../../app.component';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';
import * as moment from 'moment';
import { Messages } from '../../../shared/constants/project-messages';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ProviderWaitlistCheckInConsumerNoteComponent } from '../check-ins/provider-waitlist-checkin-consumer-note/provider-waitlist-checkin-consumer-note.component';
import { ProviderSharedFuctions } from '../../../ynw_provider/shared/functions/provider-shared-functions';
import { projectConstantsLocal } from '../../../shared/constants/project-constants';
import { ProviderWaitlistCheckInCancelPopupComponent } from '../check-ins/provider-waitlist-checkin-cancel-popup/provider-waitlist-checkin-cancel-popup.component';
import { DateFormatPipe } from '../../../shared/pipes/date-format/date-format.pipe';
import { ButtonsConfig, ButtonsStrategy, AdvancedLayout, PlainGalleryStrategy, PlainGalleryConfig, Image, ButtonType } from '@ks89/angular-modal-gallery';
import { interval as observableInterval, Subscription } from 'rxjs';
import { AppointmentActionsComponent } from './appointment-actions/appointment-actions.component';
import { VoicecallDetailsSendComponent } from './voicecall-details-send/voicecall-details-send.component';
import { WordProcessor } from '../../../shared/services/word-processor.service';
import { GroupStorageService } from '../../../shared/services/group-storage.service';
import { LocalStorageService } from '../../../shared/services/local-storage.service';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { Title } from '@angular/platform-browser';
import { DateTimeProcessor } from '../../../shared/services/datetime-processor.service';
import { AttachmentPopupComponent } from '../../../../app/shared/components/attachment-popup/attachment-popup.component';
@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent implements OnInit, OnDestroy, AfterViewInit {
  elementType = 'url';
  today_cap = Messages.TODAY_HOME_CAP;
  future_cap = Messages.FUTURE_HOME_CAP;
  history_cap = Messages.HISTORY_HOME_CAP;
  service_window_cap = Messages.WORKING_HRS_CAP;
  services_cap = Messages.SRVIC_CAP;
  check_in_status = Messages.PAY_STATUS;
  payment_status = Messages.PAYMENT_CAP;
  start_date = Messages.START_DATE_CAP;
  end_date = Messages.END_DATE_CAP;
  token_no = Messages.TOKEN_NO_CAP;
  name_cap = Messages.AUDIT_NAME_CAP;
  service_cap = Messages.PRO_SERVICE_CAP;
  status_cap = Messages.PRO_STATUS_CAP;
  note_cap = Messages.NOTE_CAP;
  change_status = Messages.CHANGE_STATUS_CAP;
  add_note_cap = Messages.ADD_NOTE_CAP;
  available_cap = Messages.PRO_AVAILABLE_CAP;
  no_service_cap = Messages.NO_SCHEDULE_MSG;
  adjust_delay = Messages.ADJUST_DELAY_CAP;
  first_name = Messages.FIRST_NAME_CAP;
  last_name = Messages.LAST_NAME_CAP;
  phone_no_cap = Messages.PHONE_NO_CAP;
  all_cap = Messages.ALL_CAP;
  date_cap = Messages.DATE_COL_CAP;
  actions_cap = Messages.ACTIONS_CAP;
  complete_cap = Messages.STATUS_DONE;
  done_cap = Messages.DONE_BTN;
  bill_cap = Messages.BILL_CAPTION;
  accept_cap = Messages.ACCEPT_PAY_CAP;
  not_paid_cap = Messages.NOT_PAID_CAP;
  partially_paid_cap = Messages.PARTIALLY_PAID_CAP;
  paid_cap = Messages.PAID_CAP;
  send_message_cap = Messages.SEND_MSG_CAP;
  add_private_note = Messages.ADD_PROVIDER_NOTE_CAP;
  cancel_cap = Messages.CANCEL_BTN;
  view_cap = Messages.VIEW_CAP;
  no_cap = Messages.NO_CAP;
  check_in_statuses = projectConstants.CHECK_IN_STATUSES;
  wait_time_caption = Messages.WAIT_TIME;
  no_result_found = Messages.NO_RESULT_FOUND;
  manage_labels = Messages.MANAGE_LABELS;
  add_label = Messages.ADD_LABEL;
  check_in_statuses_filter = projectConstantsLocal.APPT_STATUSES_FILTER;
  future_check_in_statuses_filter = projectConstantsLocal.FUTURE_APPT_STATUSES_FILTER;
  apis_loaded = false;
  carouselOne;
  screenWidth;
  small_device_display = false;
  selected_location = null;
  server_date;
  selectedView: any;
  selectedUser: any;
  isBatch = false;
  statusAction = 'new';
  todayAppointments = [];
  futureAppointments = [];
  time_type = 1;
  display_dateFormat = projectConstantsLocal.DISPLAY_DATE_FORMAT_NEW;
  newTimeDateFormat = projectConstantsLocal.DATE_EE_MM_DD_YY_FORMAT;

  filter = {
    first_name: '',
    last_name: '',
    phone_number: '',
    appointmentEncId: '',
    patientId: '',
    appointmentMode: 'all',
    schedule: 'all',
    location: 'all',
    service: 'all',
    apptStatus: 'all',
    payment_status: 'all',
    check_in_start_date: null,
    check_in_date: null,
    check_in_end_date: null,
    location_id: 'all',
    page_count: projectConstants.PERPAGING_LIMIT,
    page: 1,
    future_appt_date: null,
    age: 'all',
    gender: 'all'
  }; // same in resetFilter Fn
  filters = {
    first_name: false,
    last_name: false,
    phone_number: false,
    appointmentEncId: false,
    patientId: false,
    appointmentMode: false,
    schedule: false,
    location: false,
    service: false,
    apptStatus: false,
    payment_status: false,
    check_in_start_date: false,
    check_in_date: false,
    check_in_end_date: false,
    location_id: false,
    age: false,
    gender: false
  };
  pagination: any = {
    startpageval: 1,
    totalCnt: 0,
    perPage: this.filter.page_count
  };
  availableSlotDetails: any = [];
  selQIds: any = [];
  selUser;
  timeSlotAppts: any = [];
  statusMultiCtrl: any = [];
  appt_list: any = [];
  users: any = [];
  filterapplied = false;
  noFilter = true;
  today_waitlist_count: any = 0;
  future_waitlist_count: any = 0;
  history_waitlist_count: any = 0;
  today_checkins_count = 0;
  today_arrived_count = 0;
  today_started_count = 0;
  today_completed_count = 0;
  today_cancelled_count = 0;
  today_rejected_count = 0;
  today_cancelled_checkins_count = 0;
  today_checkedin_count = 0;
  today_bloacked_count = 0;
  scheduled_count = 0;
  started_count = 0;
  cancelled_count = 0;
  completed_count = 0;
  labelFilterData = '';
  token;
  servicesCount;
  selQCapacity = 0;
  locations: any = [];
  labelMultiCtrl: any = [];
  views: any = [];
  viewsList: any = [];
  schedules: any = [];
  activeSchedules: any = [];
  tempActiveSchedules: any = [];
  selQidsforHistory: any = [];
  board_count = 0;
  tomorrowDate;
  filter_date_start_min = null;
  filter_date_start_max = null;
  filter_date_end_min = null;
  filter_date_end_max = new Date();
  filter_dob_start_min = null;
  filter_dob_start_max = null;
  filter_dob_end_min = null;
  filter_dob_end_max = null;
  open_filter = false;
  status_type = 'all';
  checkinId;
  providerLabels: any = [];
  labelsCount: any = [];
  selectedAppt: any = [];
  labelFilter: any = [];
  showLabels = true;
  labelMap;
  labeldialogRef;
  slotsChecked: any = {};
  slotSelected: any = {};
  apptsChecked: any = {};
  appsAllChecked: any = {};
  slotsAllChecked: any = {};
  rowLevelSelectAll: any = [];
  chkSlotInput: any = [];
  appointmentsChecked: any = [];
  chkAppointments: any = [];
  chkSelectAppointments = false;
  activeAppointment: any;
  apptSingleSelection = false;
  apptMultiSelection = false;
  apptMainCheck;
  selAllSlots = false;
  check_in_filtered_list: any = [];
  active_user;
  domain;
  account_type;
  customer_label = '';
  provider_label = '';
  arrived_label = '';
  arrived_upper = '';
  checkedin_label = '';
  checkedin_upper = '';
  done_label = '';
  done_upper = '';
  started_label = '';
  started_upper = '';
  cancelled_label = '';
  cancelled_upper = '';
  checkin_label = '';
  start_label = '';
  no_history = '';
  no_started_checkin_msg = '';
  no_completed_checkin_msg = '';
  no_cancelled_checkin_msg = '';
  cust_note_tooltip;
  appt_status = [];
  refreshTime = projectConstants.INBOX_REFRESH_TIME;
  payStatusList = [
    { pk: 'NotPaid', value: 'Not Paid' },
    { pk: 'PartiallyPaid', value: 'Partially Paid' },
    { pk: 'FullyPaid', value: 'Fully Paid' },
    { pk: 'PartiallyRefunded', value: 'Partially Refunded' },
    { pk: 'FullyRefunded', value: 'Fully Refunded' },
    { pk: 'Refund', value: 'Refund' }
  ];
  appointmentModes = [
    { mode: 'WALK_IN_APPOINTMENT', value: 'Walk in Appointment' },
    { mode: 'PHONE_IN_APPOINTMENT', value: 'Phone in Appointment' },
    { mode: 'ONLINE_APPOINTMENT', value: 'Online Appointment' },
  ];
  notedialogRef;
  addnotedialogRef;
  locateCustomerdialogRef;
  trackDetail: any = [];
  customerMsg = '';
  tooltipcls = projectConstants.TOOLTIP_CLS;
  qr_value;
  path = projectConstants.PATH;
  showQR = false;
  bname = '';
  gnr_link = 2;
  loading = true;
  showArrived = false;
  showUndo = false;
  pos = false;
  showRejected = false;
  showShare = false;
  historyCheckins: any = [];
  apiloading = true;
  showSlotsN = false;
  slotsForQ: any = [];
  filter_sidebar = false;
  apptModes: any = [];
  paymentStatuses: any = [];
  apptStatuses: any = [];
  ageGroups: any = [];
  allModeSelected = false;
  allPayStatusSelected = false;
  allApptStatusSelected = false;
  allGenderSlected = false;
  allAgeSlected = false;
  genderList: any = [];
  service_list: any = [];
  allServiceSelected = false;
  services: any = [];
  consumr_id: any;
  topHeight = 0;
  admin = false;
  @ViewChildren('appSlots') slotIds: QueryList<ElementRef>;
  @ViewChild('apptSection') apptSection: ElementRef<HTMLElement>;
  windowScrolled: boolean;
  batchEnabled = false;
  consumerTrackstatus = false;
  slotsloading = false;
  showNoSlots: boolean;
  smsdialogRef: any;
  customPlainGalleryRowConfig: PlainGalleryConfig = {
    strategy: PlainGalleryStrategy.CUSTOM,
    layout: new AdvancedLayout(-1, true)
  };
  customButtonsFontAwesomeConfig: ButtonsConfig = {
    visible: true,
    strategy: ButtonsStrategy.CUSTOM,
    buttons: [
      {
        className: 'inside close-image',
        type: ButtonType.CLOSE,
        ariaLabel: 'custom close aria label',
        title: 'Close',
        fontSize: '20px'
      }
    ]
  };
  image_list_popup: Image[];
  image_list_popup_temp: Image[];
  imageAllowed = ['JPEG', 'JPG', 'PNG'];
  apptStatus = false;
  locationExist = false;
  serviceExist = false;
  scheduleExist = false;
  profileExist = false;
  message = '';
  message1 = '';
  showDashbard = true;
  filteredSchedule: any = [];
  allScheduleSelected = false;
  cronHandle: Subscription;
  allLocationSelected = false;
  filterLocation: any = [];
  selectedLabels: any = [];
  allLabelSelected: any = [];
  customerIdTooltip = '';
  allLabels: any = [];
  voicedialogRef: any;
  startedAppts: any = [];
  apptStartedMultiSelection = false;
  apptStartedSingleSelection = false;
  startedAppointmentsChecked: any = [];
  startedChkAppointments: any = [];
  chkStartedSelectAppointments = false;
  allStartedSelection = false;
  allSelection = false;
  addCustomerTooltip = '';
  selected_type = '';
  apptByTimeSlot: any = [];
  scheduleSlots: any = [];
  qloading: boolean;
  firstTime = true;
  endminday;
  maxday = new Date();
  endmaxday = new Date();
  statusChangeClicked = false;
  activeUser: any;
  delayTooltip = '';
  filtericonTooltip = '';
  cloudTooltip = '';
  teams: any;
  yesterdayDate;
  @ViewChild('closebutton') closebutton;
  showattachmentDialogRef: any;
  unassignview = false;
  constructor(private shared_functions: SharedFunctions,
    private shared_services: SharedServices,
    private provider_services: ProviderServices,
    public dateformat: DateFormatPipe,
    private router: Router,
    public activateroute: ActivatedRoute,
    private dialog: MatDialog,
    private provider_shared_functions: ProviderSharedFuctions,
    private wordProcessor: WordProcessor,
    private groupService: GroupStorageService,
    private lStorageService: LocalStorageService,
    private snackbarService: SnackbarService,
    private dateTimeProcessor: DateTimeProcessor,
    private titleService: Title) {
    this.titleService.setTitle('Jaldee Business - Appointments');
    this.onResize();
    this.delayTooltip = this.wordProcessor.getProjectMesssages('ADJUSTDELAY_TOOPTIP');
    this.filtericonTooltip = this.wordProcessor.getProjectMesssages('FILTERICON_TOOPTIP');
    this.cloudTooltip = this.wordProcessor.getProjectMesssages('CLOUDICON_TOOPTIP');
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
    this.provider_label = this.wordProcessor.getTerminologyTerm('provider');
    this.arrived_label = this.wordProcessor.getTerminologyTerm('arrived');
    this.arrived_upper = this.wordProcessor.firstToUpper(this.arrived_label);
    this.checkedin_label = this.wordProcessor.getTerminologyTerm('waitlisted');
    this.checkedin_upper = this.wordProcessor.firstToUpper(this.checkedin_label);
    this.done_label = this.wordProcessor.getTerminologyTerm('done');
    this.done_upper = this.wordProcessor.firstToUpper(this.done_label);
    this.started_label = this.wordProcessor.getTerminologyTerm('started');
    this.started_upper = this.wordProcessor.firstToUpper(this.started_label);
    this.start_label = this.wordProcessor.getTerminologyTerm('start');
    this.cancelled_label = this.wordProcessor.getTerminologyTerm('cancelled');
    this.cancelled_upper = this.wordProcessor.firstToUpper(this.cancelled_label);
    this.checkin_label = this.wordProcessor.getTerminologyTerm('waitlist');
    this.no_started_checkin_msg = this.wordProcessor.removeTerminologyTerm('waitlist', Messages.NO_STRTED_CHECKIN_MSG);
    this.no_completed_checkin_msg = this.wordProcessor.removeTerminologyTerm('waitlist', Messages.NO_COMPLETED_CHECKIN_MSG);
    this.no_cancelled_checkin_msg = this.wordProcessor.removeTerminologyTerm('waitlist', Messages.NO_CANCELLED_CHECKIN_MSG);
    this.no_history = this.wordProcessor.removeTerminologyTerm('waitlist', Messages.NO_HISTORY_MSG);
    this.appt_status = [
      { name: this.checkedin_upper, value: 'checkedIn' },
      { name: this.cancelled_upper, value: 'cancelled' },
      { name: this.started_upper, value: 'started' },
      { name: this.arrived_upper, value: 'Arrived' },
      { name: this.done_upper, value: 'complete' }];
    this.activateroute.queryParams.subscribe(params => {
      if (params.servStatus) {
        this.statusAction = 'started';
      } else {
        if (this.groupService.getitemFromGroupStorage('appt_action')) {
          this.statusAction = this.groupService.getitemFromGroupStorage('appt_action');
        }
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 767) {
    } else {
      this.small_device_display = false;
    }
    if (this.screenWidth <= 1040) {
      this.small_device_display = true;
    } else {
      this.small_device_display = false;
    }
  }
  @HostListener('window:scroll', ['$event'])
  scrollHandler() {
    let qHeader = 0;
    let tabHeader = 0;
    if (document.getElementById('qHeader')) {
      qHeader = document.getElementById('apptsSchedules').offsetHeight;
    }
    if (document.getElementById('tabHeader')) {
      tabHeader = document.getElementById('apptsTimeTypes').offsetHeight;
    }
    this.topHeight = qHeader + tabHeader;
    if (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop > 100) {
      this.windowScrolled = true;
    } else if (this.windowScrolled && window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop < 10) {
      this.windowScrolled = false;
    }
  }
  ngOnInit() {
    if (this.groupService.getitemFromGroupStorage('selected_type')) {
      this.selected_type = this.groupService.getitemFromGroupStorage('selected_type');
    } else {
      this.selected_type = 'booked';
      this.groupService.setitemToGroupStorage('selected_type', this.selected_type);
    }
    const savedtype = this.groupService.getitemFromGroupStorage('apptType');
    if (savedtype !== undefined && savedtype !== null) {
      this.time_type = savedtype;
    }
    this.setSystemDate();
    this.server_date = this.lStorageService.getitemfromLocalStorage('sysdate');
    if (this.server_date) {
      this.getTomorrowDate();
      this.getYesterdayDate();
    }
    this.active_user = this.groupService.getitemFromGroupStorage('ynw-user');
    if (this.active_user.adminPrivilege || this.active_user.userType === 5) {
      this.admin = true;
    }
    this.account_type = this.active_user.accountType;
    this.domain = this.active_user.sector;
    this.cust_note_tooltip = Messages.CUST_NOT_TOOLTIP.replace('[customer]', this.customer_label);
    this.customerIdTooltip = this.customer_label + ' Id';
    this.addCustomerTooltip = 'Add ' + this.customer_label;
    this.getPos();
    this.getLabel();
    this.getDisplayboardCount();
    this.getLocationList();
    this.getServices();
    if (this.active_user.accountType === 'BRANCH') {
      this.getProviders();
    }
    if (this.active_user.accountType === 'BRANCH') {
      this.getTeams().then((data) => {
        this.teams = data;
      });
    }
    this.cronHandle = observableInterval(this.refreshTime * 500).subscribe(() => {
      this.refresh();
    });
  }
  getServiceName(serviceName) {
    let name = '';
    if (serviceName.length > 20) {
      name = serviceName.substring(0, 20) + '...';
    } else {
      name = serviceName;
    }
    return name;
  }
  showFilterSidebar() {
    this.filter_sidebar = true;
    this.shared_functions.setFilter();
  }
  hideFilterSidebar() {
    this.filter_sidebar = false;
  }
  getDefaultViewSchedules(allSchedules) {
    const loggedUser = this.groupService.getitemFromGroupStorage('ynw-user');
    if (!loggedUser.adminPrivilege) {
      const userQs = [];
      for (let qIndex = 0; qIndex < allSchedules.length; qIndex++) {
        if (allSchedules[qIndex].provider && (allSchedules[qIndex].provider.id === loggedUser.id)) {
          userQs.push(allSchedules[qIndex]);
        }
      }
      return userQs;
    } else {
      return allSchedules;
    }
  }
  initViews(schedules, source?) {
    const _this = this;
    const qsActive = this.getDefaultViewSchedules(schedules);
    this.views = [];
    return new Promise(function (resolve, reject) {
      const tempView = {};
      tempView['name'] = 'All Appointments';
      tempView['id'] = 0;
      tempView['customViewConditions'] = {};
      tempView['customViewConditions'].schedules = qsActive;
      _this.selectedView = tempView;
      _this.getViews().then(
        (data: any) => {
          const appointmentViewList = data;
          for (let i = 0; i < appointmentViewList.length; i++) {
            if (appointmentViewList[i].type === 'Appointment') {
              _this.views.push(appointmentViewList[i]);
            }
          }
          if (_this.admin) {
            for (let i = 0; i < _this.users.length; i++) {
              _this.views.push(_this.users[i]);
            }
          }
          _this.views.push(tempView);
          let selected_view;
          if (source === 'changeLocation') {
          } else {
            selected_view = _this.groupService.getitemFromGroupStorage('appt-selectedView');
          }
          if (selected_view) {
            const viewFilter = _this.views.filter(view => view.id === selected_view.id);
            if (viewFilter.length !== 0) {
              _this.selectedView = _this.groupService.getitemFromGroupStorage('appt-selectedView');
            } else {
              _this.selectedView = tempView;
              _this.groupService.setitemToGroupStorage('appt-selectedView', _this.selectedView);
            }
          } else {
            _this.selectedView = tempView;
            _this.groupService.setitemToGroupStorage('appt-selectedView', _this.selectedView);
          }
          resolve(_this.selectedView);
        },
        error => {
          if (_this.admin) {
            for (let i = 0; i < _this.users.length; i++) {
              _this.views.push(_this.users[i]);
            }
          }
          _this.views.push(tempView);
          _this.groupService.setitemToGroupStorage('appt-selectedView', _this.selectedView);
          resolve(_this.selectedView);
        }
      );
    });
  }
  refresh() {
    if (this.time_type === 1) {
      this.getTodayAppointments();
    }
    if (this.time_type === 2) {
      this.getFutureAppointments();
    }
  }
  isQueueSelected(qId) {
    if (this.selQIds.indexOf(qId) !== -1) {
      return true;
    }
    return false;
  }
  viewQClicked(q) {
    const qindx = this.selQIds.indexOf(q.id);
    if (qindx !== -1) {
      if (this.selQIds.length === 1) {
        return false;
      }
      this.selQIds.splice(qindx, 1);
    } else {
      this.selQIds.push(q.id);
    }
    if (this.time_type === 1) {
      this.groupService.setitemToGroupStorage('appt_selQ', this.selQIds);
    } else if (this.time_type === 2) {
      this.groupService.setitemToGroupStorage('appt_future_selQ', this.selQIds);
    } else {
      this.groupService.setitemToGroupStorage('appt_history_selQ', this.selQIds);
    }
    this.loadApiSwitch('reloadAPIs');
  }
  setSystemDate() {
    this.shared_services.getSystemDate()
      .subscribe(
        res => {
          this.server_date = res;
          this.lStorageService.setitemonLocalStorage('sysdate', res);
        });
  }
  ngOnDestroy() {
    if (this.cronHandle) {
      this.cronHandle.unsubscribe();
    }
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.apis_loaded = true;
      this.carouselOne = {
        dots: false,
        nav: true,
        navContainer: '.checkins-nav',
        navText: [
          '<i class="fa fa-angle-left" aria-hidden="true"></i>',
          '<i class="fa fa-angle-right" aria-hidden="true"></i>'
        ],
        autoplay: false,
        mouseDrag: false,
        touchDrag: true,
        pullDrag: false,
        loop: false,
        autoWidth: true
      };
    });
  }
  getDisplayboardCount() {
    let layout_list: any = [];
    let displayboards: any = [];
    this.provider_services.getDisplayboardsAppointment()
      .subscribe(
        data => {
          displayboards = data;
          layout_list = displayboards.filter(displayboard => !displayboard.isContainer);
          this.board_count = layout_list.length;
        });
  }
  getViews() {
    const _this = this;
    return new Promise(function (resolve, reject) {
      _this.provider_services.getCustomViewList().subscribe(data => {
        resolve(data);
      }, error => {
        reject();
      });
    });
  }
  learnmore_clicked(action) {
    if (action === 'learnmore') {
      this.router.navigate(['/provider/' + this.domain + '/appointments']);
    }
  }
  showAdjustDelay() {
    // if (this.queues.length === 0 || !this.selQIds) {
    //   this.snackbarService.openSnackBar('Delay can be applied only for active schedules', { 'panelClass': 'snackbarerror' });
    //   return false;
    // } else {
    this.router.navigate(['provider', 'appointments', 'adjustdelay']);
    // }
  }

  performActions(action) {
    if (action === 'adjustdelay') {
      this.showAdjustDelay();
    } else if (action === 'learnmore') {
      this.router.navigate(['/provider/' + this.domain + '/appointments']);
    }
  }
  redirecToHelp() {
    this.router.navigate(['/provider/' + this.domain + '/appointments']);
  }
  getSchedules(date?) {
    const _this = this;
    const filterEnum = {};
    filterEnum['state-eq'] = 'ENABLED';
    if (date === 'all') {
      filterEnum['location-eq'] = this.selected_location.id;
    }
    return new Promise((resolve) => {
      _this.provider_services.getProviderSchedules(filterEnum).subscribe(
        (schedules: any) => {
          const qList = schedules.filter(sch => sch.apptState !== 'EXPIRED');
          resolve(qList);
        });
    });
  }
  getSchedulesFromView(view, schedules) {
    const qs = [];
    if (view && view.name !== 'All Appointments') {
      for (let i = 0; i < schedules.length; i++) {
        for (let j = 0; j < view.customViewConditions.schedules.length; j++) {
          if (schedules[i].id === view.customViewConditions.schedules[j].id) {
            qs.push(schedules[i]);
          }
        }
      }
    } else {
      const loggedUser = this.groupService.getitemFromGroupStorage('ynw-user');
      if (!loggedUser.adminPrivilege) {
        for (let qIndex = 0; qIndex < schedules.length; qIndex++) {
          if (schedules[qIndex].provider && (schedules[qIndex].provider.id === loggedUser.id)) {
            qs.push(schedules[qIndex]);
          }
        }
      } else {
        return schedules;
      }
    }
    return qs;
  }
  selectLocationFromCookie(cookie_location_id) {
    let selected_location = null;
    for (const location of this.locations) {
      if (location.id === cookie_location_id) {
        selected_location = location;
      }
    }
    if (selected_location !== null) {
      return selected_location;
    } else {
      const location = this.locations.filter(loc => loc.baseLocation);
      return location[0];
    }
  }
  selectLocationFromCookies(cookie_location_id) {
    this.locationSelected(this.selectLocationFromCookie(cookie_location_id)).then(
      (schedules: any) => {
        this.initViews(schedules, '').then(
          (view) => {
            this.initView(view, 'changeLocation');
          }
        );
      }
    );
  }
  getLocationList() {
    const self = this;
    return new Promise<void>(function (resolve, reject) {
      self.selected_location = null;
      self.provider_services.getProviderLocations()
        .subscribe(
          (data: any) => {
            const locations = data;
            self.locations = [];
            if (data.length > 0) {
              self.locationExist = true;
              self.getAllShedules();
            } else {
              self.locationExist = false;
              self.checkDashboardVisibility();
            }
            for (const loc of locations) {
              if (loc.status === 'ACTIVE') {
                self.locations.push(loc);
              }
            }
            const cookie_location_id = self.groupService.getitemFromGroupStorage('provider_selected_location'); // same in provider checkin button page
            if (cookie_location_id === '') {
              if (self.locations[0]) {
                self.locationSelected(self.locations[0]).then(
                  (schedules: any) => {
                    this.initViews(schedules, 'changeLocation').then(
                      (view) => {
                        this.initView(view, 'changeLocation');
                      }
                    );
                  }
                );
              }
            } else {
              self.selectLocationFromCookies(parseInt(cookie_location_id, 10));
            }
            resolve();
          },
          () => {
            reject();
          },
          () => {
          }
        );
    },
    );
  }
  getQIdsFromView(view) {
    const qIds = [];
    if (view && view.customViewConditions.schedules && view.customViewConditions.schedules.length > 0) {
      for (let i = 0; i < view.customViewConditions.schedules.length; i++) {
        qIds.push(view.customViewConditions.schedules[i]['id']);
      }
    }
    return qIds;
  }
  initView(view, source, type?) {

    const loggedUser = this.groupService.getitemFromGroupStorage('ynw-user');
    if (view.name === 'All Appointments' && !loggedUser.adminPrivilege && loggedUser.userType !== 5) {
      this.activeUser = loggedUser.id;
    } else {

      this.activeSchedules = [];
      const groupbyQs = this.shared_functions.groupBy(this.getSchedulesFromView(view, this.schedules), 'apptState');
      if (groupbyQs['ENABLED'] && groupbyQs['ENABLED'].length > 0) {
        this.activeSchedules = groupbyQs['ENABLED'];
      }
      if (view.name !== 'All Appointments') {
        if (groupbyQs['DISABLED'] && groupbyQs['DISABLED'].length > 0) {
          this.activeSchedules = this.activeSchedules.concat(groupbyQs['DISABLED']);
        }
      }
      const qids = [];
      for (const q of this.activeSchedules) {
        qids.push(q.id);
      }
      if (!type && this.time_type === 2 && this.groupService.getitemFromGroupStorage('appt_future_selQ')) {
        this.selQIds = this.groupService.getitemFromGroupStorage('appt_future_selQ');
      } else if (!type && this.time_type === 1 && this.groupService.getitemFromGroupStorage('appt_selQ')) {
        this.selQIds = this.groupService.getitemFromGroupStorage('appt_selQ');
      } else if (this.activeSchedules.length > 0) {
        if (this.time_type === 3) {
          this.selQidsforHistory = qids;
          this.groupService.setitemToGroupStorage('appt_history_selQ', this.selQidsforHistory);
        }
        this.selQIds = qids;
        if (this.time_type === 1) {
          this.groupService.setitemToGroupStorage('appt_selQ', this.selQIds);
        }
        if (this.time_type === 2) {
          this.groupService.setitemToGroupStorage('appt_future_selQ', this.selQIds);
        }
      }
    }
    setTimeout(() => {
      this.qloading = false;
    }, 1000);
    this.loadApiSwitch(source);
  }
  resetAll() {
    this.selectedAppt = [];
  }
  resetFilter() {
    this.filters = {
      first_name: false,
      last_name: false,
      phone_number: false,
      appointmentEncId: false,
      patientId: false,
      appointmentMode: false,
      schedule: false,
      service: false,
      apptStatus: false,
      payment_status: false,
      check_in_start_date: false,
      check_in_date: false,
      check_in_end_date: false,
      location_id: false,
      age: false,
      gender: false,
      location: false
    };
    this.filter = {
      first_name: '',
      last_name: '',
      phone_number: '',
      appointmentEncId: '',
      patientId: '',
      appointmentMode: 'all',
      schedule: 'all',
      location: 'all',
      service: 'all',
      apptStatus: 'all',
      payment_status: 'all',
      check_in_start_date: null,
      check_in_date: null,
      check_in_end_date: null,
      location_id: 'all',
      page_count: projectConstants.PERPAGING_LIMIT,
      page: 0,
      future_appt_date: null,
      age: 'all',
      gender: 'all'
    };
    this.statusMultiCtrl = [];
  }
  checkFilterDateMaxMin(type) {
    if (type === 'check_in_start_date') {
      this.filter_date_end_min = this.filter.check_in_start_date;
    } else if (type === 'check_in_end_date') {
      this.filter_date_start_max = this.filter.check_in_end_date;
    }
    this.doSearch();
  }
  loadApiSwitch(source) {
    this.resetCheckList();
    let chkSrc = true;
    this.loading = true;
    if (source === 'changeLocation' && this.time_type === 3) {
      const hisPage = this.groupService.getitemFromGroupStorage('appthP');
      const hFilter = this.groupService.getitemFromGroupStorage('appthPFil');
      if (hisPage) {
        this.filter = hFilter;
        this.pagination.startpageval = hisPage;
        this.groupService.removeitemFromGroupStorage('appthP');
        this.groupService.removeitemFromGroupStorage('appthPFil');
        chkSrc = false;
      }
    } else {
      this.groupService.removeitemFromGroupStorage('appthP');
      this.groupService.removeitemFromGroupStorage('appthPFil');
    }
    if (chkSrc) {
      if (source !== 'doSearch' && source !== 'reloadAPIs' && source !== 'changeWaitlistStatusApi') {
        this.resetFilter();
        this.resetFilterValues();
        this.resetLabelFilter();
      }
    }
    switch (this.time_type) {
      case 1: this.getTodayAppointments();
        break;
      case 2: this.getFutureAppointments();
        break;
      case 3: this.getHistoryAppointments();
        break;
    }
    this.getCounts();
  }
  setTimeType(time_type) {
    this.showSlotsN = false;
    this.statusMultiCtrl = [];
    this.hideFilterSidebar();
    this.resetCheckList();
    if (time_type === 2) {
      this.getTomorrowDate();
      if (this.statusAction === 'completed' || this.statusAction === 'started') {
        this.statusAction = 'new';
      }
    }
    if (this.open_filter === true) {
      this.toggleFilter();
    }
    this.appt_list = this.check_in_filtered_list = [];
    this.time_type = time_type;
    this.groupService.setitemToGroupStorage('apptType', this.time_type);
    if (time_type !== 3) {
      this.resetPaginationData();
    } else {
      const selectedView = this.groupService.getitemFromGroupStorage('appt-selectedView');
      this.selQidsforHistory = this.getQIdsFromView(selectedView);
      this.groupService.setitemToGroupStorage('appt_history_selQ', this.selQidsforHistory);
    }
    const stype = this.groupService.getitemFromGroupStorage('pdStyp');
    if (stype) {
      this.status_type = stype;
    } else {
      this.status_type = 'cancelled';
    }
    this.setFilterDateMaxMin();
    this.filterapplied = false;
    this.loadApiSwitch('setTimeType');
  }
  toggleFilter() {
    this.open_filter = !this.open_filter;
    if (this.open_filter) {
      this.setFilterdobMaxMin();
    }
  }
  setFilterdobMaxMin() {
    this.filter_dob_start_max = new Date();
    this.filter_dob_end_max = new Date();
  }
  setFilterDateMaxMin() {
    this.filter_date_start_min = null;
    this.filter_date_start_max = null;
    this.filter_date_end_min = null;
    this.filter_date_end_max = null;
    if (this.time_type === 0) {
      this.filter_date_start_max = moment(new Date()).add(-1, 'days');
    } else if (this.time_type === 2) {
      this.filter_date_start_min = moment(new Date()).add(+1, 'days');
      this.filter_date_end_min = moment(new Date()).add(+1, 'days');
    }
  }
  getCounts() {
    this.today_waitlist_count = 0;
    this.history_waitlist_count = 0;
    this.future_waitlist_count = 0;
    if (this.time_type !== 2 && this.activeSchedules.length > 0) {
      this.getFutureAppointmentsCount()
        .then(
          (result) => {
            this.future_waitlist_count = result;
          }
        );
    }
    if (this.time_type !== 3) {
      this.getHistoryAppointmentsCount()
        .then(
          (result) => {
            this.history_waitlist_count = result;
          }
        );
    }
    if (this.time_type !== 1 && this.activeSchedules.length > 0) {
      this.getTodayAppointmentsCount()
        .then(
          (result) => {
            this.today_waitlist_count = result;
          }
        );
    }
  }
  getActiveAppointments(appointments, status) {
    if (status === 'new') {
      return this.getScheduledAppointment(appointments);
    } else if (status === 'started') {
      return this.getStartedAppointment(appointments);
    } else if (status === 'completed') {
      return this.getCompletedAppointment(appointments);
    } else {
      return this.getCancelledAppointment(appointments);
    }
  }
  getScheduledAppointment(appointments) {
    let scheduledList = [];
    if (appointments['Confirmed']) {
      scheduledList = appointments['Confirmed'].slice();
    }
    if (appointments['Arrived']) {
      Array.prototype.push.apply(scheduledList, appointments['Arrived'].slice());
    }
    if (appointments['blocked']) {
      Array.prototype.push.apply(scheduledList, appointments['blocked'].slice());
    }
    this.sortCheckins(scheduledList);
    return scheduledList;
  }
  getCancelledAppointment(appointments) {
    let cancelledList = [];
    if (appointments['Cancelled']) {
      cancelledList = appointments['Cancelled'].slice();
    }
    if (appointments['Rejected']) {
      Array.prototype.push.apply(cancelledList, appointments['Rejected'].slice());
    }
    return cancelledList;
  }
  getStartedAppointment(appointments) {
    let startedList = [];
    if (appointments['Started']) {
      startedList = appointments['Started'].slice();
    }
    return startedList;
  }
  getCompletedAppointment(appointments) {
    let completedList = [];
    if (appointments['Completed']) {
      completedList = appointments['Completed'].slice();
    }
    if (appointments['Settled']) {
      Array.prototype.push.apply(completedList, appointments['Settled'].slice());
    }
    return completedList;
  }
  sortCheckins(checkins) {
    checkins.sort(function (message1, message2) {
      if (message1.appmtTime > message2.appmtTime) {
        return 11;
      } else if (message1.appmtTime < message2.appmtTime) {
        return -1;
      } else {
        return 0;
      }
    });
  }

  getActiveTimeSlot(slots) {
    const curDate = new Date();
    const curTime = curDate.getHours() + ':' + curDate.getMinutes();
    let activeTime = '';
    if (slots && slots.length > 1) {
      activeTime = slots[0].time.split('-')[0];
      for (let indx = 0; indx < slots.length; indx++) {
        if (slots[indx].time.split('-')[0] > curTime) {
          break;
        }
        activeTime = this.getSingleTime(slots[indx].time);
      }
    }
    return activeTime;
  }
  /**
   * @param action Scheduled/Started/Cancelled/Completed
   * @param type Today/Future/History
   */
  getCount(list, status) {
    return list.filter(function (elem) {
      return elem.apptStatus === status;
    }).length;
  }
  setCounts(list) {
    this.today_arrived_count = this.getCount(list, 'Arrived');
    this.today_checkedin_count = this.getCount(list, 'Confirmed');
    this.today_bloacked_count = this.getCount(list, 'blocked');
    this.today_checkins_count = this.today_arrived_count + this.today_checkedin_count + this.today_bloacked_count;
    this.today_started_count = this.getCount(list, 'Started');
    this.today_completed_count = this.getCount(list, 'Completed');
    this.today_cancelled_count = this.getCount(list, 'Cancelled');
    this.today_rejected_count = this.getCount(list, 'Rejected');
    this.today_cancelled_checkins_count = this.today_cancelled_count + this.today_rejected_count;
    this.scheduled_count = this.today_checkins_count;
    this.started_count = this.today_started_count;
    this.completed_count = this.today_completed_count;
    this.cancelled_count = this.today_cancelled_checkins_count;
    this.today_waitlist_count = this.today_checkins_count + this.today_started_count + this.today_completed_count + this.today_cancelled_checkins_count;
  }
  getTodayAppointmentsCount(Mfilter = null) {
    const queueid = this.groupService.getitemFromGroupStorage('appt_selQ');
    let no_filter = false;
    if (!Mfilter) {
      Mfilter = {};
      if (queueid || this.activeUser) {
        if (this.activeUser) {
          if (this.active_user.userTeams && this.active_user.userTeams.length > 0 && !this.admin) {
            Mfilter['or=team-eq'] = 'id::' + this.active_user.userTeams + ',provider-eq=' + this.activeUser;
          } else {
            Mfilter['provider-eq'] = this.activeUser;
          }
        } else {
          Mfilter['schedule-eq'] = queueid;
        }
      }
      no_filter = true;
    }
    if (this.selected_location && this.selected_location.id) {
      Mfilter['location-eq'] = this.selected_location.id;
    }
    if (this.filter.apptStatus === 'all') {
      Mfilter['apptStatus-neq'] = 'prepaymentPending,failed';
    }
    return new Promise((resolve) => {
      this.provider_services.getTodayAppointmentsCount(Mfilter)
        .subscribe(
          data => {
            if (no_filter) { this.today_waitlist_count = data; }
            resolve(data);
          },
          () => {
          });
    });
  }
  getFutureAppointmentsCount(Mfilter = null) {
    const queueid = this.groupService.getitemFromGroupStorage('appt_future_selQ');
    if (!Mfilter) {
      Mfilter = {};
      if (queueid) {
        if (this.activeUser) {
          if (this.activeUser && this.unassignview) {
            Mfilter['provider-eq'] = null;
          } else {
            if (this.active_user.userTeams && this.active_user.userTeams.length > 0 && !this.admin) {
              Mfilter['or=team-eq'] = 'id::' + this.active_user.userTeams + ',provider-eq=' + this.activeUser;
            } else {
              Mfilter['provider-eq'] = this.activeUser;
            }
          }
        } else {
          if (this.unassignview) {
            Mfilter['provider-eq'] = null;
          } else {
            Mfilter['schedule-eq'] = queueid;
          }
        }
      } else {
        if (this.activeUser) {
          if (this.active_user.userTeams && this.active_user.userTeams.length > 0 && !this.admin) {
            Mfilter['or=team-eq'] = 'id::' + this.active_user.userTeams + ',provider-eq=' + this.activeUser;
          } else {
            Mfilter['provider-eq'] = this.activeUser;
          }
        } else {
          Mfilter['schedule-eq'] = this.selQIds;
        }
        this.groupService.setitemToGroupStorage('appt_future_selQ', this.selQIds);
      }
    }
    if (this.selected_location && this.selected_location.id) {
      Mfilter['location-eq'] = this.selected_location.id;
    }
    if (this.filter.apptStatus === 'all') {
      Mfilter['apptStatus-neq'] = 'prepaymentPending,failed';
    }
    if (this.filter.check_in_date != null) {
      Mfilter['date-eq'] = this.dateTimeProcessor.transformToYMDFormat(this.filter.check_in_date);
    }
    return new Promise((resolve) => {
      this.provider_services.getFutureAppointmentsCount(Mfilter)
        .subscribe(
          data => {
            resolve(data);
            this.future_waitlist_count = data;
          },
          () => {
          });
    });
  }
  getHistoryAppointmentsCount(Mfilter = null) {   
    if (!Mfilter) {
      Mfilter = {};
    }
    if (this.filter.apptStatus === 'all') {
      Mfilter['apptStatus-neq'] = 'prepaymentPending,failed';
    }
    if (Mfilter['schedule-eq'] && (this.filteredSchedule.length === 0 || this.filter.schedule === 'all')) {
      delete Mfilter['schedule-eq'];
    }
    console.log('hisory', this.active_user);
    if (this.active_user.accountType === 'BRANCH' && !this.active_user.adminPrivilege && this.active_user.userType !== 5) {
      if (this.active_user.userTeams && this.active_user.userTeams.length > 0 && !this.admin) {
        Mfilter['or=team-eq'] = 'id::' + this.active_user.userTeams + ',provider-eq=' + this.active_user.id;
      } else {
        Mfilter['provider-eq'] = this.active_user.id;
      }
    }
    return new Promise((resolve) => {
      this.provider_services.getHistoryAppointmentsCount(Mfilter)
        .subscribe(
          data => {
            resolve(data);
            this.history_waitlist_count = data;
          },
          () => {
          });
    });
  }
  resetCheckList() {
    this.availableSlotDetails = {};
    this.timeSlotAppts = {};
    this.slotsChecked = {};
    this.apptsChecked = {};
    this.chkSlotInput = {};
    this.selectedAppt = [];
    this.appointmentsChecked = [];
    this.setApptSelections();
    this.chkSelectAppointments = false;
    this.apptSingleSelection = false;
    this.apptMultiSelection = false;
    this.chkAppointments = {};
    this.selAllSlots = false;
    this.startedChkAppointments = {};
    this.startedAppointmentsChecked = [];
    this.apptStartedSingleSelection = false;
    this.apptStartedMultiSelection = false;
  }
  getTodayAppointments() {
    const Mfilter = this.setFilterForApi();
    // if (this.selected_location && this.selected_location.id) {
    //   Mfilter['location-eq'] = this.selected_location.id;
    // }
    if (this.groupService.getitemFromGroupStorage('appt_selQ')) {
      this.selQIds = this.groupService.getitemFromGroupStorage('appt_selQ');
    }
    if (this.selQIds && this.selQIds.length > 0 || this.activeUser) {
      if (this.activeUser) {
        console.log(this.unassignview);
        if (this.unassignview) {
          Mfilter['provider-eq'] = null;
        } else {
          if (this.active_user.userTeams && this.active_user.userTeams.length > 0 && !this.admin) {
            Mfilter['or=team-eq'] = 'id::' + this.active_user.userTeams + ',provider-eq=' + this.activeUser;
          } else {
            Mfilter['provider-eq'] = this.activeUser;
          }
        }
      }
      else {
        if (this.unassignview) {
          Mfilter['provider-eq'] = null;
        } else {
          Mfilter['schedule-eq'] = this.selQIds;
        }
      }
      this.groupService.setitemToGroupStorage('appt_selQ', this.selQIds);
    }
    if (this.filter.apptStatus === 'all') {
      Mfilter['apptStatus-neq'] = 'prepaymentPending,failed';
    }
    this.resetPaginationData();
    this.pagination.startpageval = 1;
    this.pagination.totalCnt = 0; // no need of pagination in today
    if (this.activeSchedules.length > 0 || this.activeUser || (this.active_user.accountType === 'BRANCH' && this.activeSchedules.length == 0)) {
      const promise = this.getTodayAppointmentsCount(Mfilter);
      promise.then(
        result => {
          this.chkSelectAppointments = false;
          this.provider_services.getTodayAppointments(Mfilter)
            .subscribe(
              (data: any) => {
                this.appt_list = data;
                this.todayAppointments = this.shared_functions.groupBy(this.appt_list, 'apptStatus');
                if (this.filterapplied === true) {
                  this.noFilter = false;
                } else {
                  this.noFilter = true;
                }
                this.setCounts(this.appt_list);
                this.check_in_filtered_list = this.getActiveAppointments(this.todayAppointments, this.statusAction);
                this.apptByTimeSlot = this.shared_functions.groupBy(this.check_in_filtered_list, 'appmtTime');
                this.handleApptSelectionType();
                this.startedAppts = this.getActiveAppointments(this.todayAppointments, 'started');
              },
              () => {
                this.loading = false;
              },
              () => {
                this.loading = false;
                setTimeout(() => {
                  const activeTimeSlot = this.getActiveTimeSlot(this.availableSlotDetails.availableSlots);
                  if (activeTimeSlot !== '') {
                    this.scrollToSection(activeTimeSlot);
                  }
                }, 500);

              });
        });
    } else {
      this.loading = false;
    }
  }
  setFutureCounts(appointments) {
    this.scheduled_count = this.getActiveAppointments(appointments, 'new').length;
    this.cancelled_count = this.getActiveAppointments(appointments, 'cancelled').length;
  }
  getTomorrowDate() {
    const server = this.server_date.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
    const serverdate = moment(server).format();
    const servdate = new Date(serverdate);
    this.tomorrowDate = new Date(moment(new Date(servdate)).add(+1, 'days').format('YYYY-MM-DD'));
    if (this.groupService.getitemFromGroupStorage('futureDate') && this.dateTimeProcessor.transformToYMDFormat(this.groupService.getitemFromGroupStorage('futureDate')) > this.dateTimeProcessor.transformToYMDFormat(servdate)) {
      this.filter.future_appt_date = new Date(this.groupService.getitemFromGroupStorage('futureDate'));
    } else {
      this.filter.future_appt_date = moment(new Date(servdate)).add(+1, 'days').format('YYYY-MM-DD');
    }
  }
  getYesterdayDate() {
    const server = this.server_date.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
    const serverdate = moment(server).format();
    const servdate = new Date(serverdate);
    this.yesterdayDate = this.maxday = this.endmaxday = new Date(moment(new Date(servdate)).add(-1, 'days').format('YYYY-MM-DD'));
  }
  getFutureAppointments() {
    this.resetCheckList();
    if (this.groupService.getitemFromGroupStorage('appt_future_selQ')) {
      this.selQIds = this.groupService.getitemFromGroupStorage('appt_future_selQ');
    }
    let Mfilter = this.setFilterForApi();
    // if (this.selected_location && this.selected_location.id) {
    //   Mfilter['location-eq'] = this.selected_location.id;
    // }
    if (this.selQIds && this.selQIds.length > 0 || this.activeUser) {
      if (this.activeUser) {
        if (this.unassignview) {
          Mfilter['provider-eq'] = null;
        } else {
          if (this.active_user.userTeams && this.active_user.userTeams.length > 0 && !this.admin) {
            Mfilter['or=team-eq'] = 'id::' + this.active_user.userTeams + ',provider-eq=' + this.activeUser;
          } else {
            Mfilter['provider-eq'] = this.activeUser;
          }
        }
      } else {
        if (this.unassignview) {
          Mfilter['provider-eq'] = null;
        } else {
          Mfilter['schedule-eq'] = this.selQIds;
        }
      }
      this.groupService.setitemToGroupStorage('appt_future_selQ', this.selQIds);
    }

    if (this.filter.apptStatus === 'all') {
      Mfilter['apptStatus-neq'] = 'prepaymentPending,failed';
    }
    if (this.filter.check_in_date != null) {
      Mfilter['date-eq'] = this.dateTimeProcessor.transformToYMDFormat(this.filter.check_in_date);
    }
    if (this.activeSchedules.length > 0 || this.activeUser || (this.active_user.accountType === 'BRANCH' && this.activeSchedules.length == 0)) {
    const promise = this.getFutureAppointmentsCount(Mfilter);
    promise.then(
      result => {
        this.provider_services.getFutureAppointments(Mfilter)
          .subscribe(
            data => {
              this.futureAppointments = this.shared_functions.groupBy(data, 'apptStatus');
              if (this.filterapplied === true) {
                this.noFilter = false;
              } else {
                this.noFilter = true;
              }
              if (this.selQIds) {
                this.check_in_filtered_list = this.getActiveAppointments(this.futureAppointments, this.statusAction);
                this.setFutureCounts(this.futureAppointments);
              }
            },
            () => {
            },
            () => {
              this.loading = false;
            });
      });
    } else {
      this.loading = false;
    }
  }
  getHistoryAppointments() {
    console.log("in history");
    let Mfilter = this.setFilterForApi();
    if (this.active_user.accountType === 'BRANCH' && !this.active_user.adminPrivilege && this.active_user.userType !== 5) {
      if (this.active_user.userTeams && this.active_user.userTeams.length > 0 && !this.admin) {
        Mfilter['or=team-eq'] = 'id::' + this.active_user.userTeams + ',provider-eq=' + this.active_user.id;
      } else {
        Mfilter['provider-eq'] = this.active_user.id;
      }
    }
    const promise = this.getHistoryAppointmentsCount(Mfilter);
    promise.then(
      result => {
        this.pagination.totalCnt = result;
        Mfilter = this.setPaginationFilter(Mfilter);
        this.appointmentsChecked = {};
        this.chkAppointments = {};
        this.chkSelectAppointments = false;
        this.setApptSelections();
        this.provider_services.getHistoryAppointments(Mfilter)
          .subscribe(
            data => {
              this.appt_list = this.check_in_filtered_list = data;
              if (this.filterapplied === true) {
                this.noFilter = false;
              } else {
                this.noFilter = true;
              }
            },
            () => {
            },
            () => {
              this.loading = false;
            });
      }
    );
  }
  setApptSelections() {
    this.apptSingleSelection = false;
    this.apptMultiSelection = false;
    this.activeAppointment = null;
    this.showRejected = false;
    this.showShare = false;
    this.showUndo = false;
    this.showArrived = false;
    const totalAppointmentsSelected = Object.keys(this.appointmentsChecked).length;
    if (totalAppointmentsSelected === this.check_in_filtered_list.length && totalAppointmentsSelected !== 0) {
      this.chkSelectAppointments = true;
    }
    if (totalAppointmentsSelected === 1) {
      this.apptSingleSelection = true;
      Object.keys(this.appointmentsChecked).forEach(key => {
        this.activeAppointment = this.appointmentsChecked[key];
      });
      if (this.time_type === 1 && this.activeAppointment.apptStatus === 'Confirmed' && !this.activeAppointment.virtualService) {
        this.showArrived = true;
      }
      if (this.time_type !== 3 && this.activeAppointment.apptStatus !== 'Completed' && this.activeAppointment.apptStatus !== 'Confirmed') {
        this.showUndo = true;
      }
      if (this.activeAppointment.apptStatus === 'Confirmed' || this.activeAppointment.apptStatus === 'Arrived') {
        this.showRejected = true;
      }
      if (this.activeAppointment.apptStatus !== 'Rejected' && this.activeAppointment.apptStatus !== 'Cancelled') {
        this.showShare = true;
      }
      if (this.activeAppointment.apptStatus === 'Confirmed' && this.activeAppointment.jaldeeApptDistanceTime && this.activeAppointment.jaldeeApptDistanceTime.jaldeeDistanceTime && (this.activeAppointment.jaldeeStartTimeType === 'ONEHOUR' || this.activeAppointment.jaldeeStartTimeType === 'AFTERSTART')) {
        this.consumerTrackstatus = true;
      } else {
        this.consumerTrackstatus = false;
      }
    } else if (totalAppointmentsSelected > 1) {
      this.apptMultiSelection = true;
    }
  }
  resetPaginationData() {
    this.filter.page = 1;
    this.pagination.startpageval = 1;
    this.groupService.removeitemFromGroupStorage('appthP');
    this.groupService.removeitemFromGroupStorage('appthPFil');
  }
  handle_pageclick(pg) {
    this.pagination.startpageval = pg;
    this.filter.page = pg;
    this.groupService.setitemToGroupStorage('appthP', pg);
    this.groupService.setitemToGroupStorage('appthPFil', this.filter);
    this.doSearch();
  }
  getPatientIdFilter(patientid) {
    const idFilter = 'memberJaldeeId::' + patientid;
    return idFilter;
  }
  setFilterForApi() {
    let api_filter = {};
    const filter = this.lStorageService.getitemfromLocalStorage('filter');
    console.log(filter);
    if (filter) {
      api_filter = filter;
    }
    console.log(api_filter);
    if (this.filter.first_name !== '') {
      api_filter['firstName-eq'] = this.filter.first_name;
    }
    if (this.filter.last_name !== '') {
      api_filter['lastName-eq'] = this.filter.last_name;
    }
    if (this.filter.phone_number !== '') {
      api_filter['phoneNo-eq'] = this.filter.phone_number;
    }
    if (this.filter.appointmentEncId !== '') {
      api_filter['appointmentEncId-eq'] = this.filter.appointmentEncId;
    }
    if (this.filter.patientId !== '') {
      api_filter['appmtFor-eq'] = this.getPatientIdFilter(this.filter.patientId);
    }
    if (this.services.length > 0 && this.filter.service !== 'all') {
      api_filter['service-eq'] = this.services.toString();
    }
    if (this.apptStatuses.length > 0 && this.filter.apptStatus !== 'all') {
      api_filter['apptStatus-eq'] = this.apptStatuses.toString();
    }
    if (this.apptModes.length > 0 && this.filter.appointmentMode !== 'all') {
      api_filter['appointmentMode-eq'] = this.apptModes.toString();
    }
    if (this.time_type !== 1) {
      if (this.filter.check_in_start_date != null) {
        api_filter['date-ge'] = this.dateTimeProcessor.transformToYMDFormat(this.filter.check_in_start_date);
      }
      if (this.filter.check_in_end_date != null) {
        api_filter['date-le'] = this.dateTimeProcessor.transformToYMDFormat(this.filter.check_in_end_date);
      }
    }
    if (this.paymentStatuses.length > 0 && this.filter.payment_status !== 'all') {
      api_filter['paymentStatus-eq'] = this.paymentStatuses.toString();
    }
    if (this.time_type === 3) {
      if (this.filteredSchedule.length > 0 && this.filter.schedule !== 'all') {
        if (this.activeUser) {
          api_filter['provider-eq'] = this.activeUser;
        } else {
          api_filter['schedule-eq'] = this.filteredSchedule.toString();
        }

      }
      if (this.filterLocation.length > 0 && this.filter.location !== 'all') {
        api_filter['location-eq'] = this.filterLocation.toString();
      }
      if (this.ageGroups.length > 0 && this.filter.age !== 'all') {
        const kids = moment(new Date()).add(-12, 'year').format('YYYY-MM-DD');
        const adults = moment(new Date()).add(-60, 'year').format('YYYY-MM-DD');
        if (this.ageGroups.indexOf('kids') !== -1 && this.ageGroups.indexOf('adults') === -1 && this.ageGroups.indexOf('senior') === -1) {
          api_filter['dob-ge'] = kids;
        } else if (this.ageGroups.indexOf('kids') === -1 && this.ageGroups.indexOf('adults') !== -1 && this.ageGroups.indexOf('senior') === -1) {
          api_filter['dob-le'] = kids;
          api_filter['dob-ge'] = adults;
        } else if (this.ageGroups.indexOf('kids') === -1 && this.ageGroups.indexOf('adults') === -1 && this.ageGroups.indexOf('senior') !== -1) {
          api_filter['dob-le'] = adults;
        } else if (this.ageGroups.indexOf('kids') !== -1 && this.ageGroups.indexOf('adults') !== -1 && this.ageGroups.indexOf('senior') === -1) {
          api_filter['dob-ge'] = adults;
        } else if (this.ageGroups.indexOf('kids') !== -1 && this.ageGroups.indexOf('adults') === -1 && this.ageGroups.indexOf('senior') !== -1) {
          api_filter['dob-le'] = adults;
          api_filter['dob-ge'] = kids;
        } else if (this.ageGroups.indexOf('kids') === -1 && this.ageGroups.indexOf('adults') !== -1 && this.ageGroups.indexOf('senior') !== -1) {
          api_filter['dob-le'] = kids;
        }
      }
      if (this.genderList.length > 0 && this.filter.gender !== 'all') {
        api_filter['gender-eq'] = this.genderList.toString();
      }
    }
    if (this.time_type !== 3) {
      if (this.selected_location && this.selected_location.id) {
        api_filter['location-eq'] = this.selected_location.id;
      }
    }
    if (this.labelFilterData !== '') {
      api_filter['label-eq'] = this.labelFilterData;
    }

    if (this.filter.apptStatus === 'all') {
      api_filter['apptStatus-neq'] = 'prepaymentPending,failed';
    }
    return api_filter;
  }
  setPaginationFilter(api_filter) {
    api_filter['from'] = (this.pagination.startpageval) ? (this.pagination.startpageval - 1) * this.filter.page_count : 0;
    api_filter['count'] = this.filter.page_count;
    return api_filter;
  }
  doSearch() {
    this.shared_functions.setFilter();
    this.lStorageService.removeitemfromLocalStorage('filter');
    this.endminday = this.filter.check_in_start_date;
    if (this.filter.check_in_end_date) {
      this.maxday = this.filter.check_in_end_date;
    } else {
      this.maxday = this.yesterdayDate;
    }
    this.labelSelection();
    if (this.filter.first_name || this.filter.last_name || this.filter.phone_number || this.filter.appointmentEncId || this.filter.patientId || this.filter.service !== 'all' ||
      this.filter.schedule !== 'all' || this.filter.payment_status !== 'all' || this.filter.appointmentMode !== 'all' || this.filter.check_in_start_date !== null
      || this.filter.check_in_end_date !== null || this.filter.check_in_date !== null || this.filter.age !== 'all' || this.filter.gender !== 'all' || this.labelFilterData !== '' || this.filter.apptStatus !== 'all'
      || this.allAgeSlected || this.allGenderSlected || this.allServiceSelected || this.allApptStatusSelected
      || this.allPayStatusSelected || this.allModeSelected || this.allLabelSelected || this.allScheduleSelected || this.allLocationSelected) {
      this.filterapplied = true;
    } else {
      this.filterapplied = false;
    }
    this.loadApiSwitch('doSearch');
  }
  keyPressed() {
    this.shared_functions.setFilter();
    this.lStorageService.removeitemfromLocalStorage('filter');
    this.endminday = this.filter.check_in_start_date;
    if (this.filter.check_in_end_date) {
      this.maxday = this.filter.check_in_end_date;
    } else {
      this.maxday = this.yesterdayDate;
    }
    this.labelSelection();
    if (this.filter.first_name || this.filter.last_name || this.filter.phone_number || this.filter.appointmentEncId || this.filter.patientId || this.filter.service !== 'all' ||
      this.filter.schedule !== 'all' || this.filter.payment_status !== 'all' || this.filter.appointmentMode !== 'all' || this.filter.check_in_start_date !== null
      || this.filter.check_in_end_date !== null || this.filter.check_in_date !== null || this.filter.age !== 'all' || this.filter.gender !== 'all' || this.labelFilterData !== '' || this.filter.apptStatus !== 'all'
      || this.allAgeSlected || this.allGenderSlected || this.allServiceSelected || this.allApptStatusSelected
      || this.allPayStatusSelected || this.allModeSelected || this.allLabelSelected || this.allScheduleSelected || this.allLocationSelected) {
      this.filterapplied = true;
    } else {
      this.filterapplied = false;
    }
  }
  getSingleTime(slot) {
    const slots = slot.split('-');
    return this.dateTimeProcessor.convert24HourtoAmPm(slots[0]);
  }

  apptClicked(type, time?) {
    if (this.schedules.length === 0) {
      this.snackbarService.openSnackBar('No active schedules', { 'panelClass': 'snackbarerror' });
    } else if (this.service_list.length === 0) {
      this.snackbarService.openSnackBar('No active services', { 'panelClass': 'snackbarerror' });
    } else {
      let slot = '';
      let scheduleId;
      let deptId;
      let userId;
      let serviceId;
      if (time) {
        slot = time.time;
        scheduleId = time.scheduleId;
        const qfilter = this.activeSchedules.filter(q => q.id === time.scheduleId);
        if (qfilter && qfilter[0].services && qfilter[0].services.length > 0) {
          serviceId = qfilter[0].services[0].id;
        }
        if (qfilter && qfilter[0].provider) {
          userId = qfilter[0].provider.id;
          const filteredDept = this.users.filter(user => user.id === userId);
          if (filteredDept[0] && filteredDept[0].deptId) {
            deptId = filteredDept[0].deptId;
          }
        } else {
          userId = '0';
          const filteredService = this.service_list.filter(service => service.id === serviceId);
          if (filteredService[0] && filteredService[0].department) {
            deptId = filteredService[0].department;
          }
        }
      }
      this.router.navigate(['provider', 'appointments', 'appointment'],
        { queryParams: { timeslot: slot, scheduleId: scheduleId, checkinType: type, userId: userId, deptId: deptId, serviceId: serviceId } });
    }
  }
  searchCustomer() {
    this.router.navigate(['provider', 'customers', 'find']);
  }
  /**
   * Labels Section
   */
  resetLabelFilter() {
    this.labelMultiCtrl = [];
    this.labelFilter = [];
    this.labelFilterData = '';
  }

  getLabel() {
    this.providerLabels = [];
    this.provider_services.getLabelList().subscribe(data => {
      this.allLabels = data;
      this.providerLabels = this.allLabels.filter(label => label.status === 'ENABLED');
    });
  }
  getDisplayname(label) {
    for (let i = 0; i < this.allLabels.length; i++) {
      if (this.allLabels[i].label === label) {
        return this.allLabels[i].displayName;
      }
    }
  }
  labelSelection() {
    this.labelFilterData = '';
    this.labelsCount = [];
    let count = 0;
    Object.keys(this.selectedLabels).forEach(key => {
      if (this.selectedLabels[key].length > 0) {
        count++;
        if (!this.labelFilterData.includes(key)) {
          if (count === 1) {
            this.labelFilterData = this.labelFilterData + key + '::' + this.selectedLabels[key].join(',');
          } else {
            this.labelFilterData = this.labelFilterData + '$' + key + '::' + this.selectedLabels[key].join(',');
          }
        }
      } else {
        delete this.selectedLabels[key];
      }
    });
  }

  /**
 * Router Navigations
 */
  gotoLocations() {
    this.router.navigate(['provider', 'settings', 'general', 'locations']);
  }
  gotoCustomViews() {
    this.closebutton.nativeElement.click();
    const navigationExtras: NavigationExtras = {
      queryParams: {
        type: 'appt'
      }
    };
    this.router.navigate(['provider', 'settings', 'general', 'customview'], navigationExtras);
  }
  gotoUser() {
    this.router.navigate(['provider', 'settings', 'general', 'users']);
  }
  /**
   * Filter Actions
   */
  filterClicked(type) {
    this.filters[type] = !this.filters[type];
    if (!this.filters[type]) {
      if (type === 'check_in_start_date' || type === 'check_in_end_date' || type === 'check_in_date') {
        this.filter[type] = null;
      } else if (type === 'payment_status' || type === 'service' || type === 'queue' || type === 'appointmentMode' || type === 'location') {
        this.filter[type] = 'all';
      } else if (type === 'apptStatus') {
        this.statusMultiCtrl = [];
      } else {
        this.filter[type] = '';
      }
      this.doSearch();
    }
  }
  getStatusLabel(status) {
    const label_status = this.wordProcessor.firstToUpper(this.wordProcessor.getTerminologyTerm(status));
    return label_status;
  }

  selectAllAppoinments() {
    this.appointmentsChecked = {};
    this.chkAppointments = {};
    if (this.chkSelectAppointments) {
      for (let aIndex = 0; aIndex < this.check_in_filtered_list.length; aIndex++) {
        if (this.check_in_filtered_list[aIndex].providerConsumer) {
          this.chkAptHistoryClicked(aIndex, this.check_in_filtered_list[aIndex]);
        }
      }
    } else {
      this.apptSingleSelection = false;
      this.apptMultiSelection = false;
      this.activeAppointment = null;
    }
  }
  chkAptClicked(appt) {
    const indx = this.check_in_filtered_list.indexOf(appt);
    this.chkAptHistoryClicked(indx, appt);
  }
  chkAppointmentSelection(appt) {
    const indx = this.check_in_filtered_list.indexOf(appt);
    return this.chkAppointments[indx];
  }
  chkAptHistoryClicked(index, appt) {
    if (!this.chkAppointments[index]) {
      this.chkAppointments[index] = true;
      this.appointmentsChecked[index] = appt;
    } else {
      this.chkAppointments[index] = false;
      delete this.appointmentsChecked[index];
      this.chkSelectAppointments = false;
      this.selAllSlots = false;
    }
    this.setApptSelections();
  }
  clearFilter() {
    this.resetFilter();
    this.resetLabelFilter();
    this.resetFilterValues();
    this.filterapplied = false;
    this.loadApiSwitch('doSearch');
    this.shared_functions.setFilter();
    this.setFilterDateMaxMin();
  }
  resetFilterValues() {
    this.ageGroups = [];
    this.genderList = [];
    this.services = [];
    this.apptStatuses = [];
    this.filteredSchedule = [];
    this.paymentStatuses = [];
    this.apptModes = [];
    this.filterLocation = [];
    this.allAgeSlected = false;
    this.allGenderSlected = false;
    this.allServiceSelected = false;
    this.allScheduleSelected = false;
    this.allApptStatusSelected = false;
    this.allPayStatusSelected = false;
    this.allModeSelected = false;
    this.allLocationSelected = false;
    this.selectedLabels = [];
    this.allLabelSelected = [];
  }
  setFilterData(type, value) {
    this.filter[type] = value;
    this.resetPaginationData();
    this.doSearch();
  }
  setFilterDataCheckbox(type, value, event) {
    this.filter[type] = value;
    this.resetPaginationData();
    if (type === 'appointmentMode') {
      if (value === 'all') {
        this.apptModes = [];
        this.allModeSelected = false;
        if (event.checked) {
          for (const apptMode of this.appointmentModes) {
            if (this.apptModes.indexOf(apptMode.mode) === -1) {
              this.apptModes.push(apptMode.mode);
            }
          }
          this.allModeSelected = true;
        }
      } else {
        this.allModeSelected = false;
        const indx = this.apptModes.indexOf(value);
        if (indx === -1) {
          this.apptModes.push(value);
        } else {
          this.apptModes.splice(indx, 1);
        }
      }
      if (this.apptModes.length === this.appointmentModes.length) {
        this.filter['appointmentMode'] = 'all';
        this.allModeSelected = true;
      }
    }
    if (type === 'payment_status') {
      if (value === 'all') {
        this.paymentStatuses = [];
        this.allPayStatusSelected = false;
        if (event.checked) {
          for (const pay_status of this.payStatusList) {
            if (this.paymentStatuses.indexOf(pay_status.pk) === -1) {
              this.paymentStatuses.push(pay_status.pk);
            }
          }
          this.allPayStatusSelected = true;
        }
      } else {
        this.allPayStatusSelected = false;
        const indx = this.paymentStatuses.indexOf(value);
        if (indx === -1) {
          this.paymentStatuses.push(value);
        } else {
          this.paymentStatuses.splice(indx, 1);
        }
      }
      if (this.paymentStatuses.length === this.payStatusList.length) {
        this.filter['payment_status'] = 'all';
        this.allPayStatusSelected = true;
      }
    }
    if (type === 'apptStatus') {
      this.firstTime = false;
      if (value === 'all') {
        this.apptStatuses = [];
        this.allApptStatusSelected = false;
        if (event.checked) {
          for (const apptStatus of this.check_in_statuses_filter) {
            if (this.apptStatuses.indexOf(apptStatus.value) === -1) {
              this.apptStatuses.push(apptStatus.value);
            }
          }
          this.allApptStatusSelected = true;
        }
      } else {
        this.allApptStatusSelected = false;
        const indx = this.apptStatuses.indexOf(value);
        if (indx === -1) {
          this.apptStatuses.push(value);
        } else {
          this.apptStatuses.splice(indx, 1);
        }
      }
      if (this.apptStatuses.length === this.check_in_statuses_filter.length) {
        this.filter['apptStatus'] = 'all';
        this.allApptStatusSelected = true;
      }
    }
    if (type === 'service') {
      if (value === 'all') {
        this.services = [];
        this.allServiceSelected = false;
        if (event.checked) {
          for (const service of this.service_list) {
            if (this.services.indexOf(service.id) === -1) {
              this.services.push(service.id);
            }
          }
          this.allServiceSelected = true;
        }
      } else {
        this.allServiceSelected = false;
        const indx = this.services.indexOf(value);
        if (indx === -1) {
          this.services.push(value);
        } else {
          this.services.splice(indx, 1);
        }
      }
      if (this.services.length === this.service_list.length) {
        this.filter['service'] = 'all';
        this.allServiceSelected = true;
      }
    }
    if (type === 'schedule') {
      if (value === 'all') {
        this.filteredSchedule = [];
        this.allScheduleSelected = false;
        if (event.checked) {
          for (const service of this.schedules) {
            if (this.filteredSchedule.indexOf(service.id) === -1) {
              this.filteredSchedule.push(service.id);
            }
          }
          this.allScheduleSelected = true;
        }
      } else {
        this.allScheduleSelected = false;
        const indx = this.filteredSchedule.indexOf(value);
        if (indx === -1) {
          this.filteredSchedule.push(value);
        } else {
          this.filteredSchedule.splice(indx, 1);
        }
      }
      if (this.filteredSchedule.length === this.schedules.length) {
        this.filter['schedule'] = 'all';
        this.allScheduleSelected = true;
      }
    }
    if (type === 'location') {
      if (value === 'all') {
        this.filterLocation = [];
        this.allLocationSelected = false;
        if (event.checked) {
          for (const q of this.locations) {
            if (this.filterLocation.indexOf(q.id) === -1) {
              this.filterLocation.push(q.id);
            }
          }
          this.allLocationSelected = true;
        }
      } else {
        this.allLocationSelected = false;
        const indx = this.filterLocation.indexOf(value);
        if (indx === -1) {
          this.filterLocation.push(value);
        } else {
          this.filterLocation.splice(indx, 1);
        }
      }
      if (this.filterLocation.length === this.locations.length) {
        this.filter['location'] = 'all';
        this.allLocationSelected = true;
      }
    }
    this.keyPressed();
  }
  showConsumerNote(checkin) {
    this.notedialogRef = this.dialog.open(ProviderWaitlistCheckInConsumerNoteComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        checkin: checkin,
        type: 'appt'
      }
    });
    this.notedialogRef.afterClosed().subscribe(result => {
      if (result === 'reloadlist') {
      }
    });
  }

  changeApptStatusByBatch(action, appt, result?) {
    let post_data = {
      date: appt.appmtDate
    };
    if (result) {
      post_data = result;
      post_data['date'] = appt.appmtDate;
    }
    this.provider_services.changeAppointmentStatusByBatch(appt.batchId, action, post_data).subscribe(
      () => {
        this.refresh();
      }, (error) => {
        this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      }
    );
  }
  cancelBatchAppt(appt) {
    const dialogRef = this.dialog.open(ProviderWaitlistCheckInCancelPopupComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        isBatch: true,
        type: 'appt',
        batchId: appt.batchId
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.cancelReason || result.rejectReason) {
        this.changeApptStatusByBatch('Cancelled', appt, result);
      }
    });
  }
  changeWaitlistStatus(status, action, appt?) {
    const _this = this;
    let appmt;
    if (appt) {
      appmt = appt;
    } else {
      if (status === 'started') {
        Object.keys(_this.startedAppointmentsChecked).forEach(apptIndex => {
          appmt = _this.startedAppointmentsChecked[apptIndex];
        });
      } else {
        Object.keys(_this.appointmentsChecked).forEach(apptIndex => {
          appmt = _this.appointmentsChecked[apptIndex];
        });
      }
    }
    _this.provider_shared_functions.changeWaitlistStatus(_this, appmt, action, 'appt');
  }

  goCheckinDetail(checkin) {
    this.lStorageService.setitemonLocalStorage('filter', this.setFilterForApi());
    if (this.time_type === 3) {
      this.groupService.setitemToGroupStorage('appthP', this.filter.page || 1);
      this.groupService.setitemToGroupStorage('appthPFil', this.filter);
    }
    this.router.navigate(['provider', 'appointments', checkin.uid], { queryParams: { timetype: this.time_type } });
  }

  findCurrentActiveQueue(ques) {
    let selindx = 0;
    const cday = new Date();
    const currentday = (cday.getDay() + 1);
    const curtime = this.provider_shared_functions.formatTime(cday.getHours(), cday.getMinutes());
    let stime;
    let etime;
    const tday = cday.getFullYear() + '-' + (cday.getMonth() + 1) + '-' + cday.getDate();
    const curtimeforchk = new Date(tday + ' ' + curtime);
    for (let i = 0; i < ques.length; i++) {
      for (let j = 0; j < ques[i].apptSchedule.repeatIntervals.length; j++) {
        const pday = Number(ques[i].apptSchedule.repeatIntervals[j]);
        if (currentday === pday) {
          stime = new Date(tday + ' ' + this.provider_shared_functions.AMHourto24(ques[i].apptSchedule.timeSlots[0].sTime));
          etime = new Date(tday + ' ' + this.provider_shared_functions.AMHourto24(ques[i].apptSchedule.timeSlots[0].eTime));
          if ((curtimeforchk.getTime() >= stime.getTime()) && (curtimeforchk.getTime() <= etime.getTime())) {
            selindx = i;
            return selindx;
          }
        }
      }
    }
    return selindx;
  }

  callingAppt(checkin) {
    const status = (checkin.callingStatus) ? 'Disable' : 'Enable';
    this.provider_services.setApptCallStatus(checkin.uid, status).subscribe(
      () => {
        this.loadApiSwitch('reloadAPIs');
      });
  }
  changeWaitlistStatusApi(waitlist, action, post_data = {}) {
    this.statusChangeClicked = true;
    this.provider_shared_functions.changeApptStatusApi(this, waitlist, action, post_data)
      .then(
        result => {
          this.statusChangeClicked = false;
          this.loadApiSwitch(result);
        }, error => {
          this.statusChangeClicked = false;
        }
      );
  }
  getPos() {
    this.provider_services.getProviderPOSStatus().subscribe(data => {
      this.pos = data['enablepos'];
    });
  }
  printHistoryCheckin() {
    const Mfilter = this.setFilterForApi();
    const promise = this.getHistoryAppointmentsCount(Mfilter);
    promise.then(
      result => {
        this.provider_services.getHistoryAppointments(Mfilter)
          .subscribe(
            data => {
              this.historyCheckins = data;
              const params = [
                'height=' + screen.height,
                'width=' + screen.width,
                'fullscreen=yes'
              ].join(',');
              const printWindow = window.open('', '', params);
              let checkin_html = '';
              checkin_html += '<table width="100%" style="border: 1px solid #dbdbdb;">';
              checkin_html += '<td style="padding:10px;">Sl.No.</td>';
              checkin_html += '<td style="padding:10px;">Date & Time</td>';
              checkin_html += '<td style="padding:10px;">Name</td>';
              checkin_html += '<td style="padding:10px;">Service</td>';
              checkin_html += '<td style="padding:10px;">Label</td>';
              checkin_html += '</thead>';
              for (let i = 0; i < this.historyCheckins.length; i++) {
                const fname = (this.historyCheckins[i].appmtFor[0].firstName) ? this.historyCheckins[i].appmtFor[0].firstName : '';
                const lname = (this.historyCheckins[i].appmtFor[0].lastName) ? this.historyCheckins[i].appmtFor[0].lastName : '';
                checkin_html += '<tr style="line-height:20px;padding:10px">';
                checkin_html += '<td style="padding:10px">' + (this.historyCheckins.indexOf(this.historyCheckins[i]) + 1) + '</td>';
                checkin_html += '<td style="padding:10px">' + moment(this.historyCheckins[i].appmtDate).format(projectConstants.DISPLAY_DATE_FORMAT) + ' ' + this.getSingleTime(this.historyCheckins[i].appmtTime) + '</td>';
                checkin_html += '<td style="padding:10px">' + fname + ' ' + lname + '</td>';
                checkin_html += '<td style="padding:10px">' + this.historyCheckins[i].service.name + '</td>';
                if (this.historyCheckins[i].label && Object.keys(this.historyCheckins[i].label).length > 0) {
                  const labels = [];
                  Object.keys(this.historyCheckins[i].label).forEach(key => {
                    labels.push(this.getDisplayname(key));
                  });
                  checkin_html += '<td style="padding:10px">' + labels.toString() + '</td></tr>';
                }
              }
              checkin_html += '</table>';
              checkin_html += '<div style="margin:10px">';
              if (!this.labelFilterData.match('$') && this.labelsCount.length > 1) {
                for (const count of this.labelsCount) {
                  checkin_html += '<div style="padding-bottom:10px;">' + count + ' Records</div>';
                }
              }
              checkin_html += '</div>';
              printWindow.document.write('<html><head><title></title>');
              printWindow.document.write('</head><body >');
              printWindow.document.write(checkin_html);
              printWindow.document.write('</body></html>');
              printWindow.moveTo(0, 0);
              printWindow.print();
              printWindow.document.close();
              setTimeout(() => {
                printWindow.close();
              }, 500);
            });
      });
  }

  onChangeLocationSelect(event) {
    const value = event;
    this.resetFields();
    this.clearApptIdsFromStorage();
    this.locationSelected(this.locations[value] || []).then(
      (schedules: any) => {
        this.initViews(schedules, 'changeLocation').then(
          (view) => {
            this.initView(view, 'changeLocation');
          }
        );
      }
    );
  }
  locationSelected(location) {
    this.selected_location = location;
    const _this = this;
    if (this.selected_location) {
      this.groupService.setitemToGroupStorage('provider_selected_location', this.selected_location.id);
    }
    this.groupService.setitemToGroupStorage('loc_id', this.selected_location);
    return new Promise(function (resolve, reject) {
      _this.getSchedules('all').then(
        (queues: any) => {
          _this.schedules = _this.tempActiveSchedules = queues;
          resolve(queues);
        },
        () => {
          resolve([]);
        }
      );
    });
  }
  handleViewSel(view) {
    this.unassignview = false;
    console.log("view Seslection");
    console.log(view);
    this.activeUser = null;
    const tempUser = {};
    tempUser['firstName'] = 'All';
    tempUser['id'] = 'all';
    this.selectedUser = tempUser;
    this.qloading = true;
    this.groupService.setitemToGroupStorage('appt-selectedView', view);
    this.selectedView = view;
    if (!view.userType) {
      this.initView(this.selectedView, 'reloadAPIs', 'view');
    } else {
      console.log('i am a user');
      this.handleUserSelection(view);
    }
  }
  clearApptIdsFromStorage() {
    this.groupService.removeitemFromGroupStorage('appt_history_selQ');
    this.groupService.removeitemFromGroupStorage('appt_future_selQ');
    this.groupService.removeitemFromGroupStorage('appt_selQ');
    this.groupService.removeitemFromGroupStorage('appt-selectedView');
    this.resetPaginationData();
  }
  getServices() {
    const filter1 = { 'serviceType-neq': 'donationService', 'status-eq': 'ACTIVE' };
    this.provider_services.getServicesList(filter1)
      .subscribe(
        data => {
          this.service_list = data;
        },
        () => { }
      );
  }
  showCallingModes(modes) {
    if (!modes.consumer) {
      this.consumr_id = modes.providerConsumer.id;
    } else {
      this.consumr_id = modes.consumer.id;
    }
    const navigationExtras: NavigationExtras = {
      queryParams: {
        waiting_id: modes.uid,
        type: 'appt'
      }
    };
    this.router.navigate(['provider', 'telehealth'], navigationExtras);
  }
  scrollToSection(curTime) {
    this.slotIds.toArray().forEach(element => {
      if (element.nativeElement.innerText === curTime) {
        element.nativeElement.scrollIntoViewIfNeeded({ behavior: 'smooth', block: 'start' });
        return false;
      }
    });
  }
  scrollToTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
  getVirtualMode(virtualService) {
    return Object.keys(virtualService)[0];
  }

  getProviders() {
    const apiFilter = {};
    apiFilter['userType-eq'] = 'PROVIDER';
    this.provider_services.getUsers(apiFilter).subscribe(data => {
      this.users = data;
      const tempUser = {};
      tempUser['firstName'] = 'All';
      tempUser['id'] = 'all';
      if (this.groupService.getitemFromGroupStorage('appt-selectedUser')) {
        this.selectedUser = this.groupService.getitemFromGroupStorage('appt-selectedUser');
      } else {
        this.selectedUser = tempUser;
      }
    });
  }

  handleUserSelection(user) {
    this.activeUser = null;
    this.qloading = true;
    this.resetFields();
    this.groupService.setitemToGroupStorage('appt-selectedUser', user);
    this.selectedUser = user;
    this.getQsByProvider(user);
  }
  isNumeric(evt) {
    return this.shared_functions.isNumeric(evt);
  }
  getQsByProvider(user?) {
    if (!user || (user && user === 'all')) {
      this.activeSchedules = this.tempActiveSchedules;
    } else {
      this.activeUser = user.id;
      this.activeSchedules = [];
    }
    if (this.activeSchedules.length === 0) {
      this.selQIds = [];
    } else {
      const qids = [];
      for (const q of this.activeSchedules) {
        qids.push(q.id);
      }
      this.selQIds = qids;
    }
    setTimeout(() => {
      this.qloading = false;
    }, 1000);
    console.log("TimeType:" + this.time_type);
    if (this.time_type === 1) {
      this.groupService.setitemToGroupStorage('appt_selQ', this.selQIds);
    } else if (this.time_type === 2) {
      this.groupService.setitemToGroupStorage('appt_future_selQ', this.selQIds);
    } else {
      this.groupService.setitemToGroupStorage('appt_history_selQ', this.selQIds);
    }
    this.loadApiSwitch('reloadAPIs');
  }
  resetFields() {
    this.today_waitlist_count = 0;
    this.future_waitlist_count = 0;
    this.history_waitlist_count = 0;
    this.check_in_filtered_list = [];
    this.activeSchedules = [];
    this.scheduled_count = 0;
    this.started_count = 0;
    this.completed_count = 0;
    this.cancelled_count = 0;
  }

  showAttachments(appt) {
    this.provider_services.getProviderAppointmentAttachmentsByUuid(appt.uid).subscribe(
      (communications: any) => {
        this.showattachmentDialogRef = this.dialog.open(AttachmentPopupComponent, {
          width: '50%',
          panelClass: ['popup-class', 'commonpopupmainclass'],
          disableClose: true,
          data: {
            attachments: communications,
            type: 'appt'
          }
        });
        this.showattachmentDialogRef.afterClosed().subscribe(result => {
          if (result === 'reloadlist') {
          }
        });
      });
  }
  openAttachmentGallery(appt) {
    this.provider_services.getProviderAppointmentAttachmentsByUuid(appt.uid).subscribe(
      (communications: any) => {
        this.image_list_popup_temp = [];
        this.image_list_popup = [];
        let count = 0;
        for (let comIndex = 0; comIndex < communications.length; comIndex++) {
          const thumbPath = communications[comIndex].thumbPath;
          let imagePath = thumbPath;
          const description = communications[comIndex].s3path;
          const caption = communications[comIndex].caption;
          const thumbPathExt = description.substring((description.lastIndexOf('.') + 1), description.length);
          if (new RegExp(this.imageAllowed.join("|")).test(thumbPathExt.toUpperCase())) {
            imagePath = communications[comIndex].s3path;
          }
          let type = communications[comIndex].type.split('/');
          type = type[0];
          if (type !== 'image') {
            imagePath = communications[comIndex].thumbPath;
          }
          const imgobj = new Image(
            count,
            { // modal
              img: imagePath,
              description: caption || ''
            },
          );
          this.image_list_popup_temp.push(imgobj);
          count++;
        }
        if (count > 0) {
          this.image_list_popup = this.image_list_popup_temp;
          setTimeout(() => {
            this.openImageModalRow(this.image_list_popup[0]);
          }, 200);
        }
      },
      error => { }
    );
  }
  openImageModalRow(image: Image) {
    const index: number = this.getCurrentIndexCustomLayout(image, this.image_list_popup);
    this.customPlainGalleryRowConfig = Object.assign({}, this.customPlainGalleryRowConfig, { layout: new AdvancedLayout(index, true) });
  }
  private getCurrentIndexCustomLayout(image: Image, images: Image[]): number {
    return image ? images.indexOf(image) : -1;
  }
  getGlobalSettings() {
    return new Promise<void>((resolve) => {
      this.provider_services.getGlobalSettings().subscribe(
        (data: any) => {
          this.apptStatus = data.appointment;
          resolve();
        });
    });
  }
  getBusinessdetFromLocalstorage() {
    const bdetails = this.groupService.getitemFromGroupStorage('ynwbp');
    if (bdetails) {
      this.bname = bdetails.bn || '';
    }
    if (this.bname === '') {
      this.profileExist = false;
    } else {
      this.profileExist = true;
    }
    setTimeout(() => {
      this.checkDashboardVisibility();
    }, 500);
  }
  getAllServices() {
    const filter1 = { 'serviceType-neq': 'donationService' };
    return new Promise<void>((resolve) => {
      this.provider_services.getServicesList(filter1)
        .subscribe(
          (data: any) => {
            if (data.length > 0) {
              this.serviceExist = true;
            } else {
              this.serviceExist = false;
            }
            resolve();
          },
          () => { }
        );
    });
  }
  getAllShedules() {
    this.provider_services.getProviderSchedules().subscribe(
      (schedules: any) => {
        if (schedules.length > 0) {
          this.scheduleExist = true;
          this.getGlobalSettings().then(
            () => {
              this.getAllServices().then(
                () => {
                  this.getBusinessdetFromLocalstorage();
                }
              );
            }
          );
        } else {
          this.scheduleExist = false;
          this.checkDashboardVisibility();
        }
      });
  }
  checkDashboardVisibility() {
    if (!this.apptStatus || !this.profileExist || !this.locationExist || !this.serviceExist || !this.scheduleExist) {
      if (!this.profileExist || !this.locationExist || !this.serviceExist || !this.scheduleExist) {
        this.message = 'To access Appointments dashboard, set up the profile and turn on Jaldee Appointment Manager in Settings.';
      } else {
        this.message1 = 'Enable Jaldee Appointment Manager in your settings to access Appointments dashboard.';
      }
      this.apiloading = false;
      this.showDashbard = false;
    } else {
      this.apiloading = false;
      this.showDashbard = true;
    }
  }
  gotoAppt() {
    this.router.navigate(['/provider/settings/appointmentmanager']);
  }
  gotoSettings() {
    this.router.navigate(['/provider/settings']);
  }

  setLabelFilter(label, event) {
    this.resetPaginationData();
    const value = event.checked;
    if (label === 'all') {
      this.allLabelSelected = false;
      if (event.checked) {
        for (const lbl of this.providerLabels) {
          if (!this.selectedLabels[lbl.label]) {
            this.selectedLabels[lbl.label] = [];
            this.selectedLabels[lbl.label].push(true);
          }
        }
        this.allLabelSelected = true;
      } else {
        this.selectedLabels = [];
        this.allLabelSelected = false;
      }
    } else {
      this.allLabelSelected = false;
      if (this.selectedLabels[label.label]) {
        delete this.selectedLabels[label.label];
      } else {
        this.selectedLabels[label.label] = [];
        this.selectedLabels[label.label].push(value);
      }
      if (Object.keys(this.selectedLabels).length === this.providerLabels.length) {
        this.allLabelSelected = true;
      }
    }
    this.keyPressed();
  }
  showCheckinActions(status, checkin?) {
    let waitlist = [];
    if (checkin) {
      waitlist = checkin;
    } else {
      if (status === 'started') {
        Object.keys(this.startedAppointmentsChecked).forEach(apptIndex => {
          waitlist.push(this.startedAppointmentsChecked[apptIndex]);
        });
      } else {
        Object.keys(this.appointmentsChecked).forEach(apptIndex => {
          waitlist.push(this.appointmentsChecked[apptIndex]);
        });
      }
    }
    let multiSelection;
    if (checkin) {
      multiSelection = false;
    } else {
      if (status === 'started') {
        multiSelection = this.apptStartedMultiSelection;
      } else {
        multiSelection = this.apptMultiSelection;
      }
    }
    const actiondialogRef = this.dialog.open(AppointmentActionsComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'checkinactionclass'],
      disableClose: true,
      data: {
        checkinData: waitlist,
        timetype: this.time_type,
        multiSelection: multiSelection,
        labelFilterData: this.labelFilterData,
        labelsCount: this.labelsCount
      }
    });
    actiondialogRef.afterClosed().subscribe(data => {
      if (data === 'reload') {
        this.chkSelectAppointments = false;
        this.chkStartedSelectAppointments = false;
        this.getLabel();
        this.loadApiSwitch('');
      }
    });
  }
  CreateVoiceCall(appt?) {
    let appmt;
    appmt = appt.uid;
    this.voicedialogRef = this.dialog.open(VoicecallDetailsSendComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass'],
      disableClose: true,
      data: {
        uuid: appmt,
      }
    });
  }
  onButtonBeforeHook() { }
  onButtonAfterHook() { }
  gotoCustomerDetails(appt) {
    this.lStorageService.setitemonLocalStorage('filter', this.setFilterForApi());
    console.log(this.setFilterForApi());
    if (appt.apptStatus !== 'blocked') {
      this.router.navigate(['/provider/customers/' + appt.appmtFor[0].id]);
    }
  }
  stopprop(event) {
    event.stopPropagation();
  }
  addCustomerDetails(appt) {
    console.log(appt);
    let virtualServicemode;
    let virtualServicenumber;
    if (appt.service.serviceType == 'virtualService') {
      virtualServicemode = appt.service.virtualCallingModes[0].callingMode;
      if(appt.service.virtualCallingModes[0].value){
        virtualServicenumber = appt.service.virtualCallingModes[0].value;
      }
      
      // Object.keys(appt.virtualService).forEach(key => {
      //   virtualServicemode = key;
      //   virtualServicenumber = appt.virtualService[key];
      // });
    }
    this.router.navigate(['provider', 'appointments', 'appointment'], { queryParams: { source: 'appt-block', uid: appt.uid, virtualServicemode: virtualServicemode, virtualServicenumber: virtualServicenumber, serviceId: appt.service.id, apptMode: appt.appointmentMode } });
  }
  selectAllStarted() {
    this.startedAppointmentsChecked = {};
    this.startedChkAppointments = {};
    if (this.chkStartedSelectAppointments) {
      for (let aIndex = 0; aIndex < this.startedAppts.length; aIndex++) {
        this.chkStartedAptHistoryClicked(aIndex, this.startedAppts[aIndex]);
      }
    } else {
      this.apptStartedSingleSelection = false;
      this.apptStartedMultiSelection = false;
      this.activeAppointment = null;
    }
  }
  chkStartedAptHistoryClicked(index, appt) {
    if (!this.startedChkAppointments[index]) {
      this.startedChkAppointments[index] = true;
      this.startedAppointmentsChecked[index] = appt;
    } else {
      this.startedChkAppointments[index] = false;
      delete this.startedAppointmentsChecked[index];
      this.chkStartedSelectAppointments = false;
    }
    this.setStartedApptSelections();
  }

  setStartedApptSelections() {
    this.apptSingleSelection = false;
    this.apptStartedMultiSelection = false;
    this.activeAppointment = null;
    const totalAppointmentsSelected = Object.keys(this.startedAppointmentsChecked).length;
    if (totalAppointmentsSelected === this.startedAppts.length && totalAppointmentsSelected !== 0) {
      this.chkStartedSelectAppointments = true;
    }
    if (totalAppointmentsSelected === 1) {
      this.apptSingleSelection = true;
      Object.keys(this.startedAppointmentsChecked).forEach(key => {
        this.activeAppointment = this.startedAppointmentsChecked[key];
      });
    } else if (totalAppointmentsSelected > 1) {
      this.apptStartedMultiSelection = true;
    }
  }
  tabChange(event) {
    this.lStorageService.removeitemfromLocalStorage('filter');
    this.resetCheckList();
    this.chkSelectAppointments = false;
    this.chkStartedSelectAppointments = false;
    this.allStartedSelection = false;
    this.allSelection = false;
    this.loading = true;
    this.hideFilterSidebar();
    this.setTimeType(event.index + 1);
  }
  statusClick(status) {
    this.allSelection = false;
    this.statusAction = status;
    this.groupService.setitemToGroupStorage('appt_action', this.statusAction);
    this.chkSelectAppointments = false;
    this.chkStartedSelectAppointments = false;
    this.resetCheckList();
    if (this.time_type === 1) {
      this.check_in_filtered_list = this.getActiveAppointments(this.todayAppointments, status);
    } else {
      this.check_in_filtered_list = this.getActiveAppointments(this.futureAppointments, status);
    }
  }
  getScheduleIndex(id) {
    const filterSchedule = this.activeSchedules.filter(sch => sch.id === id);
    return this.activeSchedules.indexOf(filterSchedule[0]);
  }
  getSlotBYScheduleandDate(scheduleid, date) {
    this.provider_services.getSlotsByScheduleandDate(scheduleid, date).subscribe(
      (data: any) => {
        this.scheduleSlots = [];
        for (let i = 0; i < data.length; i++) {
          if (data[i].availableSlots) {
            for (let j = 0; j < data[i].availableSlots.length; j++) {
              if ((this.selected_type === 'all' && this.apptByTimeSlot[data[i].availableSlots[j].time] && this.apptByTimeSlot[data[i].availableSlots[j].time][0].schedule.id === data[i].scheduleId) || (data[i].availableSlots[j].active && data[i].availableSlots[j].noOfAvailbleSlots !== '0')) {
                data[i].availableSlots[j]['scheduleId'] = data[i].scheduleId;
                if (this.scheduleSlots.indexOf(data[i].availableSlots[j]) === -1) {
                  this.scheduleSlots.push(data[i].availableSlots[j]);
                }
              }
            }
          }
        }
        setTimeout(() => {
          this.loading = false;
        }, 200);
      }
    );
  }
  handleApptSelectionType(type?) {
    if (type) {
      this.selected_type = type;
    }
    this.groupService.setitemToGroupStorage('selected_type', this.selected_type);
    this.scheduleSlots = [];
    if (this.selected_type !== 'booked' && this.selQIds.length > 0) {
      this.loading = true;
      const server = this.server_date.toLocaleString(projectConstants.REGION_LANGUAGE, { timeZone: projectConstants.TIME_ZONE_REGION });
      const today = moment(server).format('YYYY-MM-DD');
      const schIds = this.selQIds.toString();
      const ids = schIds.replace(/,/g, '-');
      this.getSlotBYScheduleandDate(ids, today);
    }
  }
  showSelectAll() {
    if (this.check_in_filtered_list.length > 1) {
      const filterArray = this.check_in_filtered_list.filter(appt => appt.providerConsumer);
      if (filterArray.length > 1) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  getAge(age) {
    age = age.split(',');
    return age[0];
  }
  cardClicked(event) {
    console.log(event);
    if (event.type === 'note') {
      this.showConsumerNote(event.waitlist);
    } else if (event.type === 'attachment') {
      this.showAttachments(event.waitlist);
    } else if (event.type === 'actions') {
      this.showCheckinActions(event.statusAction, event.waitlist);
    }
  }
  getTeams() {
    const _this = this;
    return new Promise<void>(function (resolve) {
      _this.provider_services.getTeamGroup().subscribe(data => {
        _this.teams = data;
      },
        () => {
          resolve();
        });
    });
  }
  getUsersList(teamid) {
    const userObject = this.teams.filter(user => parseInt(user.id) === teamid);
    return userObject[0].name;
  }
  gotoUnassign() {
    this.unassignview = true;
    this.loadApiSwitch('reloadAPIs');
  }
}
