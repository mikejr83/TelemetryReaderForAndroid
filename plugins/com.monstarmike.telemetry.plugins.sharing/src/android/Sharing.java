package com.monstarmike.telemetry.plugins.sharing;

import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Log;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;

public class Sharing extends CordovaPlugin {
    private static final String TAG = "Sharing";

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) {
        Log.i(TAG, "Sharing action: " + action);

        if (action.equalsIgnoreCase(Constants.PluginActions.ACTION_SHARE)) {
            // the args array should contain a JSON blob object for the image data.
            this.handleShare(new byte[0]);
        } else {
            Log.w(TAG, "The action " + action + " did not have a handler in the plugin!");
            callbackContext.error("Action not supported! " + action);
        }

        return true;
    }

    private void handleShare(byte data[]) {
        Bitmap icon = BitmapFactory.decodeByteArray(data, 0, data.length);
        Intent share = new Intent(Intent.ACTION_SEND);
        share.setType("image/png");
    }
}
