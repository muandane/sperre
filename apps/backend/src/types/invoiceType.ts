export type InvoiceBody = {
	invoiceNumber: string;
	clientName: string;
	clientEmail: string;
	amount: number;
	status?: string;
	organizationId: number;
	dueDate: string;
	items: {
		productId: number;
		quantity: number;
		price?: number;
		discount?: number;
		name?: string;
	}[];
};
export type CreateInvoiceBody = {
	invoiceNumber: string;
	clientName: string;
	clientEmail: string;
	amount: number;
	status?: string;
	dueDate: string;
	products: {
		productId: number;
		quantity: number;
		price?: number;
		discount?: number;
		name?: string;
	}[];
};

export type UpdateInvoiceBody = Partial<InvoiceBody>;

export const convertToDBType = (body: Partial<InvoiceBody>) => {
	// biome-ignore lint/suspicious/noExplicitAny: ignore
	const converted: Record<string, any> = {};

	if (body.amount !== undefined) {
		converted.amount = body.amount.toString();
	}
	if (body.dueDate !== undefined) {
		converted.dueDate = new Date(body.dueDate);
	}

	// Copy other fields without conversion
	for (const [key, value] of Object.entries(body)) {
		if (key !== "amount" && key !== "dueDate" && value !== undefined) {
			converted[key] = value;
		}
	}

	return converted;
};
