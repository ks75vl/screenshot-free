class Content {
    constructor() {

        // Connect to extension.
        let port = chrome.runtime.connect(chrome.runtime.id, { name: 'screenshotfree' });
        port.onMessage.addListener(message => {
            window.postMessage({ type: 'from-screenshotfree', data: message }, window.location.origin)
        });

        // Set screenshot feature flag.
        localStorage.setItem('screenshot-free-feature', JSON.stringify(true));

        // Listen for response.
        window.addEventListener('message', e => {

            // Only allow current frame.
            if (e.source != window) return;

            // Only allow same origin
            if (!e.isTrusted || e.origin !== window.location.origin) return;

            // Handle message.
            switch (e.data.type) {
                case 'to-screenshotfree':
                    port.postMessage(e.data.data);
                    break
                case 'from-screenshotfree':
                    // Drop self message.
                    break;
                default:
                    break;
            }
        });

        let elem = document.createElement('script');
        elem.type = 'text/javascript';
        elem.src = `chrome-extension://${chrome.runtime.id}/screenshot-free-loader.js`;
        (document.head || document.documentElement).prepend(elem);
    }
}

const content = new Content();