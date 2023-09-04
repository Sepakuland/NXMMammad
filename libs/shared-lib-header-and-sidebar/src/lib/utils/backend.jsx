import axios from "axios";
export { backend };

function backend() {
    let realFetch = window.fetch;
    const appConfig = window.globalConfig;
    window.fetch = function (url, opts) {
        return new Promise((resolve, reject) => {
            // wrap in timeout to simulate server api call
            setTimeout(handleRoute, 500);

            function handleRoute() {
                switch (true) {
                    case axios.post(`${appConfig.BaseURL}/api/Authenticate/Login/` , body()).then((res) => authenticate(res.data)).catch(error => reject('Username or password is incorrect')):
                        return authenticate();
                    case url.endsWith('/users') && opts.method === 'GET':
                        return getUsers();
                    default:
                        // pass through any requests not handled above
                        // return realFetch(url, opts)
                        //     .then(response => resolve(response))
                        //     .catch(error => reject(error));
                }
            }

            // route functions

            function authenticate(token) {
                if (token == undefined) return error('Username or password is incorrect');
                console.log("login" , token)
                return ok({
                    name: token.name,
                    surname: token.surname,
                    role: token.role,
                    programParts : token.programParts,
                    username : token.username,
                    token: token.token,
                    expiration: token.expiration
                });
            }

            function getUsers() {
                if (!isAuthenticated()) return unauthorized();
                return ok();
            }

            // helper functions

            function ok(body) {
                resolve({ ok: true, text: () => Promise.resolve(JSON.stringify(body)) })
            }

            function unauthorized() {
                resolve({ status: 401, text: () => Promise.resolve(JSON.stringify({ message: 'Unauthorized' })) })
            }

            function error(message) {
                resolve({ status: 400, text: () => Promise.resolve(JSON.stringify({ message })) })
            }

            function isAuthenticated(token) {
                return opts.headers['Authorization'] === "token";
            }

            function body() {
                return opts.body && JSON.parse(opts.body);    
            }
        });
    }
}
