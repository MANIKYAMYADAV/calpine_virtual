import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SharedServices } from '../../services/shared-services';
import { SharedFunctions } from '../../functions/shared-functions';
import { MatDialog } from '@angular/material/dialog';
import { SignUpComponent } from '../../components/signup/signup.component';
import { LoginComponent } from '../../components/login/login.component';
import { SearchFields } from '../../modules/search/searchfields';
import { projectConstants } from '../../../app.component';
import { ScrollToConfigOptions, ScrollToService } from '@nicky-lenaers/ngx-scroll-to';
import { Meta, Title } from '@angular/platform-browser';
import { LocalStorageService } from '../../services/local-storage.service';
import { DateTimeProcessor } from '../../services/datetime-processor.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  images = {
    jaldee_find: 'assets/images/home/jaldee_find.svg',
    jaldee_find_img: 'assets/images/home/01_26.jpg',
    jaldee_checkin: 'assets/images/home/jaldee_checkin.svg',
    jaldee_checkin_img: 'assets/images/home/Graph-06_26.jpg',
    jaldee_alerts: 'assets/images/home/jaldee_alerts.svg',
    jaldee_alerts_img: 'assets/images/home/Graph-07_26.jpg',
    jaldee_coupons: 'assets/images/home/jaldee_coupons.svg',
    jaldee_coupons_img: 'assets/images/home/Graph-08.jpg',
    jaldee_pay: 'assets/images/home/jaldee_pay.svg',
    jaldee_pay_img: 'assets/images/home/Graphs-15.jpg',
    jaldee_graph: 'assets/images/home/banner-01.svg',
    jaldee_home: 'assets/images/home/02.png'
  };
  public domainlist_data: any = [];
  sector_info: any = [];
  special_info: any = [];
  public searchfields: SearchFields = new SearchFields();
  locationholder = { 'autoname': '', 'name': '', 'lat': '', 'lon': '', 'typ': '' };
  keywordholder = { 'autoname': '', 'name': '', 'domain': '', 'subdomain': '', 'typ': '' };
  selected_domain = '';
  is_provider = 'true';
  domain_obtained = false;
  carouselOne;
  playvideo = false;
  customOptions: any;
  carouselPackages: any;
  evnt;
  loading = false;
  constructor(
    private shared_service: SharedServices,
    public shared_functions: SharedFunctions,
    private routerobj: Router,
    public dialog: MatDialog,
    private _scrollToService: ScrollToService,
    private lStorageService: LocalStorageService,
    private dateTimeProcessor: DateTimeProcessor,
    private titleService: Title,
    private metaService: Meta
  ) {
    this.evnt = routerobj.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (routerobj.url === '\/') {
        if (this.shared_functions.isBusinessOwner('returntyp') === 'consumer') {
          routerobj.navigate(['consumer']);
        }
      }
      }
    });
   }
