import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
  effect,
  EffectRef,
  output,
} from '@angular/core';

@Component({
  selector: 'ruleta-range',
  imports: [],
  templateUrl: './ruletaRange.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RuletaRangeComponent {
  stop = input.required<boolean>();
  valueRange = signal(0);
  strongToPull = output<number>();
  private goUp: boolean = true;

  private intervalTimer: number = 10; // Interval in milliseconds

  constructor() {
    let intervalId: any = null;
    let hasEmitted = false;

    effect((onCleanup) => {
      if (!this.stop()) {
        // Si estaba detenido, reseteamos el flag
        hasEmitted = false;

        // Si no hay intervalo corriendo, lo creamos
        if (!intervalId) {
          intervalId = setInterval(() => {
            this.setValue0to100();
          }, this.intervalTimer);
        }
      } else {
        // Solo emitimos una vez mientras esté en stop
        if (!hasEmitted) {
          console.log('Emitiendo valor fuerte a tirar:', this.valueRange());
          this.strongToPull.emit(100 - this.valueRange());
          hasEmitted = true;
        }

        // Cancelamos el intervalo si aún está activo
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
      }

      // Limpieza cuando el componente se destruya
      onCleanup(() => {
        if (intervalId) {
          clearInterval(intervalId);
        }
      });
    });
  }

  setValue0to100() {
    this.valueRange.update((value) => {
      let speed = 1;
      if (this.goUp) {
        const distanceTo100 = 100 - value;
        speed = Math.max(1, Math.ceil(15 - distanceTo100 / 5)); // acelera al acercarse al 100
        value += speed;
        if (value >= 100) {
          value = 100;
          this.goUp = false;
        }
      } else {
        const distanceTo0 = value;
        speed = 1;
        value -= speed;
        if (value <= 0) {
          value = 0;
          this.goUp = true;
        }
      }
      return value;
    });
  }
}
