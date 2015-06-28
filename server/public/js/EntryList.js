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

