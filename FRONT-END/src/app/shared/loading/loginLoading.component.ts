import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-login-loading',
  standalone: true,
  imports: [CommonModule, ProgressSpinnerModule],
  template: `
    <div class="flex items-center justify-center h-screen">
      <div class="text-center">
        <div class="flex justify-center mb-4">
          <div class="relative">
            <i 
              class="pi pi-shopping-cart text-blue-600 animate-bounce text-4xl"
            ></i>
            <div class="absolute bottom-0 right-0 w-2 h-2 bg-gray-500 rounded-full animate-ping"></div>
          </div>
        </div>
        <p class="text-sm text-gray-600 font-medium">
          Iniciando sesión...
        </p>
      </div>
    </div>
  `,
  styles: []
})
export class LoginLoadingComponent {}