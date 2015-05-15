package com.monstarmike.telemetry;

import android.content.Intent;

import com.monstarmike.tlmreader.Flight;
import com.monstarmike.tlmreader.TLMReader;
import com.monstarmike.tlmreader.datablock.Block;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;

/**
 * Created by mgardner on 5/15/2015.
 */
public class TLMDecoder extends CordovaPlugin {

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {

        Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
        intent.setType("file/*");

        super.cordova.startActivityForResult(this, intent, 9988);

        return true;
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent intent) {
        if (requestCode == 9988) {
            try {
                this.parseFile(intent.getDataString());
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        super.onActivityResult(requestCode, resultCode, intent);
    }

    void parseFile(String path) throws IOException {
        TLMReader reader = new TLMReader();

        reader.Read(path);

        JSONArray flightsArray = new JSONArray();


        for (Flight flight : reader) {
            JSONObject flightObject = new JSONObject();
            try {
                flightObject.put("duration", flight.get_duration().getMillis());
            } catch (JSONException e) {
                e.printStackTrace();
            }

            JSONArray blockArray = new JSONArray();
            try {
                flightObject.put("blocks", blockArray);
            } catch (JSONException e) {
                e.printStackTrace();
            }

            for (Block b : flight) {
                blockArray.put(b);
            }

            flightsArray.put(flightObject);
        }
    }
}

