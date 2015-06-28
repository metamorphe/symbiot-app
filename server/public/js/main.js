/* 
 * main.js 
 *
 * Documentation coming soon.
 *
 */

function Entry(address, brightness, parentDom) {
    this.address = address || 0;
    this.brightness = brightness || 0;
    this.MIN_BRIGHTNESS = 0;
    this.MAX_BRIGHTNESS = 100;
    this.parentDom = parentDom;
    this.rootDom = null;
    this.entryTopDom = null;
    this.entryBottomDom = null;
    this.addressDom = null;
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
        this.addressDom = $('<div class="address navbar-text">ID: ' + this.address + '</div>').appendTo(this.entryTopDom);
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
        brightness = Math.round(brightness);
        if (isNaN(brightness) || brightness < this.MIN_BRIGHTNESS
            || brightness > this.MAX_BRIGHTNESS) {
            alert("Error: brightness must be an integer between "
                    + this.MIN_BRIGHTNESS + " and " + this.MAX_BRIGHTNESS);
            return;
        }
        var that = this;
        jQuery.ajax({
            method: "POST",
            url: HOSTNAME + "/devices/" + this.address + "/" + brightness
        })
        .done(function(data, textStatus, jqXHR) {
            that.brightness = brightness;
            that.brightnessDom.text("Brightness: " + brightness);
            that.valueDom.children().val("");
        })
        .fail(function(data, textStatus, jqXHR) {
            alert(textStatus);
        });
    },
    refreshBrightness: function(brightness) {
        var that = this;
        jQuery.ajax({
            method: "GET",
            url: HOSTNAME + "/devices/" + that.address,
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
    addEntry: function(address) {
        id = Math.round(address);
        if (!address || address < 0 || address > this.MAX_ID) {
            alert("Error: invalid id");
        } else if (address in this.hash) {
            alert("Error: an entry with this id already exists.");
        } else {
            var that = this;
            jQuery.ajax({
                method: "POST",
                url: HOSTNAME + "/devices/" + address, 
            })
            .done(function(data, textStatus, jqXHR) {
                that.hash[address] = new Entry(id, 0, that.rootDom);
                that.hash[address].init();
            })
            .fail(function(data, textStatus, jqXHR) {
                alert(textStatus);
            });
        }
    },
    deleteEntry: function(address) {
        if (!(address in this.hash)) {
            alert("Error: no entry with this id exists");
        } else {
            //TODO: put ajax request here
            jQuery.ajax({
                method: "DELETE",
                url: HOSTNAME + "/devices/" + address,
                dataType: "json"
            });
            this.hash[address].destroy();
            delete this.hash[address]
        }
    },
    fetchServerList: function() {
        var that = this;
        jQuery.ajax({
            method: "GET",
            url: HOSTNAME + "/devices/"
        })
        .done(function(data, textStatus, jqXHR) {
            var deviceHash = jqXHR.responseJSON;
            var newEntry;
            /* Make two passes, once over the JSON and once
             * over the existing hash to add and delete objects
             * respectively. */
            jQuery.each(deviceHash, function(index, object) {
                if (!that.hash[object.address]) {
                    that.hash[object.address] = new Entry(object.address,
                                object.brightness, that.rootDom);
                    that.hash[object.address].init();
                }
            });
            jQuery.each(that.hash, function(index, object) {
                if (!deviceHash[object.address]) {
                    that.hash[object.address].destroy();
                    delete that.hash[object.address];
                }
            });
        })
        .fail(function(data, textStatus, jqXHR) {
            alert("Error: could not fetch devices from database");
        });
    },
    deleteList: function() {
        jQuery.ajax({
            method: "DELETE",
            url: HOSTNAME + "/devices/",
            dataType: "json"
        });
        this.fetchServerList();
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
        this.buttonGroupDom = $('<div class="btn-group" role="group"></div>').appendTo(this.rootDom);
        this.createBtnDom =  $('<button type="button" class="create-btn btn btn-success">Create</button>').appendTo(this.buttonGroupDom);
        this.deleteBtnDom =  $('<button type="button" class="delete-btn btn btn-danger">Delete</button>').appendTo(this.buttonGroupDom);
        this.refreshBtnDom =  $('<button type="button" class="refresh-btn btn btn-info">Refresh List</button>').appendTo(this.buttonGroupDom);
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
        this.refreshBtnDom.click(function(e) {
            ENTRY_LIST.fetchServerList();
        });
    }
}

$(document).ready(function() {
    /* Global constant for AJAX requests. Must include port number in
     * the form:
     *
     * <hostname>:<port>
     */
    HOSTNAME = "http://localhost:3000";

    ENTRY_MANAGER = new EntryManager();
    ENTRY_MANAGER.init();
    ENTRY_LIST = new EntryList();
    ENTRY_LIST.init();
    ENTRY_LIST.fetchServerList();
});

