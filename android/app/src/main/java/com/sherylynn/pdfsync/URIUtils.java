package com.sherylynn.pdfsync;

import android.content.ContentResolver;
import android.content.Context;
import android.database.Cursor;
import android.net.Uri;
//import android.provider.MediaStore;

import com.blankj.utilcode.util.LogUtils;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

public class URIUtils {
    // android 7

    public static String getPathFromInputStreamUri(Context context, Uri uri, String fileName) {
        InputStream inputStream = null;
        String filePath = null;

        if (uri.getAuthority() != null) {
            try {
                inputStream = context.getContentResolver().openInputStream(uri);
                File file = createTemporalFileFrom(context, inputStream, fileName);
                filePath = file.getPath();

            } catch (Exception e) {
                LogUtils.e(e);
            } finally {
                try {
                    if (inputStream != null) {
                        inputStream.close();
                    }
                } catch (Exception e) {
                    LogUtils.e(e);
                }
            }
        }

        return filePath;
    }
    //如果是用这个方式是否需要直接根据stream来扫docID？
    //缓冲一次多100MB。
    private static File createTemporalFileFrom(Context context, InputStream inputStream, String fileName)
            throws IOException {
        File targetFile = null;

        if (inputStream != null) {
            int read;
            byte[] buffer = new byte[8 * 1024];
            //自己定义拷贝文件路径
            targetFile = new File(context.getCacheDir().getPath(), fileName);

            if (targetFile.exists()) {
                targetFile.delete();
            }
            OutputStream outputStream = new FileOutputStream(targetFile);

            while ((read = inputStream.read(buffer)) != -1) {
                outputStream.write(buffer, 0, read);
            }
            outputStream.flush();

            try {
                outputStream.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        return targetFile;
    }

}