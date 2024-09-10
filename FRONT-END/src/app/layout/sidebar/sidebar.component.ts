import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  animations: [
    trigger('sidebarAnimation', [
      state('collapsed', style({
        transform: 'translateX(-100%)',
        opacity: 0
      })),
      state('expanded', style({
        transform: 'translateX(0)',
        opacity: 1
      })),
      transition('collapsed <=> expanded', animate('300ms ease-in-out')),
    ]),
    trigger('submenuAnimation', [
      state('closed', style({
        height: '0',
        opacity: '0',
        overflow: 'hidden'
      })),
      state('open', style({
        height: '*',
        opacity: '1'
      })),
      transition('closed <=> open', animate('300ms ease-in-out')),
    ])
  ],
})
export class SidebarComponent {
  @Input() isSidebarVisible: boolean = true;
  @Output() sidebarClosed = new EventEmitter<void>();

  private activeSubmenu: string | null = null;

  isSubmenuOpen(submenu: string): boolean {
    return this.activeSubmenu === submenu;
  }

  toggleSubmenu(submenu: string) {
    if (this.activeSubmenu === submenu) {
      this.activeSubmenu = null;
    } else {
      this.activeSubmenu = submenu;
    }
  }

  getSubmenuState(submenu: string): string {
    return this.isSubmenuOpen(submenu) ? 'open' : 'closed';
  }

  closeSidebar() {
    this.sidebarClosed.emit(); // Emite el evento para cerrar el sidebar
  }
}
