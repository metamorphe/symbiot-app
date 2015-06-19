function Entry(id, brightness, parentDom) {
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
        this._setListeners();
    },
    _setListeners: function() {
        var that = this;
        this.sendBtnDom.click(function(e) {
            e.preventDefault();
            that.setBrightness(that.valueDom.children().val());
        });
        this.refreshBtnDom.click(function(e) {
            e.preventDefault();
            that.refreshBrightness();
        });
    },
    destroy: function() {
        this.rootDom.remove();
    },
    setBrightness: function(brightness) {
        var that = this;
        jQuery.ajax({
            method: "POST",
            url: HOSTNAME + "/devices/" + this.id + "/" + brightness,
            dataType: "json",
            crossDomain: true
        })
        .done(function(data, textStatus, jqXHR) {
            that.brightness = brightness;
            that.brightnessDom.text("Brightness: " + brightness);
        })
        .fail(function(data, textStatus, jqXHR) {
            alert(textStatus);
        });
    },
    refreshBrightness: function(brightness) {
        var that = this;
        jQuery.ajax({
            method: "GET",
            url: HOSTNAME + "/devices/" + that.id,
            contentType: "application/json",
            dataType: "json",
            crossDomain: true
        })
        .done(function(data, textStatus, jqXHR) {
            that.brightness = brightness;
            that.brightnessDom.text("Brightness: " + brightness);
        })
        .fail(function(data, textStatus, jqXHR) {
            alert(textStatus);
        });
    }
}

function EntryList() {
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
        if (!id || id < 0 || id > this.MAX_ID) {
            alert("Error: invalid id");
        } else if (id in this.hash) {
            alert("Error: an entry with this id already exists.");
        } else {
            var that = this;
            jQuery.ajax({
                method: "POST",
                url: HOSTNAME + "/devices/" + id, 
                dataType: "json",
                crossDomain: true
            })
            .done(function(data, textStatus, jqXHR) {
                that.hash[id] = new Entry(id, 0, that.rootDom);
                that.hash[id].init();
            })
            .fail(function(data, textStatus, jqXHR) {
                alert(textStatus);
            });
        }
    },
    deleteEntry: function(id) {
        if (!(id in this.hash)) {
            alert("Error: no entry with this id exists");
        } else {
            //TODO: put ajax request here
            this.hash[id].destroy();
            delete this.hash[id]
        }
    },
    fetchServerList: function() {
        //TODO: GET request from server to populate client list
    }
}

function EntryManager() {
    this.PARENT_DOM = $('.container');
    this.rootDom = null;
    this.labelDom = null;
    this.inputDom = null;
    this.createBtnDom = null;
    this.deleteBtnDom = null;
}

EntryManager.prototype = {
    init: function() {
        this.rootDom = $('<div class="form-group"></div>').appendTo(this.PARENT_DOM);
        this.labelDom = $('<label for="newNodeId">New Node ID</label>').appendTo(this.rootDom);
        this.inputDom = $('<input type="number" class="form-control" id="newNodeId" placeholder="Enter the new node\'s ID">').appendTo(this.rootDom);
        this.createBtnDom =  $('<button type="button" class="create-btn btn btn-success">Create</button>').appendTo(this.rootDom);
        this.deleteBtnDom =  $('<button type="button" class="delte-btn btn btn-danger">Delete</button>').appendTo(this.rootDom);
        this._setListeners();
    },
    _setListeners: function() {
        var that = this;
        this.createBtnDom.click(function(e) {
            ENTRY_LIST.addEntry(that.inputDom.val());
            that.inputDom.val("");
        });
        this.deleteBtnDom.click(function(e) {
            ENTRY_LIST.deleteEntry(that.inputDom.val());
        });
    },
    synchronizeViewWithList: function() {
        var that = this;
        ENTRY_LIST.forEach(function(v, i, a) {
            v.init();
        });
    }
}

$(document).ready(function() {
    /* Global constant for AJAX requests. Must include port number in
     * the form:
     *
     * <hostname>:<port>
     */
    HOSTNAME = "http://localhost:8000";

    ENTRY_MANAGER = new EntryManager();
    ENTRY_MANAGER.init();
    ENTRY_LIST = new EntryList();
    ENTRY_LIST.init();
});

