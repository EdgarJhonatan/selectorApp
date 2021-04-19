import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap, tap } from 'rxjs/operators';

import { PaisSmall } from '../../interfaces/paises.interfaces';
import { PaisesService } from '../../services/paises.service';
import { logging } from 'protractor';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [],
})
export class SelectorPageComponent implements OnInit {
  miformulario: FormGroup = this.fb.group({
    region: ['', Validators.required],
    pais: ['', Validators.required],
    frontera: ['', Validators.required],
  });

  //Llenar selectores
  regiones: string[] = [];
  paises: PaisSmall[] = [];
  //  fronteras: string[] = [];
  fronteras: PaisSmall[] = [];

  //UI
  cargando: boolean = false;

  constructor(private fb: FormBuilder, private paisesServices: PaisesService) {}

  ngOnInit(): void {
    this.regiones = this.paisesServices.regiones;
    //cuando cambie la region
    /*this.miformulario.get('region')?.valueChanges.subscribe((region) => {
      console.log(region);

        this.paisesServices.getPaisesProRegion(region).subscribe((paises) => {
          console.log(paises);
          this.paises = paises;
        });
    });
    */

    //cuando cambie la region
    this.miformulario
      .get('region')
      ?.valueChanges.pipe(
        tap((_) => {
          this.miformulario.get('pais')?.reset('');
          this.cargando = true;
        }),
        switchMap((region) => this.paisesServices.getPaisesProRegion(region))
      )
      .subscribe((paises) => {
        this.paises = paises;
        this.cargando = false;
      });

    //cuando cambie el país
    this.miformulario
      .get('pais')
      ?.valueChanges.pipe(
        tap((_) => {
          this.miformulario.get('frontera')?.reset('');
          this.cargando = true;
        }),
        switchMap((codigo) => this.paisesServices.getPaisesPorCodigo(codigo)),
        switchMap((pais) =>
          this.paisesServices.getPaisesPorCodigos(pais?.borders!)
        )
      )
      .subscribe((paises) => {
        //this.fronteras = pais?.borders || [];
        this.fronteras = paises;
        console.log(paises);
        this.cargando = false;
      });
  }

  guardar() {
    console.log(this.miformulario.value);
  }
}
