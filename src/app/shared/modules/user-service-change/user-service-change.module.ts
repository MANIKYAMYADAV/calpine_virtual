import { UserServiceChnageComponent } from './user-service-change.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UserServiceChangeRoutingModule } from './user-service-change.routing.module';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { LoadingSpinnerModule } from '../loading-spinner/loading-spinner.module';
import { ConfirmBoxLocationComponent } from './confirm-box-location/confirm-box-location.component';
import { MatDialogModule } from '@angular/material/dialog';



@NgModule({
    imports: [
      MatTableModule,
      MatCheckboxModule,
      CommonModule,
      MatFormFieldModule,
      UserServiceChangeRoutingModule,
      MatInputModule,
      FormsModule,
      LoadingSpinnerModule,
      MatDialogModule
      
    ],
    declarations: [
       UserServiceChnageComponent,
       ConfirmBoxLocationComponent 
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
      ],
})
export class UserServiceChangeModule { }
