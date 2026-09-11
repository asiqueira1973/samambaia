import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'samambaia.db';

/**
 * Cada migração é aplicada uma única vez e o índice fica gravado em
 * `PRAGMA user_version`. Para mudar o schema, acrescente uma função no fim
 * do array — nunca edite ou remova as que já foram lançadas.
 */
const MIGRATIONS: ((db: SQLite.SQLiteDatabase) => Promise<void>)[] = [
  async (db) => {
    await db.execAsync(`
      CREATE TABLE plants (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        photo_uri TEXT,
        frequency_days INTEGER NOT NULL,
        last_watered_at TEXT,
        next_watering_at TEXT NOT NULL,
        created_at TEXT NOT NULL
      );
      CREATE INDEX plants_by_next_watering ON plants (next_watering_at);
    `);
  },
];

let connection: Promise<SQLite.SQLiteDatabase> | null = null;

async function connect(): Promise<SQLite.SQLiteDatabase> {
  const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
  await db.execAsync('PRAGMA journal_mode = WAL;');

  const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  let version = row?.user_version ?? 0;

  while (version < MIGRATIONS.length) {
    await MIGRATIONS[version](db);
    version += 1;
    // `PRAGMA` não aceita parâmetro ligado, e `version` é um número nosso.
    await db.execAsync(`PRAGMA user_version = ${version}`);
  }

  return db;
}

/** Conexão única do app — abre e migra na primeira chamada. */
export function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  connection ??= connect();
  return connection;
}
