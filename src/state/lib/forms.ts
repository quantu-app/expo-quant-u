import { createForms } from "@aicacia/state-forms";
import { Consumer, state } from "./state";

export const {
  createForm,
  removeForm,
  selectForm,
  selectFormExists,
  selectField,
  selectFormErrors,
  selectFieldErrors,
  addFormError,
  addFieldError,
  updateField,
  changeField,
  removeField,
  forms,
  injectForm,
  useForm,
} = createForms(state, Consumer);
