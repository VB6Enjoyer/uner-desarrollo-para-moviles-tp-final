import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
// import Papa from 'papaparse';
//import { EstadosActividadEnum } from '../enums/estados.enum';

export const handleError = (error: HttpErrorResponse) => {
  const { error: err } = error
  let errorMessage = 'Unknown error!';
  if (err.statusCode === 0) {
    errorMessage = `An error occurred: ${err.message}`;
  } else {
    errorMessage =
      `Backend returned code ${err.statusCode}, ` + `body was: ${err.message}`;
  }
  return throwError(errorMessage);
};


// ! Comentado, de lo contrario tira errores varios.
/* export const ExportCsv = (object: any, fileName: string): void => {
  let csvData = Papa.unparse(object, {
    header: true,
    delimiter: ';',
  });

  const blob = new Blob([csvData], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileName}.csv`;
  a.click();
}

export const transformarFecha = (fechaISO: string) => {
  const date = new Date(fechaISO);

  const dia = String(date.getUTCDate()).padStart(2, '0');
  const mes = String(date.getUTCMonth() + 1).padStart(2, '0'); // Los meses empiezan desde 0
  const año = date.getUTCFullYear();

  return `${dia}/${mes}/${año}`;
}


export const EstadosString = (): String[] => {
  let estados: String[] = []
  for (let key in EstadosActividadEnum) {
    let estado = EstadosActividadEnum[key as keyof typeof EstadosActividadEnum]
    estados.push(estado.toLocaleLowerCase())
  }

  return estados
} */