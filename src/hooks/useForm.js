import { useCallback, useState } from "react";

export const useForm = (initState) => {
  const [form, setForm] = useState(initState);

  const updateForm = useCallback((filterKey, newValue) => {
    setForm((prev) => ({
      ...prev,
      [filterKey]: newValue,
    }));
  }, []);

  return {
    form,
    updateForm,
  };
};
