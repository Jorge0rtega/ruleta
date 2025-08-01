import { inject, Injectable } from '@angular/core';
import { ItemDbService } from './itemDB.service';

import * as XLSX from 'xlsx';

@Injectable({ providedIn: 'root' })
export class ExcelService {
  dbService = inject(ItemDbService);

  constructor() {}

  async exportarItemsAExcel() {
    const items = await this.dbService.obtenerItems();

    // Ordenamos manualmente los campos por cada item
    const encabezados = [
      'id',
      'item',
      'descripcion',
      'urlImagen',
      'nombreParticipante',
    ];
    const datosFormateados = items.map((item) => ({
      id: item.id ?? '',
      item: item.item,
      descripcion: item.descripcion,
      urlImagen: item.urlImagen,
      nombreParticipante: item.nombreParticipante,
    }));

    // Creamos la hoja con los encabezados fijos
    const worksheet = XLSX.utils.json_to_sheet(datosFormateados, {
      header: encabezados,
    });

    // Creamos el libro
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Items');

    // Lo convertimos a buffer y preparamos descarga
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const link = document.createElement('a');
    const fecha = new Date().toISOString().slice(0, 10);
    link.href = URL.createObjectURL(blob);
    link.download = `items_${fecha}.xlsx`;
    document.body.appendChild(link);
    link.click();
    console.log('Archivo descargado: items.xlsx');
    document.body.removeChild(link);
  }
}
