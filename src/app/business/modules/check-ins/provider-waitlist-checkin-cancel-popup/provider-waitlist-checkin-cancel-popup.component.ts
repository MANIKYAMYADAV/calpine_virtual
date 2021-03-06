import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormMessageDisplayService } from '../../../../shared/modules/form-message-display/form-message-display.service';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { Messages } from '../../../../shared/constants/project-messages';
// import { projectConstants } from '../../../../app.component';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { DateFormatPipe } from '../../../../shared/pipes/date-format/date-format.pipe';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';
import { WordProcessor } from '../../../../shared/services/word-processor.service';

@Component({
  selector: 'app-provider-waitlist-checkin-cancel-popup',
  templateUrl: './provider-waitlist-checkin-cancel-popup.component.html'
})
export class ProviderWaitlistCheckInCancelPopupComponent implements OnInit {

  cancel_cap = Messages.CANCEL_BTN;
  message_cap = Messages.MESSAGE_CAP;
  ok_btn = Messages.OK_BTN;
  select_reason_cap = Messages.POPUP_SELECT_REASON_CAP;
  send_message_cap = Messages.POPUP_SEND_MSG_CAP;
  amForm: FormGroup;
  api_error = null;
  api_success = null;
  message = [];
  cancel_reasons: any = [];
  customer_label = '';
  checkin_label = '';
  default_message;
  default_message_arr: any = [];
  rep_username;
  rep_service;
  rep_provname;
  cur_msg = '';
  cancel_reasonobj;
  cancel_reason = '';
  cancel_reason_key = '';
  def_msg = '';
  rep_date: string;
  rep_time: string;
  settings: any = [];
  showToken = false;
  max_char_count = 500;
  char_count = 0;
  messgae_cap = Messages.OTHERMESSAGE_CAP;
  isfocused = false;
  constructor(
    public dialogRef: MatDialogRef<ProviderWaitlistCheckInCancelPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder, public dateformat: DateFormatPipe,
    public fed_service: FormMessageDisplayService,
    public provider_services: ProviderServices,
    public sharedfunctionObj: SharedFunctions,
    private wordProcessor: WordProcessor,
    private groupService: GroupStorageService
  ) {
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
    // if (this.data.appt || this.data.type === 'appt') {
    //   this.checkin_label = this.cancel_cap + ' Appointment';
    // } else {
    //   this.checkin_label = this.cancel_cap + ' ' + this.wordProcessor.getTerminologyTerm('waitlist');
    // }
  }

  ngOnInit() {
    const reasons_list = [];
    const type = this.groupService.getitemFromGroupStorage('pdtyp');
    // const reasons = projectConstants.WAITLIST_CANCEL_RESON;
    const reasons = projectConstantsLocal.WAITLIST_CANCEL_REASON;
    for (let i = 0; i < reasons.length; i++) {
      if (type !== reasons[i].type) {
        reasons_list.push(reasons[i]);
      }
    }
    this.cancel_reasons = reasons_list;
    if (this.data.isBatch) {
      this.rep_username = 'Batch ' + this.data.batchId;
    } else {
      if (this.data.appt) {
        this.rep_username = this.data.waitlist.appmtFor[0].firstName ? this.titleCaseWord(this.data.waitlist.appmtFor[0].firstName) : '' + ' ' +
          this.data.waitlist.appmtFor[0].lastName ? this.titleCaseWord(this.data.waitlist.appmtFor[0].lastName) : '';
        this.rep_date = this.titleCaseWord(this.dateformat.transformToMonthlyDate(this.data.waitlist.appmtDate));
        this.rep_time = this.titleCaseWord(this.data.waitlist.apptTakenTime);
      } else {
        this.rep_username = this.data.waitlist.waitlistingFor[0].firstName ? this.titleCaseWord(this.data.waitlist.waitlistingFor[0].firstName) : '' + ' ' +
          this.data.waitlist.waitlistingFor[0].lastName ? this.titleCaseWord(this.data.waitlist.waitlistingFor[0].lastName) : '';
        this.rep_date = this.titleCaseWord(this.dateformat.transformToMonthlyDate(this.data.waitlist.date));
        this.rep_time = this.titleCaseWord(this.data.waitlist.checkInTime);
      }
      if (!this.rep_username) {
        this.rep_username = this.customer_label;
      }
      this.rep_service = this.titleCaseWord(this.data.waitlist.service.name);
      if (this.data.waitlist.providerAccount) {
        this.rep_provname = this.titleCaseWord(this.data.waitlist.providerAccount.businessName);
      }
    }
    this.getDefaultMessages();
    this.createForm();
    this.getProviderSettings();
  }
  getProviderSettings() {
    this.provider_services.getWaitlistMgr()
      .subscribe(data => {
        this.settings = data;
        this.showToken = this.settings.showTokenId;
        if (this.data.appt || this.data.type === 'appt') {
          this.checkin_label = this.cancel_cap + ' Appointment';
        } else {
          if (this.showToken) {
            this.checkin_label = 'Are you sure you want to cancel this token?';
          } else {
            this.checkin_label = 'Are you sure you want to cancel this check-In?';
          }
        }
      }, () => {
      });
  }

