import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { ChatComment } from "../models/comment";
import { makeAutoObservable, runInAction } from "mobx";
import { store } from "./store";

export default class CommentStore {
    comments: ChatComment[] = [];
    hubConnection: HubConnection | null = null;

    constructor() {
        makeAutoObservable(this); // both ChatComment and HubConnection will be marked as observables
    }

    createHubConnection = (activityId: string) => {
        if (store.activityStore.selectedActivity) {
            this.hubConnection = new HubConnectionBuilder()
                .withUrl('http://localhost:5000/chat?activityId=' + activityId, { // here we build query string ?activityId needs to beseplled as in the server side
                accessTokenFactory: () => store.userStore.user?.token! // here we pass out token, user technicall could be null, hence the '!'
                })
                .withAutomaticReconnect() // attempt to reconnect user to chathub if thye lose conenction
                .configureLogging(LogLevel.Information)
                .build(); // this creates the connection, but doesn't start it

            this.hubConnection.start().catch(error => console.log('Error establishing the connection:', + error));

            // when we connect to the activity we want to get all comments that are already here
            this.hubConnection.on('LoadComments', (comments: ChatComment[]) => { 
                                // "LoadComments" need to match the name inside ChatHub.cs, after comma is what we get back from it
                runInAction(() => {
                    comments.forEach(comment => {
                        comment.createdAt = new Date(comment.createdAt + 'Z');
                    })
                    this.comments = comments // we update comments (observables) so we runInAction
                }) 
            });
            
            this.hubConnection.on('ReceiveComment', (comment: ChatComment) => {
                runInAction(() => {
                    comment.createdAt = new Date(comment.createdAt);
                    this.comments.unshift(comment)
                });
            })
        }
    }

    stopHubConnection = () => {
        this.hubConnection?.stop().catch(error => console.log('Error stopping the connection:', error));
    }

    clearComments = () => {
        this.comments = [];
        this.stopHubConnection();
    }

    addComment = async (values: any) => {
        values.activityId = store.activityStore.selectedActivity?.id;
        try {
            await this.hubConnection?.invoke('SendComment', values); // 'SendComment' need to match the name of the method on the server (inside ChatHub.cs)
        } catch (error) {
            console.log(error);
        }
    }
}