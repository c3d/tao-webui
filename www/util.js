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
