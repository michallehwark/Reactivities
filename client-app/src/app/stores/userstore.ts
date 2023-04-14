import { makeAutoObservable, runInAction } from "mobx";
import { User, UserFormValues } from "../layout/models/user";
import agent from "../layout/API/Agent";
import { store } from "./store";
import { router } from "../router/Routes";

export default class UserStore {
    user: User | null = null;

    constructor() {
        makeAutoObservable(this)
    }

    get isLoggedIn() {
        return !!this.user;
    }

    login = async (creds: UserFormValues) => {
        try {
            const user = await agent.Account.login(creds);
            store.commonStore.setToken(user.token);
            runInAction(() => this.user = user);
            router.navigate('/activities');
            store.modalStore.closeModal();
        } catch (error) {
            throw error;
        }
    }

    register = async (creds: UserFormValues) => {
        try {
            const user = await agent.Account.regsiter(creds);
            store.commonStore.setToken(user.token); // after we get the suer we set the token
            runInAction(() => this.user = user); // we set the user inside the store
            router.navigate('/activities'); // navigate to reactivities dashboard
            store.modalStore.closeModal(); // close the modal after registration
        } catch (error) {
            throw error;
        }
    }

    logout = () => {
        store.commonStore.setToken(null);
        this.user = null;
        router.navigate('/');
    }

    getUser = async () => {
        try {
            const user = await agent.Account.current();
            runInAction(() => this.user = user);
        } catch (error) {
            console.log(error);
        }
    }
}