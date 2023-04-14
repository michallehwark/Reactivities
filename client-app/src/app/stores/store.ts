import { createContext, useContext } from "react";
import ActivityStore from "./activityStore";
import CommonStore from "./commonStore";
import UserStore from "./userstore";
import ModalStore from "./modalStore";

interface Store {
    activityStore: ActivityStore;
    commonStore: CommonStore;
    userStore: UserStore;
    modalStore: ModalStore;
}

export const store: Store = {
    activityStore: new ActivityStore(),
    commonStore: new CommonStore(),
    userStore: new UserStore(),
    modalStore: new ModalStore()
}
// as we create new stores we'll be adding new instantec of these stores into the store object
// and that will be available in react context 
export const StoreContext = createContext(store);

// react hook too allow us use stores inside components
export function useStore() {
    return useContext(StoreContext);
}