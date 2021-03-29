import React, { useEffect, useState } from 'react';

const ImportScript = ({ resourceUrl, link = false }) => {
    const [resourceUrlVal] = useState(resourceUrl)
    function loadScript() {
        const script = document.createElement('script');
        script.src = resourceUrlVal;
        script.id = resourceUrl
        script.async = true;
        document.head.appendChild(script);
        return () => {
            document.head.removeChild(script);
        }
    }
    function loadLink() {
        // if (!document.getElementById(resourceUrl)) {
        var link = document.createElement('link');
        link.id = resourceUrl
        link.rel = 'stylesheet';
        link.href = resourceUrlVal;
        document.head.appendChild(link);
        // }
        return () => {
            document.head.removeChild(link);
        }
    }
    useEffect(() => {
        return link ? loadLink() : loadScript()
    }, [resourceUrlVal]);
    return null;
};
export default ImportScript;