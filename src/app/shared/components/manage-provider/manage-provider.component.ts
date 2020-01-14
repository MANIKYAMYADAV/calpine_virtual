import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProviderServices } from '../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../functions/shared-functions';
import { Title } from '@angular/platform-browser';

@Component({
    'selector': 'app-manage-provider',
    templateUrl: './manage-provider.component.html'
})
export class ManageProviderComponent implements OnInit {
    accountId;
    constructor(private router: Router,
        private provider_service: ProviderServices,
        private activated_route: ActivatedRoute,
        private sharedFunctions: SharedFunctions,
        private titleService: Title) {
            this.activated_route.params.subscribe(params => {
                this.accountId = params.id;
              });
    }
    ngOnInit() {
        this.provider_service.manageProvider(this.accountId).subscribe(
            (data: any) => {
                this.sharedFunctions.setitemOnSessionStorage('tabId', data.tabId);
                this.sharedFunctions.setitemOnSessionStorage('accountid', this.accountId);
                data['accountType'] = 'BRANCH_SP';
                this.titleService.setTitle(data.userName);
                this.sharedFunctions.setitemToGroupStorage('ynw-user', data);
                this.router.navigate(['/provider/check-ins']);

        }, error => {
            console.log(error);
        });
    }
}
