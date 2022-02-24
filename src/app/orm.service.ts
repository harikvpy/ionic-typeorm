import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import {
  createConnection,
  ConnectionOptions,
  getConnection,
  Connection,
} from 'typeorm';
import { Contact } from '../entities/contact';
import { ChatSession } from 'src/entities/chat-session';
import { User } from 'src/entities/user';

@Injectable({
  providedIn: 'root',
})
export class OrmService {
  constructor(private platform: Platform) {}

  async ready() {
    try {

      await getConnection();

    } catch (ex) {

      console.log('Connection not established, creating connection', ex);

      await this.createConnection();
      console.log('Connection created!');
    }
  }

  private createConnection(): Promise<Connection> {
    let dbOptions: ConnectionOptions;

    if (this.platform.is('cordova')) {

      dbOptions = {
        type: 'cordova',
        database: '__crmdb',
        location: 'default'
      };
    } else {

      dbOptions = {
        type: 'sqljs',
        location: 'browser',
        autoSave: true
      };
    }

    Object.assign(dbOptions, {
      logging: ['error', 'query', 'schema'],
      synchronize: true,
      entities: [
        Contact,
        ChatSession,
        User,
        ChatSession
      ]
    });

    return createConnection(dbOptions);
  }

}
