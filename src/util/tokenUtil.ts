/** token在localStorage中的键值 */
export const TOKEN_KEY: string = 'token'

/**
 * 将token存入localStorage
 * @param token 
 */
export const setToken = (token: string) => {
	localStorage.setItem(TOKEN_KEY, token)

}

/**
 * 获取token内容
 */
export const getToken = () => {
	// const token = Cookies.get(TOKEN_KEY)
	const token = localStorage.getItem(TOKEN_KEY)
	if (token) {
		return token
	} else {
		return false
	}
}

/**
 * 移除localStorage中的token
 */
export const removeToken = () => {
	localStorage.removeItem(TOKEN_KEY)
}