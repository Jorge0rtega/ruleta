import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout-admin',
  imports: [RouterOutlet],
  templateUrl: './layoutAdmin.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutAdminComponent {}
