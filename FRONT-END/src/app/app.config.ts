import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ButtonModule } from 'primeng/button'; 
import { DialogModule } from 'primeng/dialog'; 
import { TableModule } from 'primeng/table';   
import { CheckboxModule } from 'primeng/checkbox'; 
import { MultiSelectModule } from 'primeng/multiselect';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { routes } from './app.routes';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { SHARED_IMPORTS } from './shared/shared-imports';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withFetch()),
    provideAnimations(),
    importProvidersFrom([
      ...SHARED_IMPORTS,
      BrowserAnimationsModule,
      FormsModule,
      ReactiveFormsModule,
      ButtonModule,      
      DialogModule,
      TableModule,
      CheckboxModule,
      MultiSelectModule,
      ConfirmDialog,
      ToastrModule.forRoot({
        positionClass: 'toast-bottom-right',
        timeOut: 3000,
        preventDuplicates: true,
      }),
    ]),
    ConfirmationService,
    MessageService
  ]
};
