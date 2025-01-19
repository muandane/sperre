import { db } from "@/db";
import { userOrganizations } from "@/db/schema/organization";
import type { Session } from "better-auth/types";
import { eq } from "drizzle-orm";

export const getOrgIds = async (session: Session) => {
  const userOrgs = await db
    .select({ organizationId: userOrganizations.organizationId })
    .from(userOrganizations)
    .where(eq(userOrganizations.userId, session.userId));

  return userOrgs.map(({ organizationId }) => organizationId);
};
