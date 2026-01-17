/* eslint-disable @typescript-eslint/no-unused-vars */
export interface File {
    id: string;
    originalName: string;
    storagePath: string;
    sizeBytes: number;
    mimeType: string;
    geometry: GeometryProperties | null;
    uploadedAt: Date;
}

export interface GeometryResult {
    success: boolean;
    properties?: GeometryProperties;
    error?: string;
    processingTimeMs: number;
}

export interface GeometryProperties {
    boundingBox: {
        x: number; // mm
        y: number; // mm
        z: number; // mm
    };
    volume: number;      // mm³
    volumeCm3: number;   // cm³ (for pricing)
    surfaceArea: number; // mm²
}

export interface Quote {
    id: string;
    fileId: string;

    // Configuration snapshot (frozen at quote time)
    materialId: string;
    materialName: string;
    materialPriceFactor: number; // €/cm³ at time of quote
    quantity: number;

    // Calculated pricing
    volumeCm3: number;
    unitPrice: number;
    quantityDiscount: number;
    totalPrice: number;

    // Status
    status: 'draft' | 'ready' | 'ordered' | 'expired';
    createdAt: Date;
    expiresAt: Date;
}

export interface Order {
    id: string;
    quoteId: string;

    // Customer
    customerName: string;
    customerEmail: string;
    customerCompany: string | null;

    // Payment
    paymentMethod: 'card' | 'purchase_order';
    paymentStatus: 'pending' | 'paid' | 'failed';
    purchaseOrderFileId: string | null;

    // Totals
    totalAmount: number;
    currency: 'EUR';

    createdAt: Date;
}

export interface Material{
    name: string,
    code: string
    price: number // euro/cm^3
    leadTime: number // days
    properties: string[]
}

export interface StripePaymentIntent {
    id: string;
    amount: number;
    currency: string;
    status: string;
    client_secret?: string;
    payment_method?: string | null;
    metadata?: Record<string, string>;
}