function Entry(id, brightness, parentDom)
{
    this.id = id || 0;
    this.brightness = brightness || 0;
    this.parentDom = parentDom;
    this.rootDom = null;
    this.entryTopDom = null;
    this.entryBottomDom = null;
    this.idDom = null;
    this.brightnessDom = null;
    this.valueDom = null;
    this.sendBtnDom = null;
    this.refreshBtnDom = null;
}

Entry.prototype = {
    init: function() {
        this.rootDom = $('<div class="entry navbar navbar-default"></div>').appendTo(this.parentDom);
        this.entryTopDom = $('<div class="entry-top container-fluid"></div>')
                            .appendTo(this.rootDom);
        this.entryBottomDom = $('<form class="entry-bottom navbar-form navbar-left"></div>') .appendTo(this.rootDom);
        this.idDom = $('<div class="id navbar-text">ID: ' + this.id + '</div>').appendTo(this.entryTopDom);
        this.brightnessDom = $('<div class="brightness navbar-text">Brightness: ' + this.brightness + '</div>').appendTo(this.entryTopDom);
        this.valueDom = $('<div class="form-group"><input class="value" placeholder="Enter new value"></div></div>').appendTo(this.entryBottomDom);
        this.sendBtnDom = $('<button class="send-btn btn btn-default">Send</div>').appendTo(this.entryBottomDom);
        this.refreshBtnDom = $('<button class="refreshBtn btn btn-default"><span class="glyphicon glyphicon-refresh" aria-hidden="true"></span></button>').appendTo(this.entryBottom);
    },
    destroy: function() {
        this.rootDom.remove();
    },
    setBrightness: function(brightness) {
        //TODO: put ajax request here
        this.brightness = brightness;
        this.brightnessDom.text("Brightness: " + brightness);
    }
}

function EntryList ()
{
    this.hash = {};
    this.PARENT_DOM = $('.container');
    this.rootDom = null;
    this.MAX_ID = 15;
}

EntryList.prototype = {
    init: function() {
        this.rootDom = $('<div class="entry-list"></div>').appendTo(this.PARENT_DOM);
    },
    addEntry: function(id) {
        if (id < 0 || id > this.MAX_ID) {
            alert("Error: invalid id");
        } else if (id in this.hash) {
            alert("Error: an entry with this id already exists.");
        } else {
            this.hash[id] = new Entry(id, 0, this.rootDom);
            this.hash[id].init();
        }
    },
    deleteEntry: function(id) {
        if (!(id in this.hash)) {
            alert("Error: no entry with this id exists");
        } else {
            this.hash[id].destroy();
            delete this.hash[id]
        }
    }
}


$(document).ready(function() {
    ENTRY_LIST = new EntryList();
    ENTRY_LIST.init();
});

