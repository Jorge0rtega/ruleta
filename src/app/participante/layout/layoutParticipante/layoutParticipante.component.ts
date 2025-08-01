import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout-participante',
  imports: [RouterOutlet],
  templateUrl: './layoutParticipante.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LayoutParticipanteComponent {}
