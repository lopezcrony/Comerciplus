import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';

import { SHARED_IMPORTS } from '../../shared/shared-imports';
import { CRUDComponent } from '../../shared/crud/crud.component';
import { CrudModalDirective } from '../../shared/directives/crud-modal.directive';
import { AlertsService } from '../../shared/alerts/alerts.service';
import { ValidationService } from '../../shared/validators/validations.service';

import { Product } from "../products/products.model";
import { ProductsService } from "../products/products.service";
import { CategoriesService } from '../categories/categories.service';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { MessageModule } from 'primeng/message';
import { ChipModule } from 'primeng/chip';
import { InplaceModule } from 'primeng/inplace';
import { TagModule } from 'primeng/tag';
import { Categorie } from '../categories/categories.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    ...SHARED_IMPORTS,
    CRUDComponent,
    CrudModalDirective,
    DialogModule,
    InputTextModule,
    DropdownModule,
    ButtonModule,
    FileUploadModule,
    MessageModule,
    ChipModule,
    InplaceModule,
    TagModule
  ],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})


export class ProductsComponent implements OnInit {

  products: Product[] = [];
  barcodes: any[] = [];
  filteredProducts: Product[] = [];
  categories: any[] = [];
  filteredCategories: any[] = [];

  columns: { field: string, header: string, type: string }[] = [
    { field: 'nombreProducto', header: 'Producto', type: 'text' },
    { field: 'imagenProducto', header: 'Imágen', type: 'image' },
    { field: 'nombreCategoria', header: 'Categoría', type: 'text' },
    { field: 'precioVenta', header: 'Precio venta', type: 'currency' },
    { field: 'stock', header: 'Stock', type: 'text' },
  ];

  productForm: FormGroup;
  categorieForm: FormGroup;

  showModal: boolean = false;
  viewModal: boolean = false;
  isEditing: boolean = false;
  categoryModalVisible: boolean = false;

  selectedFile: File | null = null;
  selectedProduct!: any;

  baseUrl = 'http://localhost:3006/uploads';

  newCategory = { name: '', description: '' };

  //constructor para importar el service y validar campos de formulario
  constructor(
    private productService: ProductsService,
    private categorieService: CategoriesService,
    private fb: FormBuilder,
    private alertsService: AlertsService,
    private toastr: ToastrService,
    private validationService: ValidationService,
  ) {
    this.productForm = this.fb.group({
      idProducto: [null],
      idCategoria: ['', this.validationService.getValidatorsForField('products', 'idCategoria')],
      imagenProducto: [''],
      nombreProducto: ['', this.validationService.getValidatorsForField('products', 'nombreProducto')],
      stock: ['', this.validationService.getValidatorsForField('products', 'stock')],
      precioVenta: ['', this.validationService.getValidatorsForField('products', 'precioVenta')],
      estadoProducto: [true],
    });

    this.categorieForm = this.fb.group({
      idCategoria: [null],
      nombreCategoria: ['', this.validationService.getValidatorsForField('categories', 'nombreCategoria')],
      descripcionCategoria: ['', this.validationService.getValidatorsForField('categories', 'descripcionCategoria')],
      estadoCategoria: [true]
    });
  }

  loadData() {
    forkJoin({
      categories: this.categorieService.getAllCategories(),
      products: this.productService.getAllProducts()
    }).subscribe({
      next: ({ categories, products }) => {
        this.categories = categories;
        this.filteredCategories = categories.filter(category => category.estadoCategoria === true);
        this.products = products.map(product => {
          const category = this.categories.find(c => c.idCategoria === product.idCategoria)!;
          return { ...product, nombreCategoria: category?.nombreCategoria };
        });
        this.filteredProducts = this.products;
      },
      error: (error) => {
        this.toastr.error('Error al cargar los datos.', 'Error');
        console.error('Error al cargar los datos:', error);
      }
    });
  }

  //funcion inicializadora(todo lo de aqui se inicia de una)
  ngOnInit() {
    this.loadData();
  }

  openCreateModal() {
    this.isEditing = false;
    this.productForm.reset({ estadoProducto: true });
    this.showModal = true;
  };

  openEditModal(product: Product) {
    this.isEditing = true;
    this.productForm.patchValue(product);
    this.showModal = true;
  };

  openCategoryModal() {
    this.categoryModalVisible = true;
  };

  openShowModal(product: Product) {
    this.selectedProduct = product;
    this.viewModal = true;

    this.productService.getBarcodeByProduct(product.idProducto).subscribe({
      next: (data) => {
        this.barcodes = data;
      },
      error: (err) => {
        this.toastr.error('Error al cargar los códigos de barra.');
      }
    });
  };

  getNameCategory(id: number) {
    const category = this.categories.find(c => c.idCategoria === id);
    return category?.nombreCategoria;
  }

  //cierra la modal y ya sapo
  closeModal() {
    this.showModal = false;
    this.productForm.reset();
  }

  cancelModalMessage() {
    this.alertsService.menssageCancel()
  };

  isFieldInvalid(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return !!(field?.invalid && (field.touched || field.dirty));
  };

  getErrorMessage(fieldName: string): string {
    const control = this.productForm.get(fieldName);
    if (control?.errors) {
      const errorKey = Object.keys(control.errors)[0];
      return this.validationService.getErrorMessage('products', fieldName, errorKey);
    }
    return '';
  };
  
  private markFormFieldsAsTouched() {
    Object.values(this.productForm.controls).forEach(control => control.markAsTouched());
  };

