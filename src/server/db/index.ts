import { drizzle, type MySql2Database } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

import { env } from "~/env";
import * as schema from "~/server/db/schema";




let db: MySql2Database<typeof schema>;




if (env.NODE_ENV === 'development') {
    db = singleton('db', () => {
        const connection = mysql.createPool(env.DATABASE_URL);

        return db = drizzle(
            connection,
            {
                schema,
                mode: "default"
            }
        );

    })
}
if (env.NODE_ENV === 'production') {
    const connection = mysql.createPool(env.DATABASE_URL);

    db = drizzle(
        connection,
        {
            schema,
            mode: "default"
        }
    );
}

export function singleton<Value>(name: string, value: () => Value): Value {
    const yolo = global as { __singletons?: Record<string, Value> }

    yolo.__singletons ??= {} as Record<string, Value>

    yolo.__singletons[name] ??= value()

    return yolo.__singletons[name]!
}

export { db }


