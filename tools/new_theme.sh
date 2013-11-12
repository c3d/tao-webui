#!/bin/bash
#
# new_theme.sh
#
# Helper script, to be used manually when adding a new theme similar to
# the ones provided with Tao.
# Create the required .js files for a new theme, based on 'Blue Claire'


# www/app/themes/$NEWTHEME_DIRNAME ; server/export/$NEWTHEME_DIRNAME
NEWTHEME_DIRNAME="finance"
NEWTHEME_NAME="Finance"
NEWTHEME_NAME_FR="Finance"

# Used by server when generating Tao code
#   import $NEWTHEME_IMPORT
NEWTHEME_IMPORT="FinanceTheme"
#   theme "$NEWTHEME_USE"
NEWTHEME_USE="Finance"

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
