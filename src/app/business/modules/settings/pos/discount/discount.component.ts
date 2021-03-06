import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { ConfirmBoxComponent } from '../../../../../shared/components/confirm-box/confirm-box.component';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { Messages } from '../../../../../shared/constants/project-messages';
import { Router, NavigationExtras } from '@angular/router';
import { SnackbarService } from '../../../../../shared/services/snackbar.service';
import { WordProcessor } from '../../../../../shared/services/word-processor.service';
import { GroupStorageService } from '../../../../../shared/services/group-storage.service';

@Component({
  selector: 'app-discount',
  templateUrl: './discount.component.html',
  styleUrls: ['./discount.component.css']
})
export class DiscountComponent implements OnInit, OnDestroy {

  value_cap = Messages.VALUE_CAP;
  name_cap = Messages.DISC_NAME_CAP;
  edit_btn = Messages.EDIT_BTN;
  delete_btn = Messages.DELETE_BTN;
  desc_cap = Messages.DESCRIPTION_CAP;
  add_disc_cap = Messages.ADD_DISCOUNT_CAP;
  discount_list: any = [];
  query_executed = false;
  emptyMsg = '';
  breadcrumb_moreoptions: any = [];
  frm_dicounts_cap = Messages.FRM_LEVEL_DISCOUNTS_MSG;
  breadcrumbs_init = [
    {
      url: '/provider/settings',
      title: 'Settings'
    },
    {
      title: 'Jaldee Billing',
      url: '/provider/settings/pos'
    },
    {
      title: 'Discounts',
      url: '/provider/settings/pos/discounts'
    }
  ];
  breadcrumbs = this.breadcrumbs_init;
  accountdialogRef;
  adddiscdialogRef;
  remdiscdialogRef;
  isCheckin;
  active_user;
  domain;
  constructor(private provider_servicesobj: ProviderServices,
    private dialog: MatDialog,
    private router: Router,
    private routerobj: Router,
    public shared_functions: SharedFunctions,
    private sharedfunctionObj: SharedFunctions,
    private snackbarService: SnackbarService,
        private wordProcessor: WordProcessor,
        private groupService: GroupStorageService) {
    this.emptyMsg = this.wordProcessor.getProjectMesssages('DISCOUNT_LISTEMPTY');
  }

  ngOnInit() {
    const user = this.groupService.getitemFromGroupStorage('ynw-user');
    this.domain = user.sector;
    this.active_user = this.groupService.getitemFromGroupStorage('ynw-user');
    this.getDiscounts(); // Call function to get the list of discount lists
    this.breadcrumb_moreoptions = { 'actions': [{ 'title': 'Help', 'type': 'learnmore' }] };
    this.isCheckin = this.groupService.getitemFromGroupStorage('isCheckin');
  }

  ngOnDestroy() {
    if (this.accountdialogRef) {
      this.accountdialogRef.close();
    }
    if (this.adddiscdialogRef) {
      this.adddiscdialogRef.close();
    }
    if (this.remdiscdialogRef) {
      this.remdiscdialogRef.close();
    }
  }

  getDiscounts() {
    this.provider_servicesobj.getProviderDiscounts()
      .subscribe(data => {
        this.discount_list = data;
        this.query_executed = true;
      });
  }
  performActions(action) {
    if (action === 'learnmore') {
      this.routerobj.navigate(['/provider/' + this.domain + '/billing->discount']);
    }
  }
  addDiscounts() {
    this.router.navigate(['provider', 'settings', 'pos', 'discount', 'add']);
  }
  editDiscounts(discount) {
    const navigationExtras: NavigationExtras = {
      queryParams: { action: 'edit' }
    };
    this.router.navigate(['provider', 'settings', 'pos', 'discount', discount.id], navigationExtras);
  }
  doRemoveDiscounts(discount) {
    const id = discount.id;
    if (!id) {
      return false;
    }
    this.remdiscdialogRef = this.dialog.open(ConfirmBoxComponent, {
      width: '50%',
      panelClass: ['popup-class', 'commonpopupmainclass', 'confirmationmainclass'],
      disableClose: true,
      data: {
        'message': this.wordProcessor.getProjectMesssages('DISCOUNT_DELETE').replace('[name]', discount.name),
        'heading': 'Delete Confirmation'
      }
    });
    this.remdiscdialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteDiscounts(id);
      }
    });
  }


  deleteDiscounts(id) {
    this.provider_servicesobj.deleteDiscount(id)
      .subscribe(
        () => {
          this.snackbarService.openSnackBar(Messages.DISCOUNT_DELETED);
          this.getDiscounts();
        },
        error => {
          this.snackbarService.openSnackBar(error, { 'panelClass': 'snackbarerror' });
        }
      );

  }
  formatPrice(price) {
    return this.sharedfunctionObj.print_PricewithCurrency(price);
  }

  learnmore_clicked(mod, e) {
    e.stopPropagation();
    this.routerobj.navigate(['/provider/' + this.domain + '/billing->' + mod]);
  }
  // getMode(mod) {
  //   let moreOptions = {};
  //   moreOptions = { 'show_learnmore': true, 'scrollKey': 'billing', 'subKey': mod };
  //   return moreOptions;
  // }
  redirecToJaldeeBilling() {
    this.routerobj.navigate(['provider', 'settings' , 'pos']);
  }
  redirecToHelp() {
    this.routerobj.navigate(['/provider/' + this.domain + '/billing->discount']);
  }
}
