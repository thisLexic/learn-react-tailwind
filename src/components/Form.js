import React, { useState } from "react";
import { TrashIcon, PlusIcon, UploadIcon } from "@heroicons/react/solid";

const emptyFormFields = {
  product: "",
  cost: "",
  amount: "",
  intermediate_total: 0,
  errors: {},
};

const Form = () => {
  const [formValues, setFormValues] = useState([{ ...emptyFormFields }]);

  let getFormValuesToValidate = () => {
    const lastFormValueIndex = formValues.length - 1;

    // find the last row that needs to be validated in the form
    let lastRowIndexToValidate = lastFormValueIndex;
    for (let i = lastFormValueIndex; i > -1; i--) {
      const formValue = formValues[i];
      if (
        formValue.product === "" &&
        formValue.cost === "" &&
        formValue.amount === ""
      ) {
        lastRowIndexToValidate -= 1;
      } else {
        break;
      }
    }

    // when lastRowIndexToValidate === -1, the whole form is empty and the whole form must be set to a one row with nothing in it
    // when lastRowIndexToValidate === lastFormValueIndex, the whole form is filled and the whole form must be validated
    // when lastRowIndexToValidate > 1 AND < lastFormValueIndex, the beginning of the form must be validated and the latter of the form can be dropped
    if (lastRowIndexToValidate === -1) return [emptyFormFields];
    return formValues.slice(0, lastRowIndexToValidate + 1);
  };

  let validateFormValues = () => {
    let formValuesToValidate = getFormValuesToValidate();
    const formValuesResetErrors = formValuesToValidate.map((element) => {
      return { ...element, errors: {} };
    });
    const validatedFormValues = formValuesResetErrors.map((element) => {
      const formValue = { ...element };
      if (formValue.product === "") formValue.errors.product = "required";
      if (formValue.cost === "") formValue.errors.cost = "required";
      if (formValue.amount === "") formValue.errors.amount = "required";
      return formValue;
    });
    setFormValues(validatedFormValues);
    return validatedFormValues;
  };

  let isFormValuesValid = (validatedFormValues) => {
    const errors = [].concat(
      ...validatedFormValues.map((e) => [
        e.errors.product,
        e.errors.cost,
        e.errors.amount,
      ])
    );
    return errors.every((e) => e === undefined);
  };

  let handleSubmit = (e) => {
    e.preventDefault();
    const validatedFormValues = validateFormValues();
    if (!isFormValuesValid(validatedFormValues)) return;
    alert(JSON.stringify(validatedFormValues));
  };

  let handleChange = (i, e) => {
    let newFormValues = [...formValues];
    newFormValues[i][e.target.name] = e.target.value;
    setFormValues(newFormValues);
  };

  let tryAddFormFields = () => {
    // return if any of the amounts are empty
    const amounts = formValues.map((element) => element.amount);
    if (amounts.includes("")) return;

    addFormFields();
  };

  let addFormFields = () => {
    setFormValues([...formValues, { ...emptyFormFields }]);
  };

  let updateIntermediateTotal = (i) => {
    let newFormValues = [...formValues];
    newFormValues[i]["intermediate_total"] =
      newFormValues[i]["cost"] * newFormValues[i]["amount"];
    setFormValues(newFormValues);
  };

  let removeFormFields = (i) => {
    let newFormValues = [...formValues];
    newFormValues.splice(i, 1);
    setFormValues(newFormValues);
  };

  return (
    <form className="m-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-5">
        <FormHeader>Product</FormHeader>
        <FormHeader>Cost</FormHeader>
        <FormHeader>Amount</FormHeader>
        <FormHeader>Total</FormHeader>
        <FormHeader>Action</FormHeader>
        {formValues.map((element, index) => (
          <React.Fragment key={index}>
            <FormCell
              ui={{
                type: "text",
                name: "product",
                className: element.errors.product
                  ? "border-2 border-rose-500"
                  : "",
              }}
              data={{ value: element.product, defaultValue: "" }}
              functions={{ onChange: (e) => handleChange(index, e) }}
            />
            <FormCell
              ui={{
                type: "number",
                name: "cost",
                className: element.errors.cost
                  ? "border-2 border-rose-500"
                  : "",
              }}
              data={{ value: element.cost, defaultValue: "" }}
              functions={{
                onChange: (e) => {
                  handleChange(index, e);
                  updateIntermediateTotal(index);
                },
              }}
            />
            <FormCell
              ui={{
                type: "number",
                name: "amount",
                className: element.errors.amount
                  ? "border-2 border-rose-500"
                  : "",
              }}
              data={{ value: element.amount, defaultValue: "" }}
              functions={{
                onChange: (e) => {
                  handleChange(index, e);
                  updateIntermediateTotal(index);
                  tryAddFormFields();
                },
              }}
            />
            <FormCell
              ui={{
                type: "number",
                name: "intermediate_total",
                className: "cursor-not-allowed",
                isDisabled: true,
              }}
              data={{ value: element.intermediate_total, defaultValue: 0 }}
              functions={{ onChange: (e) => handleChange(index, e) }}
            />
            <div className="border-2 text-center">
              {index ? (
                <button
                  className="bg-rose-300 hover:bg-rose-400 text-gray-800 my-1 py-1 px-2 rounded-full inline-flex items-center"
                  type="button"
                  onClick={() => removeFormFields(index)}
                  tabIndex="-1"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              ) : null}
            </div>
          </React.Fragment>
        ))}

        <div className="flex justify-center md:col-start-5 col-start-3 gap-6 m-2">
          <button
            className="bg-green-300 hover:bg-green-400 text-gray-800 my-1 py-1 px-3 rounded-full inline-flex items-center"
            type="submit"
          >
            <UploadIcon className="h-4 w-4" />
            <span>Submit</span>
          </button>
          <button
            className="bg-sky-300 hover:bg-sky-400 text-gray-800 my-1 py-1 px-2 rounded-full inline-flex items-center"
            type="button"
            onClick={() => addFormFields()}
          >
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </form>
  );
};

const FormHeader = (props) => {
  return (
    <div className="border-2 border-cyan-800 text-center">{props.children}</div>
  );
};

const FormCell = (props) => {
  const { ui, data, functions } = { ...props };
  return (
    <div className="border-2">
      <input
        className={`w-full h-full ${ui.className}`}
        type={ui.type}
        name={ui.name}
        value={data.value || data.defaultValue}
        onChange={functions.onChange}
        disabled={ui.isDisabled}
      />
    </div>
  );
};

export default Form;
