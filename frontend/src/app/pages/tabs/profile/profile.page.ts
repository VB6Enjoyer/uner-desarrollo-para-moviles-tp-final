import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonInput, IonLabel, IonItem, IonAvatar, IonIcon, IonNote, IonTextarea } from '@ionic/angular/standalone';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from 'src/services/users/users.service';
import { UserDto } from 'src/dtos/usuario.dto';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { SafeResourceUrl } from '@angular/platform-browser';
import { Platform } from '@ionic/angular'

@Component({
  standalone: true,
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  imports: [IonTextarea, IonNote, IonItem, IonLabel, IonInput, IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonAvatar, CommonModule, IonIcon, ReactiveFormsModule]
})

export class ProfilePage implements OnInit {
  imagenActual!: SafeResourceUrl; // Cambiado para usar SafeResourceUrl
  profileForm!: FormGroup;
  showImageUpload: boolean = false;
  isEditing: boolean = false;
  userProfile: UserDto | void = this.loadUserProfile();
  currentUserId: number = this.usersService.getCurrentUserId();
  photo: string | SafeResourceUrl | undefined;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private usersService: UsersService,
    private platform: Platform,
  ) { }

  ngOnInit() {
    this.loadUserProfile();
  }

  async takePicture() {
    let image;

    if (this.platform.is('ios') || this.platform.is('android')) { // Usa prompt si el usuario está en movil.
      image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Prompt
      });
    } else if (this.platform.is('desktop') || this.platform.is('mobileweb')) { // Usa Camera si el usuario está en desktop 
      image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera, // ! Sería mejor practica usar un file handler, pero francamente me importa un carajo porque esto sirve :)
      });

      if (image && image.base64String) {
        const base64String = image.base64String;
        const imageSizeInBytes = (base64String?.length * 0.75); // Base64 es 4/3 del tamaño original en bytes

        if (imageSizeInBytes > 1048576) {
          alert('La imagen seleccionada es demasiado grande. El límite es de 1MB.');
          return;
        }

        const base64Prefix = base64String.substring(0, 11); // Chequea los primeros 11 caracteres para revisar el formato de la imagen

        // * Esto revisa si la imagen tiene un data type al principio del base64, y si no, si empieza con strings que marcan si la imagen es JPG o PNG.
        if (((base64Prefix !== 'data:image/jpeg' && base64Prefix !== 'data:image/jpg') && !base64Prefix.startsWith("/9j/4AAQSkZ")) || base64Prefix.startsWith('iVBORw0KGgo')) {
          alert('Por favor, suba una imagen en formato JPEG.');
          return;
        }

        this.photo = 'data:image/jpeg;base64,' + base64String;

        this.profileForm.patchValue({ imagen: image.base64String });
      } else {
        alert("No se encontraron datos de una imagen. Por favor, intente de nuevo.");
      }
    }
  }

  // Cargar el perfil del usuario
  loadUserProfile(): UserDto | void {
    if (this.currentUserId) {
      this.usersService.getUser(this.currentUserId).subscribe(
        (userData: UserDto) => {
          this.userProfile = userData;

          this.profileForm = this.fb.group({
            idUsuario: Number(this.currentUserId),
            username: [this.userProfile?.username, [Validators.minLength(4), Validators.maxLength(32)]],
            password: ["", [Validators.minLength(4), Validators.pattern("^[a-zA-Z0-9._%+-]+"), Validators.maxLength(255)]],
            confirmPassword: ["", [Validators.minLength(4)]],
            nombre: [this.userProfile?.nombre, [Validators.minLength(2), Validators.maxLength(255)]],
            email: [this.userProfile?.email, [Validators.email, Validators.maxLength(255)]],
            imagen: [this.userProfile?.imagen],
            bio: [this.userProfile?.bio, [Validators.maxLength(2000)]],
            rol: [""]
          }, { validators: this.passwordMatchValidator });

          return this.userProfile;
        },
        (error) => {
          console.error('Hubo un error al obtener los datos del usuario:', error);
        }
      );
    } else {
      console.error('No se encontró un usuario logueado. ¿Cómo llegaste acá?');
    }

    return;
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  async onSaveProfile() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const { idUsuario, username, password, nombre, imagen, email, bio, rol } = this.profileForm.value;

    try {
      const response = await this.usersService.updateUser(this.currentUserId, { idUsuario, username, password, nombre, email, imagen, bio, rol }).toPromise();
      alert(`Perfil actualizado: ${username} (${email})`);
    } catch (error) {
      console.error(error);
      alert('No se pudo actualizar el perfil');
    }

    this.loadUserProfile();
  }
}
