import prisma from "@/libs/db"

import { parse } from 'csv-parse/sync';
import fs from 'fs';
import path from 'path';
import {Prisma} from "@/app/generated/prisma/client";


function parseArrayField(value: string | undefined): string[] {
    if (!value || value.trim() === '') return [];
    const cleaned = value.trim().replace(/^\[|\]$/g, '');
    if (cleaned === '') return [];
    return cleaned
        .split(',')
        .map((v) => v.trim().replace(/^['"]|['"]$/g, ''))
        .filter((v) => v.length > 0);
}

function parseNullableInt(value: string | undefined): number | null {
    if (!value || value.trim() === '') return null;
    const n = parseInt(value, 10);
    return Number.isNaN(n) ? null : n;
}

function parseNullableDecimal(value: string | undefined): Prisma.Decimal | null {
    if (!value || value.trim() === '') return null;
    return new Prisma.Decimal(value);
}

function parseNullableString(value: string | undefined): string | null {
    if (!value || value.trim() === '') return null;
    return value.trim();
}

async function main() {
    const csvPath = path.join(__dirname, 'wines.csv'); // adapte le chemin si besoin
    const fileContent = fs.readFileSync(csvPath, 'utf-8');

    const records: Record<string, string>[] = parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
    });

    console.log(`${records.length} lignes à importer.`);

    const batchSize = 500;
    for (let i = 0; i < records.length; i += batchSize) {
        const batch = records.slice(i, i + batchSize);

        await prisma.wines.createMany({
            data: batch.map((row) => ({
                wine_id: parseInt(row.WineID, 10),
                wine_name: row.WineName,
                type: parseNullableString(row.Type),
                elaborate: parseNullableString(row.Elaborate),
                grapes: parseArrayField(row.Grapes),
                harmonize: parseArrayField(row.Harmonize),
                abv: parseNullableDecimal(row.ABV),
                body: parseNullableString(row.Body),
                acidity: parseNullableString(row.Acidity),
                country_code: parseNullableString(row.Code),
                country: parseNullableString(row.Country),
                region_id: parseNullableInt(row.RegionID),
                region_name: parseNullableString(row.RegionName),
                winery_id: parseNullableInt(row.WineryID),
                winery_name: parseNullableString(row.WineryName),
                website: parseNullableString(row.Website),
                vintages: parseArrayField(row.Vintages),
            })),
            skipDuplicates: true,
        });

        console.log(`Import: ${Math.min(i + batchSize, records.length)}/${records.length}`);
    }

    console.log('Import terminé.');

    // load harmonize_mealdb_mapping.csv
    // harmonize_term,mealdb_ingredients
    const harmonizeCsvPath = path.join(__dirname, 'harmonize_mealdb_mapping.csv');
    const harmonizeFileContent = fs.readFileSync(harmonizeCsvPath, 'utf-8');

    const harmonizeRecords: Record<string, string>[] = parse(harmonizeFileContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
    });

    console.log(`${harmonizeRecords.length} harmonize mappings à importer.`);

    // one shot

    //model mapping_wines_harmonize_the_meal_db {
    //   harmonize_text String @id
    //   the_meal_text  String
    // }
    await prisma.mapping_wines_harmonize_the_meal_db.createMany({
        data: harmonizeRecords.map((row) => ({
            harmonize_text: row.harmonize_term,
            the_meal_text: row.mealdb_ingredients,
        })),
        skipDuplicates: true,
    });

    console.log('Import des harmonize mappings terminé.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });