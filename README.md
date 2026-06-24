# WineCore

Search for a wine by name and get back matching wines along with dishes that pair well with them.

## How it works

1. Type a wine name in the search bar
2. WineCore returns matching wines (fuzzy search, accent-insensitive)
3. For each wine, matching dishes are suggested via TheMealDB

## Tech stack

| Layer | Technology |
| ----- | ---------- |
| Framework | Next.js 16 (App Router) |
| Database | PostgreSQL |
| ORM | Prisma 7 |
| Search | `pg_trgm` (fuzzy) + `unaccent` (accents) |
| External API | [TheMealDB](https://www.themealdb.com) |

## Getting started

### Prerequisites

- Node.js 18+
- PostgreSQL with `CREATE EXTENSION` privileges (for `pg_trgm` and `unaccent`)

### Setup

```bash
# 1. Configure environment variables
cp .env.example .env
# Fill in DATABASE_URL in .env

# 2. Install dependencies
npm install

# 3. Apply migrations (creates tables + enables extensions)
npx prisma migrate deploy

# 4. Generate the Prisma client
npx prisma generate

# 5. Import the wine catalog (~35,000 entries from wines.csv)
npx prisma db seed

# 6. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Required | Description |
| -------- | -------- | ----------- |
| `DATABASE_URL` | Yes | PostgreSQL connection string (`postgres://user:pass@host:port/db`) |
| `THEMEALDB_BASE_URL` | No | Override TheMealDB base URL (default: `https://www.themealdb.com/api/json/v1/1`) |

## API

### GET /api/vin/search

Fuzzy wine search by name.

#### Parameters

| Parameter | Type | Default | Constraints |
| --------- | ---- | ------- | ----------- |
| `query` | string | — | Required, max 200 characters |
| `limit` | number | `5` | Integer between 1 and 20 |

#### Example

```http
GET /api/vin/search?query=bordeaux&limit=5
```

#### Response

```json
{
  "results": [
    {
      "wine_id": 1234,
      "wine_name": "Château Bordeaux",
      "type": "Red",
      "country": "France",
      "region_name": "Bordeaux",
      "winery_name": "Château X",
      "abv": 13.5,
      "score": 0.87
    }
  ]
}
```

## Project structure

```text
Vin-Bouffe/
├── app/
│   ├── api/
│   │   └── vin/search/route.ts   # Search route
│   ├── layout.tsx
│   └── page.tsx
├── libs/
│   ├── db/index.ts               # PrismaClient singleton
│   └── TheMealDB/index.ts        # TheMealDB API client
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts                   # wines.csv importer
│   └── migrations/
├── next.config.ts
└── prisma.config.ts
```
