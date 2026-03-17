import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';

import { PageShellComponent } from '../../shared/page-shell/page-shell.component';
import { AddApiKeyDialogComponent } from './add-api-key-dialog/add-api-key-dialog.component';
import {
  DeleteApiKeyDialogComponent,
  DeleteApiKeyDialogResult,
} from './delete-api-key-dialog/delete-api-key-dialog.component';
import { ApiKeysService } from './data-access/api-keys.service';
import { ApiKey } from './data-access/api-keys.model';

@Component({
  selector: 'app-api-keys-page',
  standalone: true,
  imports: [
    DatePipe,
    PageShellComponent,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatIconModule,
    MatSnackBarModule,
    MatTableModule,
  ],
  templateUrl: './api-keys-page.component.html',
  styleUrl: './api-keys-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApiKeysPageComponent implements OnInit {
  private readonly dialog = inject(MatDialog);
  private readonly apiKeysService = inject(ApiKeysService);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly displayedColumns = ['createdDate', 'usedEmail', 'keyValue', 'actions'];
  protected readonly keys = signal<ApiKey[]>([]);
  protected readonly deletingId = signal<number | null>(null);

  ngOnInit(): void {
    this.apiKeysService.getAll().subscribe({
      next: (keys) => this.keys.set(keys),
      error: () => this.showMessage('Unable to load API keys.'),
    });
  }

  protected openAddDialog(): void {
    this.dialog
      .open(AddApiKeyDialogComponent, {
        width: '640px',
        maxWidth: '92vw',
        autoFocus: false,
      })
      .afterClosed()
      .subscribe((created?: ApiKey) => {
        if (!created) {
          return;
        }

        this.keys.update((items) => [...items, created]);
        this.showMessage('API key added successfully.');
      });
  }

  protected openDeleteDialog(row: ApiKey): void {
    this.dialog
      .open(DeleteApiKeyDialogComponent, {
        width: '500px',
        maxWidth: '92vw',
        autoFocus: false,
      })
      .afterClosed()
      .subscribe((result?: DeleteApiKeyDialogResult) => {
        if (!result) {
          return;
        }

        this.deletingId.set(row.id);

        this.apiKeysService
          .delete(row.id, { cancellationReason: result.cancellationReason })
          .subscribe({
            next: () => {
              this.keys.update((items) => items.filter((item) => item.id !== row.id));
              this.deletingId.set(null);
              this.showMessage('API key deleted successfully.');
            },
            error: () => {
              this.deletingId.set(null);
              this.showMessage('Unable to delete API key.');
            },
          });
      });
  }

  protected trackById(_: number, row: ApiKey): number {
    return row.id;
  }

  private showMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }
}
