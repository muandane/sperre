import Elysia, { t } from "elysia";
import { db } from "@/db";
import { invoices } from "@/db/schema/invoice";
import { userOrganizations } from "@/db/schema/invoice";
import { eq, and, inArray } from "drizzle-orm";
import {
  type InvoiceBody,
  InvoiceBodySchema,
  type UpdateInvoiceBody,
  convertToDBType,
} from "@/types";
import { createInvoiceWithProducts } from "@/handler/transactions";
import { user } from "@/db/schema/auth";

export const invoiceRoutes = new Elysia()
  .post(
    "/invoices",
    async ({ body, session }: { body: InvoiceBody; session: { userId: string } }) => {
      try {
        // Get user's organizations
        const userOrgs = await db
          .select({ organizationId: userOrganizations.organizationId })
          .from(userOrganizations)
          .where(eq(userOrganizations.userId, session.userId));

        if (!userOrgs.length) {
          return { success: false, error: "User not associated with any organization" };
        }

        const { items, ...invoiceData } = body;
        
        // Verify invoice belongs to user's organization
        if (!userOrgs.some(org => org.organizationId === invoiceData.organizationId)) {
          return { success: false, error: "Unauthorized to create invoice for this organization" };
        }

        const invoice = await createInvoiceWithProducts(invoiceData, items);
        return { success: true, data: invoice };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    {
      body: InvoiceBodySchema,
      detail: { summary: "Create invoice with products", tags: ["Invoices"] },
    }
  )
  .get(
    "/invoices",
    async ({ bearer }: { bearer: { userId: string } }) => {
      try {
        // Get user's organizations
        const userOrgs = await db
          .select({ organizationId: userOrganizations.organizationId })
          .from(userOrganizations);
          // .where(eq(userOrganizations.userId, user.id));

        const orgIds = userOrgs.map(org => org.organizationId);

        // Get invoices for user's organizations
        const userInvoices = await db
          .select()
          .from(invoices)
          .where(inArray(invoices.organizationId, orgIds));
        console.log(userInvoices);
        return { success: true, data: userInvoices };
      } catch (error) {
        console.error(400, error.message);
        return { success: false, error: error.message };
      }
    },
    { detail: { summary: "Get all invoices for user's organizations", tags: ["Invoices"] } }
  )
  .get(
    "/invoices/:id",
    async ({ params: { id }, session }: { params: { id: string }; session: { userId: string } }) => {
      try {
        // Get user's organizations
        const userOrgs = await db
          .select({ organizationId: userOrganizations.organizationId })
          .from(userOrganizations)
          .where(eq(userOrganizations.userId, session.userId));

        const orgIds = userOrgs.map(org => org.organizationId);

        // Get invoice if it belongs to user's organization
        const invoice = await db
          .select()
          .from(invoices)
          .where(
            and(
              eq(invoices.id, Number.parseInt(id)),
              inArray(invoices.organizationId, orgIds)
            )
          )
          .limit(1);

        if (!invoice.length) {
          return { success: false, error: "Invoice not found" };
        }

        return { success: true, data: invoice[0] };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    {
      params: t.Object({
        id: t.String({ description: "Invoice ID", example: "1" }),
      }),
      detail: { summary: "Get invoice by ID", tags: ["Invoices"] },
    }
  )
  .put(
    "/invoices/:id",
    async ({
      params: { id },
      body,
      session,
    }: {
      params: { id: string };
      body: UpdateInvoiceBody;
      session: { userId: string };
    }) => {
      try {
        // Get user's organizations
        const userOrgs = await db
          .select({ organizationId: userOrganizations.organizationId })
          .from(userOrganizations)
          .where(eq(userOrganizations.userId, session.userId));

        const orgIds = userOrgs.map(org => org.organizationId);

        const updateData = { ...convertToDBType(body), updatedAt: new Date() };

        const updatedInvoice = await db
          .update(invoices)
          .set(updateData)
          .where(
            and(
              eq(invoices.id, Number.parseInt(id)),
              inArray(invoices.organizationId, orgIds)
            )
          )
          .returning();

        if (!updatedInvoice.length) {
          return { success: false, error: "Invoice not found or unauthorized" };
        }

        return { success: true, data: updatedInvoice[0] };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    {
      params: t.Object({
        id: t.String({ description: "Invoice ID", example: "1" }),
      }),
      body: t.Partial(InvoiceBodySchema),
      detail: { summary: "Update invoice by ID", tags: ["Invoices"] },
    }
  )
  .delete(
    "/invoices/:id",
    async ({ params: { id }, session }: { params: { id: string }; session: { userId: string } }) => {
      try {
        // Get user's organizations
        const userOrgs = await db
          .select({ organizationId: userOrganizations.organizationId })
          .from(userOrganizations)
          .where(eq(userOrganizations.userId, session.userId));

        const orgIds = userOrgs.map(org => org.organizationId);

        const deletedInvoice = await db
          .delete(invoices)
          .where(
            and(
              eq(invoices.id, Number.parseInt(id)),
              inArray(invoices.organizationId, orgIds)
            )
          )
          .returning();

        if (!deletedInvoice.length) {
          return { success: false, error: "Invoice not found or unauthorized" };
        }

        return { success: true, data: deletedInvoice[0] };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    {
      params: t.Object({
        id: t.String({ description: "Invoice ID", example: "1" }),
      }),
      detail: { summary: "Delete invoice by ID", tags: ["Invoices"] },
    }
  );