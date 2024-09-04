// Import necessary Angular and third-party modules
import {
  AfterViewInit,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Item } from '../../../../utils/type';
import { CommonModule } from '@angular/common';

// Angular Material UI
import { MatIconModule } from '@angular/material/icon';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

// Snackbar configuration
const snackbarConfig: MatSnackBarConfig = {
  duration: 3000,
  panelClass: ['custom-snackbar'], // Custom class
};

@Component({
  selector: 'app-item-table',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatTableModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  templateUrl: './item-table.component.html',
  styleUrls: ['./item-table.component.css'],
})
export class ItemTableComponent implements AfterViewInit {
  @Input() items: Item[] = [];
  @Input() isLoading = false;
  @Input() pageIndex = 0; // Use 0-based index
  @Input() pageSize = 5;
  @Input() totalPages = 0;
  @Output() edit = new EventEmitter<Item>();
  @Output() delete = new EventEmitter<number>();
  @Output() add = new EventEmitter<void>();
  @Output() page = new EventEmitter<PageEvent>();
  @Output() search = new EventEmitter<{ [key: string]: any }>();
  @Output() sort = new EventEmitter<Sort>();

  filterQuery = '';
  sortField = 'price';
  sortOrder: 'asc' | 'desc' = 'desc';
  dataSource = new MatTableDataSource<Item>([]);
  displayedColumns: string[] = [
    'position',
    'category',
    'type',
    'name',
    'price',
    'actions',
  ];
  filteredColumns: string[] = ['name', 'type', 'price', 'category'];

  private snackBar = inject(MatSnackBar);

  @ViewChild(MatSort) matSort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(): void {
    this.dataSource.sort = this.matSort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items']) {
      this.dataSource.data = this.items;
    }
    if (this.paginator) {
      this.paginator.pageIndex = this.pageIndex;
      this.paginator.pageSize = this.pageSize;
      this.paginator.length = this.totalPages;
    }
  }

  onAdd(): void {
    this.add.emit();
  }

  onEdit(item: Item): void {
    this.edit.emit(item);
  }

  onDelete(id: number): void {
    this.delete.emit(id);
  }

  onSortField(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.sortField = selectElement.value;
    this.emitSort();
  }

  onSortOrder(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.sortOrder = selectElement.value as 'asc' | 'desc';
    this.emitSort();
  }

  emitSort(): void {
    this.sort.emit({
      active: this.sortField,
      direction: this.sortOrder,
    });
  }

  onSearch(): void {
    try {
      const searchParams = JSON.parse(this.filterQuery);
      this.search.emit(searchParams);
    } catch (error) {
      console.error('Invalid JSON format for search', error);
      this.snackBar.open(
        'Invalid JSON format. Please correct the input and try again.',
        'Close',
        snackbarConfig
      );
    }
  }

  handlePageChange(event: PageEvent): void {
    this.page.emit(event);
  }
}
