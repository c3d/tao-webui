/** MultiCellSelectionModel - extends Ext.selection.Model,
*
*  Starts with some of the code from Ext.selection.CellModel
*  but supports full multiple cell selection and range selection*  while also preserving all cell records correctly. JP-
*  Obtained in http://www.sencha.com/forum/showthread.php?214050-Multicell-selection-mode-on-grid&p=821190#post821190
**/
Ext.define('TE.util.MultiCellSelectionModel', {    
    requires: [
        'Ext.selection.Model',
        'Ext.grid.CellContext',
        'Ext.util.KeyNav'
    ],
    extend: 'Ext.selection.Model',
    alias: 'selection.multiplecellmodel',
    /**    * @cfg {Boolean} enableKeyNav   
    * Turns on/off keyboard navigation within the grid.    
    */    
    enableKeyNav: true,
    /**    
    * @cfg {Boolean} preventWrap    
    * Set this configuration to true to prevent wrapping around of selection as    
    * a user navigates to the first or last column.    
    */    
    preventWrap: false,
    selected: null,
    constructor: function () {
        this.addEvents(        
            /**        
            * @event deselect        
            * Fired after a cell is deselected        
            * @param {Ext.selection.CellModel} this        
            * @param {Ext.data.Model} record The record of the deselected cell        
            * @param {Number} row The row index deselected        
            * @param {Number} column The column index deselected        
            */            'deselect',
            /**        
            * @event select        
            * Fired after a cell is selected        
            * @param {Ext.selection.CellModel} this        
            * @param {Ext.data.Model} record The record of the selected cell        
            * @param {Number} row The row index selected        
            * @param {Number} column The column index selected        
            */            'select'        
        );
        this.callParent(arguments);
    },
    bindComponent: function (view) {
        var me = this;        
        me.primaryView = view;        
        me.views = me.views || [];        
        me.views.push(view);        
        //me.bind(view.getStore(), true);        
        me.bindStore(view.getStore(), true);  
        // updated for 4.1.x from 4.0
        view.on({            
            cellmousedown: me.onMouseDown,            
            refresh: me.onViewRefresh,            
            scope: me
        });
        if (me.enableKeyNav) {            
            me.initKeyNav(view);        
        }    
    },
    initKeyNav: function (view) {
        var me = this;        
        if (!view.rendered) {            
            view.on('render', Ext.Function.bind(me.initKeyNav, me, [view], 0), me, { single: true });     
            return;
        }
        view.el.set({          
            tabIndex: -1        
        });
        me.keyNav = Ext.create('Ext.util.KeyNav', view.el, {  
            up: me.onKeyUp,            
            down: me.onKeyDown,            
            right: me.onKeyRight,            
            left: me.onKeyLeft,            
            tab: me.onKeyTab,            
            scope: me        
        });    
    },
    getHeaderCt: function () {
        return this.primaryView.headerCt;    
    },
    allCellDeselect: function () {
        var me = this;            
        var i = 0;            
        var len = me.selected.items.length;
        for (; i < len; i++) {            
            if(me.selected.items[i])                
                me.primaryView.onCellDeselect(me.selected.items[i].position);        
        }
        me.fireEvent('deselect', me, this.selected);     
        me.selected.items = [];
    },
    onKeyUp: function (e, t) {
        this.move('up', e);    
    },
    onKeyDown: function (e, t) {
        this.move('down', e);    
    },
    onKeyLeft: function (e, t) {        
        this.move('left', e);    
    },
    onKeyRight: function (e, t) {
        this.move('right', e);    
    },
    move: function (dir, e) {
        var me = this;   
        var pos = me.primaryView.walkCells(me.getCurrentPosition(), dir, e, me.preventWrap);

        var cell = me.view.getCellByPosition(pos);
        if(!cell)
            return;
        if (pos) {            
            me.setCurrentPosition(pos);            
            pos.dataIndex = me.primaryView.headerCt.gridDataColumns[pos.column].dataIndex        
        }
        cell.position = pos;        
        cell.position.record = me.primaryView.getRecord(cell.dom.parentNode);
        var record = {               
            cell: cell            
        };

        if (e.ctrlKey && me.isSelected(record)) {
            if (me.allowDeselect) {
                var index = this.selected.items.indexOf(cell);                
                this.selected.items.splice(index, 1);                
                me.primaryView.onCellDeselect(me.getCurrentPosition());            
            }
        } 
        else if (e.shiftKey && me.lastSelected) {
            if (me.getCurrentPosition()) {
                me.allCellDeselect();            
            }
            me.selectRange(record, false);
        } 
        else if (e.ctrlKey) {
            me.doMultiSelect(record, true, true);        
        } 
        else {
            if (me.getCurrentPosition()) {
                me.allCellDeselect();            
            }
            me.doSingleSelect(record, true);       
        }
        return pos;
    },
    /**    
    * Returns the current position in the format {row: row, column: column}    
    */   
    getCurrentPosition: function () {
        return this.position;    
    },
    /**    
    * Sets the current position    
    * @param {Object} position The position to set.    
    */  
    setCurrentPosition: function (pos) {
        var me = this;        
        this.position = pos;    
    },
    /**    * Set the current position based on where the user clicks.    * @private    */    
    onMouseDown: function (view, cell, cellIndex, record, row, rowIndex, e) {
        var me = this;
        if (e.button === 0) {        
            me.setCurrentPosition({       
                view:view,         
                row: rowIndex,                
                column: cellIndex,               
                dataIndex: view.headerCt.gridDataColumns[cellIndex].dataIndex            
                });
            me.selectWithEvent(record, e);        
        }    
    },
    isSelected: function (record) {
        record = Ext.isNumber(record) ? this.store.getAt(record) : record;
        if (this.selected.items == null || this.selected.items == '') 
        {
            return false;        
        }
        return this.selected.items.indexOf(record.cell) !== -1;    
    },
    selectWithEvent: function (record, e) {
        var me = this, r;     
        var cell = me.view.getCellByPosition(me.getCurrentPosition());       
        cell.position = me.getCurrentPosition();
        cell.position.record = record;        
        r = {            
            cell: cell        
        }
        switch (me.selectionMode) {
            case 'MULTI':
                if (e.ctrlKey && me.isSelected(r)) {
                    if (me.allowDeselect) {   // only delete so we can use cell                                               
                        var index = this.selected.items.indexOf(cell);                        
                        this.selected.items.splice(index, 1);                        
                        me.primaryView.onCellDeselect(me.getCurrentPosition());                    
                    }
                } 
                else if (e.shiftKey && me.lastSelected) {
                    if (me.getCurrentPosition()) {                        
                        me.allCellDeselect();                    
                    }
                    me.selectRange(r, false);
                } 
                else if (e.ctrlKey) {                    
                    me.doMultiSelect(r, true, true);
                } 
                else {                    
                    if (me.getCurrentPosition()) {
                        me.allCellDeselect();                    
                    }
                    me.doSingleSelect(r, true);                
                }
                break;
            case 'SIMPLE':     // SIMPLE DOESN'T WORK CORRECTLY HAVE NOT ATTEMPTED TO FIX
            {
                if (me.isSelected(r)) {
                    me.doDeselect(r);
                } 
                else {
                    me.doSelect(r, true);                
                }
                break;
            }
            case 'SINGLE':    // SINGLE DOESN'T WORK CORRECTLY HAVE NOT ATTEMPTED TO FIX, USE REGULAR CELL MODEL
            {
                if (me.allowDeselect && me.isSelected(r)) {
                    me.doDeselect(r);
                } else {
                    me.doSelect(r, false);                
                }
                break;    
            }    
        }    
    },
    doSingleSelect: function (record, suppressEvent) {
        var me = this;
        var changed = false;
        var selected = me.selected;
        if (me.locked) {
            return;        
        }
        if (me.isSelected(record)) {
            return;        
        }
        function commit() {            
            me.bulkChange = true;            
            if (selected.getCount() > 0 && me.doDeselect(me.lastSelected, suppressEvent) === false) 
            {                
                delete me.bulkChange;                
                return false;            
            }            
            delete me.bulkChange;
            me.selected.items.push(record.cell);            
            me.lastSelected = record;            
            changed = true;        
        }
        me.onSelectChange(record.cell, true, suppressEvent, commit);        
        me.primaryView.onCellSelect(record.cell.position);
        if (changed) {            
            if (!suppressEvent) {                
                me.setLastFocused(record.cell);            
            }            
            me.maybeFireSelectionChange(!suppressEvent);        
        }    
    },
    doMultiSelect: function (records, keepExisting, suppressEvent) 
    {
        var me = this;
        var change = false;
        var i = 0
        var len, record;        
        var selected = me.selected;

        if (me.locked) {            
            return;        
        }

        records = !Ext.isArray(records) ? [records] : records;        
        len = records.length;
        if (!keepExisting && selected.getCount() > 0) {
            if (me.doDeselect(me.getSelection(), suppressEvent) === false) 
            {
                return;            
            }        
        }
        function commit() {
            selected.items.push(record.cell);    // keep items as records not cells!           
            change = true;        
        }
        for (; i < len; i++) {
            record = records[i];
            if (keepExisting && me.isSelected(record)) {                
                continue;            
            }
            me.onSelectChange(record.cell, true, suppressEvent, commit);            
            me.primaryView.onCellSelect(record.cell.position);        
        }
        me.setLastFocused(record.cell, suppressEvent);        
        me.maybeFireSelectionChange(change && !suppressEvent);    
    },
    selectRange: function (record, keepExisting) {
        var me = this;       
        var start, end, x, y, xmin, ymin, xmax, ymax;   
        var records = [];

        if (me.isLocked()) {            
            return;        
        }
        start = record.cell.position;        
        end = me.lastSelected.cell.position;

        if (start.column < end.column) {
            xmin = start.column;            
            xmax = end.column;        
        } else {
            xmin = end.column;            
            xmax = start.column;        
        }

        if (start.row < end.row) {
            ymin = start.row;            
            ymax = end.row;        
        } else {
            ymin = end.row;            
            ymax = start.row;       
        }
        for (x = xmin; x <= xmax; x++) {
            for (y = ymin; y <= ymax; y++) {
                var cell = me.view.getCellByPosition({ row: y, column: x });                
                cell.position = {                     
                    row: y,                     
                    column: x,                    
                    dataIndex: me.primaryView.headerCt.gridDataColumns[x].dataIndex,                    
                    record: me.primaryView.getRecord(cell.dom.parentNode)                
                };                
                record.cell = cell;                       
                // append cell to record and pass it to domultiselect                
                me.doMultiSelect(record, keepExisting, true);           
            }       
        }    
    },
    onSelectChange: function (record, isSelected, suppressEvent, commitFn) 
    {
        var me = this;       
        var view = me.view;        
        var eventName = isSelected ? 'select' : 'deselect';
        if ((suppressEvent || me.fireEvent('before' + eventName, me, record)) !== false && commitFn() !== false) 
        {
            if (isSelected) {                
                view.onItemSelect(record);           
            } else {                
                view.onItemDeselect(record);            
            }
            if (!suppressEvent) {                
                me.fireEvent(eventName, me, record);            
            }        
        }   
    },  // end onSelectChange
    onKeyTab: function (e, t) {
        var me = this;        
        var direction = e.shiftKey ? 'left' : 'right';        
        var editingPlugin = me.view.editingPlugin;        
        var position = me.move(direction, e);
        if (editingPlugin && position && me.wasEditing) {            
            editingPlugin.startEditByPosition(position);        
        }
        delete me.wasEditing;    
    },
    onEditorTab: function (editingPlugin, e) {
        var me = this;        
        var direction = e.shiftKey ? 'left' : 'right';        
        var position = me.move(direction, e);
        if (position) {
            editingPlugin.startEditByPosition(position);            
            me.wasEditing = true;        
        }    
    },
    refresh: Ext.emptyFn,
    onViewRefresh: Ext.emptyFn,
    selectByPosition: function (position) {
        this.setCurrentPosition(position);    
    } 
});  