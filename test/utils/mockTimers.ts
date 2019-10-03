let originalSetTimeout = global.setTimeout;

export const before = () => {
    originalSetTimeout = global.setTimeout;
};

export const after = () => {
    global.setTimeout = originalSetTimeout;
};
