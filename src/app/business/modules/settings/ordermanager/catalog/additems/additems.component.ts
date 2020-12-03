import { Component, OnInit, OnDestroy } from '@angular/core';
import { Messages } from '../../../../../../shared/constants/project-messages';
import { projectConstants } from '../../../../../../app.component';
import { SharedFunctions } from '../../../../../../shared/functions/shared-functions';
import { Router } from '@angular/router';
import { ProviderServices } from '../../../../../../ynw_provider/services/provider-services.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-additems',
  templateUrl: './additems.component.html',
  styleUrls: ['./additems.component.css'],
})
export class AddItemsComponent implements OnInit, OnDestroy {
  tooltipcls = '';
  name_cap = Messages.ITEM_NAME_CAP;
  price_cap = Messages.PRICES_CAP;
  taxable_cap = Messages.TAXABLE_CAP;
  edit_btn = Messages.EDIT_BTN;
  delete_btn = Messages.DELETE_BTN;
  add_item_cap = Messages.ADD_ITEM_CAP;
  item_enable_btn = Messages.ITEM_ENABLE_CAP;
  catalogItem: any = [];
  query_executed = false;
  emptyMsg = '';
  domain;
  breadcrumb_moreoptions: any = [];
  frm_items_cap = Messages.FRM_LEVEL_ITEMS_MSG;
  breadcrumbs_init = [
    {
      url: '/provider/settings',
      title: 'Settings'
    },
    {
      title: 'Jaldee Order',
      url: '/provider/settings/ordermanager'
    },
    {
      title: 'Catalogs',
      url: '/provider/settings/ordermanager/catalogs'
    }
  ];
  item_status = projectConstants.ITEM_STATUS;
  breadcrumbs = this.breadcrumbs_init;
  itemnameTooltip = Messages.ITEMNAME_TOOLTIP;
  additemdialogRef;
  edititemdialogRef;
  statuschangedialogRef;
  removeitemdialogRef;
  isCheckin;
  active_user;
  order = 'status';
  selecteditems: any = [];
  selected;
  selectedCount = 0;
  api_loading = true;
  seletedCatalogItems = [];
  tempcatalog = [];
  constructor(private router: Router,
    public shared_functions: SharedFunctions,
    private location: Location,
    private provider_servicesobj: ProviderServices) {
    this.emptyMsg = this.shared_functions.getProjectMesssages('ITEM_LISTEMPTY');
  }

  ngOnInit() {
    const user = this.shared_functions.getitemFromGroupStorage('ynw-user');
    this.domain = user.sector;
    this.active_user = this.shared_functions.getitemFromGroupStorage('ynw-user');
    this.breadcrumb_moreoptions = { 'actions': [{ 'title': 'Help', 'type': 'learnmore' }] };
    this.isCheckin = this.shared_functions.getitemFromGroupStorage('isCheckin');
    this.getitems();
    this.seletedCatalogItems = this.shared_functions.getitemfromLocalStorage('selecteditems');
    console.log(this.seletedCatalogItems);
  }
  ngOnDestroy() {
  }
  getitems() {
    this.provider_servicesobj.getProviderItems()
      .subscribe((data) => {
        this.catalogItem = data;
          console.log('cataloITem' + JSON.stringify(this.catalogItem));
          console.log('selectcataloITem' + JSON.stringify(this.seletedCatalogItems));

        this.api_loading = false;
        if (this.seletedCatalogItems !== null) {
          this.selectedCount = this.seletedCatalogItems.length;
          this.catalogItem.map(item => {
            if (this.seletedCatalogItems.includes(item.itemId)) {
              item.selected = true;
            }
           return item;
          });
          console.log('cataloITem' + JSON.stringify(this.catalogItem));

        }
        //   this.selectedCount = this.seletedCatalogItems.length;
        //   for (let e = 0; e < this.seletedCatalogItems.length; e++) {
        //   for (let i = 0; i < this.catalogItem.length; i++) {
        //       if (this.catalogItem[i].id === this.seletedCatalogItems[e].id) {
        //         this.catalogItem[i].selected = true;
        //       }
        //     }
        //   }
        //   console.log('cataloITem' + JSON.stringify(this.catalogItem));

        // }


      });
  }
  selectItem(item, index) {
    console.log(this.catalogItem[index].selected);
    if (this.catalogItem[index].selected === undefined || this.catalogItem[index].selected === false) {
      this.catalogItem[index].selected = true;
      this.selectedCount++;
       //this.seletedCatalogItems.push(item);
    } else {
      this.catalogItem[index].selected = false;
      this.selectedCount--;
      //this.seletedCatalogItems.splice(index, 1);
    }
    console.log(this.seletedCatalogItems);
  }
  selectedItems() {
    this.seletedCatalogItems = [];
    for (let ia = 0; ia < this.catalogItem.length; ia++) {
      if (this.catalogItem[ia].selected === true) {
        this.seletedCatalogItems.push(this.catalogItem[ia].itemId);
      }
    }
    console.log(this.seletedCatalogItems);
    this.shared_functions.setitemonLocalStorage('selecteditems', this.seletedCatalogItems);
    this.location.back();

    // this.router.navigate(['provider', 'settings', 'ordermanager', 'catalogs', 'add']);
  }
  redirecToJaldeecatalogcreation() {
    this.router.navigate(['provider', 'settings', 'ordermanager', 'catalogs', 'add']);
  }
  redirecToHelp() {
    this.router.navigate(['/provider/' + this.domain + '/billing->items']);
  }

}