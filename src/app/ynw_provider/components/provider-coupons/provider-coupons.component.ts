import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ProviderServices } from '../../services/provider-services.service';
import { ProviderDataStorageService } from '../../services/provider-datastorage.service';
import { SearchFields } from '../../../shared/modules/search/searchfields';
import { ConfirmBoxComponent } from '../../shared/component/confirm-box/confirm-box.component';
import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { AddProviderCouponsComponent } from '../add-provider-coupons/add-provider-coupons.component';
import { Messages } from '../../../shared/constants/project-messages';
import { ProviderSharedFuctions } from '../../shared/functions/provider-shared-functions';

@Component({
  selector: 'app-provider-coupons',
  templateUrl: './provider-coupons.component.html',
  styleUrls: ['./provider-coupons.component.css']
})
export class ProviderCouponsComponent implements OnInit, OnDestroy {
  coupon_list: any = [];
  jaldeecoupon_list: any = [];
  query_executed = false;
  emptyMsg = '';
  couponStatus: boolean;
  tabid = 0;
  breadcrumbs = [
    {
      title: 'Settings',
      url: '/provider/settings'
    },
    {
      title: 'Coupons'
    }
  ];
  addcoupdialogRef;
  editcoupdialogRef;
  confirmremdialogRef;
  constructor(private provider_servicesobj: ProviderServices,
    private router: Router, private dialog: MatDialog,
    private sharedfunctionObj: SharedFunctions,
    private provider_shared_functions: ProviderSharedFuctions) {
    this.emptyMsg = this.sharedfunctionObj.getProjectMesssages('COUPON_LISTEMPTY');
  }
  ngOnInit() {
    this.getCoupons(); // Call function to get the list of discount lists
    this.getProviderJaldeeCoupon();

  }
  ngOnDestroy() {
    if (this.addcoupdialogRef) {
      this.addcoupdialogRef.close();
    }
    if (this.editcoupdialogRef) {
      this.editcoupdialogRef.close();
    }
    if (this.confirmremdialogRef) {
      this.confirmremdialogRef.close();
    }
  }
  getCoupons() {
    this.provider_servicesobj.getProviderCoupons()
      .subscribe(data => {
        this.coupon_list = data;
        this.query_executed = true;
      });
  }
  getProviderJaldeeCoupon() {
    this.jaldeecoupon_list = this.provider_servicesobj.getJaldeeCoupons();
    // .subscribe(data => {
    //   console.log(data);
    // this.jaldeecoupon_list = data;
    // this.query_executed = true;
  }
  addCoupons() {
    this.addcoupdialogRef = this.dialog.open(AddProviderCouponsComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass'],
      disableClose: true,
      data: {
        type: 'add'
      }
    });

    this.addcoupdialogRef.afterClosed().subscribe(result => {
      if (result === 'reloadlist') {
        this.getCoupons();
      }
    });
  }
  editCoupons(obj) {
    this.editcoupdialogRef = this.dialog.open(AddProviderCouponsComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass'],
      disableClose: true,
      data: {
        coupon: obj,
        type: 'edit'
      }
    });

    this.editcoupdialogRef.afterClosed().subscribe(result => {
      if (result === 'reloadlist') {
        this.getCoupons();
      }
    });
  }
  doRemoveCoupons(coupon) {
    const id = coupon.id;
    if (!id) {
      return false;
    }
    this.confirmremdialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass: ['commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        'message': this.sharedfunctionObj.getProjectMesssages('COUPON_DELETE').replace('[name]', coupon.name),
        'heading': 'Delete Confirmation'
      }
    });
    this.confirmremdialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteCoupons(id);
      }
    });
  }
  deleteCoupons(id) {
    this.provider_servicesobj.deleteCoupon(id)
      .subscribe(
        data => {
          this.sharedfunctionObj.openSnackBar(Messages.COUPON_DELETED);
          this.getCoupons();
        },
        error => {
          this.sharedfunctionObj.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }
  reports() {
    this.router.navigate(['provider', 'settings', 'coupons', 'report']);
  }
  couponView() {
    this.router.navigate(['provider', 'settings', 'coupons', 'coupon']);
  }
  formatPrice(price) {
    return this.sharedfunctionObj.print_PricewithCurrency(price);
  }

  changecouponStatus(obj) {
    //  this.provider_shared_functions.changecouponStatus(this, obj, 'coupons');
  }
}