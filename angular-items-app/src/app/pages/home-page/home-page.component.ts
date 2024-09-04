// Import necessary Angular and third-party modules
import { Subject } from 'rxjs';
import { Item, Items } from '../../utils/type';
import { ItemService } from '../../services/item.service';
import { Component, inject, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

// Angular Material UI
import { Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ItemFormComponent } from './components/item-form/item-form.component';
import { ItemTableComponent } from './components/item-table/item-table.component';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarModule,
} from '@angular/material/snack-bar';

// Snackbar configuration
const snackbarConfig: MatSnackBarConfig = {
  duration: 3000,
  panelClass: ['custom-snackbar'], // Custom class
};

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [MatSnackBarModule, ItemTableComponent],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements OnInit {
  dataSource: Item[] = [];
  isLoading = false;
  pageIndex = 0;
  pageSize = 10;
  totalPages = 0;
  filterQuery: string = '{}';
  sort: Sort = { active: 'price', direction: 'desc' };

  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private itemService = inject(ItemService);
  private searchSubject = new Subject<{ [key: string]: any }>();
  private readonly API_URL = 'http://localhost:3000/api/items'; // Marked as readonly

  ngOnInit(): void {
    this.loadItems();

    // Debounce search logic
    this.searchSubject
      .pipe(debounceTime(1500), distinctUntilChanged())
      .subscribe((filters) => {
        this.pageIndex = 0;
        this.loadItems(filters);
      });
  }

  loadItems(filters?: { [key: string]: any }): void {
    this.isLoading = true;
    this.itemService
      .getItems(this.API_URL, {
        pageIndex: this.pageIndex + 1, // API uses 1-based index
        pageSize: this.pageSize,
        filter: JSON.stringify(filters || this.parseFilterQuery()),
        sortField: this.sort.active,
        sortOrder: this.sort.direction,
      })
      .pipe(
        map((items: Items) => ({
          ...items,
          data: items.data.map((item, index) => ({
            ...item,
            position: index + 1 + this.pageIndex * this.pageSize,
          })),
        }))
      )
      .subscribe({
        next: (items: Items) => {
          this.dataSource = items.data;
          this.totalPages = items.dataLength;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Failed to load items', error);
          this.isLoading = false;
        },
      });
  }

  parseFilterQuery(): { [key: string]: any } {
    try {
      const parsedQuery = JSON.parse(this.filterQuery);
      if (typeof parsedQuery === 'object' && parsedQuery !== null) {
        return parsedQuery;
      } else {
        console.error('Parsed JSON is not an object:', parsedQuery);
        return {};
      }
    } catch (error) {
      console.error('Invalid JSON format for search', error);
      return {}; // Fallback to empty filter if JSON is invalid
    }
  }

  handlePageEvent(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadItems();
  }

  handleSearch(event: { [key: string]: any }): void {
    this.searchSubject.next(event);
  }

  handleSort(sort: Sort): void {
    this.sort = sort;
    this.loadItems();
  }

  openDialog(item?: Item): void {
    const dialogRef = this.dialog.open(ItemFormComponent, {
      width: '450px',
      data: item || {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.isLoading = true;
        const action = result.id
          ? this.itemService.updateItem(this.API_URL, result.id, result)
          : this.itemService.createItem(this.API_URL, result);

        action.subscribe({
          next: () => {
            this.loadItems();
          },
          error: (error) => {
            console.error(`${result.id ? 'Update' : 'Creation'} failed`, error);
            this.isLoading = false;
            this.snackBar.open(
              `${result.id ? 'Update' : 'Creation'} failed. Please try again.`,
              'Close',
              snackbarConfig
            );
          },
        });
      }
    });
  }

  deleteItem(id: number): void {
    this.isLoading = true;
    this.itemService.deleteItem(this.API_URL, id).subscribe({
      next: () => {
        this.loadItems();
      },
      error: (error) => {
        console.error('Deletion failed', error);
        this.isLoading = false;
        this.snackBar.open(
          'Deletion failed. Please try again.',
          'Close',
          snackbarConfig
        );
      },
    });
  }
}
