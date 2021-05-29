export function logAnalyticsEvent(evt: string, value?: number) {
    const gtag = (window as any).gtag;
    if (!gtag) {
        console.error('cant log analytics');
        return;
    }
    gtag('event', evt, {'value': value});
}
