import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {FormMessageDisplayService} from '../../../shared//modules/form-message-display/form-message-display.service';

import { ProviderServices } from '../../services/provider-services.service';
import {Messages} from '../../../shared/constants/project-messages';
import {projectConstants} from '../../../shared/constants/project-constants';

@Component({
  selector: 'app-provider-add-coupons',
  templateUrl: './add-provider-coupons.component.html',
  // styleUrls: ['./home.component.scss']
})
export class AddProviderCouponsComponent implements OnInit {

  amForm: FormGroup;
  api_error = null;
  api_success = null;
  valueCaption = 'Enter value';
  constructor(
    public dialogRef: MatDialogRef<AddProviderCouponsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public fed_service: FormMessageDisplayService,
    public provider_services: ProviderServices
    ) {
        // console.log(data);
     }

  ngOnInit() {
     this.createForm();
  }
  createForm() {
    this.amForm = this.fb.group({
    name: ['', Validators.compose([Validators.required])],
    description: ['', Validators.compose([Validators.required])],
    discValue: ['', Validators.compose([Validators.required])],
    calculationType: ['Fixed', Validators.compose([Validators.required])]
    });

    if (this.data.type === 'edit') {
     this.updateForm();
    }
  }
  updateForm() {
    this.amForm.setValue({
      'name': this.data.coupon.name || null,
      'description': this.data.coupon.description || null,
      'discValue': this.data.coupon.amount || null,
      'calculationType': this.data.coupon.calculationType || null,
    });
  }
  onSubmit (form_data) {
        if (isNaN(form_data.discValue)) {
          this.api_error = 'Please enter a numeric coupon amount';
          return;
        } else {
            if (form_data.discValue === 0) {
              this.api_error = 'Please enter the coupon value';
              return;
            }
            if (form_data.calculationType === 'Percentage') {
               if (form_data.discValue < 0 || form_data.discValue > 100) {
                this.api_error = 'Coupon percentage should be between 0 and 100';
                return;
               }
            }
        }
        const post_data = {
                          'name': form_data.name,
                          'description':  form_data.description,
                          'amount': form_data.discValue,
                          'calculationType': form_data.calculationType,
        };

        if (this.data.type === 'edit') {
            this.editCoupon(post_data);
        } else if (this.data.type === 'add') {
            this.addCoupon(post_data);
        }
  }
  addCoupon(post_data) {

    this.provider_services.addCoupon(post_data)
        .subscribe(
          data => {
           this.api_success = Messages.COUPON_CREATED;
           setTimeout(() => {
            this.dialogRef.close('reloadlist');
           }, projectConstants.TIMEOUT_DELAY);
          },
          error => {
            this.api_error = error.error;
          }
        );
  }
  editCoupon(post_data) {
    post_data.id =  this.data.coupon.id;
    this.provider_services.editCoupon(post_data)
        .subscribe(
          data => {
            this.api_success = Messages.COUPON_UPDATED;
            setTimeout(() => {
            this.dialogRef.close('reloadlist');
            }, projectConstants.TIMEOUT_DELAY);
          },
          error => {
            this.api_error = error.error;
          }
    );
  }
  handleTypechange(typ) {
      if (typ === 'Fixed') {
        this.valueCaption = 'Enter value';
      } else {
        this.valueCaption = 'Enter percentage value';
      }

  }

  resetApiErrors () {
    this.api_error = null;
    this.api_success = null;
  }
}
