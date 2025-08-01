import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  input,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'confetti',
  imports: [],
  templateUrl: './confetti.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfettiComponent {
  private confettiContainer =
    viewChild.required<ElementRef>('confettiContainer');

  ngAfterViewInit() {
    this.throwConfetti();
  }

  throwConfetti() {
    const container = this.confettiContainer();
    console.log(container);
    if (!container) return;

    for (let i = 0; i < 100; i++) {
      const confetti = document.createElement('div');
      confetti.classList.add('confetti');
      const hue = Math.floor(Math.random() * 360);
      confetti.style.setProperty('--hue', hue.toString());
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.animationDelay = Math.random() * 3 + 's';
      confetti.style.animationDuration = 2 + Math.random() * 2 + 's';
      this.confettiContainer().nativeElement.appendChild(confetti);
    }
  }
}
