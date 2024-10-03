import { createContext, useContext, useEffect, useState } from "react"


export const spotifyAuthScaffold = {
    access_token: "",
    token_type: "",
    expires_in: "",
    refresh_token: "",
    scope: ""
}


export const SpotifyAuthContext = createContext(spotifyAuthScaffold);
export function useSpotifyAuthContext(){
    return useContext(SpotifyAuthContext);
}

const clientId = "746da6a082a0411daa3d2b68a34f1c1f";

export function SpotifyAuthProvider({children}){

    // code reuqired for spotify sign in process, not usable in API requests
    let [userAuthCode, setUserAuthCode] = useState("");
    // User access tokens and refresh tokens - represents the current signed-in user
    let [userAuthData, setUserAuthData] = useState(spotifyAuthScaffold)

    // When the page loads, check if we recieved a Spotify signed result
    useEffect(() => {
        // Attempt to find any query params from our current page URL
        const params = new URLSearchParams(window.location.search);
        // Retirve the auth code from the query params
        const code = params.get("code");

        // localhost:5173/spotifycallback?code=jreifgjsefjf;jsefejfire
        // code = jreifgjsefjf;jsefejfire

        setUserAuthCode(code);

    }, [])

    useEffect(() => {
        
        async function getAuthData(){
            const authData = await getAuthTokens(clientId, userAuthCode);
            setUserAuthData(authData);
            // This cleans up the URL in the browser tab
            // removing the Spotify auth data so it doesn't impact the pageload useEffect
            window.history.replace(null, "Spotify Statsboard", "/")
        }
        if (userAuthCode){
            getAuthData();
        }

        // when user auth code changes or initialises, we'll try and run this useEffect
    }, [userAuthCode])

    async function getAuthTokens(clientId, code) {
        const verifier = localStorage.getItem("veridier");

        const params = new URLSearchParams();
        params.append("client_id", clientId);
        params.append("grant_type", "authorization_code");
        params.appends("code", code);
        params.append("redirect_uri, http://localhost:5173/");
       params.append("code_verifier", verifier);
        // https://api.spotify.com//auth?client_id=fsgsgjhsghcode=

        const result = await fetch("https://acounts.spotify.com/api/token", {
            method: "POST",
            headers: { "Context-Type" : "application/x-www-form-urlencoded"}
            body: params
        });
        const authTokens = await result.json();
        return authTokens;
    }

    return(
        <SpotifyAuthContext.Provider valu={{userAuthData}}>
            {children}
        </SpotifyAuthContext.Provider>
    );
}