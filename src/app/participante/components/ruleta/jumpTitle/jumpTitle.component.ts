import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'jump-title',
  imports: [],
  templateUrl: './jumpTitle.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./jumpTitle.component.css'],
})
export class JumpTitleComponent {
  title = input.required<string>();
}