  createForm() {
    this.amForm = this.fb.group({
      reason: ['', Validators.compose([Validators.required])],
      message: [''],
      send_message: [{ value: false, disabled: true }]
    });
    if (this.data.isBatch) {
      this.amForm.patchValue({ send_message: true });
    }
    this.amForm.get('send_message').valueChanges
      .subscribe(
        data => {
          if (data) {
            this.amForm.controls['message'].enable();
            // this.amForm.addControl('message',
            //   new FormControl(this.replacedMessage(), Validators.compose([Validators.required])));
            // this.amForm.get('message').setValue(this.replacedMessage());
          } else {
            // this.amForm.controls['message'].disable();
          }
        }
      );
  }

  onSubmit(form_data) {
    this.resetApiErrors();
    let post_data;
    // if (this.data.appt || this.data.type === 'appt') {
    //   post_data = {
    //     'rejectReason': form_data.reason
    //   };
    // } else {
    post_data = {
      'cancelReason': form_data.reason
    };
    // }
    if (form_data.send_message) {
      if (!form_data.message.replace(/\s/g, '').length) {
        this.api_error = 'Message cannot be empty';
        return;
      }
      post_data['communicationMessage'] = form_data.message;
    }

    if (this.data.isBatch && !post_data['communicationMessage']) {
      this.api_error = 'Message cannot be empty';
      return;
    }

    this.dialogRef.close(post_data);
  }

  selectReason(cancel_reason) {
    this.amForm.get('reason').setValue(cancel_reason.value);
    this.cancel_reasonobj = cancel_reason;
    this.cancel_reason = cancel_reason.title;
    this.cancel_reason_key = cancel_reason.reasonkey;
    this.amForm.controls['send_message'].enable();
    if (this.data.isBatch) {
    } else {
      this.def_msg = this.replacedMessage();
    }
    // if (this.amForm.get('message')) {
    //   this.amForm.get('message').setValue(this.replacedMessage());
    // }
    // if (!this.amForm.controls['send_message'].value) {
    //   this.amForm.controls['message'].disable();
    // }
  }
  resetApiErrors() {
    this.api_error = null;
    this.api_success = null;
  }

  getDefaultMessages() {
    // if (this.data.appt || this.data.type === 'appt') {
    //   this.provider_services.getApptProviderMessages()
    //     .subscribe(
    //       (data: any) => {
    //         this.default_message_arr = data;
    //         this.default_message = data.cancel || '';
    //         /*this.cur_msg = this.replacedMessage();
    //         if (this.amForm.get('reason')) {
    //          this.amForm.get('reason').setValue(this.cur_msg);
    //         }*/
    //       },
    //       () => {

    //       }
    //     );
    // } else {
    this.provider_services.getProviderMessages()
      .subscribe(
        (data: any) => {
          this.default_message_arr = data.cancelReasons;
          this.default_message = data.cancel || '';
          /*this.cur_msg = this.replacedMessage();
          // if (this.amForm.get('reason')) {
          //  this.amForm.get('reason').setValue(this.cur_msg);
          // }*/
        },
        () => {

        }
      );
    // }
  }
  replacedMessage() {
    let retmsg = '';
    if (this.cancel_reason_key) {
      retmsg = this.default_message_arr[this.cancel_reason_key];
    }
    // retmsg = this.default_message;
    if (retmsg && retmsg!=='') {
      retmsg = retmsg.replace(/\[consumer\]/g, this.rep_username);
      retmsg = retmsg.replace(/\[service\]/g, this.rep_service);
      retmsg = retmsg.replace(/\[date\]/g, this.rep_date);
      retmsg = retmsg.replace(/\[time\]/g, this.rep_time);
      retmsg = retmsg.replace(/\[.*?\]/g, this.rep_provname);
      if (this.cancel_reason && this.cancel_reason !== '') {
        retmsg = retmsg.replace('[reason]', this.cancel_reason);
      }
    }
    return retmsg;
  }
  titleCaseWord(word: string) {
    if (!word) { return word; }
    return word[0].toUpperCase() + word.substr(1);
  }
  setDescFocus() {
    this.isfocused = true;
    this.char_count = this.max_char_count - this.amForm.get('message').value.length;
  }
  lostDescFocus() {
    this.isfocused = false;
  }
  setCharCount() {
    this.char_count = this.max_char_count - this.amForm.get('message').value.length;
  }
}
