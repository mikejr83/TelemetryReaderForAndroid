package com.monstarmike.telemetry.plugins;

import android.app.IntentService;
import android.content.Intent;
import android.net.Uri;
import android.support.v4.content.LocalBroadcastManager;
import android.util.Log;

import com.google.common.io.ByteStreams;
import com.monstarmike.tlmreader.TLMReader;

import org.json.JSONObject;

import java.io.FileNotFoundException;
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

        Log.d(TAG, "Export Service action: " + action);
        if (action.equalsIgnoreCase(Constants.ExportServiceActions.READ_FLIGHT)) {
            Uri fileUri = ServiceDataTransfer.getInstance().get_fileUri();
            JSONObject flightJO = ServiceDataTransfer.getInstance().get_flight();

            if (fileUri == null) {
                Log.w(TAG, "The file Uri pulled from the ServiceDataTransfer singleton was null!");
            }
            if (flightJO == null) {
                Log.w(TAG, "The flight object pulled from the ServiceDataTransfer singleton was null!");
            }

            JSONObject decodedFlight = null;
            try {
                decodedFlight = this.buildFlight(fileUri, flightJO);
            } catch (Exception e) {
                Log.e(TAG, "Error occurred decoding the flight!", e);
            }

            if (decodedFlight == null) {
                Log.w(TAG, "The decoded flight was null. This could be seriously not good!");
            }

            ServiceDataTransfer.getInstance().set_flight(decodedFlight);

            Intent localIntent = new Intent(Constants.READ_FLIGHT_BROADCAST_ACTION);
            LocalBroadcastManager.getInstance(this).sendBroadcast(localIntent);
        } else if (action.equalsIgnoreCase(Constants.ExportServiceActions.READ_FILE)) {
            Uri uri = intent.getData();

            Log.d(TAG, "Reading file: " + uri.toString());

            JSONObject file = null;

            try {
                file = this.parseFile(uri);
            } catch (IOException e) {
                Log.e(TAG, "IO error when trying to get and parse the TLM data file.", e);
            }

            if (file == null) {
                Log.w(TAG, "This is interesting. The file JSONObject from the parse function is null!");
            }

            Log.d(TAG, "Done with the file. Broadcasting a local intent.");
            ServiceDataTransfer.getInstance().set_file(file);
            Intent localIntent = new Intent(Constants.READ_FILE_BROADCAST_ACTION);
            LocalBroadcastManager.getInstance(this).sendBroadcast(localIntent);
        }
    }

    private JSONObject buildFlight(Uri uri, JSONObject flightJO) {

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

        Exporter exporter = new Exporter(uri, reader, this.getApplicationContext());
        return exporter.exportFlightData(flightJO);
    }

    private JSONObject parseFile(Uri uri) throws IOException {
        InputStream inputStream = this.getApplicationContext().getContentResolver().openInputStream(uri);
        Log.d(TAG, "Have an input stream.");
        byte[] bytes = ByteStreams.toByteArray(inputStream);
        Log.d(TAG, "Read bytes: " + bytes.length);

        TLMReader reader = new TLMReader();

        reader.Read(bytes);

        Log.d(TAG, "The reader has read all the bytes. Going to export.");

        Exporter exporter = new Exporter(uri, reader, this.getApplicationContext());

        JSONObject file = exporter.exportFlights();


        return file;
    }
}
