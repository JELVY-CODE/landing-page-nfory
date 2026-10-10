export type ContactField = "name" | "email" | "company" | "service" | "serviceOther" | "date" | "slot" | "message";

export type ContactValues = Record<ContactField, string>;

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<ContactField, string>>;
  values?: ContactValues;
};

export const initialContactState: ContactState = { status: "idle" };
