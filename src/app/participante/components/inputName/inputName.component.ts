import {
  ChangeDetectionStrategy,
  Component,
  output,
  signal,
} from '@angular/core';

@Component({
  selector: 'input-name',
  imports: [],
  templateUrl: './inputName.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputNameComponent {
  name = signal('');
  nameChange = output<string>();
  participar() {
    console.log('Nombre ingresado:', this.name());
    this.nameChange.emit(this.name());
    this.name.set(''); // Limpiar el campo después de participar
    // Aquí puedes agregar la lógica para manejar la participación
  }
}
