
class ScreenshotFree {

    private port!: chrome.runtime.Port;

    constructor() {

        console.log("start");

        // Listen for connect.
        chrome.runtime.onConnect.addListener(port => {
            console.log(port.name)
            switch (port.name) {
                case 'screenshotfree':
                    if (this.port) this.port.disconnect();
                    this.port = port;
                    this.port.onMessage.addListener((message, port) => {
                        this.handler(message);
                    });
                    break;
                default:
                    break;
            }
        });
    }

    screenshot(windowId: number): void {
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            if (tabs.length && tabs[0] && tabs[0].windowId) windowId = tabs[0].windowId;
            chrome.tabs.captureVisibleTab(windowId, screenshot => {
                this.port.postMessage({ status: 'ok', screenshot })
            });
        });
    }

    handler(message: any) {
        switch (message.type) {
            case 'screenshot':
                let windowId = message.data;
                this.screenshot(windowId);
                break;
            case 'findwidow':
            case 'killtab':
            case 'version':
            case 'update':
                break;
            default:
                this.port.postMessage({ message: 'command not found' });
                break;
        }
    }
}

const sf = new ScreenshotFree();