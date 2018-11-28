import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormMessageDisplayService } from '../../../shared//modules/form-message-display/form-message-display.service';
import { ProviderDataStorageService } from '../../services/provider-datastorage.service';
import { ProviderServices } from '../../services/provider-services.service';
import { Messages } from '../../../shared/constants/project-messages';
import { projectConstants } from '../../../shared/constants/project-constants';
import * as moment from 'moment';
import { AddProviderSchedulesComponent } from '../add-provider-schedule/add-provider-schedule.component';
import { SharedFunctions } from '../../../shared/functions/shared-functions';

@Component({
  selector: 'app-provider-add-queue',
  templateUrl: './add-provider-waitlist-queues.component.html',
  styleUrls: ['./add-provider-waitlist-queues.component.css']
})
export class AddProviderWaitlistQueuesComponent implements OnInit {

  service_time_cap = Messages.SERV_TIME_WINDOW_CAP;
  select_days_cap = Messages.SELECT_DAYS_BTN;
  start_time_cap = Messages.START_TIME_CAP;
  end_time_cap = Messages.END_TIME_CAP;
  service_time_window_name = Messages.SERVICE_TIME_WINDOW_CAP;
  location_cap = Messages.QUEUE_LOCATION_CAP;
  service_cap = Messages.QUEUE_SERVICE_CAP;
  schedule_cap = Messages.SCHEDULE_CAP;
  existing_schedule_cap = Messages.EXISTING_SCHEDULE_CAP;
  max_capacity_cap = Messages.MAX_CAPACITY_CAP;
  No_cap = Messages.NO_OF_CAP;
  servc_cap = Messages.SERVE_CAP;
  cancel_btn = Messages.CANCEL_BTN;
  save_btn = Messages.SAVE_BTN;
  amForm: FormGroup;
  api_error = null;
  api_success = null;
  schedule_arr: any = [];
  schedule_json: any = [];
  bProfile: any = [];
    holdloc_list: any = [];
  loc_list: any = [];
  serv_list: any = [];
  dstart_time;
  dend_time;
  selday_arr: any = [];
  selservice_arr: any = [];
  weekdays = projectConstants.myweekdaysSchedule;
  Selall = false;
  activeSchedules: any = [];
  customer_label = '';

  constructor(
    public dialogRef: MatDialogRef<AddProviderWaitlistQueuesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public provider_services: ProviderServices,
    private provider_datastorageobj: ProviderDataStorageService,
    private sharedfunctionObj: SharedFunctions
  ) {
    this.customer_label = this.sharedfunctionObj.getTerminologyTerm('customer');
  }

  ngOnInit() {
    this.activeSchedules = this.data.schedules;
    this.bProfile = this.provider_datastorageobj.get('bProfile');
    // tslint:disable-next-line:radix
    this.dstart_time = { hour: parseInt(moment(projectConstants.DEFAULT_STARTTIME, ['h:mm A']).format('HH')), minute: parseInt(moment(projectConstants.DEFAULT_STARTTIME, ['h:mm A']).format('mm')) };
    // tslint:disable-next-line:radix
    this.dend_time = { hour: parseInt(moment(projectConstants.DEFAULT_ENDTIME, ['h:mm A']).format('HH')), minute: parseInt(moment(projectConstants.DEFAULT_ENDTIME, ['h:mm A']).format('mm')) };  
    // moment(projectConstants.DEFAULT_STARTTIME, ['h:mm A']).format('HH:mm');
    // this.dend_time =  moment(projectConstants.DEFAULT_ENDTIME, ['h:mm A']).format('HH:mm');
    // Get the provider locations
     this.createForm();
    this.getProviderLocations();
    // Get the provider services
    this.getProviderServices();
    // this.schedule_arr = projectConstants.BASE_SCHEDULE; // get base schedule from constants file
  }

