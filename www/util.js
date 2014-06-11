// ****************************************************************************
//  util.js                                                       Tao project 
// ****************************************************************************
// 
//   File Description:
// 
//     Utilities to be loaded before app.js and Ext classes
// 
// 
// 
// 
// 
// 
// 
// 
// ****************************************************************************
//  (C) 2014 Christophe de Dinechin <christophe@taodyne.com>
//  (C) 2014 Jérôme Forissier <jerome@taodyne.com>
//  (C) 2014 Taodyne SAS
// ****************************************************************************

//var TE_lang = 'fr';
var tr = function(txt) { return txt; }


function httpGet(theUrl)
// ----------------------------------------------------------------------------
//   Provide a quick utility for getting something from the server
// ----------------------------------------------------------------------------
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, false);
    xmlHttp.send(null);
    if (xmlHttp.status == 200 || xmlHttp.status == 0)
        return xmlHttp.responseText;
    return '';
}


function mergeObjects(obj1, obj2)
// ----------------------------------------------------------------------------
//   Merge the two objects, override with the right one
// ----------------------------------------------------------------------------
{
    if (!obj1)
        return obj2;
    for (var item in obj2)
        obj1[item] = mergeObjects(obj1[item], obj2[item]);
    return obj1;
}
