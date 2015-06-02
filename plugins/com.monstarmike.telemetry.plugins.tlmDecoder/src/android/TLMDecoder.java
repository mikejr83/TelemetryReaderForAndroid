package com.monstarmike.telemetry.plugins;

import android.content.Intent;
import android.net.Uri;
import android.util.Log;

import com.google.common.io.ByteStreams;
import com.monstarmike.tlmreader.TLMReader;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.FileNotFoundException;
import java.io.InputStream;
import java.io.IOException;

/**
 * Created by mgardner on 5/15/2015.
 */
public class TLMDecoder extends CordovaPlugin {
    private static final String TAG = "TLMDecoder";
    
    CallbackContext callbackContext;

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        Log.i(TAG, "TLMDecoder action: " + action);
    
        this.callbackContext = callbackContext;
        
        if(action.equalsIgnoreCase("openFile")) {
            Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
            intent.setType("*/*");
            super.cordova.startActivityForResult(this, intent, 9988);
        } else if (action.equalsIgnoreCase("readFlight")) {
            JSONObject file = args.getJSONObject(0);
            JSONObject flightJO = args.getJSONObject(1);
            callbackContext.success(this.buildFlight(file, flightJO));
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
    
    private JSONObject buildFlight(JSONObject file, JSONObject flightJO) {
        Uri uri = null;
        try {
            uri = Uri.parse(file.getString("uri"));
        } catch (JSONException e) {
            Log.w(TAG, "Unable to get the uri from the file JSONObject", e);
        }

        if (uri == null) {
            Log.w(TAG, "Returning the default flight object that was passed in.");
            return flightJO;
        }

        InputStream inputStream = null;
        try {
            inputStream = super.cordova.getActivity().getContentResolver().openInputStream(uri);
        } catch (FileNotFoundException e) {
            Log.w(TAG, "Cannot find the file at " + uri.toString(), e);
        }
        if (inputStream == null) {
            Log.w(TAG, "Returning the default flight object that was passed in.");
            return flightJO;
        }

        byte[] bytes = new byte[0];
        try {
            bytes = ByteStreams.toByteArray(inputStream);
        } catch (IOException e) {
            Log.w(TAG, "Unable to read the input stream to a byte array.", e);
        }

        if (bytes.length == 0) {
            Log.w(TAG, "Returning the default flight object that was passed in.");
            return flightJO;
        }

        TLMReader reader = new TLMReader();

        reader.Read(bytes);

        Exporter exporter = new Exporter(uri, reader);
        return exporter.exportFlightData(flightJO);
	}
}

