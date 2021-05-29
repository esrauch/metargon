export function logAnalyticsEvent(evt, value) {
    const gtag = window.gtag;
    if (!gtag) {
        console.error('cant log analytics');
        return;
    }
    gtag('event', evt, { 'value': value });
}
