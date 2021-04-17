import { Component, OnInit } from '@angular/core';
import { ScrollToConfigOptions, ScrollToService } from '@nicky-lenaers/ngx-scroll-to';

@Component({
  selector: 'app-service-page-healthcare',
  templateUrl: './service-page-healthcare.component.html',
  styleUrls: ['./service-page-healthcare.component.css']
})
export class ServicePageHealthcareComponent implements OnInit {

  constructor(
    private _scrollToService: ScrollToService
  ) { }

  ngOnInit(): void {
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
}
