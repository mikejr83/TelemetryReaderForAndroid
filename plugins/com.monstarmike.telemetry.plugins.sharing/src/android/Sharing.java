package com.monstarmike.telemetry.plugins.sharing;

import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.net.Uri;
import android.support.v4.content.LocalBroadcastManager;
import android.util.Log;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.json.JSONArray;
import org.json.JSONException;

public class Sharing extends CordovaPlugin {
    private static final String TAG = "Sharing";

    SharingResponseReceiver sharingResponseReceiver;

    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);

        this.sharingResponseReceiver = new SharingResponseReceiver(cordova.getActivity());
        LocalBroadcastManager.getInstance(cordova.getActivity())
                .registerReceiver(this.sharingResponseReceiver, new IntentFilter(Constants.BroadcastActions.PREPARE_SHARE_IMAGE_BROADCAST_ACTION));
    }

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) {
        Log.i(TAG, "Sharing action: " + action);

        if (action.equalsIgnoreCase(Constants.PluginActions.ACTION_SHARE)) {
            // the args array should contain a JSON blob object for the image data.
            try {
                ServiceDataTransfer.getInstance().set_callbackContext(callbackContext);
                ServiceDataTransfer.getInstance().set_dataUrl(args.getString(0));
                SharingService.startActionPrepareShareImage(this.cordova.getActivity().getApplicationContext());
            } catch (JSONException e) {
                String errorMsg = "JSON error when getting the data url string from the args array.";
                Log.e(TAG, errorMsg, e);
                callbackContext.error(errorMsg);
                return false;
            }
        } else {
            Log.w(TAG, "The action " + action + " did not have a handler in the plugin!");
            callbackContext.error("Action not supported! " + action);
        }

        return true;
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent intent) {
        Log.d(TAG, "onActivityResult requestCode: " + requestCode + " - resultCode" + resultCode);

        if (requestCode == Constants.PluginActions.SHARE_INTENT_ACTIVITY_RESULT) {
            Log.d(TAG, "The send action completed.");
        }

        super.onActivityResult(requestCode, resultCode, intent);
    }

    private class SharingResponseReceiver extends BroadcastReceiver {
        private Activity activity;

        private SharingResponseReceiver(Activity activity) {
            super();

            this.activity = activity;
        }

        @Override
        public void onReceive(Context context, Intent intent) {
            Log.d(TAG, "In the broadcast receiver onRecieve.");

            String action = intent.getAction();

            Log.d(TAG, "OnReceive action: " + action);

            if (Constants.BroadcastActions.PREPARE_SHARE_IMAGE_BROADCAST_ACTION.equalsIgnoreCase(action)) {
                this.handlePrepareShareImageBroadcast();
            }

            ServiceDataTransfer.getInstance().resetData();
        }

        private void handlePrepareShareImageBroadcast() {
            Intent share = new Intent(Intent.ACTION_SEND);
            share.setType("image/png");

            String filepath = Constants.get_temporaryFilename();
            Uri fileUri = Uri.parse("file://" + filepath);
            share.putExtra(Intent.EXTRA_STREAM, fileUri);

            Log.d(TAG, "An image has been prepared for sharing at: " + fileUri.toString());
            this.activity.startActivityForResult(Intent.createChooser(share, "Share Image"),
                    Constants.PluginActions.SHARE_INTENT_ACTIVITY_RESULT);

            CallbackContext callbackContext = ServiceDataTransfer.getInstance().get_callbackContext();

            if (callbackContext != null) {
                callbackContext.success();
            } else {
                Log.w(TAG, "No callback context to finish up the request from the client!");
            }
        }
    }
}
