import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentmanagerComponent } from './appointmentmanager.component';

const routes: Routes = [
    { path: '', component: AppointmentmanagerComponent },
    {path: 'schedules', loadChildren: () => import('./schedules/waitlist-schedules.module').then(m => m.WaitlistSchedulesModule)},

   // { path: 'holidays', loadChildren: () => import('./NonWorkingDay/NonWorkingDay.module').then(m => m.NonWorkingDaymodule)},
   
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class AppointmentmanagerRoutingModule {}
