import { Component, OnInit } from '@angular/core';
import { SharedFunctions } from '../../../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../../../ynw_provider/services/provider-services.service';
import {  Router } from '@angular/router';
import { projectConstants } from '../../../../../../app.component';
 import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Messages } from '../../../../../../shared/constants/project-messages';
import { FormMessageDisplayService } from '../../../../../../shared/modules/form-message-display/form-message-display.service';
import { projectConstantsLocal } from '../../../../../../shared/constants/project-constants';
import { MatDialog } from '@angular/material/dialog';
import * as DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import * as moment from 'moment';

@Component({
  selector: 'app-catalogdetail',
  templateUrl: './catalog-details.component.html'
})
export class CatalogdetailComponent implements OnInit {
  item_id;
  rupee_symbol = '₹';
  item_hi_cap = Messages.ITEM_HI_CAP;
  item_name_cap = Messages.ITEM_NAME_CAP;
  short_desc_cap = Messages.SHORT_DESC_CAP;
  detailed_dec_cap = Messages.DETAIL_DESC_CAP;
  price_cap = Messages.PRICES_CAP;
  taxable_cap = Messages.TAXABLE_CAP;
  cancel_btn_cap = Messages.CANCEL_BTN;
  save_btn_cap = Messages.SAVE_BTN;
  item_status = projectConstants.ITEM_STATUS;
  detail_desc_cap = Messages.DETAIL_DESC_CAP;
  status_cap = Messages.COUPONS_STATUS_CAP;
  item_detail_cap = Messages.ITEM_DETAIL_CAP;
  amForm: FormGroup;
  api_error = null;
  api_success = null;
  parent_id;
  selitem_pic = '';
  char_count = 0;
  max_char_count = 500;
  isfocused = false;
  item_pic = {
      files: [],
      base64: null
  };
  taxpercentage = 0;
  price = 0;
  holdtaxable = false;
  file_error_msg = '';
  img_exists = false;
  maxChars = projectConstantsLocal.VALIDATOR_MAX50;
  maxCharslong = projectConstantsLocal.VALIDATOR_MAX500;
  maxNumbers = projectConstantsLocal.VALIDATOR_MAX6;
  max_num_limit = projectConstantsLocal.VALIDATOR_MAX_LAKH;
  api_loading = true;
  disableButton = false;
  customer_label;
  action;
  breadcrumbs_init = [
      {
          title: 'Settings',
          url: '/provider/settings'
      },
      {
          title: 'Jaldee Billing',
          url: '/provider/settings/pos'
      },
      {
          title: 'Items',
          url: '/provider/settings/pos/items'
      }
  ];
  breadcrumbs = this.breadcrumbs_init;
  image_list: any = [];
  item;
  taxDetails: any = [];
  itemname: any;
  itemcaption = 'Add Item';
  showPromotionalPrice = false;
  galleryDialog;
  gallery_view_caption = Messages.GALLERY_CAP;
  havent_added_cap = Messages.BPROFILE_HAVE_NOT_ADD_CAP;
  add_now_cap = Messages.BPROFILE_ADD_IT_NOW_CAP;
  photo_cap = Messages.SERVICE_PHOTO_CAP;
  delete_btn = Messages.DELETE_BTN;
  removeimgdialogRef;
  startdateError = false;
  enddateError = false;
  preInfoEnabled = false;
  postInfoEnabled = false;
  preInfoText = '';
  postInfoText = '';
  preInfoTitle = '';
  postInfoTitle = '';
  showInfo = false;
    tempPreInfoEnabled = false;
    tempPostInfoEnabled = false;
    tempPreInfoText = '';
    tempPostInfoText = '';
    tempPreInfoTitle = '';
    tempPostInfoTitle = '';
    public Editor = DecoupledEditor;
    seletedCatalogItems = [];
    Selall = false;
    selday_arr: any = [];
    Selallstorepickup  = false;
    selday_arrstorepickup: any = [];
  weekdays = projectConstants.myweekdaysSchedule;
  select_All = Messages.SELECT_ALL;
  holdloc_list: any = [];
  loc_list: any = [];
  selected_location;
  selected_locationId;
  itemPriceInfo = true;
  advancePaymentStatus = false;
  cancelationPolicyStatus = true;
  advancePayment;
  showpolicy = false;
  cancelationPolicy;
  start_time_cap = Messages.START_TIME_CAP;
  end_time_cap = Messages.END_TIME_CAP;
  dstart_time;
  dend_time;

