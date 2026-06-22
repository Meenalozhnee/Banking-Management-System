import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../shared/navbar/navbar';
import { Sidebar } from '../../shared/sidebar/sidebar';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Navbar, Sidebar],
  template: `
    <app-navbar></app-navbar>
    <div class="layout">
      <app-sidebar></app-sidebar>
      <main class="content">
        <div class="content-inner">
          <router-outlet></router-outlet>
        </div>
        <footer class="footer">
          &copy; {{year}} Sorim Bank Hub. All rights reserved. | Digital Banking Portal
        </footer>
      </main>
    </div>
  `,
  styles: [`
    .layout { display: flex; min-height: calc(100vh - var(--nav-height)); margin-top: var(--nav-height); }
    .content { margin-left: var(--sidebar-width); flex: 1; padding: 0; background: var(--bg); min-height: calc(100vh - var(--nav-height)); display: flex; flex-direction: column; }
    .content-inner { flex: 1; padding: 28px 32px; max-width: 1200px; width: 100%; }
    .footer { padding: 14px 32px; font-size: 12px; color: var(--text-muted); border-top: 1px solid var(--border); background: var(--surface); text-align: center; }
  `]
})
export class MainLayoutComponent {
  year = new Date().getFullYear();
}
