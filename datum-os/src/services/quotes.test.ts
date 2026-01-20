import { vi, describe, it, expect, beforeEach } from 'vitest';
import { QuotesService } from './quotes.service.js';
import type {IQuotesAdapter} from './quotes.service.js';
import type {IFilesAdapter} from './files.service.js';
import type {IMaterialAdapter} from './material.service.js';
import { ValidationError } from './models/errors.js';
import type {FileDetails, Material} from './models/models.js';

const mockQuotesAdapter: IQuotesAdapter = {
    createQuote: vi.fn(),
    getQuote: vi.fn(),
};

const mockFilesAdapter: IFilesAdapter = {
    getFileDetails: vi.fn(),
    uploadFileToDatabase: vi.fn(),
    createFileDetails: vi.fn(),
};

const mockMaterialAdapter: IMaterialAdapter = {
    getMaterial: vi.fn(),
    listMaterial: vi.fn(),
    getMaterialPrice: vi.fn(),
};

describe('QuotesService', () => {
    let quotesService: QuotesService;

    beforeEach(() => {
        quotesService = new QuotesService(mockQuotesAdapter, mockFilesAdapter, mockMaterialAdapter);
    });

    it('should throw an error when quantity is 0', () => {
        const fileDetails: FileDetails = {
            id: 'file1',
            originalName: 'testFile.stl',
            storagePath: '/files/testFile.stl',
            sizeBytes: 1234,
            mimeType: 'application/stl',
            geometry: { volumeCm3: 100, surfaceArea: 200, boundingBox: { x: 10, y: 10, z: 10 }, volume: 100 },
            uploadedAt: new Date(),
        };

        const material: Material = { id: 'material1', name: 'Plastic', code: 'PL123', price: 1.5, leadTime: 5, properties: ['flexible'], available: true };

        expect(() => {
            quotesService['createInitialQuote'](fileDetails, material, 0);
        }).toThrowError(ValidationError);
        expect(() => {
            quotesService['createInitialQuote'](fileDetails, material, 0);
        }).toThrowError('Quantity cant be < 1');
    });

    it('should correctly calculate price and discounts for quantity 10', () => {
        const fileDetails: FileDetails = {
            id: 'file1',
            originalName: 'testFile.stl',
            storagePath: '/files/testFile.stl',
            sizeBytes: 1234,
            mimeType: 'application/stl',
            geometry: { volumeCm3: 100, surfaceArea: 200, boundingBox: { x: 10, y: 10, z: 10 }, volume: 100 },
            uploadedAt: new Date(),
        };

        const material: Material = { id: 'material1', name: 'Plastic', code: 'PL123', price: 1.5, leadTime: 5, properties: ['flexible'], available: true };

        const quantity = 10;
        const createdQuote = quotesService['createInitialQuote'](fileDetails, material, quantity);

        const unitPrice = 100 * 1.5;
        const subtotal = unitPrice * quantity;
        const discountPercent = quotesService['calculateDiscount'](quantity);
        const quantityDiscount = subtotal - (subtotal * (1 - discountPercent / 100));
        const totalPrice = subtotal - quantityDiscount;

        expect(createdQuote.totalPrice).toBe(totalPrice);
        expect(createdQuote.unitPrice).toBe(unitPrice);
        expect(createdQuote.quantity).toBe(quantity);
        expect(createdQuote.quantityDiscount).toBe(quantityDiscount);
    });

    it('should correctly calculate price and discounts for quantity 500', () => {
        const fileDetails: FileDetails = {
            id: 'file1',
            originalName: 'testFile.stl',
            storagePath: '/files/testFile.stl',
            sizeBytes: 1234,
            mimeType: 'application/stl',
            geometry: { volumeCm3: 100, surfaceArea: 200, boundingBox: { x: 10, y: 10, z: 10 }, volume: 100 },
            uploadedAt: new Date(),
        };

        const material: Material = { id: 'material1', name: 'Plastic', code: 'PL123', price: 1.5, leadTime: 5, properties: ['flexible'], available: true };

        const quantity = 500;
        const createdQuote = quotesService['createInitialQuote'](fileDetails, material, quantity);

        const unitPrice = 100 * 1.5;
        const subtotal = unitPrice * quantity;
        const discountPercent = quotesService['calculateDiscount'](quantity);
        const quantityDiscount = subtotal - (subtotal * (1 - discountPercent / 100));
        const totalPrice = subtotal - quantityDiscount;
        expect(createdQuote.totalPrice).toBe(totalPrice);
        expect(createdQuote.unitPrice).toBe(unitPrice);
        expect(createdQuote.quantity).toBe(quantity);
        expect(createdQuote.quantityDiscount).toBe(quantityDiscount);
    });
});
