import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NavigationExtras, Router } from '@angular/router';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { SharedServices } from '../../../../shared/services/shared-services';

@Component({
  selector: 'app-order-actions',
  templateUrl: './order-actions.component.html',
  styleUrls: ['./order-actions.component.css']
})
export class OrderActionsComponent implements OnInit {
  orderDetails;
  mulipleSelection = false;
  showBill = false;
  showSendDetails = false;
  pos = false;
  customer_label = '';
  loading = false;
  catalog_list: any = [];
  catalogStatuses: any = [];
  activeCatalog: any;
  catalog_Id: any;
  orderStatusClasses = projectConstantsLocal.ORDER_STATUS_CLASS;
  constructor(public dialogRef: MatDialogRef<OrderActionsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public router: Router, public provider_services: ProviderServices,
    public shared_functions: SharedFunctions,
    private shared_services: SharedServices,) { }

  ngOnInit() {
    this.loading = true;
    this.customer_label = this.shared_functions.getTerminologyTerm('customer');
    this.orderDetails = this.data.selectedOrder;
    console.log(this.orderDetails);
    console.log(this.orderDetails.orderStatus);
    if (this.orderDetails.length > 1) {
      this.mulipleSelection = true;
    }
    this.getPos();
  }
  setActions() {
    if (!this.mulipleSelection) {
      this.showSendDetails = true;
      if (this.pos && (this.orderDetails.orderStatus !== 'Cancelled' || (this.orderDetails.orderStatus === 'Cancelled' && this.orderDetails.bill && this.orderDetails.bill.billPaymentStatus !== 'NotPaid'))) {
        this.showBill = true;
      }
      this.getCatalog();
    } else {
      this.loading = false;
    }
  }
  gotoDetails() {
    this.dialogRef.close();
    this.router.navigate(['provider', 'orders', this.orderDetails.uid]);
  }
  gotoBill() {
    this.provider_services.getWaitlistBill(this.orderDetails.uid)
      .subscribe(
        data => {
          this.router.navigate(['provider', 'bill', this.orderDetails.uid], { queryParams: { source: 'order' } });
          this.dialogRef.close();
        },
        error => {
          this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );
  }
  orderEdit() {
    console.log(this.orderDetails);
    const cuser = this.shared_functions.getitemFromGroupStorage('accountId');
    const location = this.shared_functions.getitemFromGroupStorage('location');
    const ynwbp = this.shared_functions.getitemFromGroupStorage('ynwbp');
    console.log(cuser);
    console.log(location);
    console.log(ynwbp);    
    this.shared_services.getConsumerCatalogs(cuser).subscribe(
      (catalogs: any) => {
        this.activeCatalog = catalogs[0];
        console.log(this.activeCatalog);
        this.catalog_Id = this.activeCatalog.id;
        this.getOrderAvailableDatesForPickup();
      }
    );
      // this.sharedFunctionobj.setitemonLocalStorage('order', this.orderList);
      // this.sharedFunctionobj.setitemonLocalStorage('order_sp', businessObject);
      // this.router.navigate(['order/shoppingcart'], navigationExtras);
      // this.dialogRef.close();
      // this.router.navigate(['order/shoppingcart']);
     
  }
  getOrderAvailableDatesForPickup() {
    const cuser = this.shared_functions.getitemFromGroupStorage('accountId');
    console.log(cuser);
    const _this = this;

    _this.shared_services.getAvailableDatesForPickup(this.catalog_Id, cuser)
      .subscribe((data: any) => {
        console.log(data);
        // const availables = data.filter(obj => obj.isAvailable);
        // const availDates = availables.map(function (a) { return a.date; });
        // _this.storeAvailableDates = availDates.filter(function (elem, index, self) {
        //   return index === self.indexOf(elem);
        // });
      });
  }
  // getOrderAvailableDatesForHome() {
  //   const _this = this;

  //   _this.shared_services.getAvailableDatesForHome(this.catalog_Id, this.account_id)
  //     .subscribe((data: any) => {
  //       const availables = data.filter(obj => obj.isAvailable);
  //       const availDates = availables.map(function (a) { return a.date; });
  //       _this.homeAvailableDates = availDates.filter(function (elem, index, self) {
  //         return index === self.indexOf(elem);
  //       });
  //     });
  // }
  getPos() {
    this.provider_services.getProviderPOSStatus().subscribe(data => {
      this.pos = data['enablepos'];
      this.setActions();
    },
      error => {
        this.setActions();
      });
  }
  gotoCustomerDetails() {
    this.dialogRef.close();
    const navigationExtras: NavigationExtras = {
      queryParams: { action: 'view' }
    };
    this.router.navigate(['/provider/customers/' + this.orderDetails.orderFor.id], navigationExtras);
  }
  changeOrderStatus(status) {
    this.provider_services.changeOrderStatus(this.orderDetails.uid, status).subscribe(data => {
      this.dialogRef.close();
    },
      error => {
        this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      });
  }
  getCatalog() {
    this.provider_services.getProviderCatalogs()
      .subscribe(data => {
        this.catalog_list = data;
        const catalog = this.catalog_list.filter(cata => cata.id === this.orderDetails.catalog.id);
        if (catalog[0]) {
          this.catalogStatuses = catalog[0].orderStatuses;
        }
        this.loading = false;
      });
  }
  getOrderActionClass(status) {
    const retdet = this.orderStatusClasses.filter(
      soc => soc.value === status);
    const returndet = retdet[0].class;
    return returndet;
  }
}
