import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { projectConstants } from '../../../../../app.component';
import { SharedServices } from '../../../../../shared/services/shared-services';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { projectConstantsLocal } from '../../../../../shared/constants/project-constants';
import { WordProcessor } from '../../../../../shared/services/word-processor.service';
import { SubSink } from 'subsink';
import { DateTimeProcessor } from '../../../../../shared/services/datetime-processor.service';
import { LocalStorageService } from '../../../../../shared/services/local-storage.service';

@Component({
  selector: 'app-confirm-page',
  templateUrl: './confirm-page.component.html',
  styleUrls: ['./confirm-page.component.css']
})
export class ConfirmPageComponent implements OnInit,OnDestroy {

  breadcrumbs = [
    {
      title: 'My Jaldee',
      url: '/consumer'
    },
    {
      title: 'Payment'
    }
  ];
  infoParams;
  appointment: any = [];
  path = projectConstants.PATH;
  dateFormat = projectConstants.PIPE_DISPLAY_DATE_FORMAT;
  newDateFormat = projectConstantsLocal.DATE_EE_MM_DD_YY_FORMAT;
  email;
  apiloading = false;
  provider_label;
  type = 'appt';
  private subs=new SubSink();
  theme: any;
  accountId;
  customId;
  constructor(
    public route: ActivatedRoute, public router: Router,
    private shared_services: SharedServices, public sharedFunctionobj: SharedFunctions,
    private wordProcessor: WordProcessor, private lStorageService: LocalStorageService,
    private dateTimeProcessor: DateTimeProcessor) {
    this.provider_label = this.wordProcessor.getTerminologyTerm('provider');
    this.subs.sink=this.route.queryParams.subscribe(
      params => {
        this.infoParams = params;
        if (params.uuid && params.account_id) {
         this.subs.sink= this.shared_services.getAppointmentByConsumerUUID(params.uuid, params.account_id).subscribe(
            (appt: any) => {
              this.appointment = appt;
              this.apiloading = false;
            });
        }
        if (params.type) {
          this.type = params.type;
        }
        if (params.customId) {
          this.customId = params.customId;
          this.accountId = params.account_id;
        }
        if(params.theme){
          this.theme=params.theme;
        }
      });
  }

  ngOnInit() {
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  // okClick() {
  //   let queryParam = {};
  //   if (this.customId) {
  //     queryParam['customId'] = this.customId;
  //     queryParam['theme'] = this.theme;
  //   }
  //   if (this.infoParams.account_id) {
  //     queryParam['account_id'] = this.infoParams.account_id;
  //     queryParam['accountId'] = this.infoParams.account_id;

  //   }
  //   const navigationExtras: NavigationExtras = {
  //     queryParams: queryParam
  //   };
  //   this.lStorageService.setitemonLocalStorage('orderStat', false);
  //   if (this.appointment.service.livetrack && this.type !== 'reschedule') {
  //     this.router.navigate(['consumer', 'appointment', 'track', this.infoParams.uuid], navigationExtras);
  //   } else {
  //     this.router.navigate(['consumer'], navigationExtras);
  //   }
  // }
  okClick(appt) {
    if (appt.service.livetrack && this.type !== 'reschedule') {
      let queryParams= {
        account_id: this.infoParams.account_id,
        theme:this.theme 
    }
    if (this.customId) {
      queryParams['customId'] = this.customId;
    }
    let navigationExtras: NavigationExtras = {
        queryParams: queryParams
    };
    this.router.navigate(['consumer', 'appointment', 'track', this.infoParams.uuid], navigationExtras);
    } else {
      let queryParams= {
        theme:this.theme,
        accountId: this.accountId
      }
      if (this.customId) {
          queryParams['customId'] = this.customId;
      }
      let navigationExtras: NavigationExtras = {
          queryParams: queryParams
      };
      this.router.navigate(['consumer'], navigationExtras);
    }
    this.lStorageService.setitemonLocalStorage('orderStat', false);
  }
  getSingleTime(slot) {
    if (slot) {
      const slots = slot.split('-');
      return this.dateTimeProcessor.convert24HourtoAmPm(slots[0]);
    }
  }
  updateEmail() {
    console.log(this.email);
  }
}
