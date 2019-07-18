package com.sherylynn.pdfsync;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.SharedPreferences.Editor;
import android.preference.PreferenceManager;

public class SPUtils {
    //# activity is from content
    //public static void put(Activity activity,String name ,int value){
    public static void put(Context context, String name, String value){
        SharedPreferences sharedPref = PreferenceManager.getDefaultSharedPreferences(context);
        Editor editor = sharedPref.edit();
        editor.putString(name,value);
        //# commit is sync method when apply is async method
        //editor.commit();
        editor.apply();
    }
    public static void putSync(Context context, String name, String value){
        SharedPreferences sharedPref = PreferenceManager.getDefaultSharedPreferences(context);
        Editor editor = sharedPref.edit();
        editor.putString(name,value);
        editor.commit();
    }
    public static void putSync(Context context,String name,boolean value){
        SharedPreferences sharedPref = PreferenceManager.getDefaultSharedPreferences(context);
        Editor editor = sharedPref.edit();
        editor.putBoolean(name,value);
        editor.commit();
    }
    public static void put(Context context,String name,int value){
        SharedPreferences sharedPref = PreferenceManager.getDefaultSharedPreferences(context);
        Editor editor = sharedPref.edit();
        editor.putInt(name,value);
        editor.apply();
    }
    public static String get(Context context,String name,String defaultValue){
        SharedPreferences sharedPref = PreferenceManager.getDefaultSharedPreferences(context);
        String value = sharedPref.getString(name,defaultValue);
        return value;
    }
    public static Boolean get(Context context,String name,Boolean defaultValue){
        SharedPreferences sharedPref = PreferenceManager.getDefaultSharedPreferences(context);
        Boolean value = sharedPref.getBoolean(name,defaultValue);
        return value;
    }
    public static int get(Context context,String name,int defaultValue){
        SharedPreferences sharedPref = PreferenceManager.getDefaultSharedPreferences(context);
        int value = sharedPref.getInt(name,defaultValue);
        return value;
    }
}
