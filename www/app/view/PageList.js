Ext.define('TE.tree.PageList', {
    extend: 'Ext.panel.Panel',
    requires: [ 'TE.view.PageListContextMenu',
                'TE.util.DropZone',
                'Ext.util.Point', 
                "Ext.panel.Panel", 
                "Ext.view.View" ],
    alias: 'widget.pagelist',
    title: tr('Pages'),
    id: 'Pages',
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    autoScroll: true,
    items:  [{
                xtype: 'dataview',
                alias: 'widget.page',
                title: tr('Page'),
			    store: 'Pages',
			    id: 'page',
			    autoScroll: false,
				itemSelector: '.page-container',
				prepareData : function(data, recordIndex, record ){
					// Add image url to the diplayed data
					var img = Ext.create(record.getPageTemplateViewClass()).image;
					data['img'] = img;
					return data;
			    },
				tpl: [
					'<div class="page-wrap" style="width:{[this.totalWidth([values.length])]}">',
						'<div class="page-row">',
							'<tpl for=".">',
								'<div class="page-container">',
									'<div class="page">',
									'<div class="page-name">{[xindex]} - {name}</div>',
									'<div class="page-img"><img src="{img}"/></div>',
									'</div>',
								'</div>',
							'</tpl>',				
						'</div>',
					'</div>',
					{
						// Simple function to get always to correct total width
				        compiled: true,
				        totalWidth: function(value) {
				        	return value * 322; // NUmber of items multiply by the size of a page container
				        }
				    }
				],
                listeners: {
					render: function(v) {
						this.initDragZone(v);
						this.initDropZone(v);
					}
				},
				
				// Initialize the drag zone in the current view
				initDragZone: function(v) {
					v.dragZone = Ext.create('Ext.view.DragZone', {
				    	view: v,
						ddGroup: "Drag",
				        dragText: 'Drag'
					});
				},
				
				// Initialize the drop zone in the current view
				initDropZone: function(v) {
					v.dropZone = Ext.create('TE.util.DropZone', {
						view: v,
						ddGroup: 'Drag',
						indicatorHtml: '<div class="grid-drop-indicator"></div>',
						indicatorCls: 'grid-drop-indicator',
						handleNodeDrop : function(data, record, position)
						{
							var view = this.view,
								store = view.getStore(),
								index, records, i, len;
								data.view.store.remove(data.records, data.view === view);
							index = store.indexOf(record);
							if (position !== 'before') {
								index++;
							}
							store.insert(index, data.records);
							view.getSelectionModel().select(data.records);
						}
					});			
				}
            }],
            
    initComponent: function() {
        Ext.apply(this, {
            tbar: [
                '>', // Right align buttons
                {
                    xtype: 'button',
                    text: tr('Move page before'),
                    icon: 'app/resources/images/pageup.gif',
                    action: 'pageBefore',
                    disabled: true
                },{
                    xtype: 'button',
                    text: tr('Move page after'),
                    icon: 'app/resources/images/pagedown.gif',
                    action: 'pageAfter',
                    disabled: true
                },{
                    xtype: 'button',
                    text: tr('Delete page'),
                    icon: 'app/resources/images/delete.png',
                    action: 'pageDelete',
                    disabled: true
                },
                ' ', // Spacer
                {
                    xtype: 'button',
                    text: tr('Image library...'),
                    icon: 'app/resources/images/image.png',
                    action: 'showPicLibrary'
                }
            ]
        });

        this.callParent(arguments);
    },
});


