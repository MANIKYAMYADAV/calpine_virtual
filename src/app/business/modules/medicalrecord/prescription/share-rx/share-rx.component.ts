import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
// import { ProviderServices } from '../../../../../ynw_provider/services/provider-services.service';
import { SharedFunctions } from '../../../../../shared/functions/shared-functions';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-share-rx',
  templateUrl: './share-rx.component.html',
  styleUrls: ['./share-rx.component.css']
})
export class ShareRxComponent implements OnInit {

  msgreceivers: any = [{'id': 0, 'name': 'patient'}, { 'id': 0, 'name': 'sp'} ];
  patientId: any;
  mrId;
  amForm: FormGroup;
  deptName;
  bname;
  location;
  customer_label: any;
  qname: any;
  qstarttime: any;
  qendtime: any;
  schedulename: any;
  appttime: any;
  appmtDate: any;
  spfname: any;
  splname: any;
  Schedulestime: any;
  Scheduleetime: any;
  sms = true;
  email = true;
  chekintype: any;
  consumer_fname: any;
  consumer_lname: any;
  serv_name: any;
  date: string;
  time: any;
  consumer_email: any;
  api_loading = false;
  phone: any;
  SEND_MESSAGE = '';
  settings: any = [];
  showToken = false;
iconClass: string;
  constructor(
      @Inject(MAT_DIALOG_DATA) public data: any,
     // private provider_services: ProviderServices,
      private shared_functions: SharedFunctions,
      private fb: FormBuilder,
      public dialogRef: MatDialogRef<ShareRxComponent>) {
        this.createForm();
          this.patientId = this.data.userId;
          this.chekintype = this.data.chekintype;
      }
 ngOnInit() {
  // this.msgreceivers = [{'id': 0, 'name': 'patient'}, { 'id': this.patientId, 'name': 'sp'} ];

  this.mrId = this.shared_functions.getitemfromLocalStorage('mrId');
 }
 createForm() {

  this.amForm = this.fb.group({
      selectedForwhom: [''],
      message: ['', Validators.compose([Validators.required])],
  });
  this.getMessageReceviers();

 }
  back() {
      this.dialogRef.close();
  }
  onSubmit(formdata) {
      console.log(formdata);
      // const providerid = 78055;
      // this.provider_services.shareprescription(this.mrId, providerid, formdata.message)
      //       .subscribe((data) => {
      //         this.shared_functions.openSnackBar('Prescription shared successfully');
      //       },
      //           error => {
      //               this.shared_functions.openSnackBar(this.shared_functions.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
      //           });

  }
  getMessageReceviers() {
    this.msgreceivers = [{'id': 0, 'name': 'patient'}, { 'id': this.patientId, 'name': 'sp'} ];
  }
}
