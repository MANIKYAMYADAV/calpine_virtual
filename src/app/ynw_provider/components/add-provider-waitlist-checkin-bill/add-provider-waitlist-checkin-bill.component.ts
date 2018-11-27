import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormMessageDisplayService } from '../../../shared//modules/form-message-display/form-message-display.service';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

import { Messages } from '../../../shared/constants/project-messages';
import { projectConstants } from '../../../shared/constants/project-constants';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { ProviderServices } from '../../services/provider-services.service';

export interface ItemServiceGroup {
  type: string;
  values: string[];
}

@Component({
  selector: 'app-provider-waitlist-checkin-bill',
  templateUrl: './add-provider-waitlist-checkin-bill.component.html',
  styleUrls: ['./add-provider-waitlist-checkin-bill.component.css']
})

export class AddProviderWaitlistCheckInBillComponent implements OnInit {

  new_cap = Messages.NEW_CAP;
  bill_cap = Messages.BILL_CAPTION;
  date_cap = Messages.DATE_CAP;
  time_cap = Messages.TIME_CAP;
  bill_no_cap = Messages.BILL_NO_CAP;
  gstin_cap = Messages.GSTIN_CAP;
  ad_ser_item_cap = Messages.ADD_SER_ITEM_CAP;
  no_cap = Messages.NO_CAP;
  available_cap = Messages.AVAILABLE_CAP;
  qty_cap = Messages.QTY_CAPITAL_CAP;
  add_btn_cap = Messages.ADD_BTN;
  cancel_btn_cap = Messages.CANCEL_BTN;
  qnty_cap = Messages.QTY_CAP;
  select_discount_cap = Messages.SEL_DISC_CAP;
  select_coupon_cap = Messages.SEL_COUPON_CAP;
  done_btn_cap = Messages.DONE_BTN;
  discount_cap = Messages.DISCOUNT_CAP;
  coupon_cap = Messages.COUPON_CAP;
  sub_tot_cap = Messages.SUB_TOT_CAP;
  dis_coupons_cap = Messages.DISCOUNTS_COUPONS_CAP;
  delete_btn_cap = Messages.DELETE_BTN;
  gross_amnt_cap = Messages.GROSS_AMNT_CAP;
  bill_disc_cap = Messages.BILL_DISCOUNT_CAP;
  tax_cap = Messages.TAX_CAP;
  amount_paid_cap = Messages.AMNT_PAID_CAP;
  amount_to_pay_cap = Messages.AMNT_TO_PAY_CAP;
  back_to_bill_cap = Messages.BACK_TO_BILL_CAP;
  payment_logs_cap = Messages.PAY_LOGS_CAP;
  amount_cap = Messages.AMOUNT_CAP;
  refundable_cap = Messages.REFUNDABLE_CAP;
  status_cap = Messages.STATUS_CAP;
  mode_cap = Messages.MODE_CAP;
  refunds_cap = Messages.REFUNDS_CAP;
  save_btn_cap = Messages.SAVE_BTN;

  @ViewChild('itemservicesearch') item_service_search;

  amForm: FormGroup;
  api_error = null;
  api_success = null;
  checkin = null;
  bill_data: any = [];
  message = '';
  source = 'add';
  today = new Date();
  dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT;
  timeFormat = 'h:mm a';
  itemServiceSearch: FormControl = new FormControl();
  services: any = [];
  coupons: any = [];
  discounts: any = [];
  items: any = [];
  totdisc_val = 0;
  totcoup_val = 0;
  isServiceBillable = true;
  showAddItemsec = false;
  showmainDiscSelsec = false;
  taxabletotal = 0;
  tottaxvalue = 0;
  totpaid = 0;
  curSelItm = { indx: 0, typ: '', qty: 1 };
  bname;
  showPaidlist = false;
  ItemServiceGroupOptions: Observable<ItemServiceGroup[]>;
  itemServicesGroup: ItemServiceGroup[] = [{
    'type': 'Services',
    'values': []
  },
  {
    'type': 'Items',
    'values': []
  }];

  selectedItems = [];
  bill_load_complete = 0;
  item_service_tax: any = 0;
  pre_payment_log: any = [];

