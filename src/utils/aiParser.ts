interface AIParsedService {
    name: string;
    description?: string;
    isQuotable?: boolean | string;
    price: number;
    currency?: string;
    categoryName: string;
}

interface AIParsedProduct {
    name: string;
    description?: string;
    price: number;
    categoryName: string;
    currency?: string;
    sku?: string;
    quantity: number;
    minRestockLevel: number;
    street?: string;
    city?: string;
    zipcode?: string;
    state: string;
    country: string;
    hsCode: string;
    weight: number;
    length: number;
    width: number;
    height: number;
}

export const parseServicesWithAI = async (file: File): Promise<AIParsedService[]> => {
    const aiBase = import.meta.env.VITE_AI_PARSER_URL;
    if (!aiBase) {
        throw new Error("AI parser URL not configured");
    }

    const formData = new FormData();
    formData.append("file", file);

    const resp = await fetch(`${aiBase}/parse/v2/services`, {
        method: "POST",
        body: formData,
    });

    const json = await resp.json().catch(() => ({}));

    if (!resp.ok) {
        const error: any = new Error(
            json?.message || (resp.status === 422 ? "Validation error" : "AI parsing failed")
        );
        error.response = { status: resp.status, data: json };
        error.data = json;
        throw error;
    }

    if (!json?.services || !Array.isArray(json.services)) {
        throw new Error("AI parser returned an invalid response");
    }

    return json.services;
};


export const parseProductsWithAI = async (file: File): Promise<AIParsedProduct[]> => {
    const aiBase = import.meta.env.VITE_AI_PARSER_URL;
    if (!aiBase) {
        throw new Error("AI parser URL not configured");
    }

    const formData = new FormData();
    formData.append("file", file);

    const resp = await fetch(`${aiBase}/parse/v2/products`, {
        method: "POST",
        body: formData,
    });

    const json = await resp.json().catch(() => ({}));

    if (!resp.ok) {
        const error: any = new Error(
            json?.message || (resp.status === 422 ? "Validation error" : "AI parsing failed")
        );
        error.response = { status: resp.status, data: json };
        error.data = json;
        throw error;
    }

    if (!json?.products || !Array.isArray(json.products)) {
        throw new Error("AI parser returned an invalid response");
    }

    return json.products;
};