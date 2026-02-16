import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product } from '../../services/product';
import { Modal } from '../../shared/modal/modal/modal';

@Component({
  selector: 'app-products',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, Modal],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(Product);
  private platformId = inject(PLATFORM_ID);
  private cd = inject(ChangeDetectorRef);

  showDeleteModal = false;
  products: any[] = [];
  total = 0;
  page = 1;
  limit = 5;

  editingId: string | null = null;
  selectedId: string | null = null;

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    price: [0, Validators.required],
    category: ['Electronics'],
    status: ['Active'],
    tags: [[] as string[], Validators.required],
  });

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadProducts();
    }
  }

  loadProducts() {
    this.productService.getProducts(this.page, this.limit)
      .subscribe(res => {
        this.products = res.data;
        this.total = res.total;
        console.log('Loaded products:', this.products);
        this.cd.detectChanges();
      });
  }

  save() {
    if (this.form.invalid) return;

    if (this.editingId) {
      this.productService.updateProduct(this.editingId, this.form.value)
        .subscribe(() => {
          this.editingId = null;
          this.form.reset({ status: 'Active', category: 'Electronics', tags: [] });
          this.loadProducts();
        });
    } else {
      this.productService.createProduct(this.form.value)
        .subscribe(() => {
          this.form.reset({ status: 'Active', category: 'Electronics', tags: [] });
          this.loadProducts();
        });
    }
  }

  edit(product: any) {
    this.editingId = product._id;
    console.log('Editing product:', product);
    this.form.patchValue(product);
  }

  delete(id: string) {
    // if (!confirm('Delete this product?')) return;

    // this.productService.deleteProduct(id)
    //   .subscribe(() => this.loadProducts());

    this.selectedId = id;
    this.showDeleteModal = true;
   
  }

  deleteConfirmed() {
    if (!this.selectedId) return;

    this.productService.deleteProduct(this.selectedId)
      .subscribe(() => {
        this.loadProducts();
        this.showDeleteModal = false;
      });
  }

  changePage(p: number) {
    this.page = p;
    this.loadProducts();
  }

  toggleTag(tag: string, event: any) {
    console.log('Toggling tag:', tag, event.target.checked);
    let currentTags = this.form.value.tags || [];

    if (event.target.checked) {
      currentTags.push(tag);
    } else {
      const index = currentTags.indexOf(tag);
      if (index > -1) currentTags.splice(index, 1);
    }
    console.log('Current tags after toggle:', currentTags);
    this.form.patchValue({ tags: currentTags });
  }
}
