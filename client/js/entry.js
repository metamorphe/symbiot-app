function Entry(defaultId, defaultBrightness, parent) {
    this.defaultId = defaultId || 0;
    this.defaultBrightness = defaultBrightness || 0;
    this.parent = parent;
    this.DOM = null;
    this.entryTop = null;
    this.entryBottom = null;
    this.id = null;
    this.brightness = null;
    this.value = null;
    this.sendBtn = null;
    this.refreshBtn = null;
}

Entry.prototype = {
    init: function() {
        this.DOM = $('<div class="entry"></div>').appendTo(this.parent);
        this.entryTop = $('<div class="entry-top"></div>')
                            .appendTo(this.DOM);
        this.entryBottom = $('<div class="entry-bottom"></div>')
                                .appendTo(this.DOM);
        this.id = $('<div class="id">ID: ' + this.defaultId + '</div>').appendTo(this.entryTop);
        this.brightness = $('<div class="brightness">BRIGHTNESS:</div>')
                                .appendTo(this.entryTop);
        this.value = $('<input class="value" placeholder="Enter new value"></div>')
                        .appendTo(this.entryBottom);
        this.sendBtn = $('<button class="sendBtn">SEND</div>')
                        .appendTo(this.entryBottom);
        this.refreshBtn = $('<button class="refreshBtn">REFRESH</div>')
                            .appendTo(this.entryBottom);
    },
    tmp: function() {}
}
