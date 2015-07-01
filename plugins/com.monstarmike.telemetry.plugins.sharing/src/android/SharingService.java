package com.monstarmike.telemetry.plugins.sharing;

import android.app.IntentService;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Environment;
import android.support.v4.content.LocalBroadcastManager;
import android.util.Base64;
import android.util.Log;

import org.json.JSONArray;
import org.json.JSONException;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

/**
 * An {@link IntentService} subclass for handling asynchronous task requests in
 * a service on a separate handler thread.
 */
public class SharingService extends IntentService {
    private static final String TAG = "SharingService";

    /**
     * Starts this service to perform action PrepareShareImage. If
     * the service is already performing a task this action will be queued.
     *
     * @see IntentService
     */
    public static void startActionPrepareShareImage(Context context) {
        Intent intent = new Intent(context, SharingService.class);
        intent.setAction(Constants.SharingService.PrepareShareImage.ACTION);
        context.startService(intent);
    }

    public SharingService() {
        super(TAG);
    }

    @Override
    protected void onHandleIntent(Intent intent) {
        Log.d(TAG, "Handling intent in SharingService.");

        if (intent != null) {
            final String action = intent.getAction();
            Log.d(TAG, "SharingService handling action: " + action);
            if (Constants.SharingService.PrepareShareImage.ACTION.equals(action)) {
                handleActionPrepareShareImage();
            } else {
                Log.w(TAG, "There is no handler for the intent's action!");
            }
        }
    }

    /**
     * Handle action PrepareShareImage in the provided background thread.
     */
    private void handleActionPrepareShareImage() {
        String dataUrl = ServiceDataTransfer.getInstance().get_dataUrl();

        byte[] data = this.parseImageBytes(dataUrl);

        if (data != null) {
            this.handleShare(data);

            Log.d(TAG, "The data url for the image has been saved to a temporary file. Broadcasting...");
            Intent localIntent = new Intent(Constants.BroadcastActions.PREPARE_SHARE_IMAGE_BROADCAST_ACTION);
            LocalBroadcastManager.getInstance(this).sendBroadcast(localIntent);
        } else {
            Log.w(TAG, "Image bytes were not able to be parsed.");
        }
    }

    private byte[] parseImageBytes(String dataUrl) {
        String encodingPrefix = "base64,";

        int contentStartIndex = dataUrl.indexOf(encodingPrefix) + encodingPrefix.length();

        byte[] data = Base64.decode(dataUrl.substring(contentStartIndex), Base64.DEFAULT);

        return data;
    }

    private void handleShare(byte data[]) {
        Bitmap icon = BitmapFactory.decodeByteArray(data, 0, data.length);
        Intent share = new Intent(Intent.ACTION_SEND);
        share.setType("image/png");

        ByteArrayOutputStream bytes = new ByteArrayOutputStream();
        icon.compress(Bitmap.CompressFormat.PNG, 100, bytes);

        String filepath = Constants.get_temporaryFilename();

        File f = new File(filepath);

        File parentDir = new File(f.getParent());

        if(parentDir != null && !parentDir.exists()) {
            parentDir.mkdirs();
        }

        try {
            f.createNewFile();
            FileOutputStream fo = new FileOutputStream(f);
            fo.write(bytes.toByteArray());
        } catch (IOException e) {
            Log.e(TAG, "Exception while creating temporary image file.", e);
        }
    }
}
