import { Component, Input } from '@angular/core';
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
  ],
})
export class SidebarComponent {
  @Input() isSidebarVisible = false;
  @Input() isSubmenuOpenConfig: boolean = false;
  @Input() isSubmenuOpenUsers: boolean = false;
  @Input() isSubmenuOpenShoppings: boolean = false;
  @Input() isSubmenuOpenSales: boolean = false;
  @Input() isSubmenuOpenReturns: boolean = false;

  toggleSubmenuConfig() {
    this.isSubmenuOpenConfig = !this.isSubmenuOpenConfig;
  }
  toggleSubmenuUsers() {
    this.isSubmenuOpenUsers = !this.isSubmenuOpenUsers;
  }
  toggleSubmenuShoppings() {
    this.isSubmenuOpenShoppings = !this.isSubmenuOpenShoppings;
  }
  toggleSubmenuSales() {
    this.isSubmenuOpenSales = !this.isSubmenuOpenSales;
  }
  toggleSubmenuReturns() {
    this.isSubmenuOpenReturns = !this.isSubmenuOpenReturns;
  }
}
  