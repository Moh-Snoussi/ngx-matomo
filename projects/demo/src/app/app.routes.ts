import { Routes } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { UserComponent } from './user/user.component';
import { ConsentComponent } from './consent/consent.component';
import { EventComponent } from './event/event.component';
import { FormComponent } from './form/form.component';
import { MediaComponent } from './media/media.component';

export const routes: Routes = [
  {
    path: 'user',
    component: UserComponent,
    title: 'User Page',
  },
  {
    path: 'consent',
    component: ConsentComponent,
    title: 'Consent Page',
  },
  {
    path: 'event',
    component: EventComponent,
    title: 'Event Page',
  },
  {
    path: 'e-commerce',
    loadChildren: () => import('./e-commerce/e-commerce.routes').then((m) => m.E_COMMERCE_ROUTES),
  },
  {
    path: 'media',
    component: MediaComponent,
    title: 'Media Page',
  },
  {
    path: 'form',
    component: FormComponent,
    title: 'Form Page',
  },
  {
    path: '',
    pathMatch: 'full',
    component: WelcomeComponent,
    title: 'Welcome Page',
  },
];
