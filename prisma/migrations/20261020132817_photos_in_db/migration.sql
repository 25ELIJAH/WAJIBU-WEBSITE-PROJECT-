-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Photo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "charityId" TEXT NOT NULL,
    "file" TEXT NOT NULL,
    "data" BLOB,
    "mime" TEXT NOT NULL DEFAULT 'image/jpeg',
    "caption" TEXT NOT NULL DEFAULT '',
    "sort" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Photo_charityId_fkey" FOREIGN KEY ("charityId") REFERENCES "CharityProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Photo" ("caption", "charityId", "createdAt", "file", "id", "sort") SELECT "caption", "charityId", "createdAt", "file", "id", "sort" FROM "Photo";
DROP TABLE "Photo";
ALTER TABLE "new_Photo" RENAME TO "Photo";
CREATE INDEX "Photo_charityId_idx" ON "Photo"("charityId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
