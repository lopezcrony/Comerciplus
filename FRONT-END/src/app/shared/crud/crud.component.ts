import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { ToggleButtonModule } from 'primeng/togglebutton';

@Component({
  selector: 'app-crud',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    IconFieldModule,
    ToggleButtonModule
  ],
  templateUrl: './crud.component.html',
  styleUrl: './crud.component.css'
})
export class CRUDComponent {

  // Configuraciones de la tabla y permisos
  @Input() canSeeDetail: boolean = true;
  @Input() canCreate: boolean = true;
  @Input() canDelete: boolean = true;
  @Input() canExport: boolean = true;
  @Input() canEdit: boolean = true;
  @Input() canChangeStatus: boolean = false;
  @Input() canInstallment: boolean = false;
  @Input() showStateColumn: boolean = false;
  @Input() creditColumn: boolean = false;
  @Input() actions: boolean = true;

  // Datos de entrada para la tabla
  @Input() items: any[] = [];
  @Input() columns: { field: string, header: string }[] = [];
  @Input() statusField: string = 'estado';

  // Funciones del CRUD
  @Output() create = new EventEmitter<void>();
  @Output() deleteAll = new EventEmitter<void>();
  @Output() export = new EventEmitter<void>();
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() detail = new EventEmitter<any>();
  @Output() installment = new EventEmitter<any>();
  @Output() statusChange = new EventEmitter<any>();
  @Output() search = new EventEmitter<string>();

  // Parámetro de búsqueda
  searchQuery = '';

  onCreate() {
    this.create.emit();
  }

  onExport() {
    this.export.emit();
  }

  onEdit(item: any) {
    this.edit.emit(item);
  }

  onDelete(item: any) {
    this.delete.emit(item);
  }

  onDetail(item: any) {
    this.detail.emit(item);
  }

  onInstallment(item: any){
    this.installment.emit(item);
  }
  
  onSearch() {
    this.search.emit(this.searchQuery);
  }

  clearSearch() {
    this.searchQuery = '';
    this.onSearch();
  }

  getEstado(item: any): boolean {
    return item[this.statusField];
  }

  cambiarEstado(item: any) {
    const updatedItem = { ...item, [this.statusField]: !item[this.statusField] };
    this.statusChange.emit(updatedItem);
  }
}