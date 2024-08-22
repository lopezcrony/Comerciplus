import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { SHARED_IMPORTS } from '../../shared/shared-imports'; // Archivo para las importaciones generales
import { CRUDComponent } from '../../shared/crud/crud.component';
import { CrudModalDirective } from '../../shared/directives/crud-modal.directive';
import { AlertsService } from '../../shared/alerts/alerts.service';

import { Product} from "../products/products.model";
import { ProductsService} from "../products/products.service";
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    ...SHARED_IMPORTS,
    CRUDComponent,
    CrudModalDirective,
    AutoCompleteModule,
    DropdownModule
    ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})


export class ProductsComponent implements OnInit {


  products:Product[]=[];
  filteredProducts:Product[]=[];
  categories: any[] = []; 

  columns:{ field: string, header: string }[] = [
    { field: 'nombreProducto', header: 'Nombre producto' },
    { field: 'imagenProducto', header: 'Imagen' },
    { field: 'idCategoria', header: 'Categoria' },
    { field: 'precioVenta', header: 'Precio venta' },
    { field: 'stock', header: 'Stock' },
    { field: 'estadoProducto', header: 'Estado' }
  ];

  productForm: FormGroup;

  showModal = false;
  isEditing = false;

  //constructor para importar el service y validar campos de formulario
  constructor(
    private productService: ProductsService,
    private fb: FormBuilder,
    private confirmationService: AlertsService,
    private toastr: ToastrService
  ) {
    this.productForm = this.fb.group({
      idProducto: [null],
      idCategoria: ['', Validators.required],
      imagenProducto: [''],
      nombreProducto: ['', Validators.required],
      stock: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      precioVenta: ['', [Validators.required, Validators.pattern('^(|[1-9][0-9]*)(\\.[0-9]+)?$')]],
      estadoProducto: [true],
    });
  }
  

  loadProducts() {
    this.productService.getAllProducts().subscribe(data => {
      this.products = data;
      this.filteredProducts = data;
    });
  }

  //funcion para traer las categorias y luego llenar el select de productos
  loadCategories() {
    this.productService.getAllCategories().subscribe(data => {
      console.log('Categorías recibidas con éxito:', data);
      this.categories = data;
    });
  }

  //funcion inicializadora(todo lo de aqui se inicia de una)
  ngOnInit(){
    this.loadProducts();
    this.loadCategories(); 
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

  //cierra la modal y ya sapo
  closeModal() {
    this.showModal = false;
    this.productForm.reset();
  }

  //funcion para guardar o actualizar una categoria
  saveProduct() {
    if (this.productForm.valid) {
      //categoriadata guarda todo lo del form(informacion)
      const productData = this.productForm.value;
      //si es editing edita y se llama esa funcion si no entonces es crear y llama crear :)
      const request = this.isEditing ?
        this.productService.updateProduct(productData) :
        this.productService.createProduct(productData);
        
      request.subscribe({
        next: () => {
          this.loadProducts();
          this.isEditing? this.toastr.success('Producto actualizado exitosamente.', 'Éxito'):this.toastr.success('Producto creado exitosamente.', 'Éxito');
          this.closeModal();
        },
        error: (error) => { 
          this.toastr.error(error.message, 'Error');
          console.error('Error al guardar el producto:', error);}
      });
    }
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


  confirmDelete(product:Product) {
    this.confirmationService.confirm(
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

}
