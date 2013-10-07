Ext.define('TE.util.ServerErrors', {
    singleton: true,

    message: function(jsonData) {
        switch (jsonData.status) {
        case 'EFILECHANGED':
            return tr('The file %1 was not saved because it was modified outside this editor. ' +
                      'To save it anyways, please delete the file and try again.').replace('%1', jsonData.filename);
        case 'EFILEACCESS':
            return tr('Could not write file %1.').replace('%1', jsonData.filename);
        }
        return tr('Server error: ') + jsonData.status;
    }
});