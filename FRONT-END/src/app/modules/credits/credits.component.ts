import { Credit } from './credit.model';
import { Client } from '../clients/client.model';
import { CreditsService } from './credits.service';
import { ClientService } from '../clients/clients.service';

import { SHARED_IMPORTS } from '../../shared/shared-imports';
import { CRUDComponent } from '../../shared/crud/crud.component';
import { CrudModalDirective } from '../../shared/directives/crud-modal.directive';
// import { AlertsService } from '../../shared/alerts/alerts.service';

import { Component } from '@angular/core';
import { FloatLabelModule } from 'primeng/floatlabel';
// import { FormBuilder, FormGroup } from '@angular/forms';
// import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-credits',
  standalone: true,
  imports: [
    ...SHARED_IMPORTS,
    CRUDComponent,
    CrudModalDirective,
    FloatLabelModule
  ],
  templateUrl: './credits.component.html',
})

export class CreditsComponent {

  credits: Credit[] = [];
  clients: Client[] = [];
  filteredCredits: any[] = [];

  columns: { field: string, header: string }[] = [
    { field: 'nombreCliente', header: 'Cliente' },
    { field: 'totalCredito', header: 'Deuda Actual' },
  ];

  constructor(
    private creditService: CreditsService,
    private clientService: ClientService
  ){}

  loadClients() {
    return this.clientService.getAllClients();
  }

  loadCredits() {
    return this.creditService.getAllCredits();
  }

  ngOnInit() {
    forkJoin({
      clients: this.loadClients(),
      credits: this.loadCredits()
    }).subscribe(({ clients, credits }) => {
      this.clients = clients;
      this.credits = credits.map(credit => {
        const client = this.clients.find(c => c.idCliente === credit.idCliente)!;
        return { ...credit, nombreCliente: client.nombreCliente + ' ' + client.apellidoCliente };
      });
      this.filteredCredits = this.credits;
    });
  }

  searchCredits(query: string) {
    this.filteredCredits = this.credits.filter(credit =>
      // credit.nombreCliente.toLowerCase().includes(query.toLowerCase()) ||
      credit.totalCredito.toString().includes(query)
    );
  }

  exportCredits() {}
}