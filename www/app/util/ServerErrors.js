Ext.define('TE.util.ServerErrors', {
    singleton: true,

    message: function(jsonData) {
        switch (jsonData.status) {
        case 'ERR_FILECHANGED':
            return tr('The file %1 was not saved because it was modified outside this editor. ' +
                      'To save it anyways, please delete the file and try again.').replace('%1', jsonData.filename);
        case 'ERR_FILEACCESS':
            return tr('Could not write file %1.').replace('%1', jsonData.filename);
        }
        return tr('Server error: ') + jsonData.status;
    }
});