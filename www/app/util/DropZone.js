/*
Override the main Ext.view.Drop to allow to make horizontal Drag & Drop.
*/
Ext.define('TE.util.DropZone', {
    extend: 'Ext.view.DropZone',
    getPosition: function(e, node) {
        var x      = e.getXY()[0],
            region = Ext.fly(node).getRegion(),
            pos;
        if ((region.right - x) >= (region.right - region.left) / 2) {
            pos = "before";
        } else {
            pos = "after";
        }
        return pos;
    },
    
   getTargetFromEvent : function(e) {
        var node = e.getTarget(this.view.getItemSelector()),
            mouseX, nodeList, testNode, i, len, box;
            
        if (!node) {
            mouseX = e.getPageX();
            for (i = 0, nodeList = this.view.getNodes(), len = nodeList.length; i < len; i++) {
                testNode = nodeList[i];
                box = Ext.fly(testNode).getBox();
                if (mouseX <= box.right) {
                    return testNode;
                }
            }
        }
        return node;
    },
    positionIndicator: function(node, data, e) {
        var me = this,
            view = me.view,
            pos = me.getPosition(e, node),
            overRecord = view.getRecord(node),
            draggingRecords = data.records,
            indicatorX;
            

        if (!Ext.Array.contains(draggingRecords, overRecord) && (
            pos == 'before' && !me.containsRecordAtOffset(draggingRecords, overRecord, -1) ||
            pos == 'after' && !me.containsRecordAtOffset(draggingRecords, overRecord, 1)
        )) {
            me.valid = true;

            if (me.overRecord != overRecord || me.currentPosition != pos) {

                indicatorX = Ext.fly(node).getX() - view.el.getX() - 1;
                
		        var delta = indicatorX - data.fromPosition[0];
		        if(delta > 0) 		
					indicatorX += Ext.fly(node).getWidth();
                me.getIndicator().setHeight(Ext.fly(node).getHeight()).showAt(indicatorX, 0);

                // Cache the overRecord and the 'before' or 'after' indicator.
                me.overRecord = overRecord;
                me.currentPosition = pos;
            }
        } else {
            me.invalidateDrop();
        }
    },
        // The mouse is over a View node
    onNodeOver: function(node, dragZone, e, data) {
        var me = this;

        if (!Ext.Array.contains(data.records, me.view.getRecord(node))) {
            me.positionIndicator(node, data, e);
        }
        return me.valid ? me.dropAllowed : me.dropNotAllowed;
    },

});
