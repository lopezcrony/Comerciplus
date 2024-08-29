import { Component, Input, EventEmitter, Output } from '@angular/core';
import { CommonModule} from '@angular/common';
import { RouterModule } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';
// import {TopbarComponent} from '../topbar/topbar.component'

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'], // Verifica que el nombre sea styleUrls, no styleUrl

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
  ],
})
export class SidebarComponent {
[x: string]: any;
  @Input() isSidebarVisible = false;

  @Input() isSubmenuOpen: boolean = false;

  // Método para cambiar el estado del submenu
  toggleSubmenu() {
    this.isSubmenuOpen = !this.isSubmenuOpen;
  }
}
