import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { ScrollToConfigOptions, ScrollToService } from "@nicky-lenaers/ngx-scroll-to";
import { DomainConfigGenerator } from "../../services/domain-config-generator.service";
import { SharedServices } from "../../services/shared-services";
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
    selector:'app-business-page-home',
    templateUrl: './business-page-home.component.html',
    styleUrls: ['./business-page-home.component.css']
    
})
export class BusinessPageHomeComponent implements OnInit {
    
    @ViewChild('privacyPolicy') privacyPolicy: ElementRef;
    @ViewChild('termsConditions') termsConditions: ElementRef;
    @ViewChild(MatSidenav)
    sidenav!: MatSidenav;
    // pdfUrl: any;
    accountEncId: string;
    provider_id: any;
    accountProperties: any;
    privacyUrl: any;
    termsUrl: any;
    target: any;
    contact = true;
    termcondition = false;
    privacypolicy =false;
    refundcancell = false;
    shippingdelivry = false;


    
    constructor(private domSanitizer: DomSanitizer,
        private activateroute:ActivatedRoute,
        private router: Router,
        private shared_services: SharedServices,
        private _scrollToService: ScrollToService,
        private domainConfigService: DomainConfigGenerator,
        private observer: BreakpointObserver) {
        
    }
    ngOnInit() {
        const _this = this;
        this.activateroute.queryParams.subscribe(
            (queryParams: any) => {
                if (queryParams.target) {
                    this.target = queryParams.target;
                }                
            }
        )
        this.activateroute.paramMap.subscribe(params => {
            this.accountEncId = params.get('id');
            this.getAccountIdFromEncId(this.accountEncId).then(
                (id: any) => {
                    _this.provider_id = id;
                    _this.domainConfigService.getUIAccountConfig(_this.provider_id).subscribe(
                    (uiconfig: any) => {
                    
                        if (uiconfig.terms) {
                            if(uiconfig.terms.startsWith('https')) {
                                console.log(uiconfig.terms);
                                this.termsUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(uiconfig.terms);
                            } else {
                                this.termsConditions.nativeElement.innerHTML = uiconfig.terms;
                            }
                        }
                        if (uiconfig.privacy) {
                            if(uiconfig.privacy.startsWith('https')) {
                                console.log(uiconfig.privacy);
                                this.privacyUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(uiconfig.privacy);

                            } else {
                                this.privacyPolicy.nativeElement.innerHTML = uiconfig.privacy;
                            }
                        }    
                        
                        if (this.target) {
                            this._scrollToService.scrollTo(this.target);
                        }


                    });
                });
            });

        // this.pdfUrl = this.domSanitizer.bypassSecurityTrustResourceUrl('https://jaldeeui.s3.ap-south-1.amazonaws.com/ui/scale/config/152877/PRIVACY+POLICY.pdf');
    }
    ngAfterViewInit() {
        this.observer.observe(['(max-width: 800px)']).subscribe((res) => {
          if (res.matches) {
            this.sidenav.mode = 'over';
            this.sidenav.close();
          } else {
            this.sidenav.mode = 'side';
            this.sidenav.open();
          }
        });
      }
    
    /**
   * 
   * @param encId encId/customId which represents the Account
   * @returns the unique provider id which will gives access to the s3
   */
  getAccountIdFromEncId(encId) {
    const _this = this;
    return new Promise(function (resolve, reject) {
      _this.shared_services.getBusinessUniqueId(encId).subscribe(
        (id) => {
          resolve(id);
        },
        error => {
          if (error.status === 404) {
            _this.router.navigate(['/not-found']);
          }
          reject();
        }
      );
    });
  }
  public triggerScrollTo(destination) {
      alert(destination);
    const config: ScrollToConfigOptions = {
      target: destination,
      duration: 150,
      easing: 'easeOutElastic',
      offset: 0
    };
    this._scrollToService.scrollTo(config);
  }
  selection(type){
    if(type=='contact'){
        this.contact = true;
    } else if (type =='term'){
    this.termcondition = true;
    this.contact = false;
  }
}

}