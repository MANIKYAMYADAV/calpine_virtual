import { Component, Inject, OnInit, Input, Output, EventEmitter, } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { FormMessageDisplayService } from '../../../shared//modules/form-message-display/form-message-display.service';
// import { ConsumerServices } from '../../services/consumer-services.service';
import { SharedServices } from '../../services/shared-services';
import { Messages } from '../../../shared/constants/project-messages';
import { SharedFunctions } from '../../functions/shared-functions';

@Component({
  selector: 'app-consumer-add-member',
  templateUrl: './add-member.component.html',
   styleUrls: ['./add-member.component.css']
})
export class AddMemberComponent implements OnInit {


  fill_foll_details_cap = Messages.FILL_FOLL_DETAILS_CAP;
  first_name_cap = Messages.F_NAME_CAP;
  last_name_cap = Messages.L_NAME_CAP;
  mobile_no = Messages.MOBILE_NUMBER_CAP;
  gender_cap = Messages.GENDER_CAP;
  male_cap = Messages.MALE_CAP;
  female_cap = Messages.FEMALE_CAP;
  dob_cap = Messages.DOB_CAP;
  mob_prefix_cap = Messages.MOB_NO_PREFIX_CAP;

  firstname = '';
  lastname = '';
  mobile = '';
  gender = '';
  dob = '';
  dobholder = '';
  amForm: FormGroup;
  api_error = null;
  api_success = null;
  parent_id;
  tday = new Date();
  minday = new Date(1900, 0, 1);

  @Input() calledFrom: any;
  @Output() returnDetails = new EventEmitter<any>();
  countryCode_whtsap: any;
  whatsappnumber: any;
  telegramnumber: any;
  countryCode_telegram: any;
  email: any;

  constructor(
    public dialogRef: MatDialogRef<AddMemberComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public fed_service: FormMessageDisplayService,
    public sharedservice: SharedServices,
    public shared_functions: SharedFunctions
  ) {
    if (data.type === 'edit') {
      console.log(data);
      this.firstname = data.member.userProfile.firstName || '';
      this.lastname = data.member.userProfile.lastName || '';
      this.mobile = data.member.userProfile.primaryMobileNo || '';
      this.gender = data.member.userProfile.gender || '';
      this.dob = data.member.userProfile.dob || '';
      this.dobholder = data.member.userProfile.dob || '';
this.email=data.member.userProfile.email || '';
      if(data.member.userProfile.whatsAppNum){
        this.countryCode_whtsap=data.member.userProfile.whatsAppNum.countryCode;
        this.whatsappnumber=data.member.userProfile.whatsAppNum.number;
      }
      console.log(data.member.userProfile.telegramNum);
      if(data.member.userProfile.telegramNum){
        this.countryCode_telegram=data.member.userProfile.telegramNum.countryCode;
        this.telegramnumber=data.member.userProfile.telegramNum.number;
      }
      if(data.member.userProfile.email){
        this.email=data.member.userProfile.email;
        
      }
    }
  }

  ngOnInit() {
  }
  isNumericSign(evt) {
    return this.shared_functions.isNumericSign(evt);
  }
  valuechange() {
    const retobj = {
      'fname': this.firstname || '',
      'lname': this.lastname || '',
      'mobile': this.mobile || '',
      'gender': this.gender || '',
      'dob': this.dobholder || '',
      'countryCode_whtsap':this.countryCode_whtsap,
      'whatsappnumber':this.whatsappnumber,
      'countryCode_telegram':this.countryCode_telegram,
      'telegramnumber':this.telegramnumber,
      'email':this.email
    };
    console.log(retobj);
    this.returnDetails.emit(retobj);
  }
  dateChanged(e) {
    if (e) {
      if (e.value._i) {
        let cday = e.value._i.date;
        let cmon = (e.value._i.month + 1);
        const cyear = e.value._i.year;
        if (cday < 10) {
          cday = '0' + cday;
        }
        if (cmon < 10) {
          cmon = '0' + cmon;
        }
        this.dobholder = cyear + '-' + cmon + '-' + cday;
      }
    } else {
      this.dobholder = '';
    }
    this.valuechange();
  }
  resetApiErrors() {
    this.api_error = null;
    this.api_success = null;
  }
  isNumeric(evt) {
    return this.shared_functions.isNumeric(evt);
  }
}
