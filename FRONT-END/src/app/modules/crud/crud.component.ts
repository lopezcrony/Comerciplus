import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';

@Component({
  selector: 'app-crud',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, InputTextModule, FormsModule, IconFieldModule
  ],
  templateUrl: './crud.component.html',
  styleUrl: './crud.component.css'
})
export class CRUDComponent {
  
  @Input() canDelete: boolean = true;
  @Input() items: any[] = [];
  @Input() columns: {field: string, header: string}[] = [];

  
  @Output() create = new EventEmitter<void>();
  @Output() deleteAll = new EventEmitter<void>();
  @Output() export = new EventEmitter<void>();
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() search = new EventEmitter<string>();

  searchQuery = '';

  onCreate() {
    this.create.emit();
  }

  onDeleteAll() {
    this.deleteAll.emit();
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

  onSearch() {
    this.search.emit(this.searchQuery);
  }

  clearSearch() {
    this.searchQuery = '';
    this.onSearch();
  }
}