  constructor(private provider_services: ProviderServices,
    private sharedfunctionObj: SharedFunctions,
    private router: Router,
    public dialog: MatDialog,
    private fb: FormBuilder,
    public fed_service: FormMessageDisplayService) {
        this.customer_label = this.sharedfunctionObj.getTerminologyTerm('customer');
     }

  ngOnInit() {
    this.dstart_time = { hour: parseInt(moment(projectConstants.DEFAULT_STARTTIME, ['h:mm A']).format('HH'), 10), minute: parseInt(moment(projectConstants.DEFAULT_STARTTIME, ['h:mm A']).format('mm'), 10) };
    this.dend_time = { hour: parseInt(moment(projectConstants.DEFAULT_ENDTIME, ['h:mm A']).format('HH'), 10), minute: parseInt(moment(projectConstants.DEFAULT_ENDTIME, ['h:mm A']).format('mm'), 10) };
    this.seletedCatalogItems = this.sharedfunctionObj.getitemfromLocalStorage('selecteditems');
    console.log(this.seletedCatalogItems);
    this.createForm();    
    this.api_loading = false;
  }
  addItemstoCart() {
    this.router.navigate(['provider', 'settings', 'ordermanager', 'catalogs' , 'add', 'items']);
  }
  getItem(itemId) {
    const _this = this;
    return new Promise(function (resolve, reject) {
        _this.provider_services.getProviderItems(itemId)
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
goBack() {
    this.router.navigate(['provider', 'settings', 'ordermanager',
        'catalogs']);
    this.api_loading = false;
}
createForm() {
    // if (this.action === 'add') {
        this.amForm = this.fb.group({
          catalogName: ['', Validators.compose([Validators.required, Validators.maxLength(this.maxChars)])],
          catalogshortDesc: ['', Validators.compose([Validators.required, Validators.maxLength(this.maxChars)])],
          catalogDesc: ['', Validators.compose([Validators.maxLength(this.maxCharslong)])],
          catalogdays: [],
          startdate: [''],
                enddate: [''],
                qstarttime: [this.dstart_time, Validators.compose([Validators.required])],
        qendtime: [this.dend_time, Validators.compose([Validators.required])],
            orderType: [],
            storepickup: [false],
            storepickupdays: [],
            startdatestore: [''],
            enddatestore: ['']
        });
        this.amForm.get('orderType').setValue('SHOPPINGCART');
    // } else {
    //     this.amForm = this.fb.group({
    //       catalogName: ['', Validators.compose([Validators.required, Validators.maxLength(this.maxChars)])],
    //       catalogshortDesc: ['', Validators.compose([Validators.required, Validators.maxLength(this.maxChars)])],
    //       catalogDesc: ['', Validators.compose([Validators.maxLength(this.maxCharslong)])],
    //         taxable: [false, Validators.compose([Validators.required])],
    //         price: ['', Validators.compose([Validators.required, Validators.pattern(projectConstantsLocal.VALIDATOR_FLOAT), Validators.maxLength(this.maxNumbers)])],
    //         promotionalPrice: ['', Validators.compose([ Validators.pattern(projectConstantsLocal.VALIDATOR_FLOAT), Validators.maxLength(this.maxNumbers)])]
    //     });
    // }
    // if (this.action === 'edit') {
    //     this.itemcaption = 'Edit Item';
    //     this.updateForm();
    // }
}
setDescFocus() {
    this.isfocused = true;
    this.char_count = this.max_char_count - this.amForm.get('displayDesc').value.length;
}
lostDescFocus() {
    this.isfocused = false;
}
setCharCount() {
    this.char_count = this.max_char_count - this.amForm.get('displayDesc').value.length;
}
compareDate(dateValue, startOrend) {
    const UserDate = dateValue;
    this.startdateError = false;
    this.enddateError = false;
    const ToDate = new Date().toString();
    const l = ToDate.split(' ').splice(0, 4).join(' ');
    const sDate = this.amForm.get('startdate').value;
    const sDate1 = new Date(sDate).toString();
    const l2 = sDate1.split(' ').splice(0, 4).join(' ');
    if (startOrend === 0) {
        if (new Date(UserDate) < new Date(l)) {
            return this.startdateError = true;
        }
        return this.startdateError = false;
    } else if (startOrend === 1 && dateValue) {
        if (new Date(UserDate) < new Date(l2)) {
            return this.enddateError = true;
        }
        return this.enddateError = false;
    }
}
compareDatestore(dateValue, startOrend) {
  const UserDate = dateValue;
  this.startdateError = false;
  this.enddateError = false;
  const ToDate = new Date().toString();
  const l = ToDate.split(' ').splice(0, 4).join(' ');
  const sDate = this.amForm.get('startdatestore').value;
  const sDate1 = new Date(sDate).toString();
  const l2 = sDate1.split(' ').splice(0, 4).join(' ');
  if (startOrend === 0) {
      if (new Date(UserDate) < new Date(l)) {
          return this.startdateError = true;
      }
      return this.startdateError = false;
  } else if (startOrend === 1 && dateValue) {
      if (new Date(UserDate) < new Date(l2)) {
          return this.enddateError = true;
      }
      return this.enddateError = false;
  }
}

updateForm() {
    console.log(this.item);
    if (this.item.taxable === true) {
        this.holdtaxable = true;
    }
    this.amForm.setValue({
        'catalogName': this.item.catalogName || null,
        'itemName': this.item.itemName || null,
        'catalogshortDesc': this.item.catalogshortDesc || null,
        'catalogDesc': this.item.displayDesc || null,
        'price': this.item.price || null,
        'taxable': this.holdtaxable,
        'showPromotionalPrice': this.item.showPromotionalPrice,
        'promotionalPrice': this.item.promotionalPrice || null
    });
}
handleTaxablechange() {
    this.resetApiErrors();
    if (this.taxpercentage <= 0) {
        this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectMesssages('SERVICE_TAX_ZERO_ERROR'), { 'panelClass': 'snackbarerror' });
        setTimeout(() => {
            this.api_error = null;
        }, projectConstants.TIMEOUT_DELAY_LARGE);
        this.amForm.get('taxable').setValue(false);
    } else {
        this.api_error = null;
    }
}
showimg() {
    if (this.item_pic.base64) {
        return this.item_pic.base64;
    } else {
        return this.sharedfunctionObj.showitemimg('');
    }
}

handleDaychecbox(dayindx) {
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
  check_existsinArray(arr, val) {
    let ret = -1;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === val) {
        ret = i;
      }
    }
    return ret;
  }
  
  handleDaychecboxstorepickup(dayindx) {
    const selindx = this.selday_arrstorepickup.indexOf(dayindx);
    if (selindx === -1) {
      this.selday_arrstorepickup.push(dayindx);
    } else {
      this.selday_arrstorepickup.splice(selindx, 1);
    }
    if (this.selday_arrstorepickup.length === 7) {
      this.Selallstorepickup = true;
    } else {
      this.Selallstorepickup = false;
    }
  }
  handleselectallstorepickup() {
    this.Selallstorepickup = true;
    this.selday_arrstorepickup = [];
    const wkdaystemp = this.weekdays;
    this.weekdays = [];
    for (let ii = 1; ii <= 7; ii++) {
      this.handleDaychecboxstorepickup(ii);
    }
    this.weekdays = wkdaystemp;
  }
  handleselectnonestorepickup() {
    this.Selallstorepickup = false;
    this.selday_arrstorepickup = [];
    const wkdaystemp = this.weekdays;
    this.weekdays = [];
    this.weekdays = wkdaystemp;
  }
  check_existsinArraystorepickup(arr, val) {
    let ret = -1;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === val) {
        ret = i;
      }
    }
    return ret;
  }
  changetime(src, passtime) {
    switch (src) {
      case 'start':
        this.dstart_time = passtime;
        break;
      case 'end':
        this.dend_time = passtime;
        break;
    }
  }
