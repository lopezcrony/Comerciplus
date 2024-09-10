import { CRUDComponent } from './crud/crud.component';
import { CrudModalDirective } from './directives/crud-modal.directive';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';


export const SHARED_IMPORTS = [
  CRUDComponent,
  CrudModalDirective,
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  ButtonModule,
  ToolbarModule,
  DialogModule,
  ConfirmDialogModule,
  InputTextModule,
  FloatLabelModule,
  TableModule,
  TooltipModule,
  InputNumberModule,
];
