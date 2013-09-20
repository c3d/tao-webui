.PHONY: install

install: npm-install js_header.txt
	mkdir -p install
	cp LICENSE install
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
	# Find all OUR .js files, copy them to install but prepend our copyright header
	find install -name '*.js' -not -path 'server/node_modules/*' \
		-exec mv {} {}_ \; \
		-exec cp js_header.txt {} \; \
		-exec bash -c "cat {}_ >> {}" \; \
		-exec rm {}_ \;
	cp start_server.sh install

js_header.txt: js_header.txt.in
	NOW=`date "+%d-%h-%Y %H:%M:%S"`; SHA1=`git rev-parse HEAD`; sed -e "s/@BUILD_DATE@/$${NOW}/" -e "s/@GIT_SHA1@/$${SHA1}/" $< >$@

clean:
	rm -f js_header.txt
	rm -rf install

npm-install:
	cd server && npm install

npm-uninstall:
	rm -rf server/node_modules
