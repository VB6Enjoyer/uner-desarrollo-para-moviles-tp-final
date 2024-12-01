import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonFooter, IonInput, IonNote, IonLabel, IonItem } from '@ionic/angular/standalone';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth/auth.service';
import { AlertController } from '@ionic/angular';
import { UsersService } from 'src/services/users/users.service';

@Component({
  standalone: true,
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  imports: [IonItem, IonLabel, IonNote, ReactiveFormsModule, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonFooter, IonInput]
})
export class RegisterPage {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private usersService: UsersService,
    private alertCtrl: AlertController // Importar AlertController
  ) {
    // Inicializar el formulario de registro con validaciones
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(32)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(255)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  // Validador para comprobar que las contraseñas coincidan
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { mismatch: true };
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  // Lógica de registro
  async onRegister() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { username, email, password } = this.registerForm.value;

    // Revisa si ya existe el email
    try {
      const userDto = await this.usersService.checkExistingEmail(email).toPromise();
      if (userDto) {
        await this.showAlert('Error', 'Ya existe una cuenta con el email ingresado.');
        return;
      }
    } catch (error) { } // ! No es una buena práctica esperar que se retorne un error en el chequeo, pero por ahora sirve.

    try {
      const response = await this.authService.register(username, email, password).toPromise();
      await this.showAlert('Registro exitoso', `Usuario registrado: ${username} (${email})`);
      this.router.navigate(['/login']);
    } catch (error) {
      console.error(error);
      await this.showAlert('Error', 'No se puede registrar el usuario. Revise la consola para más información.');
    }
  }
}
