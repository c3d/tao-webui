Ext.define('TE.util.CustomGridEditor', {
    extend:'Ext.grid.Panel',
    alias: 'widget.customgrideditor',
    requires: ["TE.util.MultiCellSelectionModel"],
    border: false,
    verticalScrollerType: 'paginggridscroller',
    invalidateScrollerOnRefresh: false,
    viewConfig:{
        markDirty:false
    },
    selType: 'multiplecellmodel',
    multiSelect : true,
    plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
        clicksToEdit: 2,
        pluginId: 'cellEditing',
        listeners: {
            edit: function() {
                this.grid.updateData();
            }
        }
    })],
    tbar: [{
        scope: this.grid,
        itemId: 'addRow',
        text: 'Add',
        handler : function() {
            var grid  = this.ownerCt.ownerCt;
            var cellEditing = grid.getPlugin('cellEditing');
            var newRow = grid.store.getCount();

            cellEditing.cancelEdit();
            grid.store.add({"a":"", "b":"", 'c':'', 'd':''})
            cellEditing.startEdit(newRow, 0);
        }
    }, {
        itemId: 'removeRow',
        text: 'Remove',
        handler: function() {
            var grid  = this.ownerCt.ownerCt;
            var cellEditing = grid.getPlugin('cellEditing');
            var sm = grid.getSelectionModel();

            cellEditing.cancelEdit();
            var recs = sm.getSelection();
            for(var i = 0; i < recs.length; i++)
                grid.store.remove(recs[i].position.record);

            grid.updateData();
        },
    }],
     listeners: {                
        viewready: function(grid) {            
            var map = new Ext.KeyMap(grid.getEl(), 
            [{
                key: "c",
                ctrl:true,
                fn: function(keyCode, e) {
                    var recs = grid.getSelectionModel().getSelection();

                    // Sort selected records by row and by column
                    recs = grid.sortSelectedRecords(recs);

                    if (recs && recs.length != 0) {

                       var clipText = grid.getCsvDataFromRecs(recs);

                       var ta = document.createElement('textarea');

                       ta.id = 'cliparea';
                       ta.style.position = 'absolute';
                       ta.style.left = '-1000px';
                       ta.style.top = '-1000px';
                       ta.value = clipText;
                       document.body.appendChild(ta);
                       document.designMode = 'off';

                       ta.focus();
                       ta.select();

                       setTimeout(function(){

                           document.body.removeChild(ta);

                       }, 100);
                    }
                }
            },
            {
                key: "v",
                ctrl:true,
                    fn: function() {

                        var ta = document.createElement('textarea');
                        ta.id = 'cliparea';

                        ta.style.position = 'absolute';
                        ta.style.left = '-1000px';
                        ta.style.top = '-1000px';
                        ta.value = '';

                        document.body.appendChild(ta);
                        document.designMode = 'off';

                        setTimeout(function(){

                        grid.getRecsFromCsv(grid, ta);

                    }, 100);

                    ta.focus();
                    ta.select();
                }
            }]);
        }
    },
    getCsvDataFromRecs: function(records) {
        var clipText = '';
        var store = this.store;
        var currRow = records[0].position.row + 1;
        for (var i=0; i<records.length; i++) {
            var rec = records[i];
            var index = rec.position.row + 1;
            var r = index;
            var val = rec.position.record.data[rec.position.dataIndex];
            
            // Check that new value is not null. If it is, then use empty string
            if((val == null) ||  (val == 'null'))
                val = "";

            if (r === currRow) {
                clipText = clipText.concat(val,"\t");
             } else {
                currRow = r;
                clipText = clipText.concat("\n", val, "\t");
            }
        }
        clipText = clipText.concat("\n");
        return clipText;
    },
    getRecsFromCsv: function(grid, ta) {
        document.body.removeChild(ta);
        var rows = ta.value.split("\n");

        // Remove white spaces in rows
        for(var i = 0; i < rows.length; i++)
            rows[i] = Ext.util.Format.trim(rows[i]);

        var columns = [];
        var recs = grid.getSelectionModel().getSelection();

        // Sort selected records by row and by column
        recs = this.sortSelectedRecords(recs);

        // If only one cell in clipboard data, block fill process (i.e. copy a cell, then select a group of cells to paste)
        if( rows[0].split("\t").length==1 && ( (rows.length==1) || (rows.length==2  && rows[1].trim()== "")))
        {            
            for(var i = 0; i < recs.length; i++)
            {
                var rec = recs[i].position.record;
                var dataIndex = recs[i].position.dataIndex;
                var row = recs[i].position.row;
                rec.data[dataIndex] = rows[0];
                grid.store.removeAt(row);
                grid.store.insert(row, rec);
            }
        }
        else
        {
            var nextIndex = 0;
            var gridTotalRows = grid.store.getCount();
            var currentRow = 0;

            for(var rowIndex = 0; rowIndex < (rows.length - 1); rowIndex++ ){
                columns = rows[rowIndex].split("\t");

                /* Check there is a correct selected record.
                *  If not, then get corresponding record in the store
                *  or create it.
                **/
                var selected = recs[nextIndex];
                var isNotSelected = false;
                var currentCol = 0;
                if(! selected)
                {
                    currentRow = currentRow + 1;
                    currentDataIndex = recs[nextIndex - 1].position.dataIndex;
                    if(currentRow >= gridTotalRows)
                        grid.store.add({"a":"", "b":"", 'c':'', 'd':''});

                    currentRec = grid.store.getAt(currentRow);
                    currentCol = recs[0].position.column;

                    isNotSelected = true;
                }

                for(var columnIndex=0; columnIndex < columns.length; columnIndex++ )
                {
                    // Check if column index is out of range.
                    if(currentCol >= grid.columns.length)
                        continue;

                    if(! isNotSelected)
                    {
                        /* Check there is a correct selected record.
                        *  If not, then get corresponding record in the store
                        **/
                        selected = recs[nextIndex];
                        if(! selected)
                        {
                            currentDataIndex = grid.columns[currentCol].dataIndex;
                            currentRec = grid.store.getAt(currentRow);
                        }
                        else
                        {
                            // Get selected record
                            currentCol = recs[nextIndex].position.column;
                            currentDataIndex = recs[nextIndex].position.dataIndex;
                            currentRow = recs[nextIndex].position.row;
                            currentRec = recs[nextIndex].position.record;
                            nextIndex++;
                        }
                    }
                    else
                    {
                        currentDataIndex = grid.columns[currentCol].dataIndex;
                    }

                    // Check that new value is not null, otherwise use empty string
                    if((columns[columnIndex] != null) && (columns[columnIndex] != 'null'))
                        currentRec.data[currentDataIndex] = columns[columnIndex];
                    else
                        currentRec.data[currentDataIndex] = "";

                    // Remove previous record, then add new one
                    grid.store.removeAt(currentRow);
                    grid.store.insert(currentRow, currentRec);                   

                    currentCol = currentCol + 1;
                }

                this.updateData();
            }
        }
    },
    updateData: function()
    {
    },
    sortSelectedRecords: function(recs)
    {
        var sortedRecs = recs;
        // Sort selected records by row and by column
        sortedRecs.sort(function(a,b) {
                if(a.position.row > b.position.row)
                    return 1;
                else if(a.position.row < b.position.row)
                    return -1;
                else if(a.position.column > b.position.column)
                    return 1;
                else if(a.position.column < b.position.column)
                    return -1;
                else
                    return 0;
        });

        return sortedRecs;
    }
});