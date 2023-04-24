import { Profile } from "./profile";

export interface Activity {
    id: string;
    title: string;
    date: Date | null;
    description: string;
    category: string;
    city: string;
    venue: string;
    hostUsername: string;
    isCandelled: boolean;
    isGoing: boolean;
    isHost: boolean;
    host?: Profile;
    attendees: Profile[];
}
export class Activity implements Activity {
    constructor(init?: ActivityFormValues) {
        Object.assign(this, init) // target, source --> (this, init), init is whatever we pass here 
    }
}


// By creating a calss this will give us oportunity to create constructor to init certain value when we pass activity obejct from API to ctor of this class.
export class ActivityFormValues {
    id?: string = undefined;
    title: string = '';
    category: string = '';
    description: string = '';
    date: Date | null = null;
    city: string = '';
    venue: string = '';

    // we want to use ActivityFormValues for either creating an activity or editing an exisiting activity
    // that is why we make it optional
    constructor(activity?: ActivityFormValues) {
        if (activity) {
            this.id = activity.id;
            this.title = activity.title;
            this.category = activity.category;
            this.description = activity.description;
            this.date = activity.date;
            this.city = activity.city;
            this.venue = activity.venue;
        }
    }
}