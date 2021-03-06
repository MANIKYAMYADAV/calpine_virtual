import { Component, OnInit, OnDestroy } from '@angular/core';
import { projectConstantsLocal } from '../../../../shared/constants/project-constants';
import { SharedFunctions } from '../../../../shared/functions/shared-functions';
import { ProviderServices } from '../../../../ynw_provider/services/provider-services.service';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { SnackbarService } from '../../../../shared/services/snackbar.service';
import { WordProcessor } from '../../../../shared/services/word-processor.service';



@Component({
  selector: 'app-clinicalnotes',
  templateUrl: './clinicalnotes.component.html',
  styleUrls: ['./clinicalnotes.component.css']
})
export class ClinicalnotesComponent implements OnInit, OnDestroy {


  mrId = 0;
  clinicalNotes: any[];
  allergies: any;
  currentMRId: any;
  patientDetails: any;
  userId;
  customerDetails: any;
  editclinicaldialogRef: any;
  symptoms: any;
  diagnosis: any;
  complaints: any;
  observations: any;
  misc_notes: any;
  vaccinationHistory: any;
  Cdata;
  isLoaded = false;
  clinical_constant = projectConstantsLocal.CLINICAL_NOTES;
  constructor(

    public sharedfunctionObj: SharedFunctions,
    public provider_services: ProviderServices,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private snackbarService: SnackbarService,
    private wordProcessor: WordProcessor
  ) {


  }

  ngOnInit() {
    const medicalrecordId = this.activatedRoute.parent.snapshot.params['mrId'];
    this.mrId = parseInt(medicalrecordId, 0);

      if (this.mrId === 0 || this.mrId === undefined) {
        this.isLoaded = true;
        for (let i = 0; i < this.clinical_constant.length; i++) {
          this.clinical_constant[i].value = '';

        }
        this.clinicalNotes = this.clinical_constant;


      } else if (this.mrId !== 0) {
        for (let i = 0; i < this.clinical_constant.length; i++) {
          this.clinical_constant[i].value = '';

        }
        this.clinicalNotes = this.clinical_constant;
        this.getMRClinicalNotes(this.mrId).then((res: any) => {
          this.clinicalNotes = res;
          this.isLoaded = true;

        });
      }



  }

  getMRClinicalNotes(mrId) {
    const $this = this;
    let response = '';
    for (let i = 0; i < this.clinical_constant.length; i++) {
      this.clinical_constant[i].value = '';

    }
    const compArray = this.clinical_constant;

    return new Promise((resolve) => {
      $this.provider_services.getClinicalRecordOfMRById(mrId)
        .subscribe((res: any) => {
          if (res.clinicalNotes) {
            response = res.clinicalNotes;
          } else {
            response = res;
          }

          Object.entries(response).forEach(
            function ([key, v]) {
              const index = compArray.findIndex(element => element.id === key);
              compArray[index].value = v;

            });
        },
          error => {
            $this.snackbarService.openSnackBar($this.wordProcessor.getProjectErrorMesssages(error), { 'panelClass': 'snackbarerror' });
          });


      resolve(compArray);
    });

  }

  ngOnDestroy() {

  }
  addOrEditClinicalNotes(object) {

    const navigationExtras: NavigationExtras = {
      relativeTo: this.activatedRoute,
      queryParams: {
        'data': JSON.stringify(object),
        'clinicalNotes': JSON.stringify(this.clinicalNotes)
      }
    };
    this.router.navigate(['../edit'], navigationExtras);
  }
}
