import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { ConfettiComponent } from './confetti/confetti.component';

@Component({
  selector: 'app-item',
  imports: [ConfettiComponent],
  templateUrl: './item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemComponent {
  itemName = input.required<string>();
  itemDescription = input.required<string>();
  itemImage = input.required<string>();
  showItemDetails = input.required<boolean>();
  showItemDetailsChange = output<boolean>();

  formattedDescription = computed(() => {
    const desc = this.itemDescription();
    return desc.trim().substring(0, 30) + '...'; // ejemplo de formato
  });

  close() {
    console.log('Item closed');
    this.showItemDetailsChange.emit(false);
  }
}