  // creates the form
  createForm() {
    console.log(this.dstart_time);
    this.amForm = this.fb.group({
      qname: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
      qlocation: ['', Validators.compose([Validators.required])],
      qstarttime: [this.dstart_time, Validators.compose([Validators.required])],
      qendtime: [this.dend_time, Validators.compose([Validators.required])],
      qcapacity: [10, Validators.compose([Validators.required, Validators.maxLength(4)])],
      qserveonce: [1, Validators.compose([Validators.required, Validators.maxLength(4)])]
    });

    // if (this.data.type === 'edit') {
    //     this.updateForm();
    // }

   // if (this.data.source === 'location_detail' &&
   //   this.data.type === 'add' &&
   //   this.data.queue.location.id) {
   //   this.amForm.get('qlocation').setValue(this.data.queue.location.id);
   // }
  }

  // sets up the form with the values filled in
  updateForm() {
    // console.log(this.data.queue.queueSchedule.timeSlots[0].sTime);
    const sttime = {
      // tslint:disable-next-line:radix
      hour: parseInt(moment(this.data.queue.queueSchedule.timeSlots[0].sTime,
        ['h:mm A']).format('HH')),
      // tslint:disable-next-line:radix
      minute: parseInt(moment(this.data.queue.queueSchedule.timeSlots[0].sTime,
        ['h:mm A']).format('mm'))
    };
    const edtime = {
      // tslint:disable-next-line:radix
      hour: parseInt(moment(this.data.queue.queueSchedule.timeSlots[0].eTime,
        ['h:mm A']).format('HH')),
      // tslint:disable-next-line:radix
      minute: parseInt(moment(this.data.queue.queueSchedule.timeSlots[0].eTime,
        ['h:mm A']).format('mm'))
    };
    // console.log('dataQ', this.data.queue);
    this.amForm.setValue({
      qname: this.data.queue.name || null,
      qlocation: this.data.queue.location.id || null,
      qstarttime: sttime || null,
      qendtime: edtime || null,
      qcapacity: this.data.queue.capacity || null,
      qserveonce: this.data.queue.parallelServing || null,
    });

    this.amForm.get('qlocation').disable();

    this.selday_arr = [];
    // extracting the selected days
    for (let j = 0; j < this.data.queue.queueSchedule.repeatIntervals.length; j++) {
      // pushing the day details to the respective array to show it in the page
      this.selday_arr.push(Number(this.data.queue.queueSchedule.repeatIntervals[j]));
    }
     if (this.selday_arr.length === 7) {
      this.Selall = true;
    } else {
      this.Selall = false;
    }
    this.selservice_arr = [];
    // extracting the selected services
    for (let j = 0; j < this.data.queue.services.length; j++) {
      // pushing the service details to the respective array to show it in the page
      for (let k = 0; k < this.serv_list.length; k++) {
        if (this.data.queue.services[j].id === this.serv_list[k].id) {
          this.selservice_arr.push(this.data.queue.services[j].id);
        }
      }
    }
    this.dstart_time = sttime; // moment(sttime, ['h:mm A']).format('HH:mm');
    this.dend_time = edtime; // moment(edtime, ['h:mm A']).format('HH:mm');
  }

  // gets the list of locations
  getProviderLocations() {
    this.provider_services.getProviderLocations()
      .subscribe(data => {
        this.holdloc_list = data;
        this.loc_list = [];
        for (let i = 0; i < this.holdloc_list.length; i++) {
          if (this.holdloc_list[i].status === 'ACTIVE') {
            this.loc_list.push(this.holdloc_list[i]);
          }
        }
        
        if (this.data.source === 'location_detail' &&
        this.data.type === 'add' &&
        this.data.queue.location.id) {
          this.amForm.get('qlocation').setValue(this.data.queue.location.id );
        } else if (this.data.type === 'add' && this.loc_list.length === 1) {
          this.amForm.get('qlocation').setValue(this.loc_list[0].id);
        }
        
      });
  }

  // get the list of services
  getProviderServices() {
    const params = { 'status': 'ACTIVE' };
    this.provider_services.getServicesList(params)
      .subscribe(data => {
        this.serv_list = data;
        if (this.data.type === 'edit') {
          this.updateForm();
        }
      });
  }