ngOnDestroy() {
  const a = document.getElementById("fb-root");
  if (a) {
  a.classList.remove('visible_chat');
  }
  // alert('destroy');
  // let a = document.getElementById('fb-root');
  //   a.setAttribute('style', 'visibility:hidden !important');
}
ngAfterViewInit() {
  // alert('init');
  // let a = document.getElementById('hubspot-messages-iframe-container');
  // a.setAttribute('style', 'visibility:visible !important');
}
  ngOnInit() {

    const a = document.getElementById("fb-root");
    if (a) {
      a.classList.add('visible_chat');
    }
  




    this.titleService.setTitle('Jaldee - Avoid Waiting in Line');
    this.metaService.addTags([
      { name: 'description', content: 'www.jaldee.com is a web portal connecting service providers with customers. Jaldee is an all India platform listing thousands of doctors/professionals/technicians and all service areas including healthcare, homecare, personal care and legal/financial care. The motto of Jaldee is \"seamless connectivity of service providers/business enterprises with potential customers.\" Elimination of queues, wiping out unproductive & boring waiting times, is the motivation & aim of Jaldee.' }
    ]);
    this.setSystemDate();
    // calling the method to get the list of domains
    this.getDomainList();
    // callling method to set the captions for sectors / subdomains or specializations in the home page
    this.setRequiredCaptions();
    this.carouselPackages = {
      dots: false,
      autoplay: true,
      autoplayTimeout: 6000,
      autoplaySpeed: 1000,
      autoplayHoverPause: true,
      mouseDrag: true,
      touchDrag: true,
      pullDrag: true,
      loop: true,
      responsive: { 0: { items: 1 }, 700: { items: 2 }, 991: { items: 3 }, 1200: { items: 3 } }
    };

    this.customOptions = {
      loop: true,
      mouseDrag: true,
      touchDrag: true,
      pullDrag: true,
      dots: false,
      autoplay: true,
      navSpeed: 700,
      navText: ['', ''],
      responsive: {
        0: {
          items: 1
        },
        400: {
          items: 1
        },
        740: {
          items: 1
        },
        940: {
          items: 1
        }
      },
      nav: true
    };
    this.carouselOne = {
      // nav: true,
      // navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
      dots: true,
      loop: true,
      autoplay: true,
      responsiveClass: true,
      responsive: {
        0: {
          items: 1
        },
        992: {
          items: 3,
          center: true,
        }
      }
    };
    setTimeout(() => {
      this.handleScroll('home');
    }, 500);
  }

  handleScroll(target) {
    this.triggerScrollTo(target);
  }
  public triggerScrollTo(destination) {
    const config: ScrollToConfigOptions = {
      target: destination,
      duration: 150,
      easing: 'easeOutElastic',
      offset: 0
    };
    this._scrollToService.scrollTo(config);
  }
  setRequiredCaptions() {
    // building array to hold the details related to the specialization
    this.special_info['healthCare'] = [
      { 'caption': 'Paediatrics', 'kw': 'Paediatrics', 'kwautoname': 'Paediatrics', 'kwtyp': 'special' },
      { 'caption': 'Ayurvedic Medicine', 'kw': 'AyurvedicMedicine', 'kwautoname': 'Ayurvedic Medicine', 'kwtyp': 'special' },
      { 'caption': 'Dentists', 'kw': 'dentists', 'kwautoname': 'Dentists', 'kwtyp': 'subdom' }
    ];

    this.special_info['personalCare'] = [
      { 'caption': 'Beauty Care for Men', 'kw': 'BeautyCareForMen', 'kwautoname': 'Beauty Care for Men', 'kwtyp': 'special' },
      { 'caption': 'Beauty Care for Women', 'kw': 'BeautyCareForWomen', 'kwautoname': 'Beauty Care for Women', 'kwtyp': 'special' },
      { 'caption': 'Personal Fitness', 'kw': 'HairSalonForKids', 'kwautoname': 'Personal Fitness', 'kwtyp': 'special' }
    ];
    this.special_info['professionalConsulting'] = [
      { 'caption': 'Lawyer', 'kw': 'lawyers', 'kwautoname': 'Lawyer', 'kwtyp': 'subdom' },
      { 'caption': 'Tax Consultants', 'kw': 'taxConsultants', 'kwautoname': 'Tax Consultants', 'kwtyp': 'subdom' },
      { 'caption': 'Civil Architects', 'kw': 'civilArchitects', 'kwautoname': 'Civil Architects', 'kwtyp': 'subdom' },
      { 'caption': 'Chartered Accountants', 'kw': 'charteredAccountants', 'kwautoname': 'Chartered Accountants', 'kwtyp': 'subdom' }
    ];
    this.special_info['finance'] = [
      { 'caption': 'Bank', 'kw': 'bank', 'kwautoname': 'Bank', 'kwtyp': 'subdom' },
      { 'caption': 'NBFC', 'kw': 'nbfc', 'kwautoname': 'NBFC', 'kwtyp': 'subdom' },
      { 'caption': 'Insurance', 'kw': 'insurance', 'kwautoname': 'Insurance', 'kwtyp': 'subdom' }
    ];
    // building array to hold the details related to the domains
    this.sector_info['healthCare'] = {
      'simg': 'assets/images/home/HealthCare.jpg',
      'caption1': '1000s of Doctors', 'caption2': '', 'special': this.special_info['healthCare']
    };
    this.sector_info['personalCare'] = {
      'simg': 'assets/images/home/personal-care.jpg',
      'caption1': '', 'caption2': '', 'special': this.special_info['personalCare']
    };
    this.sector_info['professionalConsulting'] = {
      'simg': 'assets/images/home/Proffesional.jpg',
      'caption1': '', 'caption2': '', 'special': this.special_info['professionalConsulting']
    };
    this.sector_info['finance'] = {
      'simg': 'assets/images/home/Graphs-055.jpg',
      'caption1': '', 'caption2': '', 'special': this.special_info['finance']
    };
  }
  playvideoClicked() {
    document.getElementById('video-box').innerHTML = '<iframe width="100%"  src="https://www.youtube-nocookie.com/embed/qF4gLhQW2CE?controls=1&rel=0&autoplay=1" height= "514px" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
  }

  setSystemDate() {
    this.shared_service.getSystemDate()
      .subscribe(
        res => {
          this.lStorageService.setitemonLocalStorage('sysdate', res);
        });
  }
  getDomainList() {
    const bconfig = this.lStorageService.getitemfromLocalStorage('ynw-bconf');
    let run_api = true;
    if (bconfig && bconfig.cdate && bconfig.bdata) { // case if data is there in local storage
      const bdate = bconfig.cdate;
      const bdata = bconfig.bdata;
      const saveddate = new Date(bdate);
      if (bconfig.bdata) {
        const diff = this.dateTimeProcessor.getdaysdifffromDates('now', saveddate);
        if (diff['hours'] < projectConstants.DOMAINLIST_APIFETCH_HOURS) {
          run_api = false;
          this.domainlist_data = bdata;
          // this.domainlist_data = ddata.bdata;
          this.domain_obtained = true;
        }
      }
    }
    if (run_api) { // case if data is not there in data
      this.shared_service.bussinessDomains()
        .subscribe(
          res => {
            this.domainlist_data = res;
            this.domain_obtained = true;
            const today = new Date();
            const postdata = {
              cdate: today,
              bdata: this.domainlist_data
            };
            this.lStorageService.setitemonLocalStorage('ynw-bconf', postdata);
          }
        );
    }
  }
  domainClicked(type) {
    this.handle_home_domain_click({'domain' : type});
  }
  handle_home_domain_click(obj) {
    this.keywordholder = { 'autoname': '', 'name': '', 'domain': '', 'subdomain': '', 'typ': '' };
    this.selected_domain = obj.domain;
    this.handle_search();
  }
  handle_homelinks_click(kw, kwautoname, kwdomain, kwsubdomain, kwtyp) {
    this.selected_domain = kwdomain;
    this.keywordholder.autoname = kwautoname;
    this.keywordholder.name = kw;
    this.keywordholder.domain = kwdomain || '';
    this.keywordholder.subdomain = kwsubdomain || '';
    this.keywordholder.typ = kwtyp;

    this.selected_domain = kwdomain;

    this.handle_search();
  }
  handle_search() {
    const localloc = this.lStorageService.getitemfromLocalStorage('ynw-locdet');
    if (localloc.autoname !== '' && localloc.autoname !== undefined && localloc.autoname !== null) {
      this.locationholder = localloc;
    }
    const passparam = {
      do: this.selected_domain || '',
      la: this.locationholder.lat || '',
      lo: this.locationholder.lon || '',
      lon: this.locationholder.name || '',
      lonauto: this.locationholder.autoname || '',
      kw: this.keywordholder.name || '',
      kwauto: this.keywordholder.autoname || '',
      kwdomain: this.keywordholder.domain || '',
      kwsubdomain: this.keywordholder.subdomain || '',
      kwtyp: this.keywordholder.typ || '',
      // srt: 'title' + ' ' + 'asc',
      srt: ' ',
      lq: '',
      cfilter: ''
    };
    this.routerobj.navigate(['/searchdetail', passparam]);
  }
  doSignup(origin?) {
    if (origin === 'provider') {
      // cClass = 'commonpopupmainclass';
    }
    const dialogRef = this.dialog.open(SignUpComponent, {
      width: '50%',
      panelClass: ['signupmainclass', 'popup-class'],
      disableClose: true,
      data: {
        is_provider: this.checkProvider(origin)
      }
    });

    dialogRef.afterClosed().subscribe(() => {
    });
  }
  doLogin(origin?) {
    if (origin === 'provider') {
      // cClass = 'commonpopupmainclass';
    }
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '50%',
      panelClass: ['loginmainclass', 'popup-class'],
      disableClose: true,
      data: {
        type: origin,
        is_provider: this.checkProvider(origin)
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if(result){
        this.loading = true;
      }
    });
  }
  doWatchVideo() {
    // alert('Clicked watch video');
  }
  doLearnMore() {
    // alert('Clicked learn more');
  }
  doSignuppage() {
    this.routerobj.navigate(['/business']);
  }
  checkProvider(type) {
    return (type === 'consumer') ? 'false' : 'true';
  }
  // checkinDetailsView() {
  //   this.routerobj.navigate(['/waitlist-details/ecid']);
  // }
  knowCheckinStatus() {
    this.routerobj.navigate(['status/new']);
  }
  providerLinkClicked() {
    this.routerobj.navigate(['/business/healthcare']);
  }
  // knowApptStatus () {
  //   this.routerobj.navigate(['appt/status/new']);
  // }
}

