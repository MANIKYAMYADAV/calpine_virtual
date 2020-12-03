import { NgModule } from '@angular/core';
import { CatalogComponent } from './catalog.component';
import { CatalogdetailComponent } from './details/catalog-details.component';
import { BreadCrumbModule } from '../../../../../shared/modules/breadcrumb/breadcrumb.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CatalogRoutingModule } from './catalog.routing.module';
import { MaterialModule } from '../../../../../shared/modules/common/material.module';
import { GalleryModule } from '../../../../../shared/modules/gallery/gallery.module';
import { LoadingSpinnerModule } from '../../../../../ynw_provider/components/loading-spinner/loading-spinner.module';
import { FormMessageDisplayModule } from '../../../../../shared/modules/form-message-display/form-message-display.module';
import { OrderModule } from 'ngx-order-pipe';
import { ModalGalleryModule } from 'angular-modal-gallery';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { AddItemsComponent } from './additems/additems.component';
import { TruncateModule } from '../../../../../shared/pipes/limitTo.module';
import { CapitalizeFirstPipeModule } from '../../../../../shared/pipes/capitalize.module';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
    declarations: [
        CatalogComponent,
        CatalogdetailComponent,
        AddItemsComponent
      ],
    imports: [
        CatalogRoutingModule,
        BreadCrumbModule,
        CommonModule,
        FormsModule,
        MaterialModule,
        GalleryModule,
        LoadingSpinnerModule,
        FormMessageDisplayModule,
        ReactiveFormsModule,
        OrderModule,
        ModalGalleryModule,
        CKEditorModule,
        TruncateModule,
        CapitalizeFirstPipeModule,
        NgbTimepickerModule
    ],
    exports: [CatalogComponent]
})
export class CatalogModule {}