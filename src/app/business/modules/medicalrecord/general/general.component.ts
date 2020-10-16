import { Component, OnInit } from '@angular/core';
// import { MedicalrecordService } from '../medicalrecord.service';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MedicalrecordService } from '../medicalrecord.service';


@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})
export class GeneralComponent implements OnInit {
  mrId: any;
  displayTitle: any;
  editable_object: any;
  clinicalNotes: any;
  edit_data: any;
  Cnotes: string;
  customerDetails: any;
  userId: any;
  today = new Date();
  patientid: any;

  constructor(
    public sharedfunctionObj: SharedFunctions,
    public provider_services: ProviderServices,
    private shared_functions: SharedFunctions,
    private activated_route: ActivatedRoute,
    private router: Router,
    private medicalrecordService: MedicalrecordService
  ) {
    this.medicalrecordService.patient_data.subscribe(data => {
      this.customerDetails = JSON.parse(data.customerDetail);
      console.log(this.customerDetails);
    });
    this.medicalrecordService._mrUid.subscribe(mrId => {
      this.mrId = mrId;
    });
    this.activated_route.queryParams.subscribe(params => {
      this.editable_object = JSON.parse(params.data);
      this.edit_data = this.editable_object.value;
      this.displayTitle = this.editable_object.displayName;
      this.clinicalNotes = JSON.parse(params.clinicalNotes);

    });

  }

  ngOnInit() {
  }

  redirecToClinicalNotes() {
    this.router.navigateByUrl('../clinicalnotes', { relativeTo: this.activated_route });
  }

  updateClinicalNotes(notes) {
    const index = this.clinicalNotes.findIndex(element => element.id === this.editable_object.id);
    console.log(index);

    this.clinicalNotes[index].value = notes;
    const payloadObject = this.clinicalNotes.reduce((acc, cur) => ({ ...acc, [cur.id]: cur.value }), {});
    const payload = {
      'clinicalNotes': payloadObject
    };

      if (this.mrId === 0) {

        this.medicalrecordService.createMR('clinicalNotes', payloadObject).then(res => {
          this.medicalrecordService.setCurrentMRID(res);
          this.sharedfunctionObj.openSnackBar('Medical Record Created Successfully');
          this.router.navigate(['provider', 'medicalrecord']);
        },
          error => {
            this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
          });
      } else {
             this.updateMrwithClinicalNotes(payload, this.mrId);

      }


  }

  updateMrwithClinicalNotes(payload, mrId) {
    this.provider_services.updateMrClinicalNOtes(payload, mrId)
      .subscribe((data) => {
        this.shared_functions.openSnackBar(this.displayTitle + ' updated successfully');
        this.router.navigate(['provider', 'medicalrecord']);
      },
        error => {
          this.sharedfunctionObj.openSnackBar(this.sharedfunctionObj.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
        });


  }

}
