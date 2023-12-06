import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  registrationForm: FormGroup = {} as FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {}


  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.registrationForm = this.fb.group({
      nombres: ['', Validators.required],
      primerApellido: ['', Validators.required],
      segundoApellido: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      correoElectronico: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      confirmarContrasena: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(group: FormGroup | null) {
    if (group) {
      const contrasena = group.get('contrasena')?.value;
      const confirmarContrasena = group.get('confirmarContrasena')?.value;

      if (contrasena === confirmarContrasena) {
        return null;
      } else {
        group.get('confirmarContrasena')?.setErrors({ mismatch: true });
        return { mismatch: true };
      }
    }

    return null;
  }

  onSubmit() {
    // ... (código anterior)

    // Verificar si todos los campos están en estado de error 'required'
    const allFieldsRequired = Object.keys(this.registrationForm.controls)
      .every(controlName => this.registrationForm.get(controlName)?.hasError('required'));

    if (allFieldsRequired) {
      this.showAlert('Todos los campos son obligatorios.');
      return;
    }

    // Obtener los campos individuales que faltan
    for (const controlName in this.registrationForm.controls) {
      if (this.registrationForm.controls.hasOwnProperty(controlName)) {
        const control = this.registrationForm.get(controlName);

        // Verificar si el campo de correo tiene un error de formato
        if (controlName === 'correoElectronico' && control?.hasError('email')) {
          this.showAlert('Formato de correo electrónico incorrecto.');
          return; // Detener la ejecución para mostrar solo un error a la vez
        }

        if (control?.hasError('required')) {
          this.showAlert(`Por favor, ingrese su ${this.capitalizeFirstLetter(controlName)}.`);
          return; // Detener la ejecución para mostrar solo un error a la vez
        }
      }
    }

    // Verificar si las contraseñas no coinciden
    if (this.registrationForm.hasError('mismatch')) {
      this.showAlert('Las contraseñas no coinciden.');
      return;
    }

    // Si llegamos aquí, significa que no hay errores y podemos procesar el formulario
    console.log('Formulario válido:', this.registrationForm.value);
    // Puedes agregar lógica adicional aquí, como enviar el formulario al servidor
    this.router.navigate(['/home']);
  }

  showAlert(message: string) {
    alert(message);
  }

  capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
 
  
}
