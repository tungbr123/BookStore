// context.js
import { createContext, useState } from 'react';

const DeliveryInfoContext = createContext();

function DeliveryInfoProvider({ children }) {
    const [state, setState] = useState({
        email:'',
        phone: '',
        address: '',
        name: ''
      });

  return (
    <DeliveryInfoContext.Provider value={[state, setState]}>
      {children}
    </DeliveryInfoContext.Provider>
  );
}

export { DeliveryInfoProvider, DeliveryInfoContext };