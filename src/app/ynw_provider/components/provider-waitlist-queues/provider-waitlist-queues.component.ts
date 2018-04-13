import {Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HeaderComponent } from '../../../shared/modules/header/header.component';

import { SharedFunctions } from '../../../shared/functions/shared-functions';
import { SharedServices } from '../../../shared/services/shared-services';
import { ProviderServices } from '../../services/provider-services.service';
import { ProviderDataStorageService } from '../../services/provider-datastorage.service';
import { FormMessageDisplayService } from '../../../shared/modules/form-message-display/form-message-display.service';
import { Messages } from '../../../shared/constants/project-messages';
import { projectConstants } from '../../../shared/constants/project-constants';
import { AddProviderWaitlistQueuesComponent } from '../add-provider-waitlist-queues/add-provider-waitlist-queues.component';

import { ProviderSharedFuctions } from '../../shared/functions/provider-shared-functions';

@Component({
    selector: 'app-provider-waitlist-queues',
    templateUrl: './provider-waitlist-queues.component.html',
    styleUrls: ['./provider-waitlist-queues.component.css']
})

export class ProviderWaitlistQueuesComponent implements OnInit {


  queue_list: any = [];
  query_executed = false;

  api_error = null;
  api_success = null;

  api_load_complete = 0;

  breadcrumbs = [
    {
      title: 'Settings'
    },
    {
    title: 'Waitlist Manager',
    url: '/provider/settings/waitlist-manager'
    },
    {
      title: 'Queues'
    }
  ];

  constructor(
    private provider_services: ProviderServices,
    private provider_datastorage: ProviderDataStorageService,
    private shared_Functionsobj: SharedFunctions,
    private dialog: MatDialog,
    private router: Router,
    public provider_shared_functions: ProviderSharedFuctions) {}

  ngOnInit() {
    // calling the method to get the list of locations
    this.getProviderQueues();
  }

  // get the list of locations added for the current provider
  getProviderQueues() {
    this.provider_services.getProviderQueues()
      .subscribe(data => {
        this.queue_list = data;
        this.query_executed = true;
      },
      complete => {
        this.api_load_complete = 1;
      });
  }

  addEditProviderQueue(type, queue = null) {

    this.provider_shared_functions.addEditQueuePopup(this, type, 'queue_list', queue);

  }

  changeProviderQueueStatus(obj) {
    this.provider_shared_functions.changeProviderQueueStatus(this, obj);
  }

  resetApiErrors() {
    this.api_error = null;
    this.api_success = null;
  }
  goQueueDetail(queue) {
    this.router.navigate(['provider', 'settings' , 'waitlist-manager',
    'queue-detail', queue.id]);
  }





}
