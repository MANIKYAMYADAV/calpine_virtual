import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { Messages } from '../../../../shared/constants/project-messages';

@Component({
  selector: 'app-ordermanager',
  templateUrl: './ordermanager.component.html',
  styleUrls: ['./ordermanager.component.css']
})
export class OrdermanagerComponent implements OnInit {

  customer_label = '';
  breadcrumbs_init = [
    {
      url: '/provider/settings',
      title: 'Settings'
    },
    {
      title: 'Jaldee Billing',
      url: '/provider/settings/pos'
    }
  ];
  
  breadcrumbs = this.breadcrumbs_init;
  pos_status = false;
  pos_statusstr = 'Off';
  frm_public_self_cap = '';
  domain;
  nodiscountError = false;
  noitemError = false;
  itemError = '';
  discountError = '';
  discount_list;
  discount_count = 0;
  item_list;
  item_count = 0;
  breadcrumb_moreoptions: any = [];
  constructor(private router: Router,
    private shared_functions: SharedFunctions,
    private routerobj: Router,
    private provider_services: ProviderServices) {
    this.customer_label = this.shared_functions.getTerminologyTerm('customer');
  }

  ngOnInit() {
    this.frm_public_self_cap = Messages.FRM_LEVEL_SELF_MSG.replace('[customer]', this.customer_label);
    const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
    this.domain = user.sector;
    this.breadcrumb_moreoptions = { 'actions': [{ 'title': 'Help', 'type': 'learnmore' }] };
    this.getPOSSettings();
    this.getDiscounts();
    this.getitems();
  }

  getDiscounts() {
    this.provider_services.getProviderDiscounts()
      .subscribe(data => {
        this.discount_list = data;
        this.discount_count = this.discount_list.length;
        this.nodiscountError = true;
      },
        (error) => {
          this.discountError = error;
          this.nodiscountError = false;
        }
      );
  }

  getitems() {
    this.provider_services.getProviderItems()
      .subscribe(data => {
        this.item_list = data;
        this.item_count = this.item_list.length;
        this.noitemError = true;
      },
        (error) => {
          this.itemError = error;
          this.noitemError = false;
        });
  }
  gotoItems() {
    if (this.noitemError) {
      this.router.navigate(['provider', 'settings', 'ordermanager', 'items']);
    } else {
      this.shared_functions.openSnackBar(this.itemError, { 'panelClass': 'snackbarerror' });
    }
  }
  gotoStoredetails() {
    this.routerobj.navigate(['provider', 'settings', 'ordermanager' , 'storedetails']);
    // if (this.nodiscountError) {
    //   this.router.navigate(['provider', 'settings', 'pos', 'discount']);
    // } else {
    //   this.shared_functions.openSnackBar(this.discountError, { 'panelClass': 'snackbarerror' });
    // }
  }
  gotoCatalogs() {
    this.routerobj.navigate(['provider', 'settings', 'ordermanager' , 'catalogs']);
    // this.router.navigate(['provider', 'settings', 'pos', 'coupon']);
  }
  handle_posStatus(event) {
    const value = (event.checked) ? true : false;
    const status = (value) ? 'enabled' : 'disabled';
    this.provider_services.setProviderPOSStatus(value).subscribe(data => {
      this.shared_functions.openSnackBar('Billing settings ' + status + ' successfully', { 'panelclass': 'snackbarerror' });
      this.getPOSSettings();
    }, (error) => {
      this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      this.getPOSSettings();
    });
  }
  getPOSSettings() {
    this.provider_services.getProviderPOSStatus().subscribe(data => {
      this.pos_status = data['enablepos'];
      this.pos_statusstr = (this.pos_status) ? 'On' : 'Off';
    });
  }
  performActions(action) {
    if (action === 'learnmore') {
      this.routerobj.navigate(['/provider/' + this.domain + '/billing']);
    }
  }
  learnmore_clicked(mod, e) {
    e.stopPropagation();
    this.routerobj.navigate(['/provider/' + this.domain + '/billing->' + mod]);
  }
  redirecToSettings() {
    this.routerobj.navigate(['provider', 'settings']);
  }
  redirecToHelp() {
    this.routerobj.navigate(['/provider/' + this.domain + '/billing']);
}

}