onCancel() {
    this.router.navigate(['provider', 'settings', 'ordermanager',
        'catalogs']);
    this.api_loading = false;
}
addcancelpolicy() {
  if (this.showpolicy === false) {
    this.showpolicy = true;
  } else {
    this.showpolicy = false;
  }

}
onSubmit(form_data) {
    const daystr: any = [];
      for (const cday of this.selday_arr) {
        daystr.push(cday);
      }
      if (this.selday_arr.length === 0) {
        const error = 'Please select the days';
        this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        return;
      }
      let endDate;
      const startDate = this.convertDate(form_data.startdate);
      if (form_data.enddate) {
        endDate = this.convertDate(form_data.enddate);
      } else {
        endDate = '';
      }
       // check whether the start and end times are selected
       if (!this.dstart_time || !this.dend_time) {
        this.sharedfunctionObj.openSnackBar(Messages.WAITLIST_QUEUE_SELECTTIME, { 'panelclass': 'snackbarerror' });
        return;
      }
      // today
      if (this.sharedfunctionObj.getminutesOfDay(this.dstart_time) > this.sharedfunctionObj.getminutesOfDay(this.dend_time)) {
        this.sharedfunctionObj.openSnackBar(Messages.WAITLIST_QUEUE_STIMEERROR, { 'panelclass': 'snackbarerror' });
        return;
      }
      const curdate = new Date();
      curdate.setHours(this.dstart_time.hour);
      curdate.setMinutes(this.dstart_time.minute);
      const enddate = new Date();
      enddate.setHours(this.dend_time.hour);
      enddate.setMinutes(this.dend_time.minute);
      const starttime_format = moment(curdate).format('hh:mm A') || null;
      const endtime_format = moment(enddate).format('hh:mm A') || null;

      //store pickup
      const storedaystr: any = [];
      for (const cday of this.selday_arrstorepickup) {
        storedaystr.push(cday);
      }
      if (this.selday_arrstorepickup.length === 0) {
        const error = 'Please select the storepickup days';
        this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        return;
      }
      let storeendDate;
      const storestartDate = this.convertDate(form_data.startdatestore);
      if (form_data.enddate) {
        storeendDate = this.convertDate(form_data.enddatestore);
      } else {
        storeendDate = '';
      }

    if (this.action === 'add') {
       
        const postdata = {
            'catalogName': form_data.catalogName,
            'catalogDesc':  form_data.catalogDesc,
            'catalogSchedule': {
              'recurringType': 'Weekly',
              'repeatIntervals': daystr,
              'startDate': startDate,
              'terminator': {
                'endDate': endDate,
                'noOfOccurance': 0
              },
              'timeSlots': [
                {
                  'sTime': starttime_format,
                  'eTime': endtime_format
                }
              ]
            },
            'catalogStatus': 'ACTIVE',
            'orderType': form_data.orderType,
            'pickUp': {
              'orderPickUp': true,
              'pickUpSchedule': {
                'recurringType': 'Weekly',
                'repeatIntervals': storedaystr,
                'startDate': storestartDate,
                'terminator': {
                  'endDate': storeendDate,
                  'noOfOccurance': 0
                },
                'timeSlots': [
                  {
                    'sTime': '09:00 AM',
                    'eTime': '08:00 PM'
                  }
                ]
              },
              'pickUpOtpVerification': true,
              'pickUpScheduledAllowed': true,
              'pickUpAsapAllowed': false
            },
            'homeDelivery': {
              'homeDelivery': true,
              'deliverySchedule': {
                'recurringType': 'Weekly',
                'repeatIntervals': [
                  '1',
                  '2',
                  '3',
                  '4',
                  '5',
                  '6',
                  '7'
                ],
                'startDate': '2020-11-20',
                'terminator': {
                  'endDate': '2022-01-01',
                  'noOfOccurance': 0
                },
                'timeSlots': [
                  {
                    'sTime': '09:00 AM',
                    'eTime': '08:00 PM'
                  }
                ]
              },
              'deliveryOtpVerification': true,
              'deliveryRadius': 5,
              'scheduledHomeDeliveryAllowed': true,
              'asapHomeDeliveryAllowed': false,
              'deliveryCharge': 10
            },
            'showPrice': true,
            'paymentType': 'FIXED',
            'advanceAmount': this.advancePayment,
            'preInfo': {
              'preInfoEnabled': true,
              'preInfoTitle': 'nothing',
              'preInfoText': 'more'
            },
            'postInfo': {
              'postInfoEnabled': true,
              'postInfoTitle': 'nothing',
              'postInfoText': 'less'
            },
            'catalogItem': this.seletedCatalogItems,
            'location': {
              'id': 1
            },
            'cancellationPolicy': 'If cancellation is necessary, we require that you call at least [Time Period] in advance. Appointments are in high demand, and your advanced notice will allow another patient access to that appointment time.'
          };
          

        this.addItem(postdata);
    } else if (this.action === 'edit') {
        const post_itemdata = {
            'catalogName': form_data.catalogName,
            'itemName': form_data.itemName,
            'catalogshortDesc': form_data.catalogshortDesc,
            'catalogDesc': form_data.catalogDesc,
            'taxable': form_data.taxable,
            'price': form_data.price,
            'showPromotionalPrice': this.showPromotionalPrice,
            'promotionalPrice': form_data.promotionalPrice
        };
        this.editItem(post_itemdata);
    }
}
addItem(post_data) {
    this.disableButton = true;
    this.resetApiErrors();
    this.api_loading = true;
    this.provider_services.addItem(post_data)
        .subscribe(
            () => {
                this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectMesssages('ITEM_CREATED'));
                this.api_loading = false;
                this.router.navigate(['provider', 'settings', 'ordermanager', 'catalogs']);
            },
            error => {
                this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                this.api_loading = false;
                this.disableButton = false;
            }
        );
}
editItem(post_itemdata) {
    this.disableButton = true;
    this.resetApiErrors();
    this.api_loading = true;
    post_itemdata.itemId = this.item.itemId;
    this.provider_services.editItem(post_itemdata)
        .subscribe(
            () => {
                this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectMesssages('ITEM_UPDATED'));
                this.api_loading = false;
                this.router.navigate(['provider', 'settings', 'ordermanager', 'catalogs']);
            },
            error => {
                this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
                this.api_loading = false;
                this.disableButton = false;
            }
        );
}
convertDate(date?) {
    // let today;
    let mon;
    let cdate;
    if (date) {
      cdate = new Date(date);
    } else {
      cdate = new Date();
    }
    mon = (cdate.getMonth() + 1);
    if (mon < 10) {
      mon = '0' + mon;
    }
    return (cdate.getFullYear() + '-' + mon + '-' + cdate.getDate());
  }
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
        // if (this.queue_data) {
        //   this.loc_name = this.queue_data.location.place;
        // } else if (this.loc_list.length === 1) {
        //   this.loc_name = this.loc_list[0];
        // }
        if (this.action === 'add') {
          this.selected_location = this.loc_list[0];
          this.selected_locationId = this.loc_list[0].id;
        }
        // if (this.action === 'add' && this.params.source === 'location_detail' && this.params.locationId) {
        //   this.selected_locationId = this.params.locationId;
        // } else 
        if (this.action === 'add' && this.loc_list.length === 1) {
          // this.amForm.get('qlocation').setValue(this.loc_list[0].id);
          this.selected_locationId = this.loc_list[0].id;
        }
      });

  }
