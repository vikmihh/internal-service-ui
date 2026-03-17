import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-page-shell',
  standalone: true,
  templateUrl: './page-shell.component.html',
  styleUrl: './page-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageShellComponent {
  readonly title = input.required<string>();
  readonly subtitle = input<string>('');
  readonly showDivider = input(true);
}
