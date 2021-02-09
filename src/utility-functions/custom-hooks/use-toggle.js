import { useState } from 'react';

function useToggle(defaultValue = null) {
  const [value, setValue] = useState(defaultValue);
  const toggle = () => {
    setValue(!value);
  };
  return [value, toggle];
}
export default useToggle;
