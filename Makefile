.PHONY: help install clean

help:
	@echo "Run 'make install' to copy the release version of the app to ./install"
	@echo "    'make clean' to delete ./install"

install:
	mkdir -p install/www
	cp www/index_nodebug.html install/www/index.html
	cp www/app.{js,css} install/www
	cp -R www/app install/www
	mkdir -p install/www/ext-4
	cp www/ext-4/ext-all.js install/www/ext-4
	mkdir -p install/www/ext-4/resources/ext-theme-neptune
	cp www/ext-4/resources/ext-theme-neptune/ext-theme-neptune-all.css install/www/ext-4/resources/ext-theme-neptune
	cp -R www/ext-4/resources/ext-theme-neptune/images install/www/ext-4/resources/ext-theme-neptune
	mkdir -p install/server
	cp -R server install
	cp start_server.sh install

clean:
	rm -rf install