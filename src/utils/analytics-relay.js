class AnalyticsRelay {
    relayInfo(...args) {
        console.log(...args);
    }

    relayError(...args) {
        console.error(...args);
    }
}

export default AnalyticsRelay;
