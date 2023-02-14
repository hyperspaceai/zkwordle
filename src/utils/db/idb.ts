import { openDB } from "idb";

export const DB_NAME = "zkwordle";
export const STORE_NAME = "state";

export const initDb = () => {
  return openDB(DB_NAME, 3, {
    upgrade: (db, _oldVersion, _newVersion, _transaction) => {
      db.createObjectStore(STORE_NAME);
    },
  });
};
