import React from 'react';
import { OPSqliteOpenFactory } from '@powersync/op-sqlite';
import { createBaseLogger, LogLevel, PowerSyncDatabase } from '@powersync/react-native';
import { SupabaseConnector } from '@/supabase/SupabaseConnector';
import { AppSchema } from '@/powersync/AppSchema';

const logger = createBaseLogger();
logger.useDefaults();
logger.setLevel(LogLevel.DEBUG);

export class System {
    connector: SupabaseConnector;
    powersync: PowerSyncDatabase;

    constructor() {
        this.connector = new SupabaseConnector(this);
        const opSqlite = new OPSqliteOpenFactory({
            dbFilename: 'opsqlite2.db'
        });

        this.powersync = new PowerSyncDatabase({
            schema: AppSchema,
            database: opSqlite,
        });
    }

    async init() {
        await this.connector.signInAnonymously();

        await this.powersync.init();

        await this.powersync.connect(this.connector);

        const l = this.powersync.registerListener({
            initialized: () => { },
            statusChanged: (status) => {
                console.log('PowerSync status changed:', status);
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


