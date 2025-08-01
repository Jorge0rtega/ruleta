// src/app/services/item-db.service.ts
import { Injectable } from '@angular/core';
import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Item } from '../interfaces/item.interface';

interface MiDB extends DBSchema {
  items: {
    key: number;
    value: Item;
  };
}

@Injectable({ providedIn: 'root' })
export class ItemDbService {
  private dbPromise: Promise<IDBPDatabase<MiDB>>;

  constructor() {
    this.dbPromise = openDB<MiDB>('MiBaseLocal', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('items')) {
          db.createObjectStore('items', {
            keyPath: 'id',
            autoIncrement: true,
          });
        }
      },
    });
  }

  async agregarItem(item: Item) {
    const db = await this.dbPromise;
    return db.add('items', item);
  }

  async obtenerItems(): Promise<Item[]> {
    const db = await this.dbPromise;
    return db.getAll('items');
  }

  async obtenerItemsSinNombreParticipante(): Promise<Item[]> {
    const db = await this.dbPromise;
    const items = await db.getAll('items');
    return items.filter((item) => !item.nombreParticipante);
  }

  async borrarItem(id: number) {
    const db = await this.dbPromise;
    return db.delete('items', id);
  }
  async borrarTodosItems() {
    const db = await this.dbPromise;
    return db.clear('items');
  }

  async actualizarItem(item: Item) {
    const db = await this.dbPromise;
    return db.put('items', item);
  }
}
