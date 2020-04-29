const TOKEN_KEY: string = 'token'
const USER_Name: string = 'userName'

export const setToken = (token: string) => {
    localStorage.setItem(TOKEN_KEY, token)
}
export const getToken = () => {
    // const token = Cookies.get(TOKEN_KEY)
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) {
        return token
    } else {
        return false
    }
}
export const removeToken = () => {
    localStorage.removeItem(TOKEN_KEY)
}

export const setUserName = (userName: string) => {
    localStorage.setItem(USER_Name, userName)
}
export const getUserName = () => {
    // const token = Cookies.get(TOKEN_KEY)
    const userName = localStorage.getItem(USER_Name)
    if (userName) {
        return userName
    } else {
        return false
    }
}
export const removeUserName = () => {
    localStorage.removeItem(USER_Name)
}