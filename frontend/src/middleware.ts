export {default } from "next-auth/middleware"

/*  Este será el intermediario para proteger
    las páginas internas en caso usuario no esté logueado
    https://next-auth.js.org/deployment
*/
export const config = { matcher: ["/chat", "/events", "/dashboard"]}