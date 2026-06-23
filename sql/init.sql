CREATE TABLE wines (
   wine_id      INTEGER PRIMARY KEY,
   wine_name    TEXT NOT NULL,
   type         VARCHAR(50),
   elaborate    VARCHAR(100),
   grapes       TEXT[],
   harmonize    TEXT[],
   abv          NUMERIC(4,2),
   body         VARCHAR(50),
   acidity      VARCHAR(50),
   country_code VARCHAR(10),
   country      VARCHAR(100),
   region_id    INTEGER,
   region_name  VARCHAR(150),
   winery_id    INTEGER,
   winery_name  TEXT,
   website      TEXT,
   vintages     TEXT[]
);

CREATE TABLE mapping_wines_harmonize_the_meal_db (
 harmonize_text TEXT PRIMARY KEY,
 the_meal_text  TEXT NOT NULL
);

