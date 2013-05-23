ownCloud News mobile app
========================

Before you start
----------------
* Install **Apache** and place the app in **/var/www**
* Make sure that **AllowOverride** is enabled for **/var/www** in the **/etc/apache/httpd.conf**:

```
<Directory "/var/www">
	AllowOverride All
</Directory>
```

Developing
----------
Simply launch the [http://localhost/news-mobile/www/templates/index.html](http://localhost/news-mobile/www/templates/index.html) in your browser



Firefox OS
----------
How to launch the app in the simulator:

* Install the [Firefox OS Simulator](https://addons.mozilla.org/de/firefox/addon/firefox-os-simulator/)
* Launch the simulator by going to  **Menu** > **Web Developer** > **Firefox OS Simulator**
* Click on **Add Directory** and choose the **manifest.webapp** in the **/var/www/news-mobile/www/*** folder

The app should be opened in a new window. If not install **xhost** and execute

	xhost +
