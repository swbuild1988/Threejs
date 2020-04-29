export interface UserInfo {
    username: any,
        password: any
}

export interface RouteInfo {
    routers: any,
        addRouters: any
}

export interface User {
    id: number,
        name: string,
        password: string
}

/** 用户类 */
export class UserClass {
    constructor(public id: number, public name: string) {}
}