resetApiErrors() {
    this.api_error = null;
    this.api_success = null;
}
isNumeric(evt) {
    return this.sharedfunctionObj.isNumeric(evt);
}
isvalid(evt) {
    return this.sharedfunctionObj.isValid(evt);
}
redirecToJaldeeOrdrmnagrCatalog() {
    this.router.navigate(['provider', 'settings', 'ordermanager' , 'catalogs']);
}
showInfoSection() {
    if (!this.showInfo) {
        this.tempPreInfoEnabled = this.preInfoEnabled;
        this.tempPreInfoText = this.preInfoText;
        this.tempPreInfoTitle = this.preInfoTitle;
        this.tempPostInfoEnabled = this.postInfoEnabled;
        this.tempPostInfoText = this.postInfoText;
        this.tempPostInfoTitle = this.postInfoTitle;
        this.showInfo = true;
       // this.sharedfunctionObj.sendMessage({ 'ttype': 'hide-back' });
    } else {
        if (this.preInfoEnabled && this.preInfoTitle.trim() === '') {
            this.sharedfunctionObj.openSnackBar('Please add instructions title', { 'panelClass': 'snackbarerror' });
        } else if (this.postInfoEnabled && this.postInfoTitle.trim() === '') {
            this.sharedfunctionObj.openSnackBar('Please add instructions title', { 'panelClass': 'snackbarerror' });
        } else {
            this.showInfo = false;
           // this.sharedfunctionObj.sendMessage({ 'ttype': 'show-back' });
        }
    }
}

cancelChanges() {
    this.preInfoEnabled = this.tempPreInfoEnabled;
    this.preInfoText = this.tempPreInfoText;
    this.preInfoTitle = this.tempPreInfoTitle;
    this.postInfoEnabled = this.tempPostInfoEnabled;
    this.postInfoText = this.tempPostInfoText;
    this.postInfoTitle = this.tempPostInfoTitle;
    this.showInfo = false;
    //this.sharedfunctionObj.sendMessage({ 'ttype': 'show-back' });
}
public onReady(editor) {
    editor.ui.getEditableElement().parentElement.insertBefore(
        editor.ui.view.toolbar.element,
        editor.ui.getEditableElement()
    );
    editor.getData();

}

}
