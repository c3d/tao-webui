#!/bin/bash
#
# new_theme.sh
#
# Create the required .js files for a new theme, based on 'Blue Claire'


# www/app/themes/$NEWTHEME_DIRNAME ; server/export/$NEWTHEME_DIRNAME
NEWTHEME_DIRNAME="bright_rectangles"
NEWTHEME_NAME="Bright Rectangles"
NEWTHEME_NAME_FR="Rectangles Lumineux"

# Used by server when generating Tao code
#   import SeyesTheme
NEWTHEME_IMPORT="BrightRectanglesTheme"
#   theme "Seyes"
NEWTHEME_USE="BrightRectangles"

###

SCRIPT_PATH="$( cd "$(dirname "$0")" ; pwd )"

(
    cd $SCRIPT_PATH/../themes
    if [ -e $NEWTHEME_DIRNAME ] ; then
        echo "Error: `pwd`/$NEWTHEME_DIRNAME exists."
        exit 1
    fi
    mkdir -p $NEWTHEME_DIRNAME && cp -r blueclaire/* $NEWTHEME_DIRNAME
    find $NEWTHEME_DIRNAME -name \*.js | while read f ; do
        echo $f
        sed -i .tmp \
            -e "s/blueclaire/$NEWTHEME_DIRNAME/g" \
            -e "s/Blue Claire/$NEWTHEME_NAME/g" \
            -e "s/Bleu Claire/$NEWTHEME_NAME_FR/g" \
            -e "s/BlueClaireTheme/$NEWTHEME_IMPORT/g" \
            -e "s/BlueClaire/$NEWTHEME_USE/g" \
            -e "s@app/themes/blueclaire@app/themes/$NEWTHEME_DIRNAME@g" \
            $f && rm $f.tmp
    done
    mv $NEWTHEME_DIRNAME/resources/images/blueclaire.png $NEWTHEME_DIRNAME/resources/images/$NEWTHEME_DIRNAME.png

    echo "* Do not forget to update themes/$NEWTHEME_DIRNAME/resources/images/*.png"
    echo "* and add '$NEWTHEME_DIRNAME' to www/app/controller/Editor.js (loadThemes)."
)