  customer_label = '';
  billdate = '';
  billtime = '';
  gstnumber = '';
  billnumber = '';
  showDiscountSection;
  showPCouponSection;
  showJCouponSection;
  showAddItemMenuSection = true;
  jCoupon;
  selOrderProviderCoupon: any = '';
  selOrderDiscount: any = '';
  constructor(
    public dialogRef: MatDialogRef<AddProviderWaitlistCheckInBillComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public provider_services: ProviderServices,
    public sharedfunctionObj: SharedFunctions,
    @Inject(DOCUMENT) public document

  ) {
    this.checkin = this.data.checkin || null;
    this.bill_data = this.data.bill_data || [];
    // console.log('data' , this.bill_data);
    if (!this.checkin) {
      setTimeout(() => {
        this.dialogRef.close('error');
      }, projectConstants.TIMEOUT_DELAY);
    }
    this.getBillDateandTime();
    this.getPrePaymentDetails()
      .then(
        (result) => {
          this.getCoupons()
            .then(
              () => {
                this.getDiscounts()
                  .then(
                    () => {
                      this.getTaxDetails()
                        .then(
                          () => {
                            this.getDomainSubdomainSettings()
                              .then(
                                () => {
                                  this.getServiceList();
                                },
                                error => {
                                }
                              );
                            this.getItemsList();
                            this.bill_load_complete = 1;
                          },
                          (error) => {
                            this.bill_load_complete = 0;
                          });
                    },
                    (error) => {
                      this.bill_load_complete = 0;
                    });
              },
              (error) => {
                this.bill_load_complete = 0;
              });
        },
        (error) => {
          this.bill_load_complete = 0;
        }
      );
    this.customer_label = this.sharedfunctionObj.getTerminologyTerm('customer');
  }
  ngOnInit() {
    const bdetails = this.sharedfunctionObj.getitemfromLocalStorage('ynwbp');
    if (bdetails) {
      this.bname = bdetails.bn || '';
    }
  }
  getBillDateandTime() {
    if (this.bill_data.hasOwnProperty('createdDate')) {
      const datearr = this.bill_data.createdDate.split(' ');
      const billdatearr = datearr[0].split('-');
      this.billdate = billdatearr[2] + '/' + billdatearr[1] + '/' + billdatearr[0];
      this.billtime = datearr[1] + ' ' + datearr[2];
    } else {
      this.billdate = this.sharedfunctionObj.addZero(this.today.getDate()) + '/' + this.sharedfunctionObj.addZero((this.today.getMonth() + 1)) + '/' + this.today.getFullYear();
      // this.billtime = this.sharedfunctionObj.addZero(this.today.getHours()) + ':' + this.sharedfunctionObj.addZero(this.today.getMinutes());
      const gethrs = this.today.getHours();
      const amOrPm = (gethrs < 12) ? 'AM' : 'PM';
      // const hour = (gethrs < 12) ? gethrs : gethrs - 12;
      let hour = 0;
      if (gethrs === 12) {
        hour = 12;
      } else if (gethrs > 12) {
        hour = gethrs - 12;
      } else {
        hour = gethrs;
      }
      this.billtime = this.sharedfunctionObj.addZero(hour) + ':' + this.sharedfunctionObj.addZero(this.today.getMinutes()) + ' ' + amOrPm;
      // const amOrPm = (this.today.getHours() < 12) ? 'AM' : 'PM';
      // const hour = (this.today.getHours() < 12) ? this.today.getHours() : this.today.getHours() - 12;
      // this.billtime = this.sharedfunctionObj.addZero(hour) + ':' + this.sharedfunctionObj.addZero(this.today.getMinutes()) + ' ' + amOrPm;
    }
    if (this.bill_data.hasOwnProperty('gstNumber')) {
      this.gstnumber = this.bill_data.gstNumber;
      // console.log('gst', this.gstnumber);
    }
    if (this.bill_data.hasOwnProperty('id')) {
      this.billnumber = this.bill_data.id;
      // console.log('gst', this.billnumber);
    }
  }
  filterGroup(val: string): ItemServiceGroup[] {
    if (val) {
      return this.itemServicesGroup
        .map(group => ({ type: group.type, values: this._filter(group.values, val) }))
        .filter(group => group.values.length > 0);
    }
    return this.itemServicesGroup;
  }
  private _filter(opt: string[], val: string) {
    const filterValue = val.toLowerCase();
    return opt.filter(item => item.toLowerCase().startsWith(filterValue));
  }
  resetApiErrors() {
    this.api_error = null;
    this.api_success = null;
  }
  getWaitlistBill() {
    this.provider_services.getWaitlistBill(this.checkin.ynwUuid)
      .subscribe(
        data => {
          this.bill_data = data;
        },
        error => {
          if (error.status === 422) {
            this.bill_data = [];
            // console.log('reached here');
          }
          this.bill_load_complete = 1;
        },
        () => {
          this.bill_load_complete = 1;
        }
      );
  }
  getDomainSubdomainSettings() {
    const user_data = this.sharedfunctionObj.getitemfromLocalStorage('ynw-user');
    const domain = user_data.sector || null;
    const sub_domain = user_data.subSector || null;
    return new Promise((resolve, reject) => {
      this.provider_services.domainSubdomainSettings(domain, sub_domain)
        .subscribe(
          (data: any) => {
            if (data.serviceBillable === false) {
              this.isServiceBillable = false;
              reject();
            } else {
              this.isServiceBillable = true;
              resolve();
            }
          },
          error => {
            reject(error);
          }
        );
    });
  }
  getServiceList() {
    this.provider_services.getServicesList()
      .subscribe(
        (data: any) => {
          for (const ser of data) {
            if (ser.status === 'ACTIVE') {
              this.services.push(ser);
            }
          }
          const services = this.services.map((ob) => ob.name);
          this.itemServicesGroup[0]['values'] = services;
        },
        error => {
          this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }
  getCoupons() {
    return new Promise((resolve, reject) => {
      this.provider_services.getProviderCoupons()
        .subscribe(
          data => {
            this.coupons = data;
            resolve();
          },
          error => {
            this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            reject(error);
          }
        );
    });
  }
  getDiscounts() {
    return new Promise((resolve, reject) => {
      this.provider_services.getProviderDiscounts()
        .subscribe(
          data => {
            this.discounts = data;
            resolve();
          },
          error => {
            this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            reject(error);
          }
        );
    });
  }
  getItemsList() {
    this.provider_services.getProviderItems()
      .subscribe(
        (data: any) => {
          this.items = data;
          const items = this.items.map((ob) => ob.displayName);
          this.itemServicesGroup[1]['values'] = items;
        },
        error => {
          this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });

        }
      );
  }
  getTaxDetails() {
    return new Promise((resolve, reject) => {
      this.provider_services.getProviderTax()
        .subscribe(
          data => {
            this.item_service_tax = data['taxPercentage'];
            resolve();
          },
          error => {
            this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });

            reject(error);
          }
        );
    });
  }
  getPrePaymentDetails() {
    return new Promise((resolve, reject) => {
      this.provider_services.getPaymentDetail(this.checkin.ynwUuid)
        .subscribe(
          data => {
            this.pre_payment_log = data;
            resolve();
          },
          error => {
            this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });

            reject(error);
          }
        );
    });
  }
  getIndexFromId(array, id) {
    let index = '';
    array
      .map((ob, i) => {
        if (ob.id === id) {
          index = i;
        }
      });
    return index;
  }
  stringtoDate(dt, mod) {
    let dtsarr;
    if (dt) {
      // const dts = new Date(dt);
      dtsarr = dt.split(' ');
      const dtarr = dtsarr[0].split('-');
      let retval = '';
      if (mod === 'all') {
        retval = dtarr[2] + '/' + dtarr[1] + '/' + dtarr[0] + ' ' + dtsarr[1] + ' ' + dtsarr[2];
      } else if (mod === 'date') {
        retval = dtarr[2] + '/' + dtarr[1] + '/' + dtarr[0];
      } else if (mod === 'time') {
        retval = dtsarr[1] + ' ' + dtsarr[2];
      }

      return retval;
    } else {
      return;
    }
  }
  showAddItem() {
    this.showDiscountSection = false;
    this.showPCouponSection = false;
    this.showJCouponSection = false;
    this.showAddItemsec = true;
    this.ItemServiceGroupOptions = this.itemServiceSearch.valueChanges
      .pipe(
        startWith(''),
        map(val => this.filterGroup(val))
      );
    // console.log('reached here');
    setTimeout(() => {
      /*if (this.document.getElementById('itemservicesearch')) {
        console.log('focus here');
        this.document.getElementById('itemservicesearch').focus();
      }*/
      this.item_service_search.nativeElement.focus();
    }, 500);
  }
  hideAddItem() {
    this.showAddItemsec = false;
    this.itemServiceSearch.reset();
    this.curSelItm = { indx: 0, typ: '', qty: 1 };
  }
  /**
   * Returns Service Id
   * @param serviceName Service Name
   */
  getSelectedServiceId(serviceName) {
    let serviceId = 0;
    for (let i = 0; i < this.services.length; i++) {
      if (this.services[i].name === serviceName) {
        serviceId = this.services[i].id;
        break;
      }
    }
    return serviceId;
  }
  /**
   * Return Item Id
   * @param itemName Item Name
   */
  getSelectedItemId(itemName) {
    let itemId = 0;
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].displayName === itemName) {
        itemId = this.items[i].itemId;
        break;
      }
    }
    return itemId;
  }
  /**
   * Toggle Item Discount/Coupon Section
   * @param indx Index
   */
  itemDiscCoupSec(indx) {
    this.bill_data.items[indx].itemDiscount = '';
    if (this.bill_data.items[indx]) {
      if (this.bill_data.items[indx].showitemdisccoup) {
        this.bill_data.items[indx].showitemdisccoup = false;
      } else {
        this.bill_data.items[indx].showitemdisccoup = true;
      }
    }
  }
  /**
   * Toggle Service Discount/Coupon section
   * @param indx Index
   */
  serviceDiscCoupSec(indx) {
    this.bill_data.service[indx].serviceDiscount = '';
    if (this.bill_data.service[indx]) {
      if (this.bill_data.service[indx].showservicedisccoup) {
        this.bill_data.service[indx].showservicedisccoup = false;
      } else {
        this.bill_data.service[indx].showservicedisccoup = true;
      }
    }
  }
  showpaidSection() {
    if (this.showPaidlist) {
      this.showPaidlist = false;
    } else {
      this.showPaidlist = true;
    }
  }
  blurQty(val, itm) {
    if (isNaN(val)) {
      itm.qty = 1;
    } else {
      const vv = parseInt(val, 10);
      itm.qty = vv;
    }
  }
  orderDiscountSelected() {
    this.showDiscountSection = true;
    this.showPCouponSection = false;
    this.showJCouponSection = false;
    this.showAddItemsec = false;
    this.showAddItemMenuSection = false;
  }
  orderPCouponSelected() {
    this.showDiscountSection = false;
    this.showPCouponSection = true;
    this.showJCouponSection = false;
    this.showAddItemsec = false;
    this.showAddItemMenuSection = false;
  }
  jCouponSelected() {
    this.showDiscountSection = false;
    this.showPCouponSection = false;
    this.showJCouponSection = true;
    this.showAddItemsec = false;
    this.showAddItemMenuSection = false;
  }
  /**
   * Set Item/Service
   * @param type Category Services/Items
   * @param name Service/Item Name
   */
  itemServiceSelected(type, name) {
    this.curSelItm = { indx: 0, typ: '', qty: 1 };
    if (type === 'Services') {
      this.curSelItm.indx = this.getSelectedServiceId(name);
      this.curSelItm.typ = 'Services';
      this.curSelItm.qty = 1;
    } else if (type === 'Items') {
      this.curSelItm.indx = this.getSelectedItemId(name);
      this.curSelItm.typ = 'Items';
      this.curSelItm.qty = 1;
    }
  }
  /**
   * Perform Bill Actions
   * @param action Action Type
   * @param uuid Bill Id
   * @param data Data to be sent as request body
   */
  applyAction(action, uuid, data) {
    return new Promise((resolve, reject) => {
      this.provider_services.setWaitlistBill(action, uuid, data, { 'Content-Type': 'application/json' }).subscribe
        (billInfo => {
          this.bill_data = billInfo;
          this.hideWorkBench();
          resolve();
        },
        error => {
          this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
          reject(error);
        });
    });
  }
  /**
   * Add Service/Item to the Bill
   */
  addService_Item() {
    let action;
    const type = this.curSelItm.typ;
    const itemId = this.curSelItm.indx;
    console.log(this.curSelItm.indx);
    if (isNaN(this.curSelItm.qty)) {
      this.curSelItm.qty = 1;
    }
    const data = {};
    if (type === 'Services') {
      action = 'addService';
      data['serviceId'] = itemId;
      data['quantity'] = this.curSelItm.qty;
      this.curSelItm.typ = 'Services';
      this.curSelItm.qty = 1;
    } else if (type === 'Items') {
      action = 'addItem';
      data['itemId'] = itemId;
      data['quantity'] = this.curSelItm.qty;
    }
    this.provider_services.setWaitlistBill(action, this.bill_data.uuid, data, null).subscribe
      (billInfo => {
        this.bill_data = billInfo;
        this.hideAddItem();
      });
    this.itemServiceSearch.reset();
    this.curSelItm = { indx: 0, typ: '', qty: 1 };
  }
  /**
   * Remove a particular Service from the bill
   * @param id Service Id
   * @param qty Service Quantity
   */
  removeService(id, qty) {
    const action = 'removeService';
    const data = {};
    data['quantity'] = qty;
    data['serviceId'] = id;
    this.applyAction(action, this.bill_data.uuid, data);
  }
  /**
   * Remove an Item from the Bill
   * @param id Item Id
   * @param qty Item Quantity
   */
  removeItem(id, qty) {
    const action = 'removeItem';
    const data = {};
    data['quantity'] = qty;
    data['itemId'] = id;
    this.applyAction(action, this.bill_data.uuid, data);
  }
  /**
   * Apply Service Level Discount
   * @param service Service Details
   */
  applyServiceDiscount(service) {
    console.log(service);
    const action = 'addServiceLevelDiscount';
    const discountIds = [];
    discountIds.push(service.serviceDiscount.id);
    const data = {};
    data['serviceId'] = service.serviceId;
    data['discountIds'] = discountIds;
    this.applyAction(action, this.bill_data.uuid, data);
  }
  /**
   * Remove Service Level Discount
   * @param serviceId Service Id
   * @param discountId Discount Id
   */
  removeServiceDiscount(serviceId, discountId) {
    const action = 'removeServiceLevelDiscount';
    const discountIds = [];
    discountIds.push(discountId);
    const data = {};
    data['serviceId'] = serviceId;
    data['discountIds'] = discountIds;
    this.applyAction(action, this.bill_data.uuid, data);
  }
  /**
   * Remove Item Level Discount
   * @param itemId Item Id
   * @param discountId Discount Id
   */
  removeItemDiscount(itemId, discountId) {
    const action = 'removeItemLevelDiscount';
    const discountIds = [];
    discountIds.push(discountId);
    const data = {};
    data['itemId'] = itemId;
    data['discountIds'] = discountIds;
    this.applyAction(action, this.bill_data.uuid, data);
  }
  /**
   * Apply Item Level Discount
   * @param item Item
   */
  applyItemDiscount(item) {
    console.log(item);
    const action = 'addItemLevelDiscount';
    const discountIds = [];
    discountIds.push(item.itemDiscount.id);
    const data = {};
    data['itemId'] = item.itemId;
    data['discountIds'] = discountIds;
    this.applyAction(action, this.bill_data.uuid, data);
  }
  /**
   * Apply Jaldee Coupon
   * @param jCoupon Coupon Code
   */
  applyJCoupon(jCoupon) {
    console.log(jCoupon);
    const action = 'addJaldeeCoupons';
    let jaldeeCoupon: string;
    jaldeeCoupon = '"' + jCoupon + '"';
    this.applyAction(action, this.bill_data.uuid, jaldeeCoupon);
  }
  /**
   * Remove Jaldee Coupon
   * @param jCouponCode Coupon Code
   */
  removeJCoupon(jCouponCode) {
    const action = 'removeJaldeeCoupons';
    let jaldeeCoupon: string;
    jaldeeCoupon = '"' + jCouponCode + '"';
    this.applyAction(action, this.bill_data.uuid, jaldeeCoupon);
  }
  /**
   * Remove Order Level Discounts
   * @param discount Discount Info
   */
  removeOrderDiscount(discount) {
    const action = 'removeBillLevelDiscount';
    const discountIds = [];
    console.log(discount);
    discountIds.push(discount.id);
    const data = {};
    data['id'] = this.bill_data.id;
    data['discountIds'] = discountIds;
    this.applyAction(action, this.bill_data.uuid, data);
  }
  /**
   * Remove Provider Coupons
   * @param coupon Coupon Info
   */
  removeProviderCoupon(coupon) {
    const action = 'removeProviderCoupons';
    const couponIds = [];
    couponIds.push(coupon.id);
    const data = {};
    data['id'] = this.bill_data.id;
    data['couponIds'] = couponIds;
    this.applyAction(action, this.bill_data.uuid, data);
  }
  hideWorkBench() {
    this.jCoupon = '';
    this.showJCouponSection = false;
    this.showDiscountSection = false;
    this.showPCouponSection = false;
    this.showAddItemMenuSection = true;
  }
  applyOrderDiscount() {
    const action = 'addBillLevelDiscount';
    const data = {};
    data['id'] = this.bill_data.id;
    const discounts = [];
    console.log(this.selOrderDiscount);
    discounts.push(this.selOrderDiscount.id);
    data['discountIds'] = discounts;
    this.applyAction(action, this.bill_data.uuid, data);
  }
  applyOrderCoupon() {
    const action = 'addProviderCoupons';
    const data = {};
    data['id'] = this.bill_data.id;
    const coupons = [];
    console.log(this.selOrderProviderCoupon);
    coupons.push(this.selOrderProviderCoupon.id);
    data['couponIds'] = coupons;
    this.applyAction(action, this.bill_data.uuid, data);
  }
}
