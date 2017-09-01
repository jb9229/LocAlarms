import {objectMap} from "./Operators";

export const formTypes = {
  email: "Email",
  location: "Location",
  number: "Number",
  string: "Text",
  picker: "Enum",
  date: "Date",
  time: "Time"
};

export function setFormValues(change: (name: string, data: any) => any, initialData: any) {
  Object.keys(initialData).forEach((key) => {
    change(key, initialData[key]);
  });
}

export function createFields(fieldData) {
  return objectMap(fieldData, (val, key) => ({...val, name: key}));
}

export function attachRender(fields, render) {
  return objectMap(fields, (val) => ({...val, component: render}));
}
