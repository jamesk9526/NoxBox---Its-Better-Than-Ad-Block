"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaBlurController = void 0;
class MediaBlurController {
    constructor(initialOptions) {
        this.isActive = false;
        this.options = Object.assign({}, initialOptions);
        this.mutationObserver = new MutationObserver(this.handleMutations.bind(this));
    }
    /**
     * Start observing DOM changes and apply blur to existing media
     */
    start() {
        if (this.isActive)
            return;
        this.isActive = true;
        this.applyToExistingMedia();
        this.observeDOMChanges();
        this.updateCSSVariables();
    }
    /**
     * Stop observing DOM changes
     */
    stop() {
        if (!this.isActive)
            return;
        this.isActive = false;
        this.mutationObserver.disconnect();
    }
    /**
     * Update blur options and reapply to all media
     */
    updateOptions(newOptions) {
        this.options = Object.assign(Object.assign({}, this.options), newOptions);
        this.updateCSSVariables();
        this.applyToExistingMedia();
    }
    /**
     * Get current options
     */
    getOptions() {
        return Object.assign({}, this.options);
    }
    /**
     * Apply blur to all existing media elements
     */
    applyToExistingMedia() {
        if (this.options.blurImages) {
            document.querySelectorAll('img').forEach(this.blurElement.bind(this));
        }
        if (this.options.blurVideos) {
            document.querySelectorAll('video').forEach(this.blurElement.bind(this));
        }
    }
    /**
     * Set up MutationObserver to watch for new media elements
     */
    observeDOMChanges() {
        this.mutationObserver.observe(document.documentElement, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['src', 'srcset', 'poster'],
        });
    }
    /**
     * Handle DOM mutations
     */
    handleMutations(records) {
        for (const record of records) {
            // Handle newly added nodes
            for (const node of Array.from(record.addedNodes)) {
                if (!(node instanceof Element))
                    continue;
                this.processElement(node);
            }
            // Handle attribute changes (e.g., src changes)
            if (record.type === 'attributes' && record.target instanceof Element) {
                this.processElement(record.target);
            }
        }
    }
    /**
     * Process a single element and its children for media blurring
     */
    processElement(element) {
        // Check if this element itself is media
        if (element instanceof HTMLImageElement && this.options.blurImages) {
            this.blurElement(element);
        }
        else if (element instanceof HTMLVideoElement && this.options.blurVideos) {
            this.blurElement(element);
        }
        // Check child elements
        const mediaElements = element.querySelectorAll('img, video');
        mediaElements.forEach(mediaEl => {
            if (mediaEl instanceof HTMLImageElement && this.options.blurImages) {
                this.blurElement(mediaEl);
            }
            else if (mediaEl instanceof HTMLVideoElement && this.options.blurVideos) {
                this.blurElement(mediaEl);
            }
        });
    }
    /**
     * Apply blur class to a media element
     */
    blurElement(element) {
        if (!element.classList.contains('media-blurred')) {
            element.classList.add('media-blurred');
            element.setAttribute('data-blurred', 'true');
        }
    }
    /**
     * Update CSS variables for blur radius
     */
    updateCSSVariables() {
        const root = document.documentElement;
        root.style.setProperty('--blur-radius', `${this.options.blurRadiusPx}px`);
    }
}
exports.MediaBlurController = MediaBlurController;
