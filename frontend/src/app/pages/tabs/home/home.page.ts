import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import {IonIcon } from '@ionic/angular/standalone';
import { HostListener } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonIcon ]
})
export class HomePage {
  constructor(private platform: Platform, private router: Router) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      if (this.router.url === '/tabs/home') {
      } else {
        // Permitir el comportamiento de retroceso por defecto en otras páginas
        window.history.back();
      }
    });
  }
}
