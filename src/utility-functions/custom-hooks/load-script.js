export function loadScript(src, windowVariableKey) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.src = src
        document.head.appendChild(script)
        script.onload = () => {
            if (windowVariableKey) {
                const windowVariableValue = window[windowVariableKey]
                resolve(windowVariableValue)
            } else {
                resolve(true)
            }
        }
        script.onerror = () => { resolve(false) }
    })
}