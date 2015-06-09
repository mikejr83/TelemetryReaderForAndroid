package com.monstarmike.telemetry.plugins;

import android.app.IntentService;
import android.content.Intent;
import android.net.Uri;
import android.support.v4.content.LocalBroadcastManager;
import android.util.Log;

import com.google.common.io.ByteStreams;
import com.monstarmike.tlmreader.TLMReader;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;

/**
 * Created by mgardner on 6/5/15.
 */
public class ExportService extends IntentService {
    private static final String TAG = "ExportService";

    public ExportService() {
        super(TAG);
    }

    @Override
    protected void onHandleIntent(Intent intent) {
        String action = intent.getAction();
        if (action.equalsIgnoreCase("readflight")) {
            JSONObject file = ServiceDataTransfer.getInstance().get_file();
            JSONObject flightJO = ServiceDataTransfer.getInstance().get_flight();
            
            if (file == null) {
              Log.w(TAG, "The file object pulled from the ServiceDataTransfer singleton was null!");
            }
            if (flightJO == null) {
              Log.w(TAG, "The flight object pulled from the ServiceDataTransfer singleton was null!");
            }

            JSONObject decodedFlight = null;
            try {
                decodedFlight = this.buildFlight(file, flightJO);
            } catch (Exception e) {
                Log.e(TAG, "Error occurred decoding the flight!", e);
            }
            
            if (decodedFlight == null) {
              Log.w(TAG, "The decoded flight was null. This could be seriously not good!");
            }

            ServiceDataTransfer.getInstance().set_flight(decodedFlight);

            Intent localIntent = new Intent(Constants.READ_FLIGHT_BROADCAST_ACTION);
                    //.putExtra(Constants.READ_FLIGHT_EXTENDED_STATUS, tempPath);
            LocalBroadcastManager.getInstance(this).sendBroadcast(localIntent);
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
        } else {
            Log.d(TAG, "URI: " + uri.toString());
        }

        InputStream inputStream = null;
        try {
            inputStream = this.getContentResolver().openInputStream(uri);
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
