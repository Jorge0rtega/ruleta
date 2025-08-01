import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { ItemComponent } from '../item/item.component';
import { RuletaRangeComponent } from './ruletaRange/ruletaRange.component';
import { JumpTitleComponent } from './jumpTitle/jumpTitle.component';
import { ConfettiComponent } from '../item/confetti/confetti.component';
import { ItemDbService } from '../../../shared/services/itemDB.service';
import { Item } from '../../../shared/interfaces/item.interface';
import { InputNameComponent } from '../inputName/inputName.component';
import { ExcelService } from '../../../shared/services/excel.service';

@Component({
  selector: 'ruleta',
  imports: [
    ItemComponent,
    RuletaRangeComponent,
    JumpTitleComponent,
    InputNameComponent,
  ],
  templateUrl: './ruleta.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class RuletaComponent {
  private canvas = viewChild.required<ElementRef>('wheel');
  showItemDetails = signal(false);
  itemNameChosen = signal('');
  itemDescriptionChosen = signal('');
  itemImageChosen = signal('');
  name = signal('');
  stop = signal(false);
  strongToPull = signal(0);
  private ctx = signal<CanvasRenderingContext2D | null>(null);
  private radius = signal(0);
  private options = signal<Item[]>([]);
  private colors: string[] = this.arrayRandomLightColor(this.options().length);
  private sliceAngle = signal((2 * Math.PI) / this.options().length);
  private angle = signal(0);
  private isSpinning = signal(false);

  dbService = inject(ItemDbService);
  excelService = inject(ExcelService);

  constructor() {
    effect((onCleanup) => {
      console.log('showItemDetails effect:', this.showItemDetails());
      if (!this.showItemDetails()) {
        this.stop.set(false);
      } else {
        this.stop.set(true);
      }
      onCleanup(() => {});
    });
  }

  ngAfterViewInit(): void {
    // Inicializar opciones de la ruleta
    this.options.set([]);
    this.dbService.obtenerItemsSinNombreParticipante().then((items) => {
      this.options.set(items);
      this.colors = this.arrayRandomLightColor(items.length);
      this.sliceAngle.set((2 * Math.PI) / items.length);

      this.ctx.set(this.canvas().nativeElement.getContext('2d'));
      this.radius.set(this.canvas().nativeElement.width / 2);
      console.log('Opciones de la ruleta:', this.options());
      this.drawWheel();
    });
  }

  updateWheelMinusOption(item: Item): void {
    const indexItem = this.options().findIndex((i) => i.item === item.item);
    this.options.set(this.options().filter((i) => i.item !== item.item));
    this.sliceAngle.set((2 * Math.PI) / this.options().length);
    this.colors = this.colors.filter((_, i) => i !== indexItem);
  }

  private drawWheel() {
    console.log('Opciones de la ruleta:', this.options());
    const ctx = this.ctx();
    if (!ctx) return;

    const radius = this.radius();
    const options = this.options();
    const sliceAngle = this.sliceAngle();
    const centerX = radius;
    const centerY = radius;

    ctx.clearRect(0, 0, radius * 2, radius * 2);

    let i = 0;
    console.log('Opciones de la ruleta:', options[0].descripcion);
    for (const { item } of options) {
      console.log('Dibujando segmento:', item);
      const startAngle = i * sliceAngle + this.angle();
      const endAngle = startAngle + sliceAngle;

      // Dibuja el segmento
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = this.colors[i];
      ctx.fill();

      // Dibuja el texto
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#fff';
      ctx.font = '2rem Basic';
      ctx.fillText(item, radius - 10, 10);
      ctx.restore();
      i++;
    }
  }

  startSpinWheel() {
    if (this.isSpinning()) return;

    this.stop.set(true);
    this.isSpinning.set(true);
  }

  private currentVelocity = 0;

  spinWheel = (strongToPull: number) => {
    if (this.currentVelocity === 0) {
      console.log(
        'Iniciando el giro de la ruleta con fuerza de:',
        strongToPull
      );
      this.currentVelocity = strongToPull * 0.01 + 0.01;
      console.log('Velocidad inicial:', this.currentVelocity);
    }
    if (this.currentVelocity <= 0.002) {
      this.isSpinning.set(false);
      const selected: Item = this.getSelectedOption();
      console.log(
        'La fortuna ha hablado:',
        selected.item,
        selected.descripcion
      );
      setTimeout(() => {
        this.itemNameChosen.set(selected.item);
        this.itemDescriptionChosen.set(selected.descripcion);
        this.itemImageChosen.set(selected.urlImagen);
        selected.nombreParticipante = this.name();
        this.dbService.actualizarItem(selected);
        console.log('Nombre del participante:', this.name());
        this.excelService.exportarItemsAExcel();
        this.name.set(''); // Limpiar el nombre después de participar
        this.showItemDetails.set(true);
        this.currentVelocity = 0; // reset para próximos giros
        this.updateWheelMinusOption(selected);
        this.drawWheel();
      }, 1000);
      return;
    }

    this.angle.set(this.angle() + this.currentVelocity);
    this.currentVelocity *= 0.98;
    this.drawWheel();
    requestAnimationFrame(this.spinWheel.bind(this, strongToPull));
  };

  arrayRandomLightColor(n: number): string[] {
    const colors = [];
    for (let i = 0; i < n; i++) {
      const color = 'hsl(' + Math.random() * 360 + ', 100%, 45%)';
      colors.push(color);
    }
    return colors;
  }

  private getSelectedIndex(): number {
    const angle = this.angle() % (2 * Math.PI);
    const sliceAngle = this.sliceAngle();

    // Calculamos el ángulo donde apunta la flecha (arriba)
    const pointerAngle = (3 * Math.PI) / 2; // 270° en radianes

    // El ángulo actual de la ruleta donde está apuntando la flecha
    const currentAngle = (pointerAngle - angle + 2 * Math.PI) % (2 * Math.PI);

    return Math.floor(currentAngle / sliceAngle);
  }

  private getSelectedOption(): Item {
    console.log(this.getSelectedIndex());
    return this.options()[this.getSelectedIndex()];
  }
}
