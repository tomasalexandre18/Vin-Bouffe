-- Replace the plain wine_name GIN index with one on unaccent(wine_name)
-- so the search query can hit the index instead of doing a full seq scan.
-- unaccent() is STABLE by default; we wrap it in an IMMUTABLE function
-- because GIN expression indexes require IMMUTABLE functions.
DROP INDEX IF EXISTS wine_name_trgm_unaccent_idx;

CREATE OR REPLACE FUNCTION unaccent_immutable(text)
RETURNS text LANGUAGE sql IMMUTABLE PARALLEL SAFE AS
$$SELECT public.unaccent($1)$$;

CREATE INDEX wine_name_trgm_unaccent_idx
    ON "wines" USING GIN (unaccent_immutable(wine_name) gin_trgm_ops);
