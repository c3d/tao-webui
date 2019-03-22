# ******************************************************************************
# webui.pro                                                        Tao3D project
# ******************************************************************************
#
# File description:
# Qt build file for the Tao3D Web User Interface
#
#
#
#
#
#
#
# ******************************************************************************
# This software is licensed under the GNU General Public License v3
# (C) 2014,2019, Christophe de Dinechin <christophe@dinechin.org>
# (C) 2013, Jérôme Forissier <jerome@taodyne.com>
# ******************************************************************************
# This file is part of Tao3D
#
# Tao3D is free software: you can r redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# Tao3D is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with Tao3D, in a file named COPYING.
# If not, see <https://www.gnu.org/licenses/>.
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
