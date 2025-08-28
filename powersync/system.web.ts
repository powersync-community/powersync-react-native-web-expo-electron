import '@azure/core-asynciterator-polyfill';

import React from 'react';
import { PowerSyncDatabase as PowerSyncDatabaseNative } from '@powersync/react-native';
import { PowerSyncDatabase as PowerSyncDatabaseWeb, WASQLiteOpenFactory } from '@powersync/web';
import { AbstractPowerSyncDatabase, createBaseLogger, LogLevel } from '@powersync/common';
import { SupabaseConnector } from '../supabase/SupabaseConnector.web';
import { AppSchema } from './AppSchema';

const logger = createBaseLogger();
logger.useDefaults();
logger.setLevel(LogLevel.DEBUG);

export class System {
  connector: SupabaseConnector;
  powersync: AbstractPowerSyncDatabase;

  constructor() {
    this.connector = new SupabaseConnector();
    if (PowerSyncDatabaseNative) {
      this.powersync = new PowerSyncDatabaseNative({
        schema: AppSchema,
        database: {
          dbFilename: 'sqlite.db'
        }
      });
    } else {
      const factory = new WASQLiteOpenFactory({
        dbFilename: 'sqlite.db',

        // You can specify a path to the db worker
        worker: '/@powersync/worker/WASQLiteDB.umd.js'

        // Or provide a factory function to create the worker.
        // The worker name should be unique for the database filename to avoid conflicts if multiple clients with different databases are present.
        // worker: (options) => {
        //   if (options?.flags?.enableMultiTabs) {
        //     return new SharedWorker(`/@powersync/worker/WASQLiteDB.umd.js`, {
        //       name: `shared-DB-worker-${options?.dbFilename}`
        //     });
        //   } else {
        //     return new Worker(`/@powersync/worker/WASQLiteDB.umd.js`, {
        //       name: `DB-worker-${options?.dbFilename}`
        //     });
        //   }
        // }
      });
      this.powersync = new PowerSyncDatabaseWeb({
        schema: AppSchema,
        database: factory,
        sync: {
          // You can specify a path to the sync worker
          worker: '/@powersync/worker/SharedSyncImplementation.umd.js'

          // Or provide a factory function to create the worker.
          // The worker name should be unique for the database filename to avoid conflicts if multiple clients with different databases are present.
          // worker: (options) => {
          //   return new SharedWorker(`/@powersync/worker/SharedSyncImplementation.umd.js`, {
          //     name: `shared-sync-${options?.dbFilename}`
          //   });
          // }
        }
      });
    }
  }

  async init() {
    console.log('init')
    await this.connector.signInAnonymously();
    await this.powersync.init();
    await this.powersync.connect(this.connector);

    const l = this.powersync.registerListener({
        statusChanged: (status) => {
            console.log('PowerSync status changed:', status);

            // if (status!.downloadProgress?.downloadedFraction == 1 && status!.dataFlowStatus!.downloading) {
            //     console.log("Something weird is happening!", JSON.stringify(status, null, 2));
            // }
        }
    });
  }

  async disconnect() {
    await this.powersync.disconnect();
  }
}

export const system = new System();

export const SystemContext = React.createContext(system);
export const useSystem = () => React.useContext(SystemContext);
