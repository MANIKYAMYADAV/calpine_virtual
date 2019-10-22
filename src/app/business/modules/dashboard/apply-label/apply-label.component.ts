import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';

@Component({
    selector: 'app-apply-label',
    templateUrl: './apply-label.component.html'
})

export class ApplyLabelComponent implements OnInit {
    checkin_id;
    providerLabels: any = [];
    constructor(public activateroute: ActivatedRoute,
        public provider_services: ProviderServices,
        public shared_functions: SharedFunctions) {
        this.activateroute.params.subscribe(data => {
            this.checkin_id = data.id;
        });
    }

    ngOnInit() {
        this.getLabels();
    }

    getLabels() {
        this.provider_services.getLabelList().subscribe(data => {
            this.providerLabels = data;
        });
    }

    addLabel() {
        console.log(this.checkin_id);
        this.provider_services.addLabeltoCheckin(this.checkin_id).subscribe(data => {

        },
            error => {
                this.shared_functions.openSnackBar(error, { 'panelClass': 'snackarerror' });
            });
    }

    deleteLabel(label) {
        this.provider_services.deleteLabelfromCheckin(this.checkin_id, label).subscribe(data => {

        },
            error => {
                this.shared_functions.openSnackBar(error, { 'panelClass': 'snackbarerror' });
            });
    }
}