  // handles the day checkbox click
  handleDaychecbox(dayindx) {
    this.resetApiErrors();
    const selindx = this.selday_arr.indexOf(dayindx);
    if (selindx === -1) {
      this.selday_arr.push(dayindx);
    } else {
      this.selday_arr.splice(selindx, 1);
    }
     if (this.selday_arr.length === 7) {
      this.Selall = true;
    } else {
      this.Selall = false;
    }
  }

  // handles the service checkbox click
  handleServicechecbox(indx) {
    this.resetApiErrors();
    const selindx = this.selservice_arr.indexOf(indx);
    if (selindx === -1) {
      this.selservice_arr.push(indx);
    } else {
      this.selservice_arr.splice(selindx, 1);
    }
  }

  // gets the name of the day from the given index
  getDay(num) {
    return projectConstants.myweekdaysSchedule[num];
  }

  // handled the time box changes
  changetime(src, passtime) {
    switch (src) {
      case 'start':
        this.dstart_time = passtime;
        break;
      case 'end':
        this.dend_time = passtime;
        break;
    }
    // console.log(this.dstart_time, this.dend_time);
  }

  // checks whether a given value is there in the given array
  check_existsinArray(arr, val) {
    let ret = -1;
    for (let i = 0; i < arr.length; i++) {
      // console.log('compare', arr[i], val);
      if (arr[i] === val) {
        ret = i;
      }
    }
    return ret;
  }

  // handles the submit button click for add and edit
  onSubmit(form_data) {
    this.resetApiErrors();
    const selser: any = [];
    let schedulejson: any = [];
    // Check whether atleast one service is selected
    if (this.selservice_arr.length === 0) {
      const error = 'Please select services';
      this.sharedfunctionObj.apiErrorAutoHide(this, error);
      return;
    } else {
      for (const sel of this.selservice_arr) {
        selser.push({ 'id': sel });
      }
    }
    // Check whether atleast one day is selected
    if (this.selday_arr.length === 0) {
      const error = 'Please select the days';
      this.sharedfunctionObj.apiErrorAutoHide(this, error);
      return;
    } else {
      // Numeric validation
      if (isNaN(form_data.qcapacity)) {
        const error = 'Please enter a numeric value for capacity';
        this.sharedfunctionObj.apiErrorAutoHide(this, error);
        return;
      }
      if (!this.sharedfunctionObj.checkIsInteger(form_data.qcapacity)) {
        const error = 'Please enter an integer value for capacity';
        this.sharedfunctionObj.apiErrorAutoHide(this, error);
        return;
      } else {
        if (form_data.qcapacity === 0) {
          const error = 'Maximum Capacity should be greater than 0';
          this.sharedfunctionObj.apiErrorAutoHide(this, error);
          return;
        }
      }
      // Numeric validation
      if (isNaN(form_data.qserveonce)) {
        const error = 'Please enter a numeric value for Number of ' + this.customer_label + 's served at a time';
        this.sharedfunctionObj.apiErrorAutoHide(this, error);
        return;
      }
      if (!this.sharedfunctionObj.checkIsInteger(form_data.qserveonce)) {
        const error = 'Please enter an integer value for Number of ' + this.customer_label + 's served at a time';
        this.sharedfunctionObj.apiErrorAutoHide(this, error);
        return;
      } else {
        if (form_data.qserveonce === 0) {
          const error = 'Number of ' + this.customer_label + 's served at a time should be greater than 0';
          this.sharedfunctionObj.apiErrorAutoHide(this, error);
          return;
        }
      }

      // start and end date validations
      const cdate = new Date();
      const mon = (cdate.getMonth() + 1);
      let month = '';
      if (mon < 10) {
        month = '0' + mon;
      }
      const daystr: any = [];
      const today = cdate.getFullYear() + '-' + month + '-' + cdate.getDate();
      for (const cday of this.selday_arr) {
        daystr.push(cday);
      }
      // check whether the start and end times are selected
      if (!this.dstart_time || !this.dend_time) {
        // this.api_error = Messages.WAITLIST_QUEUE_SELECTTIME;
        this.sharedfunctionObj.apiErrorAutoHide(this, Messages.WAITLIST_QUEUE_SELECTTIME);
        return;
      }
      // today
      const curday = new Date();
      const today_date = moment(curday).format('YYYY-MM-DD');
      // const today_curtime = moment(moment(curday).format('LT'), ['hh:mm A']).format('HH:mm');
      // console.log('compare', this.sharedfunctionObj.getminutesOfDay(this.dstart_time),
      // this.sharedfunctionObj.getminutesOfDay(this.dend_time));
      if (this.sharedfunctionObj.getminutesOfDay(this.dstart_time) > this.sharedfunctionObj.getminutesOfDay(this.dend_time)) {
        // this.api_error = Messages.WAITLIST_QUEUE_STIMEERROR;
        this.sharedfunctionObj.apiErrorAutoHide(this, Messages.WAITLIST_QUEUE_STIMEERROR);
        return;
      }
      // convert start time to 12 hour format
      // const starttime = new Date(today_date + ' ' + this.dstart_time + ':00');
      const starttime = new Date(today_date + ' ' + this.dstart_time.hour + ':' + this.dstart_time.minute + ':00');
      const starttime_format = moment(starttime).format('hh:mm A') || null;

      // convert end time to 12 hour format
      // const endtime = new Date(today_date + ' ' + this.dend_time + ':00');
      const endtime = new Date(today_date + ' ' + this.dend_time.hour + ':' + this.dend_time.minute + ':00');
      const endtime_format = moment(endtime).format('hh:mm A') || null;

      // building the schedule json section
      schedulejson = {
        'recurringType': 'Weekly',
        'repeatIntervals': daystr,
        'startDate': today,
        'terminator': {
          'endDate': '',
          'noOfOccurance': ''
        },
        'timeSlots': [{
          'sTime': starttime_format,
          'eTime': endtime_format
        }]
      };
      // generating the data to be posted
      const post_data = {
        'name': form_data.qname,
        'queueSchedule': schedulejson,
        'parallelServing': form_data.qserveonce,
        'capacity': form_data.qcapacity,
        'location': {
          'id': form_data.qlocation
        },
        'services': selser
      };

      if (this.data.type === 'edit') {
        this.editProviderQueue(post_data);
      } else if (this.data.type === 'add') {
        this.addProviderQueue(post_data);
      }
    }
  }

