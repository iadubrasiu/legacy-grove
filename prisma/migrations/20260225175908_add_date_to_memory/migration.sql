-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Memory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "media" TEXT,
    "personId" TEXT,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Memory_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Memory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Memory" ("content", "createdAt", "id", "media", "personId", "title", "userId") SELECT "content", "createdAt", "id", "media", "personId", "title", "userId" FROM "Memory";
DROP TABLE "Memory";
ALTER TABLE "new_Memory" RENAME TO "Memory";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
