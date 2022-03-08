export const isDeveloper = () => {
    const urlParams = new URLSearchParams(window.location.search); 
    return urlParams.has("developer") && urlParams.get("developer")==="1";
    } 