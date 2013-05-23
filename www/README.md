ownCloud News mobile app - Get started with Developement
========================================================

Before you start
----------------
* Install **Apache** and place the app in **/var/www**
* Make sure that **AllowOverride** is enabled for **/var/www** in the **/etc/apache/httpd.conf**:

```
<Directory "/var/www">
	AllowOverride All
</Directory>
```

If you want to use a different webserver for development, you need to set the [correct content type for the manifest.webapp file](https://developer.mozilla.org/en-US/docs/Web/Apps/Manifest?redirectlocale=en-US&redirectslug=Apps%2FManifest#Serving_manifests) by yourself.

Browser
-------
The app can be developed locally in your browser. Simply go to [http://localhost/news-mobile/www/templates/index.html](http://localhost/news-mobile/www/templates/index.html)

Build the JavaScript
--------------------
Run:

	make watch

to set up a watch to compile the JavaScript files when they are saved.

Run the JavaScript Unit Tests
-----------------------------
Run:

	make testacular

to set up a watch to run the JavaScript unit tests when JavaScript files are saved.

Firefox OS
----------
How to launch the app in the simulator:

* Install the [Firefox OS Simulator](https://addons.mozilla.org/de/firefox/addon/firefox-os-simulator/)
* Launch the simulator by going to  **Menu** > **Web Developer** > **Firefox OS Simulator**
* Click on **Add Directory** and choose the **manifest.webapp** in the **/var/www/news-mobile/www/** folder

The app should be opened in a new window. If not install **xhost** and execute

	xhost +
