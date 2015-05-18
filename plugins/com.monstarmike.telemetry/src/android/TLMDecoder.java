package com.monstarmike.telemetry;

import android.content.Intent;

import com.monstarmike.tlmreader.Flight;
import com.monstarmike.tlmreader.TLMReader;
import com.monstarmike.tlmreader.datablock.*;

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

    CallbackContext callbackContext;

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {

        this.callbackContext = callbackContext;
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


            for (Block b : flight) {
                JSONObject blockJSON = new JSONObject();
                try {
                    blockJSON.put("blockType", b.getClass().getSimpleName());
                } catch (JSONException e) {
                    e.printStackTrace();
                }

                if (b instanceof HeaderBlock) {
                    handleHeaderBlock(flightObject, blockJSON, flight,
                            (HeaderBlock) b);
                } else if (b instanceof DataBlock) {
                    try {
                        handleDataBlock(blockJSON, (DataBlock) b);
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }

                blockArray.put(blockJSON);
            }

            try {
                flightObject.put("blocks", blockArray);
            } catch (JSONException e) {
                e.printStackTrace();
            }

            flightsArray.put(flightObject);
        }

        if (this.callbackContext != null) {
            this.callbackContext.success(flightsArray);
        }
    }

    static void handleHeaderBlock(JSONObject fjsonFlight, JSONObject jsonBlock,
                                  Flight flight, HeaderBlock headerBlock) {

    }

    static void handleDataBlock(JSONObject jsonBlock, DataBlock dataBlock) throws JSONException {
        jsonBlock.put("timestamp", dataBlock.get_timestamp());

        if (dataBlock instanceof AirspeedBlock) {

        } else if (dataBlock instanceof AltitudeBlock) {
            jsonBlock.put("altitude",
                    ((AltitudeBlock) dataBlock).get_altitudeInTenthsOfAMeter());
        } else if (dataBlock instanceof CurrentBlock) {
            CurrentBlock currentBlock = (CurrentBlock) dataBlock;
            jsonBlock.put("current", currentBlock.get_Current());

        } else if (dataBlock instanceof GForceBlock) {
            GForceBlock gfBlock = (GForceBlock) dataBlock;
            jsonBlock.put("maxX", gfBlock.get_maxX());
            jsonBlock.put("maxY", gfBlock.get_maxY());
            jsonBlock.put("maxZ", gfBlock.get_maxZ());
            jsonBlock.put("x", gfBlock.get_x());
            jsonBlock.put("y", gfBlock.get_y());
            jsonBlock.put("z", gfBlock.get_z());
            jsonBlock.put("minZ", gfBlock.get_minZ());

        } else if (dataBlock instanceof PowerboxBlock) {
            PowerboxBlock pbBlock = (PowerboxBlock) dataBlock;
            jsonBlock.put("capacityOne", pbBlock.get_capacityOne());
            jsonBlock.put("capacityTwo", pbBlock.get_capacityTwo());
            jsonBlock.put("voltageOne", pbBlock.get_voltageOne());
            jsonBlock.put("voltageTwo", pbBlock.get_voltageTwo());

        } else if (dataBlock instanceof RXBlock) {
            RXBlock rxBlock = (RXBlock) dataBlock;

            jsonBlock.put("a", rxBlock.get_a());
            jsonBlock.put("b", rxBlock.get_b());
            jsonBlock.put("frameLoss", rxBlock.get_frameLoss());
            jsonBlock.put("holds", rxBlock.get_holds());
            jsonBlock.put("l", rxBlock.get_l());
            jsonBlock.put("r", rxBlock.get_r());
            jsonBlock.put("volts", rxBlock.get_volts());

        } else if (dataBlock instanceof StandardBlock) {
            StandardBlock standard = (StandardBlock) dataBlock;

            jsonBlock.put("rpm", standard.get_rpm());
            jsonBlock.put("temperature", standard.get_temperature());
            jsonBlock.put("volt", standard.get_volt());

        } else if (dataBlock instanceof VarioBlock) {
            VarioBlock varioBlock = (VarioBlock) dataBlock;

            jsonBlock.put("delta1000ms", varioBlock.get_1000ms());
            jsonBlock.put("delta2000ms", varioBlock.get_2000ms());
            jsonBlock.put("delta250ms", varioBlock.get_250ms());
            jsonBlock.put("delta3000ms", varioBlock.get_3000ms());
            jsonBlock.put("delta500ms", varioBlock.get_500ms());
            jsonBlock.put("altitude", varioBlock.get_altitude());

        } else if (dataBlock instanceof VoltageBlock) {
            VoltageBlock voltageBlock = (VoltageBlock) dataBlock;

//			jsonBlock.put("delta3000ms", voltageBlock.g);
//			jsonBlock.put("delta500ms", varioBlock.get_500ms());
//			jsonBlock.put("altitude", varioBlock.get_altitude());
        }
    }
}

