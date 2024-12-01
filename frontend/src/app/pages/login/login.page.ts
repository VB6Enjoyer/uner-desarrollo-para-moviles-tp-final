import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonInputPasswordToggle, IonHeader, IonTitle, IonToolbar, IonButton, IonFooter, IonInput, IonNote, IonLabel, IonItem } from '@ionic/angular/standalone';
import { AuthService } from '../../../services/auth/auth.service';
import { NavController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { RolesEnum } from 'src/enums/roles.enum';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [IonItem, IonLabel, IonNote, IonInputPasswordToggle, ReactiveFormsModule, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonFooter, IonInput, IonInput]
})
export class LoginPage {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private alertCtrl: AlertController
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  async onLogin() {
  
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.showAlert('Error', 'Debe ingresar todos los campos'); 
      return;
    }
  
    const formValue = this.loginForm.value;
  
    // Agregamos un alert para verificar si se ha capturado el valor del formulario correctamente

  
    this.authService.login(formValue.email, formValue.password).subscribe({
      next: (response) => {
        if (response) {
      
          this.authService.setSession(response.token);
  
          // Verificamos los roles para redirigir a la página correcta
          if (this.authService.hasRole(RolesEnum.ADMINISTRADOR)) {
            this.router.navigateByUrl('tabs/home'); 
          } else if (this.authService.hasRole(RolesEnum.INVITADO)) {
            this.router.navigateByUrl('/tabs/home'); 
          } else if (this.authService.hasRole(RolesEnum.USUARIO)) {
            this.router.navigateByUrl('/tabs/home'); 
          } else {
            this.router.navigateByUrl('/'); // Por defecto, redirigir al home general
          }
        }
      },
      error: (error) => {
        // Agregamos un alert para ver qué error se está recibiendo
        console.error('Error en autenticación:', error);
        this.showAlert('Error de autenticación', 'Error al autenticar. Verifique el usuario y la clave');
      }
    });
  }
  
  photo: string | undefined;


 


  goToRegister() {
    this.router.navigate(['/register']);
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}

