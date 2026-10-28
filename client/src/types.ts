import type { FormKey, Values } from "./formConfig";

/** Opens the forms section on a given tab, optionally pre-filling some fields. */
export type OpenForm = (form: FormKey, preset?: Partial<Values>) => void;

export interface FormRequest {
  form: FormKey;
  preset?: Partial<Values>;
  /** Changes on every request so the target form re-initialises even for the same tab. */
  nonce: number;
}
