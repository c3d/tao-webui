# ******************************************************************************
# webui.pro                                                          Tao project
# ******************************************************************************
# File Description:
# Qt build file for the Tao Presentations Web User Interface
# ******************************************************************************
# GNU General Public License Usage
# This file may be used under the terms of the GNU General Public License
# version 3.0 as published by the Free Software Foundation and appearing in the
# file LICENSE included in the packaging of this file.
#
# Please review the following information to ensure the GNU General Public
# License version 3.0 requirements will be met:
# http://www.gnu.org/copyleft/gpl.html.
#
# (C) 2013 Jerome Forissier <jerome@taodyne.com>
# (C) 2013 Taodyne SAS
# ******************************************************************************

!build_pass:!system(bash -c \"npm -v\" >/dev/null) {
  error(npm not found. Did you install NodeJS? \
        [\'sudo apt-get install nodejs\' or \'sudo port install nodejs\' \
        or from http://nodejs.org/])
}
!build_pass:!exists(www/ext-4) {
  error("ExtJS not found under www/ext-4. \
        Please install it from http://www.sencha.com/products/extjs/download,\
        or disable this sub-project when configuring Tao: \
        ./configure NO_WEBUI=1")
}

include(../main.pri)

TEMPLATE = subdirs

install.path = $$APPINST/webui
install.commands = mkdir -p \"$$APPINST/webui\" ; make -f Makefile.all install DEST=\"$$APPINST/webui/\"

INSTALLS += install
