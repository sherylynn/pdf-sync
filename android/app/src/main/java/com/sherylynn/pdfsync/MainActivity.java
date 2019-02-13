/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
 */

package com.sherylynn.pdfsync;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;

import org.apache.cordova.*;

public class MainActivity extends CordovaActivity
{
    private Uri uri;
    private String TAG="MainActivity";
    private String filePath;
    @Override

    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);

        Intent intent = getIntent();
        if (intent!=null){
            String action = intent.getAction();
            if (intent.ACTION_VIEW.equals(action)) {
                uri = intent.getData();
                filePath = "file://"+Uri.decode(uri.getEncodedPath());
                Log.d(TAG, filePath);
            }else {
                filePath = "file:///android_asset/www/pdf-readme.pdf";
                //filePath = "file:///storage/emulated/0/360/test.pdf";
                Log.v("pdf-sync-file", "action不匹配"+filePath);
            }
        }else {
            filePath = "file:///android_asset/www/pdf-readme.pdf";
            Log.v("pdf-sync-file", "intent为null"+filePath);
        }

        // enable Cordova apps to be started in the background
        Bundle extras = getIntent().getExtras();
        if (extras != null && extras.getBoolean("cdvStartInBackground", false)) {
            moveTaskToBack(true);
        }
        Log.v("pdf-sync-file", "最终："+filePath);

        // Set by <content src="index.html" /> in config.xml
        loadUrl(launchUrl+"?file="+filePath);
        //看起来似乎不支持，另外log需要说动给赞数+""来转成字符串
    }
}
