import React, { useState } from "react";
import { TrashIcon, PlusIcon, UploadIcon } from "@heroicons/react/solid";

const emptyFormFields = {
  product: "",
  cost: "",
  amount: "",
  intermediate_total: 0,
};

const Form = () => {
  const [formValues, setFormValues] = useState([{ ...emptyFormFields }]);

  let handleSubmit = (e) => {
    e.preventDefault();
    alert(JSON.stringify(formValues));
  };

  let handleChange = (i, e) => {
    let newFormValues = [...formValues];
    newFormValues[i][e.target.name] = e.target.value;
    setFormValues(newFormValues);
  };

  let tryAddFormFields = () => {
    // return if the last amount is empty OR if any of the rest of the amounts are non-empty
    const lastAmount = formValues[formValues.length - 1].amount;
    const restAmounts = formValues.map((element) => element.amount);
    if (lastAmount === "" || restAmounts.includes("")) return;

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
              ui={{ type: "text", name: "product" }}
              data={{ value: element.product, defaultValue: "" }}
              function={{ onClick: (e) => handleChange(index, e) }}
            />
            <FormCell
              ui={{ type: "number", name: "cost" }}
              data={{ value: element.cost, defaultValue: "" }}
              function={{
                onClick: (e) => {
                  handleChange(index, e);
                  updateIntermediateTotal(index);
                },
              }}
            />
            <FormCell
              ui={{ type: "number", name: "amount" }}
              data={{ value: element.amount, defaultValue: "" }}
              function={{
                onClick: (e) => {
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
              function={{ onClick: (e) => handleChange(index, e) }}
            />
            <div className="border-2 text-center">
              {index ? (
                <button
                  className="bg-rose-300 hover:bg-rose-400 text-gray-800 my-1 py-1 px-2 rounded-full inline-flex items-center"
                  type="button"
                  onClick={() => removeFormFields(index)}
                  tabindex="-1"
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
  return (
    <div className="border-2">
      <input
        className={`w-full h-full ${props.ui.className}`}
        type={props.ui.type}
        name={props.ui.name}
        value={props.data.value || props.data.defaultValue}
        onChange={props.function.onClick}
        disabled={props.ui.isDisabled}
      />
    </div>
  );
};

export default Form;
