import { Component, OnInit , OnDestroy} from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { Messages } from '../../../../shared/constants/project-messages';
import { MatDialog } from '@angular/material/dialog';
import { ShowMessageComponent } from '../../show-messages/show-messages.component';
import { WordProcessor } from '../../../../shared/services/word-processor.service';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { GroupStorageService } from '../../../../shared/services/group-storage.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-ordermanager',
  templateUrl: './ordermanager.component.html',
  styleUrls: ['./ordermanager.component.css']
})
export class OrdermanagerComponent implements OnInit, OnDestroy {

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
  orderstatus;
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
  pos;
  catalog_list: any = [];
  private subscriptions = new SubSink();
  constructor(private router: Router,
    private shared_functions: SharedFunctions,
    private routerobj: Router,
    private dialog: MatDialog,
    private provider_services: ProviderServices,
    private wordProcessor: WordProcessor,
    private snackbarService: SnackbarService,
    private groupService: GroupStorageService
    ) {
    this.customer_label = this.wordProcessor.getTerminologyTerm('customer');
  }

  ngOnInit() {
    this.frm_public_self_cap = Messages.FRM_LEVEL_SELF_MSG.replace('[customer]', this.customer_label);
    const user = this.groupService.getitemFromGroupStorage('ynw-user');
    this.domain = user.sector;
    this.breadcrumb_moreoptions = { 'actions': [{ 'title': 'Help', 'type': 'learnmore' }] };
    this.getOrderStatus();
    this.getCatalog();
    //this.getDiscounts();
    this.getitems();
    //this.getPOSSettings();
  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
  getDiscounts() {
    this.subscriptions.sink = this.provider_services.getProviderDiscounts()
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
  getCatalog() {
    this.subscriptions.sink = this.provider_services.getProviderCatalogs()
        .subscribe(data => {
            this.catalog_list = data;
        });
}
  getitems() {
    this.subscriptions.sink = this.provider_services.getProviderItems()
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
    const navigatExtras: NavigationExtras = {
      queryParams: {
        type: 'ordermanager'
      }
    };
    if (this.noitemError) {
      this.router.navigate(['provider', 'settings', 'pos', 'items'] , navigatExtras);
    } else {
      this.snackbarService.openSnackBar(this.itemError, { 'panelClass': 'snackbarerror' });
    }
  }
  gotoStoredetails() {
    this.routerobj.navigate(['provider', 'settings', 'ordermanager', 'storedetails']);
  }
  gotoCatalogs() {
    this.routerobj.navigate(['provider', 'settings', 'ordermanager', 'catalogs']);
  }
  handleOrderStatus(event) {
    const status = (event.checked) ? 'enabled' : 'disabled';
    if (event.checked && this.catalog_list.length === 0) {
      const confirmdialogRef = this.dialog.open(ShowMessageComponent, {
          width: '50%',
          panelClass: ['popup-class', 'commonpopupmainclass'],
          disableClose: true,
          data: {
            'type': 'order'
          }
        });
        this.subscriptions.sink = confirmdialogRef.afterClosed().subscribe(result => {
        this.getOrderStatus();
      });
  } else {
    this.subscriptions.sink = this.provider_services.setProviderOrderSStatus(event.checked).subscribe(data => {
      this.snackbarService.openSnackBar('Order settings ' + status + ' successfully', { 'panelclass': 'snackbarerror' });
      this.getOrderStatus();
    }, (error) => {
      this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
      this.getOrderStatus();
    });
  }
}




  getOrderStatus() {
    this.subscriptions.sink = this.provider_services.getProviderOrderSettings().subscribe((data: any) => {
      this.orderstatus = data.enableOrder;
      this.pos_statusstr = (this.orderstatus) ? 'On' : 'Off';
      this.shared_functions.sendMessage({ 'ttype': 'orderStatus', orderStatus: this.orderstatus });
    });
  }
  getPOSSettings() {
    this.subscriptions.sink = this.provider_services.getProviderPOSStatus().subscribe(data => {
      this.pos = data['enablepos'];
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
