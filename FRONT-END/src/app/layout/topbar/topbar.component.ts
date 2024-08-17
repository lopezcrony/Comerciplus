import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css'
})
export class TopbarComponent {
  @Output() toggleSidebar = new EventEmitter<void>();

  // Cambia el nombre del método a toggleSidebarVisibility
  toggleSidebarVisibility() {
    this.toggleSidebar.emit();
  }
}
