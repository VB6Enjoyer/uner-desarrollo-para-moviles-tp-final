import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonLabel, IonTabButton, IonTabBar, IonTabs, IonIcon} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { home, map, settings, person } from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: true,
  imports: [IonIcon, IonTabs, IonTabBar, IonTabButton, IonLabel, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class TabsPage implements OnInit {

  constructor() { 
    addIcons({home,map,person,settings});
  }


  ngOnInit() {
  }

}




