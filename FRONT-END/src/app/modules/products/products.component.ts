import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { SHARED_IMPORTS } from '../../shared/shared-imports'; // Archivo para las importaciones generales
import { CRUDComponent } from '../../shared/crud/crud.component';
import { CrudModalDirective } from '../../shared/directives/crud-modal.directive';
import { FileUploadModule } from 'primeng/fileupload';
import { AlertsService } from '../../shared/alerts/alerts.service';

import { Product } from "../products/products.model";
import { ProductsService } from "../products/products.service";
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DropdownModule } from 'primeng/dropdown';
import { ValidationService } from '../../shared/validators/validations.service';
import { CategoriesService } from '../categories/categories.service';
import { Categorie } from '../categories/categories.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    ...SHARED_IMPORTS,
    CRUDComponent,
    CrudModalDirective,
    AutoCompleteModule,
    DropdownModule,
    FileUploadModule
  ],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})


export class ProductsComponent implements OnInit {


  products: Product[] = [];
  barcodes: any[] = [];
  filteredProducts: Product[] = [];
  categories: Categorie[] = [];

  columns: { field: string, header: string }[] = [
    { field: 'nombreProducto', header: 'Producto' },
    { field: 'imagenProducto', header: 'Imágen' },
    { field: 'nombreCategoria', header: 'Categoría' },
    { field: 'precioVenta', header: 'Precio venta' },
    { field: 'stock', header: 'Stock' }
  ];

  productForm: FormGroup;
  categorieForm: FormGroup;
  selectedFile: File | null = null;
  showModal = false;
  viewModal = false;
  isEditing = false;
  baseUrl = 'http://localhost:3006/uploads';

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
      //validar categoría
      idCategoria: [null],
      nombreCategoria: ['', this.validationService.getValidatorsForField('categories', 'nombreCategoria')],
      descripcionCategoria: ['', this.validationService.getValidatorsForField('categories', 'descripcionCategoria')],
      estadoCategoria: [true]
    });
  }

  categoryModalVisible: boolean = false;
  newCategory = { name: '', description: '' };
  selectedProduct: Product | undefined;
  selectedCategory: Categorie | undefined;


  showCategoryModal() {
    this.categoryModalVisible = true;
  }

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
        this.loadCategories();
      },
      error: (error) => {
        this.toastr.error(error.message, 'Error');
      }
    });

  }

  loadProducts() {
    this.productService.getAllProducts().subscribe(data => {
      this.products = data.map(product => {
        const category = this.categories.find(c => c.idCategoria === product.idCategoria)!;
        return { ...product, nombreCategoria: category.nombreCategoria };
      });
      this.filteredProducts = this.products;
    });
}


  //funcion para traer las categorias y luego llenar el select de productos
  loadCategories() {
    this.categorieService.getAllCategories().subscribe(data => {
      this.categories = data.filter(category => category.estadoCategoria === true);
    });
  }

  getCategoryName(id: any): string {
    const category = this.categories.find(cat => cat.idCategoria === id);
    return category ? category.nombreCategoria : 'Desconocida';
}


  //funcion inicializadora(todo lo de aqui se inicia de una)
  ngOnInit() {
    this.loadCategories();
    this.loadProducts();
  }


  //esta abre la modal de crear  y diferencia si se esta creando o editando
  openCreateModal() {
    this.isEditing = false;
    this.productForm.reset({ estadoProducto: true });
    this.showModal = true;
  }


  //abre la monda de editar y ya
  openEditModal(product: Product) {
    this.isEditing = true;
    this.productForm.patchValue(product);
    this.showModal = true;
  }

  openShowModal(product: Product) {
    // Asigna el producto seleccionado a una variable para usar en la vista
    this.selectedProduct = product;
    // Muestra la modal
    this.viewModal = true;


    this.productService.getBarcodeByProduct(product.idProducto).subscribe({
      next: (data) => {
        this.barcodes = data;
      },
      error: (err) => {
        this.toastr.error('Error al cargar los códigos de barra.');
      }
    });
  }

  //cierra la modal y ya sapo
  closeModal() {
    this.showModal = false;
    this.productForm.reset();
  }

  cancelModalMessage() {
    this.alertsService.menssageCancel()
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return !!(field?.invalid && (field.touched || field.dirty));
  }

  getErrorMessage(fieldName: string): string {
    const control = this.productForm.get(fieldName);
    if (control?.errors) {
      const errorKey = Object.keys(control.errors)[0];
      return this.validationService.getErrorMessage('products', fieldName, errorKey);
    }
    return '';
  }

  private markFormFieldsAsTouched() {
    Object.values(this.productForm.controls).forEach(control => control.markAsTouched());
  }

  //funcion para guardar o actualizar una categoria
  saveProduct() {
    // Si es edición, deshabilita los campos que no deben ser modificados.
    if (this.isEditing) {
      this.productForm.get('stock')?.disable();         // Deshabilita 'stock'
      this.productForm.get('idCategoria')?.disable();   // Deshabilita 'idCategoria'
      this.productForm.get('nombreCategoria')?.disable(); // Deshabilita 'nombreCategoria'
    } else {
      // Si es creación, establece el valor por defecto de 'stock' a 0
      this.productForm.patchValue({
        stock: 0
      });
    }
  
    // Válida el formulario antes de enviarlo
    if (this.productForm.invalid) {
      this.markFormFieldsAsTouched();
      return;
    }
  
    // Obtener los valores del formulario, incluyendo los deshabilitados
    const productData = this.productForm.getRawValue();
  
    // Ejecuta la acción correspondiente (crear o actualizar)
    const request = this.isEditing
      ? this.productService.updateProduct(productData)
      : this.productService.createProduct(productData);
  
    // Manejo de la respuesta
    request.subscribe({
      next: () => {
        this.loadProducts();
        this.isEditing
          ? this.toastr.success('Producto actualizado exitosamente.', 'Éxito')
          : this.toastr.success('Producto creado exitosamente.', 'Éxito');
        this.closeModal();
      },
      error: (error) => {
        this.toastr.error(error.message, 'Error');
        console.error('Error al guardar el producto:', error);
      }
    });
  }
  

  deleteProduct(id: number) {
    //el suscribe es un tipo de try catch
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        //si es exito carga las categorias 
        this.loadProducts();
        //toastr para que muestre el tipo de alertica que sale en la pantalla
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

    // Intenta convertir la consulta a un número
    let numericQuery = parseFloat(query);

    this.filteredProducts = this.products.filter(product => {
      let nombreProductoMatch = product.nombreProducto?.toLowerCase().includes(lowerCaseQuery);

      // Comparación numérica para el stock
      let stockMatch = !isNaN(numericQuery) && product.stock != null && Number(product.stock) === numericQuery;

      // Retorna verdadero si hay coincidencia en nombreProducto o stock
      return nombreProductoMatch || stockMatch;
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


  // funciones para la carga de imagenes en productos


  getImageUrl(productId?: number): string {
    if (productId === undefined) {
      return ''; // Retorna una URL vacía o una imagen por defecto
    }
    return `http://localhost:3006/uploads/productos/${productId}`;
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