  // Created new provider queue
  addProviderQueue(post_data) {
    this.provider_services.addProviderQueue(post_data)
      .subscribe(
        data => {
          this.api_success = this.sharedfunctionObj.getProjectMesssages('WAITLIST_QUEUE_CREATED');
          setTimeout(() => {
            this.dialogRef.close('reloadlist');
          }, projectConstants.TIMEOUT_DELAY);
        },
        error => {
          // this.api_error = error.error;
          this.sharedfunctionObj.apiErrorAutoHide(this, error);
        }
      );
  }

  // update a queue
  editProviderQueue(post_data) {
    post_data.id = this.data.queue.id;
    this.provider_services.editProviderQueue(post_data)
      .subscribe(
        data => {
          this.api_success = this.sharedfunctionObj.getProjectMesssages('WAITLIST_QUEUE_UPDATED');
          setTimeout(() => {
            this.dialogRef.close('reloadlist');
          }, projectConstants.TIMEOUT_DELAY);
        },
        error => {
          // this.api_error = error.error;
          this.sharedfunctionObj.apiErrorAutoHide(this, error);
        }
      );
  }

  // resets api for success and failure
  resetApiErrors() {
    this.api_error = null;
    this.api_success = null;
  }

  handleselectall() {
    this.Selall = true;
    this.selday_arr = [];
    const wkdaystemp = this.weekdays;
    this.weekdays = [];
    for (let ii = 1; ii <= 7; ii++) {
      this.handleDaychecbox(ii);
    }
    this.weekdays = wkdaystemp;
  }
  handleselectnone() {
    this.Selall = false;
    this.selday_arr = [];
    const wkdaystemp = this.weekdays;
    this.weekdays = [];
    this.weekdays = wkdaystemp;
  }
}
