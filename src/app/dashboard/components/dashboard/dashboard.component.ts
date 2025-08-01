import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import * as XLSX from 'xlsx';
import { ItemDbService } from '../../../shared/services/itemDB.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  data: any[] = [];
  bdService = inject(ItemDbService);

  onFileSelected(event: Event) {
    this.bdService.borrarTodosItems();
    const file = (event.target as HTMLInputElement).files?.[0];
    console.log('Archivo seleccionado:', file);
    if (file) {
      const reader: FileReader = new FileReader();

      reader.onload = (e: any) => {
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];

        const rawData = XLSX.utils.sheet_to_json<any[]>(ws, { header: 1 });
        const [headers, ...rows] = rawData;

        this.data = rows.map((row) =>
          headers.reduce((acc, header, index) => {
            acc[header] = row[index];
            return acc;
          }, {} as Record<string, any>)
        );

        console.log('Datos parseados:', this.data);

        // Guardar cada item en la BD
        this.data.forEach((item) => {
          this.bdService.agregarItem(item).then(() => {
            console.log('Item guardado:', item);
          });
        });
      };

      reader.readAsBinaryString(file);
    }
  }
}
