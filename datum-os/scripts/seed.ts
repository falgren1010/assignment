import pkg from 'pg';
const { Client } = pkg;
import "dotenv/config";
import type {Material, MaterialPrice} from "../src/services/models/models.js";

const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
});

async function seed() {
    try {
        await client.connect();

        for (const material of materialsTestData) {
            await client.query(
                `INSERT INTO materials (name, code, price, lead_time, properties, available) VALUES ($1, $2, $3, $4, $5, $6)`,
                [
                    material.name,
                    material.code,
                    material.price,
                    material.leadTime,
                    JSON.stringify(material.properties),
                    material.available
                ]
            );
        }

        for (const price of materialsPriceTestData) {
            await client.query(
                `INSERT INTO material_prices (material_code, material_price, valid_from, valid_to) VALUES ($1, $2, $3, $4)`,
                [
                    price.materialCode,
                    price.materialPrice,
                    price.validFrom,
                    price.validTo
                ]
            );
        }

        console.log('Seed-Data added');
    } catch (err) {
        console.error('Error adding Seed-Data: ', err);
    } finally {
        await client.end();
    }
}

seed();


export const materialsTestData: Material[] = [
    {
        name: "PLA",
        code: "pla",
        price: 0.08,
        leadTime: 3,
        properties: ["Standard prototyping", "biodegradable"],
        available: true
    },
    {
        name: "ABS",
        code: "abs",
        price: 0.12,
        leadTime: 5,
        properties: ["Heat resistant", "good mechanical strength"],
        available: true
    },
    {
        name: "Nylon PA12",
        code: "pa12",
        price: 0.28,
        leadTime: 7,
        properties: ["Industrial grade", "high wear resistance"],
        available: true
    },
    {
        name: "Polypropylene",
        code: "pp",
        price: 0.18,
        leadTime: 7,
        properties: ["Chemical resistant", "living hinges"],
        available: false
    },
    {
        name: "TPU 95A",
        code: "tpu",
        price: 0.22,
        leadTime: 5,
        properties: ["Flexible", "impact resistant"],
        available: true
    }
];

const twoWeeksAgo = new Date();
twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

export const materialsPriceTestData: MaterialPrice[] = [
    {
        materialCode: "pla",
        materialPrice: 0.08,
        validFrom: twoWeeksAgo,
        validTo: null
    },
    {
        materialCode: "abs",
        materialPrice: 0.12,
        validFrom: twoWeeksAgo,
        validTo: null
    },
    {
        materialCode: "pa12",
        materialPrice: 0.28,
        validFrom: twoWeeksAgo,
        validTo: null
    },
    {
        materialCode: "pp",
        materialPrice: 0.18,
        validFrom: twoWeeksAgo,
        validTo: null
    },
    {
        materialCode: "tpu",
        materialPrice: 0.22,
        validFrom: twoWeeksAgo,
        validTo: null
    }
];

