package com.monstarmike.telemetry.plugins;

import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.net.Uri;
import android.support.v4.content.LocalBroadcastManager;
import android.util.Log;

import com.google.common.io.ByteStreams;
import com.monstarmike.tlmreader.TLMReader;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.io.InputStream;

/**
 * Created by mgardner on 5/15/2015.
 */
public class TLMDecoder extends CordovaPlugin {
    private static final String TAG = "TLMDecoder";

    CallbackContext callbackContext;
    ExportResponseReceiver exportResponseReceiver;

    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);

        this.exportResponseReceiver = new ExportResponseReceiver();
        LocalBroadcastManager.getInstance(cordova.getActivity())
                .registerReceiver(this.exportResponseReceiver, new IntentFilter(Constants.READ_FLIGHT_BROADCAST_ACTION));
        LocalBroadcastManager.getInstance(cordova.getActivity())
                .registerReceiver(this.exportResponseReceiver, new IntentFilter(Constants.READ_FILE_BROADCAST_ACTION));
    }

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        Log.i(TAG, "TLMDecoder action: " + action);

        this.callbackContext = callbackContext;

        if (action.equalsIgnoreCase("openFile")) {
            Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
            intent.setType("*/*");
            super.cordova.startActivityForResult(this, intent, Constants.PluginIntentActions.GET_FILE);
        } else if (action.equalsIgnoreCase("readFlight")) {
            String fileUriStr = args.getString(0);
            JSONObject flightJO = args.getJSONObject(1);

            if (fileUriStr != null) {
                Log.d(TAG, "file uri: " + fileUriStr);
            } else {
                Log.w(TAG, "File was passed in null. This probably won't end well!");
            }
            if (flightJO == null) {
                Log.w(TAG, "Flight was passed in null. This probably won't end well!");
            }

            Log.d(TAG, "creating the export service intent");
            Intent exportServiceIntent = new Intent(this.cordova.getActivity(), ExportService.class);
            Log.d(TAG, "Setting the data to: " + fileUriStr);
            Uri fileUri = Uri.parse(fileUriStr);
            exportServiceIntent.setData(fileUri);

            ServiceDataTransfer.getInstance().set_fileUri(fileUri);
            ServiceDataTransfer.getInstance().set_flight(flightJO);
            ServiceDataTransfer.getInstance().set_callbackContext(callbackContext);

            exportServiceIntent.setAction(Constants.ExportServiceActions.READ_FLIGHT);

            this.cordova.getActivity().startService(exportServiceIntent);
        }

        return true;
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent intent) {
        Log.i(TAG, "TLMDecoder onActivityResult requestCode: " + requestCode + " - resultCode: " + resultCode);

        if(intent == null) {
            Log.w(TAG, "When in onActivityResult the intent was null.");
            this.callbackContext.error(-1);
        }
        else if (requestCode == Constants.PluginIntentActions.GET_FILE
                && resultCode == Activity.RESULT_OK) {
            Uri intentData = intent.getData();
            Log.d(TAG, "Intent Data: " + intentData.toString());
            if (intentData != null) {
                Log.d(TAG, "File URI: " + intentData.toString());
                Intent exportServiceIntent = new Intent(this.cordova.getActivity(), ExportService.class);
                exportServiceIntent.setData(intentData);

                ServiceDataTransfer.getInstance().set_fileUri(intentData);
                ServiceDataTransfer.getInstance().set_callbackContext(callbackContext);

                exportServiceIntent.setAction(Constants.ExportServiceActions.READ_FILE);

                this.cordova.getActivity().startService(exportServiceIntent);
            } else {
                this.callbackContext.error(-1);
            }
        } else if (resultCode == Activity.RESULT_CANCELED) {
            this.callbackContext.error(Activity.RESULT_CANCELED);
        } else {
            this.callbackContext.error(-1);
        }

        super.onActivityResult(requestCode, resultCode, intent);
    }

    private class ExportResponseReceiver extends BroadcastReceiver {

        private ExportResponseReceiver() {
            super();
        }

        @Override
        public void onReceive(Context context, Intent intent) {
            Log.d(TAG, "In the broadcast receiver onRecieve.");

            CallbackContext callbackContext = ServiceDataTransfer.getInstance().get_callbackContext();
            String action = intent.getAction();

            Log.d(TAG, "OnReceive action: " + action);

            if (action.equalsIgnoreCase(Constants.READ_FILE_BROADCAST_ACTION)) {
                this.handleReadFile(callbackContext);
            } else if (action.equalsIgnoreCase(Constants.READ_FLIGHT_BROADCAST_ACTION)) {
                this.handleReadFlight(callbackContext);
            }

            ServiceDataTransfer.getInstance().resetData();
        }

        private void handleReadFile(CallbackContext callbackContext) {
            if (callbackContext != null) {
                JSONObject file = ServiceDataTransfer.getInstance().get_file();

                if (file != null) {
                    Log.d(TAG, "Calling back to the client with a file JSON object which was retrieved from the export service.");
                    callbackContext.success(file);
                } else {
                    Log.w(TAG, "No file JSON was handed back. This could be an error in the service!");
                    callbackContext.error("Did not get file JSON back from the service.");
                }
            } else {
                Log.w(TAG, "Cannot callback to the client because there was no callback context!");
            }
        }

        private void handleReadFlight(CallbackContext callbackContext) {
            if (callbackContext != null) {
                JSONObject flight = ServiceDataTransfer.getInstance().get_flight();

                if (flight != null) {
                    Log.d(TAG, "Calling back to the client with a flight JSON object which was retrieved from the export service.");
                    callbackContext.success(flight);
                } else {
                    Log.w(TAG, "No flight was handed back. This could be an error in the service!");
                    callbackContext.error("Did not get a flight back from the service.");
                }
            } else {
                Log.w(TAG, "Cannot callback to the client because there was no callback context!");
            }
        }
    }
}
