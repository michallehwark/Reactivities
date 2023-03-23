import axios, { AxiosResponse } from 'axios'
import { Activity } from '../models/activity';

const sleep = (delay: number) => {
    return new Promise((respolve) => {
        setTimeout(respolve, delay)
    })
}

axios.defaults.baseURL = 'http://localhost:5000/api';

axios.interceptors.response.use(async response => {
    try {
        await sleep(1500);
        return response;
    } catch (error) {
        console.log(error);
        return await Promise.reject(error);
    }
})

const responseBody = <T>(response: AxiosResponse<T>) => response.data; // <T> added ere specifies the type of response we want to receive

const requests = {
    get: <T> (url: string) => axios.get<T>(url).then(responseBody),
    post: <T> (url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T> (url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    del: <T> (url: string) => axios.delete<T>(url).then(responseBody)
}

const Activities = {
    list: () => requests.get<Activity[]>('/activities'), // this is base URL + whatever we pass in this request
    details: (id: string) => requests.get<Activity>(`activities/${id}`),
    create: (activity: Activity) => requests.post<void>('/activities', activity),
    update: (activity: Activity) => requests.put<void>(`/activities/${activity.id}`, activity),
    delete: (id: string) => axios.delete<void>(`/activities/${id}`)
    // delete: (id: string) => requests.del<void>(`/activities/${id}`)
}

const agent = {
    Activities
}

export default agent;