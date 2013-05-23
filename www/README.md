ownCloud News mobile app
========================

Firefox OS
----------

How to launch the app:

* Install Apache and place the app in the webroot
* Make sure that **AllowOverride** is enabled for the webroot
* Install the (Firefox OS Simulator)[https://addons.mozilla.org/de/firefox/addon/firefox-os-simulator/]
* Launch the simulator by going to  **Menu** > **Web Developer** > **Firefox OS Simulator**
* Click on **Add Directory** and choose the **manifest.webapp** in the **www/*** folder

The app should be opened in a new window. If not install **xhost** and execute

	xhost +
