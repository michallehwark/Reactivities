import { createContext, useContext } from "react";
import ActivityStore from "./activityStore";

interface Store {
    activityStore: ActivityStore
}

export const store: Store = {
    activityStore: new ActivityStore()
}
// as we create new stores we'll be adding new instantec of these stores into the store object
// and that will be available in react context 
export const StoreContext = createContext(store);

// react hook too allow us use stores inside components
export function useStore() {
    return useContext(StoreContext);
}