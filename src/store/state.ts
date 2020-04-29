export interface State {
    userName: string | null
    token: string | null
    roles: Array < string >
    permissions: Array < string >
}

export const state: State = {
    userName: '',
    token: '',
    roles: [],
    permissions: [],
}