import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { SHARED_IMPORTS } from '../../shared/shared-imports'; // Archivo para las importaciones generales
import { CRUDComponent } from '../../shared/crud/crud.component';
import { CrudModalDirective } from '../../shared/directives/crud-modal.directive';
import { AlertsService } from '../../shared/alerts/alerts.service';
import { Categorie } from './categories.model';
import { CategoriesService } from './categories.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    ...SHARED_IMPORTS,
    CRUDComponent,
    CrudModalDirective,
    ],
  templateUrl: './categories.component.html',
})

//el implement oninit es el ejecutador de todos los metodos cuando se inicia en esa pagina(modulo)
export class CategoriesComponent implements OnInit{

  //guarda la informacion del modelo en esa variable
  categories:Categorie[]=[];
  //busca relaciones de los registros
  filteredCategories:Categorie[]=[];

  //esta es la info que se muestra en el crud, y los campos (field donde se muestran(llamalos como en el modelo) ) y el (header el nombre del campo)
  columns: { field: string, header: string }[] = [
    { field: 'nombreCategoria', header: 'Nombre' },
    { field: 'descripcionCategoria', header: 'Descripción' },
    { field: 'estadoCategoria', header: 'Estado' }
  ];

  //aqui se define la variable del formulario
  categorieForm: FormGroup;

  showModal = false;
  isEditing = false;

//constructor para importar el service y validar campos de formulario
  constructor(
    //aqui se llama el categoria service y se le asigna a categorieService
    private categorieService: CategoriesService,
    private fb: FormBuilder,
    private confirmationService: AlertsService,
    private toastr: ToastrService
  ) {
    //aqui se llama la variable del form :) el el categorieForm
    this.categorieForm = this.fb.group({
      //estos son los campos que van a ser validados en formulario
      idCategoria: [null],
      nombreCategoria: ['', Validators.required],
      descripcionCategoria:"",
      estadoCategoria: [true]
    });
  }

  loadCategories() {
    this.categorieService.getAllCategories().subscribe(data => {
      this.categories = data;
      this.filteredCategories = data;
    });
  }

  //funcion inicializadora(todo lo de aqui se inicia de una)
  ngOnInit(){
    this.loadCategories();
  }

//esta abre la modal de crear  y diferencia si se esta creando o editando
  openCreateModal() {
    this.isEditing = false;
    this.categorieForm.reset({ estadoCategoria: true });
    this.showModal = true;
  }

  //abre la monda de editar y ya
  openEditModal(categorie: Categorie) {
    this.isEditing = true;
    this.categorieForm.patchValue(categorie);
    this.showModal = true;
  }

  //cierra la modal y ya sapo
  closeModal() {
    this.showModal = false;
    this.categorieForm.reset();
  }



  //funcion para guardar o actualizar una categoria
  saveCategorie() {
    if (this.categorieForm.valid) {
      //categoriadata guarda todo lo del form(informacion)
      const categorieData = this.categorieForm.value;
      //si es editing edita y se llama esa funcion si no entonces es crear y llama crear :)
      const request = this.isEditing ?
        this.categorieService.updateCategorie(categorieData) :
        this.categorieService.createCategorie(categorieData);

      request.subscribe({
        next: () => {
          this.loadCategories();
          this.isEditing? this.toastr.success('Categoria actualizada exitosamente.', 'Éxito'):this.toastr.success('Categoria creada exitosamente.', 'Éxito');
          this.closeModal();
        },
        error: (error) => console.error('Error al guardar la categoria:', error)
      });
    }
  }


  deleteCategorie(id: number) {
    //el suscribe es un tipo de try catch
    this.categorieService.deleteCategorie(id).subscribe({
      next: () => {
        //si es exito carga las categorias 
        this.loadCategories();
        //toastr para que muestre el tipo de alertica que sale en la pantalla
        this.toastr.success('Categoria eliminada exitosamente.', 'Éxito');
      },
      //si es error muestra el error
      error: (error) => {
        console.error('Error al eliminar la categoria:', error);
        if (error.status === 500 || error.error.mensagge.includes('Cannot delete or update a parent row')) {
          this.toastr.error('No se puede eliminar la categoria porque tiene productos asociados.', 'Error');
        } else {
          this.toastr.error('Ocurrió un error al eliminar la categoria.', 'Error');
        }
      }
    });
  }

  confirmDelete(categorie:Categorie) {
    this.confirmationService.confirm(
      `¿Quieres eliminar la categoria: ${categorie.nombreCategoria}?`,
      () => this.deleteCategorie(categorie.idCategoria)
    );
  }

  exportCategorie() { }

  searchCategorie(query: string) {
    const lowerCaseQuery = query.toLowerCase();
  
    // Define el estado que estás buscando. Aquí asumo que buscas "true" en la query.
    const isSearchingForTrue = lowerCaseQuery === 'true';
  
    this.filteredCategories = this.categories.filter(categorie =>
      categorie.nombreCategoria?.toLowerCase().includes(lowerCaseQuery) ||
      categorie.descripcionCategoria?.toLowerCase().includes(lowerCaseQuery) ||
      categorie.estadoCategoria === isSearchingForTrue
    );
  }
  
  


}