  saveCategory() {
    if (this.categorieForm.invalid) {
      this.markFormFieldsAsTouched();
      return;
    }
    const categoriaData = this.categorieForm.value;
    const request = this.categorieService.createCategorie(categoriaData);

    request.subscribe({
      next: () => {
        this.toastr.success('Categoría creada exitosamente.', 'Éxito');
        this.categoryModalVisible = false;
        this.loadDataAll();
      },
      error: (error) => {
        this.toastr.error(`Ya existe una categoria con ese nombre`,'Error');
      }
    });
  };

  saveProduct() {
    // Si es edición, deshabilita los campos que no deben ser modificados.
    if (this.isEditing) {
      this.productForm.get('stock')?.disable();         
      this.productForm.get('idCategoria')?.disable();   
      this.productForm.get('nombreCategoria')?.disable(); 
    } else {
      this.productForm.patchValue({
        stock: 0
      });
    }
  
    // Válida el formulario antes de enviarlo
    if (this.productForm.invalid) { return this.markFormFieldsAsTouched(); }
  
    // Obtener los valores del formulario, incluyendo los deshabilitados
    const productData = this.productForm.getRawValue();
  
    // Ejecuta la acción correspondiente (crear o actualizar)
    const request = this.isEditing
      ? this.productService.updateProduct(productData)
      : this.productService.createProduct(productData);
  
    // Manejo de la respuesta
    request.subscribe({
      next: () => {
        this.isEditing
          ? this.toastr.success('Producto actualizado exitosamente.', 'Éxito')
          : this.toastr.success('Producto creado exitosamente.', 'Éxito');
        this.loadData();
        this.closeModal();
      },
      error: (error) => {
        this.toastr.error(`Ya existe un producto con este nombre`,'Error');
      }
    });
  }
  

  deleteProduct(id: number) {
    //el suscribe es un tipo de try catch
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.loadData();
        this.toastr.success('Producto eliminado exitosamente.', 'Éxito');
      },
      //si es error muestra el error
      error: (error) => {
        console.error('Error al eliminar el producto:', error);
        if (error.status === 500) {
          this.toastr.error('No se puede eliminar el producto porque tiene una compra asociada.', 'Error');
        } else {
          this.toastr.error('Ocurrió un error al eliminar el producto.', 'Error');
        }
      }
    });
  }

  confirmDelete(product: Product) {
    this.alertsService.confirm(
      `¿Quieres eliminar el producto: ${product.nombreProducto}?`,
      () => this.deleteProduct(product.idProducto)
    );
  }

  exportProduct() { }

  searchProduct(query: string) {
    let lowerCaseQuery = query.toLowerCase();
    let lowerQuery = query.toLowerCase();
    // Intenta convertir la consulta a un número
    let numericQuery = parseFloat(query);

    this.filteredProducts = this.products.filter(product => {
      let nombreProductoMatch = product.nombreProducto?.toLowerCase().includes(lowerCaseQuery);
      const categoriaproduct= product as Product & { nombreCategoria?: string };

      // Comparación numérica para el stock
      let stockMatch = !isNaN(numericQuery) && product.stock != null && Number(product.stock) === numericQuery;
      // Retorna verdadero si hay coincidencia en nombreProducto o stock
      const matchcategoriaproduct = (categoriaproduct.nombreCategoria || '').toLowerCase().includes(lowerQuery);
      return nombreProductoMatch || stockMatch || matchcategoriaproduct;

    });
  }

  changeProductStatus(updatedProduct: Product) {
    const estadoProducto = updatedProduct.estadoProducto ?? false;

    this.productService.updateStatusProduct(updatedProduct.idProducto, estadoProducto).subscribe({
      next: () => {
        [this.products, this.filteredProducts].forEach(list => {
          const index = list.findIndex(c => c.idProducto === updatedProduct.idProducto);
          if (index !== -1) {
            list[index] = { ...list[index], ...updatedProduct };
          }
        });
        this.toastr.success('Estado actualizado con éxito', 'Éxito');
      },
      error: () => {
        this.toastr.error('Error al actualizar el estado', 'Error');
      }
    });
  }

loadDataAll() {
    forkJoin({
      categories: this.categorieService.getAllCategories(),
      products: this.productService.getAllProducts()
    }).subscribe({
      next: ({ categories, products }) => {
        this.categories = categories.filter(category => category);
        this.products = products.map(product => {
          const category = this.categories.find(c => c.idCategoria === product.idCategoria)!;
          return { ...product, nombreCategoria: category?.nombreCategoria };
        });
        this.filteredProducts = this.products;
      },
      error: (error) => {
        this.toastr.error('Error al cargar los datos.', 'Error');
        console.error('Error al cargar los datos:', error);
      }
    });
  }


  // funciones para la carga de imagenes en productos

  getImageUrl(id: number) {
    return this.productService.getImageUrl(id);
  }

  onFileSelect(event: any) {
    const file: File = event.files[0];
    if (file) {
      this.selectedFile = file;
      this.uploadImage();
    }
  }

  uploadImage() {
    if (this.selectedFile) {
      this.productService.uploadImage(this.selectedFile).subscribe({
        next: (response) => {
          // Guarda el nombre de la imagen en el formulario
          this.productForm.patchValue({ imagenProducto: response.nombre });
        },
        error: (error) => {
          this.toastr.error(error.message, 'Error');
        }
      });
    }
  }

}
