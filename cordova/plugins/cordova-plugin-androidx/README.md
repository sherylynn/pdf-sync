cordova-plugin-androidx
=======================

This Cordova/Phonegap plugin enables AndroidX in a Cordova project ([AndroidX](https://developer.android.com/jetpack/androidx/migrate) is the successor to the [Android Support Library](https://developer.android.com/topic/libraries/support-library/index)).


This plugin is useful if your project contains plugins which have migrated to AndroidX or if you otherwise want to enable AndroidX in your Cordova Android platform project. 

# Requirements

This plugin requires a minimum of [`cordova@9`](https://github.com/apache/cordova-cli) and [`cordova-android@8`](https://github.com/apache/cordova-android).
 
# Installation

    $ cordova plugin add cordova-plugin-androidx
    
**IMPORTANT:** This plugin relies on [Cordova hook scripts](https://cordova.apache.org/docs/en/latest/guide/appdev/hooks/) so will not work in Cloud Build environments such as Phonegap Build which do not support Cordova hook scripts. 
    
# Usage

Once the plugin is installed it will persistently enable AndroidX by editing the `gradle.properties` file in your Cordova Android platform project.

If you encounter build failures after installing this plugin (or after manually enabling AndroidX) try installing [cordova-plugin-androidx-adapter](https://github.com/dpa99c/cordova-plugin-androidx-adapter) into your Cordova project; it will migrate any references to the legacy Android Support library in the Gradle config or Java source to use the new AndroidX mappings which should resolve build failures due to referencing legacy Support Library assets.

License
================

The MIT License

Copyright (c) 2019 Dave Alden / Working Edge Ltd.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
