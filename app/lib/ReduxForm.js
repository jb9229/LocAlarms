import {objectMap} from "./Operators";

export const formTypes = {
  email: "Email",
  location: "Location",
  number: "Number",
  string: "Text",
  picker: "Picker",
  radio: "Radio",
  switchType: "Switch",
  date: "Date",
  time: "Time",
  customOnFocus: "customOnFocus"
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
