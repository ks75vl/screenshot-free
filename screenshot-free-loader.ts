class ScreenshotFreeLoader {
    private resolve!: (value: string) => void;
    private reject!: (value: string) => void;
    constructor() {
        window.addEventListener('message', e => {
            if (e.source !== window) return;
            if (e.origin !== window.location.origin) return;
            switch (e.data.type) {
                case 'to-screenshotfree':
                    break;
                case 'from-screenshotfree':
                    this.resolve(e.data);
                    break;
                default:
                    break;
            }
        });
        Object.assign(window, {
            ScreenshotFree: {
                screenshot: (id: number) => new Promise((resolve, reject) => {
                    this.resolve = resolve;
                    this.reject = reject;
                    window.postMessage({ type: 'to-screenshotfree', data: { type: 'screenshot', data: id } });
                })
            }
        });
    }
}

let screenshotFreeLoader = new ScreenshotFreeLoader();