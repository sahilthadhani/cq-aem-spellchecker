MultiField = CQ.Ext.extend(CQ.form.CompositeField, {
    hiddenField: null,
    tempItems:null,
    path:null,

    constructor: function (config) {
        config = config || {};
        if(config.path != null) {
            this.path = config.path;
        }
        var defaults = {
            "border": false,
            "layout": "form"
        };
        config = CQ.Util.applyDefaults(config, defaults);
        MultiField.superclass.constructor.call(this, config);
    },

    //overriding CQ.Ext.Component#initComponent
    initComponent: function () {
        MultiField.superclass.initComponent.call(this);
        
        // Add hidden field - used for storing the content
        this.hiddenField = new CQ.Ext.form.Hidden({ name: this.name });
        this.add(this.hiddenField);

        // setup variables
        var i=0;
        this.tempItems = [];
        
        //Build the panel that is referenced in the path
        var panel = CQ.Util.build({
            "jcr:primaryType":"cq:Widget",
            "xtype":"cqinclude",
            "path":this.path
        });
        
        //Loop through each component, and add a listener to update the hidden field
        while (panel.getComponent(0)) {
            this.tempItems[i] = panel.getComponent(0);
            this.tempItems[i].on("dialogclose", this.updateHiddenField, this);
            this.tempItems[i].on("change", this.updateHiddenField, this);
            this.tempItems[i].on("selectionchanged", this.updateHiddenField, this);
            this.tempItems[i].on("check", this.updateHiddenField, this);
            this.add(this.tempItems[i]);
            i++;
        }

        //Add to new Panel
        var frame = new CQ.Ext.Panel({
            layout:		"column",
            border: 	false,
            title:		panel.getName(),
            /*toggleCollapse: true,*/
            titleCollapse: true,
            collapsible: true,
            /*collapsed : true,*/
            /*draggable: true,*/
            autoWidth:	false,
            boxMaxWidth:600,
            width:		600,
            defaults:{
                layout:		"form",
                border:		false,
                hideLabel:	false,
                labelWidth:	0
            },
            items:[ { items:[ this.tempItems ] } ]
        });

        this.add(frame);
    },

    processInit: function (path, record) {
        for (var i=0; i < this.tempItems.length; i++){
            this.tempItems[i].processInit(path, record);
        }
    },
    
    //override existing function
    getValue: function () {
        return this.getRawValue();
    },

    //override existing function
    //Cycle through each value and add each one to the list
    getRawValue: function () {
        var list = {};
        for (var i=0; i < this.tempItems.length; i++){
            var id = this.tempItems[i].getName();
            list[id]=this.tempItems[i].getValue();
        }
        return JSON.stringify(list);
    },

    //override existing function
    //Cycle through list of items, and set value of each one
    setValue: function(value) {
        var list = JSON.parse(value);
        for(var i=0; i < this.tempItems.length; i++) {
            var id = this.tempItems[i].getName();
            this.tempItems[i].setValue(list[id]);
        }
        this.hiddenField.setValue(value);
    },
        
    updateHiddenField: function() {
        this.hiddenField.setValue(this.getValue());
    }
});

CQ.Ext.reg('multifieldList', MultiField);
