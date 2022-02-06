import { TextField } from "@mui/material";
import * as React from "react";

interface CustomTextFieldProps {
  type: "number" | "string";
  value: any;
  setValue: (value: any) => any;
}

interface CustomTextFieldState {
  editingValue: any;
  isEditable: boolean;
  isBeingEdited: boolean;
}

export default function CustomTextField(props: CustomTextFieldProps) {
  const [state, setState] = React.useState<CustomTextFieldState>({
    editingValue: props.value,
    isEditable: false,
    isBeingEdited: false,
  });

  const onChange = (event) => setState((state) => ({ ...state, editingValue: event.target.value }));

  const onKeyDown = (event) => {
    if (event.key === "Enter") {
      event.target.blur();
    }
  };

  const onMouseEnter = (event) => {
    setState((state) => ({ ...state, isEditable: true }));
  };

  const onMouseLeave = (event) => {
    if (!state.isBeingEdited) {
      setState((state) => ({ ...state, isEditable: false }));
    }
  };

  const onClick = (event) => {
    setState((state) => ({ ...state, isEditable: true, isBeingEdited: true }));
  };

  const onBlur = (event) => {
    setState((state) => ({ ...state, isEditable: false, isBeingEdited: false }));
    props.setValue(event.target.value);
  };

  return props.type === "string" ? (
    <TextField
      fullWidth
      type="text"
      variant="standard"
      aria-label="Field name"
      value={state.editingValue}
      onChange={onChange}
      onClick={onClick}
      onKeyDown={onKeyDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onBlur={onBlur}
      disabled={!state.isEditable}
    />
  ) : state.isBeingEdited === true ? (
    <TextField
      type="number"
      inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
      variant="standard"
      aria-label="Field name"
      value={state.editingValue}
      onChange={onChange}
      onClick={onClick}
      onKeyDown={onKeyDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onBlur={onBlur}
      disabled={!state.isEditable}
    />
  ) : (
    <div
      onChange={onChange}
      onClick={onClick}
      onKeyDown={onKeyDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onBlur={onBlur}
    >
      {state.editingValue}
    </div>
  );
}
