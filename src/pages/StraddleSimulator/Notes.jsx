import React, { useState } from "react";
import { Input } from "antd";
import { NotesContainer } from "./StyledComponents";
import { Button } from "../../components/ui/Button";

const { TextArea } = Input;

export const Notes = ({ value: valueProp, onSet }) => {
  const [value, setValue] = useState(valueProp);
  return (
    <NotesContainer>
      <TextArea rows={1} onChange={(event) => setValue(event.target.value)} />
      <Button
        disabled={valueProp === value}
        style={{ boxShadow: "none" }}
        onClick={() => onSet(value)}
        type="primary"
      >
        Set
      </Button>
    </NotesContainer>
  );
};
