# news-mobile

News-mobile repository is dedicated to HTML5/JS/CSS based web application for accessing OwnCloud's News application feeds. Having in mind the development of these technologies, it is now possible to build applications for mobile platforms like Android using PhoneGap, which can turn web application in Android's one.

Using AngularJS as JS framework for fast developing of rich and fully functional applications, it is possible for these applications to work on mobile platforms as same as in any web browser.

Targeted platforms (for now):
* Android,
* Firefox OS.


## Folder structure

* PhoneGap related folders:
 * .cordova/
 * merges/
 * platforms/
 * plugins/
* Application test scripts:
 * tests/
* Application code:
 * www/

 
Important files:
* package.json - specifies application basic description and needed Node.js packages for development,
* Gruntfile.js - Grunt script for automatizing steps which need to be repeated on a daily basis,
* Makefile - make scirpt for running some steps needed after cloning repository.


## Building application for Android


What you will need is:
* Android SDK
* PhoneGap Node.js module (which should be installed after runing ```make build```)

Android's version is being built using PhoneGap. Steps needed to go through to build application are given in PhoneGap manual page, but the fastest way to do it is ```phonegap run android``` for building and installing application on connected device or running emulator.

When running application on emulator or device, ```adb logcat``` will be usefull for debugging it.


## Building application for Firefox OS


Since there is no official Firefox OS PhoneGap platform, and until it is, we'll have to with some way of automatizing copying files from www/, and generating manifest files based on key files describing application.


### Building application for Firefox OS

Building application for FF OS is simple as running ```grunt firefoxos```.

Application package can be found at platforms/firefoxos/bin/ folder. If you point simulator's browser to that directory, you'll automaticaly start install procedure.

What is really happening when ```grunt firefoxos``` is run? Keep reading.

Main focus for now is on Gruntfile.js which has tasks, like copy, compress and clean. These tasks are run by main task __firefoxos__ with command ```grunt firefoxos```, and it builds application for Firefox OS, in these steps:
* Remove all files and folders from platforms/firefoxos/assets/ and platforms/firefoxos/bin/ folders,
* Copy needed files and folders from www/ directory into platforms/firefoxos/assets/ (structure that is similar for phonegap's builds for android),
* Copy needed manifest.webapp from platforms/firefoxos/templates/ folder into platforms/firefoxos/assets,
* Compress platforms/firefoxos/assets into platforms/firefoxos/bin/, taking application name from package.json and concatenating it's version making zip archive (for example News_0.2.zip). This archive is made in current folder (where we run grunt firefoxos), so we need to copy it to platforms/firefoxos/bin/ and clean it from current folder.

For testing purpouses, you'll want to install new built package on simulator, you will need package.manifest file (which is mini version of manifest.webapp), and also index.html file. Those two files are also in plaforms/firefoxos/templates/, and those two are copied to platforms/firefoxos/bin/ so you can point browser on simulator to that folder and get installation procedure going.

### Firefox OS Simulator 

If happens that you do not have Firefox OS running on a device, you can use Firefox OS simulator, which can be installed as [Firefox browser addon](https://addons.mozilla.org/de/firefox/addon/firefox-os-simulator/). Launch the simulator by going to  **Menu** > **Web Developer** > **Firefox OS Simulator**. After opening it's dashboard and packaging application, there are some basic steps which will be covered in guiding you to get it going.

There are two options for installing application on simulator:
* Running simulator and pointing it's browser to platforms/firefoxos/bin/ directory and get installation procedure going. This includes that news-mobile folder is served by Apache, or any other web server.
* When openning simlator dashboard, click on Add Directory button, and point to the platforms/firefoxos/assets/manifest.webapp file.

# news-mobile development

## Before you start
* Install **Apache** and place the app in **/var/www**
* Make sure that **AllowOverride** is enabled for **/var/www** in the **/etc/apache/httpd.conf**:

```
<Directory "/var/www">
	AllowOverride All
</Directory>
```

If you want to use a different webserver for development, you need to set the [correct content type for the manifest.webapp file](https://developer.mozilla.org/en-US/docs/Web/Apps/Manifest?redirectlocale=en-US&redirectslug=Apps%2FManifest#Serving_manifests) by yourself.

## Browser

The app can be developed locally in your browser. Simply go to [http://localhost/news-mobile/www/templates/index.html](http://localhost/news-mobile/www/templates/index.html)

## Build the JavaScript

Run:

	```make watch```

to set up a watch to compile the JavaScript files when they are saved.

## Run the JavaScript Unit Tests

Run:

	```make testacular```

to set up a watch to run the JavaScript unit tests when JavaScript files are saved.
