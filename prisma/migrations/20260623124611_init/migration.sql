-- CreateTable
CREATE TABLE "wines" (
    "wine_id" INTEGER NOT NULL,
    "wine_name" TEXT NOT NULL,
    "type" VARCHAR(50),
    "elaborate" VARCHAR(100),
    "grapes" TEXT[],
    "harmonize" TEXT[],
    "abv" DECIMAL(4,2),
    "body" VARCHAR(50),
    "acidity" VARCHAR(50),
    "country_code" VARCHAR(10),
    "country" VARCHAR(100),
    "region_id" INTEGER,
    "region_name" VARCHAR(150),
    "winery_id" INTEGER,
    "winery_name" TEXT,
    "website" TEXT,
    "vintages" TEXT[],

    CONSTRAINT "wines_pkey" PRIMARY KEY ("wine_id")
);

-- CreateTable
CREATE TABLE "mapping_wines_harmonize_the_meal_db" (
    "harmonize_text" TEXT NOT NULL,
    "the_meal_text" TEXT NOT NULL,

    CONSTRAINT "mapping_wines_harmonize_the_meal_db_pkey" PRIMARY KEY ("harmonize_text")
);

CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

CREATE INDEX wine_name_trgm_unaccent_idx ON "wines" USING GIN (wine_name gin_trgm_ops);