package com.monstarmike.telemetry.plugins;

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

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
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

        IntentFilter exportStatusFilter = new IntentFilter(Constants.READ_FLIGHT_BROADCAST_ACTION);

        this.exportResponseReceiver = new ExportResponseReceiver();
        LocalBroadcastManager.getInstance(cordova.getActivity())
                .registerReceiver(this.exportResponseReceiver, exportStatusFilter);
    }

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        Log.i(TAG, "TLMDecoder action: " + action);

        this.callbackContext = callbackContext;

        if (action.equalsIgnoreCase("openFile")) {
            Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
            intent.setType("*/*");
            super.cordova.startActivityForResult(this, intent, 9988);
        } else if (action.equalsIgnoreCase("readFlight")) {
            JSONObject file = args.getJSONObject(0);
            JSONObject flightJO = args.getJSONObject(1);

            if (file != null) {
                Log.d(TAG, "file: " + file.toString());
            } else {
                Log.w(TAG, "File was passed in null. This probably won't end well!");
            }
            if (flightJO == null) {
                Log.w(TAG, "Flight was passed in null. This probably won't end well!");
            }

            Log.d(TAG, "creating the export service intent");
            Intent exportServiceIntent = new Intent(this.cordova.getActivity(), ExportService.class);
            Log.d(TAG, "Setting the data to: " + file.getString("uri"));
            exportServiceIntent.setData(Uri.parse(file.getString("uri")));

            exportServiceIntent.putExtra("file", file.toString());
            exportServiceIntent.putExtra("flight", flightJO.toString());
            exportServiceIntent.setAction("readFlight");

            this.exportResponseReceiver.set_callbackContext(callbackContext);
            this.cordova.getActivity().startService(exportServiceIntent);
        }

        return true;
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent intent) {
        Log.i(TAG, "TLMDecoder onActivityResult requestCode: " + requestCode + " - resultCode: " + resultCode);

        if (requestCode == 9988) {
            try {
                Uri fileUri = Uri.parse(intent.getDataString());
                Log.d(TAG, "File URI: " + fileUri.toString());
                this.parseFile(fileUri);
            } catch (IOException e) {
                Log.e(TAG, "Error when parsing the file!", e);
                e.printStackTrace();
            }
        }

        super.onActivityResult(requestCode, resultCode, intent);
    }

    void parseFile(Uri uri) throws IOException {
        InputStream inputStream = super.cordova.getActivity().getContentResolver().openInputStream(uri);
        byte[] bytes = ByteStreams.toByteArray(inputStream);

        TLMReader reader = new TLMReader();

        reader.Read(bytes);

        Exporter exporter = new Exporter(uri, reader);

        if (this.callbackContext != null) {
            Log.d(TAG, "There is a callback context. Lets send the array back!");
            this.callbackContext.success(exporter.exportFlights());
        }
    }

    private class ExportResponseReceiver extends BroadcastReceiver {
        private CallbackContext callbackContext = null;

        public void set_callbackContext(CallbackContext callbackContext) {
            this.callbackContext = callbackContext;
        }

        private ExportResponseReceiver() {
            super();
        }

        @Override
        public void onReceive(Context context, Intent intent) {
            if (this.callbackContext != null) {
                String flightTempFilePath = intent.getStringExtra(Constants.READ_FLIGHT_EXTENDED_STATUS);
                FileInputStream inputStream = null;
                try {
                    inputStream = new FileInputStream(new File(flightTempFilePath));
                } catch (FileNotFoundException e) {
                    e.printStackTrace();
                }

                StringBuffer fileContent = new StringBuffer("");

                byte[] buffer = new byte[1024];
                int n;
                try {
                    while ((n = inputStream.read(buffer)) != -1) {
                        fileContent.append(new String(buffer, 0, n));
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                }

                String flightString = fileContent.toString();

                try {
                    inputStream.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }

                File tempFile = new File(flightTempFilePath);
                if (tempFile.exists()) {
                    tempFile.delete();
                }

                if (flightString != null) {
                    try {
                        this.callbackContext.success(new JSONObject(flightString));
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                } else {
                    this.callbackContext.error("Did not get a flight back from the service.");
                }
            }
        }
    }
}
