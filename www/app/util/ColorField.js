// ****************************************************************************
//  ColorField.js                                                Tao project
// ****************************************************************************
//
//   File Description:
//
//    A simple display field
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
//  (C) 2014 Catherine Burvelle <cathy@taodyne.com>
//  (C) 2014 Taodyne SAS
// ****************************************************************************

Ext.define('TE.util.ColorField', {
    extend: 'Ext.form.FieldSet',
    requires:[ 'Ext.form.field.Display', 'Ext.picker.Color' ],
    alias: 'widget.te_colorfield',
    autoScroll:true,
    collapsible: true,
    collapsed:false,

    colorNames: {
        "#F0F8FF" : "aliceblue",
        "#FAEBD7" : "antiquewhite",
        "#00FFFF" : "aqua",
        "#7FFFD4" : "aquamarine",
        "#F0FFFF" : "azure",
        "#F5F5DC" : "beige",
        "#FFE4C4" : "bisque",
        "#000000" : "black",
        "#FFEBCD" : "blanchedalmond",
        "#0000FF" : "blue",
        "#8A2BE2" : "blueviolet",
        "#A52A2A" : "brown",
        "#DEB887" : "burlywood",
        "#5F9EA0" : "cadetblue",
        "#7FFF00" : "chartreuse",
        "#D2691E" : "chocolate",
        "#FF7F50" : "coral",
        "#6495ED" : "cornflowerblue",
        "#FFF8DC" : "cornsilk",
        "#DC143C" : "crimson",
        "#00FFFF" : "cyan",
        "#00008B" : "darkblue",
        "#008B8B" : "darkcyan",
        "#B8860B" : "darkgoldenrod",
        "#A9A9A9" : "darkgray",
        "#006400" : "darkgreen",
        "#A9A9A9" : "darkgrey",
        "#BDB76B" : "darkkhaki",
        "#8B008B" : "darkmagenta",
        "#556B2F" : "darkolivegreen",
        "#FF8C00" : "darkorange",
        "#9932CC" : "darkorchid",
        "#8B0000" : "darkred",
        "#E9967A" : "darksalmon",
        "#8FBC8F" : "darkseagreen",
        "#483D8B" : "darkslateblue",
        "#2F4F4F" : "darkslategray",
        "#2F4F4F" : "darkslategrey",
        "#00CED1" : "darkturquoise",
        "#9400D3" : "darkviolet",
        "#FF1493" : "deeppink",
        "#00BFFF" : "deepskyblue",
        "#696969" : "dimgray",
        "#696969" : "dimgrey",
        "#1E90FF" : "dodgerblue",
        "#B22222" : "firebrick",
        "#FFFAF0" : "floralwhite",
        "#228B22" : "forestgreen",
        "#FF00FF" : "fuchsia",
        "#DCDCDC" : "gainsboro",
        "#F8F8FF" : "ghostwhite",
        "#FFD700" : "gold",
        "#DAA520" : "goldenrod",
        "#808080" : "gray",
        "#008000" : "green",
        "#ADFF2F" : "greenyellow",
        "#808080" : "grey",
        "#F0FFF0" : "honeydew",
        "#FF69B4" : "hotpink",
        "#CD5C5C" : "indianred",
        "#4B0082" : "indigo",
        "#FFFFF0" : "ivory",
        "#F0E68C" : "khaki",
        "#E6E6FA" : "lavender",
        "#FFF0F5" : "lavenderblush",
        "#7CFC00" : "lawngreen",
        "#FFFACD" : "lemonchiffon",
        "#ADD8E6" : "lightblue",
        "#F08080" : "lightcoral",
        "#E0FFFF" : "lightcyan",
        "#FAFAD2" : "lightgoldenrodyellow",
        "#D3D3D3" : "lightgray",
        "#90EE90" : "lightgreen",
        "#D3D3D3" : "lightgrey",
        "#FFB6C1" : "lightpink",
        "#FFA07A" : "lightsalmon",
        "#20B2AA" : "lightseagreen",
        "#87CEFA" : "lightskyblue",
        "#778899" : "lightslategray",
        "#778899" : "lightslategrey",
        "#B0C4DE" : "lightsteelblue",
        "#FFFFE0" : "lightyellow",
        "#00FF00" : "lime",
        "#32CD32" : "limegreen",
        "#FAF0E6" : "linen",
        "#FF00FF" : "magenta",
        "#800000" : "maroon",
        "#66CDAA" : "mediumaquamarine",
        "#0000CD" : "mediumblue",
        "#BA55D3" : "mediumorchid",
        "#9370DB" : "mediumpurple",
        "#3CB371" : "mediumseagreen",
        "#7B68EE" : "mediumslateblue",
        "#00FA9A" : "mediumspringgreen",
        "#48D1CC" : "mediumturquoise",
        "#C71585" : "mediumvioletred",
        "#191970" : "midnightblue",
        "#F5FFFA" : "mintcream",
        "#FFE4E1" : "mistyrose",
        "#FFE4B5" : "moccasin",
        "#FFDEAD" : "navajowhite",
        "#000080" : "navy",
        "#FDF5E6" : "oldlace",
        "#808000" : "olive",
        "#6B8E23" : "olivedrab",
        "#FFA500" : "orange",
        "#FF4500" : "orangered",
        "#DA70D6" : "orchid",
        "#EEE8AA" : "palegoldenrod",
        "#98FB98" : "palegreen",
        "#AFEEEE" : "paleturquoise",
        "#DB7093" : "palevioletred",
        "#FFEFD5" : "papayawhip",
        "#FFDAB9" : "peachpuff",
        "#CD853F" : "peru",
        "#FFC0CB" : "pink",
        "#DDA0DD" : "plum",
        "#B0E0E6" : "powderblue",
        "#800080" : "purple",
        "#FF0000" : "red",
        "#BC8F8F" : "rosybrown",
        "#4169E1" : "royalblue",
        "#8B4513" : "saddlebrown",
        "#FA8072" : "salmon",
        "#F4A460" : "sandybrown",
        "#2E8B57" : "seagreen",
        "#FFF5EE" : "seashell",
        "#A0522D" : "sienna",
        "#C0C0C0" : "silver",
        "#87CEEB" : "skyblue",
        "#6A5ACD" : "slateblue",
        "#708090" : "slategray",
        "#708090" : "slategrey",
        "#FFFAFA" : "snow",
        "#00FF7F" : "springgreen",
        "#4682B4" : "steelblue",
        "#D2B48C" : "tan",
        "#008080" : "teal",
        "#D8BFD8" : "thistle",
        "#FF6347" : "tomato",
        "#40E0D0" : "turquoise",
        "#EE82EE" : "violet",
        "#F5DEB3" : "wheat",
        "#FFFFFF" : "white",
        "#F5F5F5" : "whitesmoke",
        "#FFFF00" : "yellow",
        "#9ACD32" : "yellowgreen"
    },

    items: [{
        xtype: 'textfield',
        width: '100%',
        listeners: {
            change: function(f) {
                this.ownerCt.fireEvent('change', this.ownerCt);
            },
            render: function(f) {
                // Use same name that fieldset for form
                f.name = f.ownerCt.name;
                f.multipleAllowed = f.ownerCt.multipleAllowed;
            }
        }        
    },{
        xtype:'colorpicker',
        width: '100%',
        listeners: {
            select: function(picker, selColor) {
                this.ownerCt.setValue('#' + selColor);
            }
        },
        colors: [ 
            "000000", "111111", "222222", "333333", "444444", "555555",
            "666666", "777777", "888888", "999999", "AAAAAA", "BBBBBB",
            "CCCCCC", "DDDDDD", "EEEEEE", "FFFFFF", "663D3D", "995C5C",
            "CC7A7A", "FF9999", "662828", "993D3D", "CC5151", "FF6666",
            "661414", "991E1E", "CC2828", "FF3333", "660000", "990000",
            "CC0000", "FF0000", "664D3D", "99745C", "CC9B7A", "FFC299",
            "664128", "99623D", "CC8351", "FFA366", "663514", "994F1E",
            "CC6A28", "FF8533", "662800", "993D00", "CC5100", "FF6600",
            "665E3D", "998D5C", "CCBC7A", "FFEB99", "665A28", "99873D",
            "CCB451", "FFE166", "665614", "99811E", "CCAC28", "FFD733",
            "665100", "997A00", "CCA300", "FFCC00", "5E663D", "8D995C",
            "BCCC7A", "EBFF99", "5A6628", "87993D", "B4CC51", "E1FF66",
            "566614", "81991E", "ACCC28", "D7FF33", "516600", "7A9900",
            "A3CC00", "CCFF00", "4D663D", "74995C", "9BCC7A", "C2FF99",
            "416628", "62993D", "83CC51", "A3FF66", "356614", "4F991E",
            "6ACC28", "85FF33", "286600", "3D9900", "51CC00", "66FF00",
            "3D663D", "5C995C", "7ACC7A", "99FF99", "286628", "3D993D",
            "51CC51", "66FF66", "146614", "1E991E", "28CC28", "33FF33",
            "006600", "009900", "00CC00", "00FF00", "3D664D", "5C9974",
            "7ACC9B", "99FFC2", "286641", "3D9962", "51CC83", "66FFA3",
            "146635", "1E994F", "28CC6A", "33FF85", "006628", "00993D",
            "00CC51", "00FF66", "3D665E", "5C998D", "7ACCBC", "99FFEB",
            "28665A", "3D9987", "51CCB4", "66FFE1", "146656", "1E9981",
            "28CCAC", "33FFD7", "006651", "00997A", "00CCA3", "00FFCC",
            "3D5E66", "5C8D99", "7ABCCC", "99EBFF", "285A66", "3D8799",
            "51B4CC", "66E1FF", "145666", "1E8199", "28ACCC", "33D7FF",
            "005166", "007A99", "00A3CC", "00CCFF", "3D4D66", "5C7499",
            "7A9BCC", "99C2FF", "284166", "3D6299", "5183CC", "66A3FF",
            "143566", "1E4F99", "286ACC", "3385FF", "002866", "003D99",
            "0051CC", "0066FF", "3D3D66", "5C5C99", "7A7ACC", "9999FF",
            "282866", "3D3D99", "5151CC", "6666FF", "141466", "1E1E99",
            "2828CC", "3333FF", "000066", "000099", "0000CC", "0000FF",
            "4D3D66", "745C99", "9B7ACC", "C299FF", "412866", "623D99",
            "8351CC", "A366FF", "351466", "4F1E99", "6A28CC", "8533FF",
            "280066", "3D0099", "5100CC", "6600FF", "5E3D66", "8D5C99",
            "BC7ACC", "EB99FF", "5A2866", "873D99", "B451CC", "E166FF",
            "561466", "811E99", "AC28CC", "D733FF", "510066", "7A0099",
            "A300CC", "CC00FF", "663D5E", "995C8D", "CC7ABC", "FF99EB",
            "66285A", "993D87", "CC51B4", "FF66E1", "661456", "991E81",
            "CC28AC", "FF33D7", "660051", "99007A", "CC00A3", "FF00CC",
            "663D4D", "995C74", "CC7A9B", "FF99C2", "662841", "993D62",
            "CC5183", "FF66A3", "661435", "991E4F", "CC286A", "FF3385",
            "660028", "99003D", "CC0051", "FF0066"
        ]
    }],


    getValue: function()
    // ------------------------------------------------------------------------
    //  Return displayfield value in a json object
    // ------------------------------------------------------------------------
    {
        var textField = this.down('textfield');
        return textField.getValue();
    },


    setValue: function(value)
    // ------------------------------------------------------------------------
    // Set displayfield according to a json object
    // ------------------------------------------------------------------------
    {
        var name = value;
        if (value.match(/^#[0-9a-f]{3,6}$/i)) {
            // Original is in the form '#ff0033': Convert to name
            if (this.colorNames.hasOwnProperty(value))
                name = this.colorNames[value];
            value = value.replace(/^#/, '');
        } else {
            // Original is something like 'aliceblue': convert to RGB
            var colorNames = this.colorNames;
            for (var n in colorNames) {
                if (colorNames[n] == name)
                    value = n.replace(/^#/, '');
            }
        }

        var colorPicker = this.down('colorpicker');
        if (colorPicker.colors.indexOf(value) >= 0)
            colorPicker.select(value, true);

        var textField = this.down('textfield');
        textField.setValue(name);
    },


    toJSON: function()
    // ------------------------------------------------------------------------
    // Override toJSON method
    // ------------------------------------------------------------------------
    {
        return Ext.encode(this.getValue());
    }
});
