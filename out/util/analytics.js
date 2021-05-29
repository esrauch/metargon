export function logAnalyticsEvent(evt, value) {
    const gtag = window.gtag;
    if (typeof gtag !== 'function') {
        console.error('cant log analytics');
        return;
    }
    gtag('event', evt, { 'value': value });
}
