news-mobile
===========

News-mobile repository is dedicated to HTML5/JS/CSS based web application for accessing OwnCloud's News application feeds. Having in mind the development of these technologies, it is now possible to build applications for mobile platforms like Android using PhoneGap, which can turn web application in Android's one.

Using AngularJS as JS framework for fast developing of rich and fully functional applications, it is possible for these applications to work on mobile platforms as same as in any web browser.

Targeted platforms (for now):
* Android,
* Firefox OS.


Folder structure
----------------
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


Building application for Android
--------------------------------

What you will need is:
* Android SDK
* PhoneGap Node.js module (which should be installed after runing ```make build```)

Android's version is being built using PhoneGap. Steps needed to go through to build application are given in PhoneGap manual page, but the fastest way to do it is ```phonegap run android``` for building and installing application on connected device or running emulator.

When running application on emulator or device, ```adb logcat``` will be usefull for debugging it.


Building application for Firefox OS
-----------------------------------

Since there is no official Firefox OS PhoneGap platform, and until it is, we'll have to with some way of automatizing copying files from www/, and generating manifest files based on key files describing application.

__This is yet to be covered__

If happens that you do not have Firefox OS running on a device, you can use Firefox OS simulator, which can be installed as Firefox browser addon. After installing it, and packaging application, there are some basic steps which will be covered in guiding you to get it going.
