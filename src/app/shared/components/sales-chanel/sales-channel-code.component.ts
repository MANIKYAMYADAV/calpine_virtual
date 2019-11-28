import 'rxjs/add/observable/interval';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { SharedServices } from '../../services/shared-services';
import { SharedFunctions } from '../../functions/shared-functions';
import { FormMessageDisplayService } from '../../modules/form-message-display/form-message-display.service';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';
import { Messages } from '../../constants/project-messages';

@Component({
  selector: 'app-sales-channel-code',
  templateUrl: './sales-channel-code.component.html'
})
export class SalesChannelCodeComponent implements OnInit {
  hearus;
  scCode_Ph;
  scInfo: any;
  scfound = false;
  ok_btn_cap = Messages.OK_BTN;
  @Output() retonRefSubmit: EventEmitter<any> = new EventEmitter();
  action;
  constructor(
    public fed_service: FormMessageDisplayService,
    public shared_services: SharedServices,
    public provider_services: ProviderServices,
    public shared_functions: SharedFunctions) { }

  ngOnInit() {
  }

  handlekeyup(ev) {
    if (ev.keyCode === 13) {
      this.findSC_ByScCode(this.scCode_Ph);
    }
  }
  findSC_ByScCode(scCode) {
    if (scCode) {
      this.provider_services.getSearchSCdetails(this.scCode_Ph)
      .subscribe(
        data => {
          this.scfound = true;
          this.scInfo = data;
        },
        () => {
          this.findSC_ByPhone(scCode);
        }
      );
    }
  }
  findSC_ByPhone(phonenumber) {
    this.provider_services.getsearchPhonedetails(phonenumber)
      .subscribe(
        data => {
          this.scfound = true;
          this.scInfo = data;
        },
        () => {
          this.scfound = false;
          this.shared_functions.openSnackBar(Messages.SCNOTFOUND,  {'panelClass': 'snackbarerror'});
        }
      );
  }
  onSubmit(action) {
    let post_data = {};
    if (action === 'skip') {
      post_data['action'] = 'skip';
    } else {
      post_data['action'] = 'save';
      post_data = {
        'hereby': this.hearus,
      };
      if (this.hearus === 'salesrep') {
        if (this.scInfo.scId) {
          post_data['scCode'] = this.scInfo.scId;
        } else {
          this.shared_functions.openSnackBar(Messages.SCNOTFOUND,  {'panelClass': 'snackbarerror'});
          return false;
        }
      }
    }
    this.retonRefSubmit.emit(post_data);
  }
}
