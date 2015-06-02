package com.monstarmike.telemetry.plugins;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.monstarmike.tlmreader.Flight;
import com.monstarmike.tlmreader.datablock.AirspeedBlock;
import com.monstarmike.tlmreader.datablock.AltitudeBlock;
import com.monstarmike.tlmreader.datablock.Block;
import com.monstarmike.tlmreader.datablock.CurrentBlock;
import com.monstarmike.tlmreader.datablock.DataBlock;
import com.monstarmike.tlmreader.datablock.GForceBlock;
import com.monstarmike.tlmreader.datablock.HeaderBlock;
import com.monstarmike.tlmreader.datablock.PowerboxBlock;
import com.monstarmike.tlmreader.datablock.RXBlock;
import com.monstarmike.tlmreader.datablock.StandardBlock;
import com.monstarmike.tlmreader.datablock.VarioBlock;
import com.monstarmike.tlmreader.datablock.VoltageBlock;

public class Exporter {
    Iterable<Flight> flights;

    public Exporter(Iterable<Flight> flights) {
        this.flights = flights;
    }

    public JSONObject exportFlights() {
        JSONObject file = new JSONObject();

        JSONArray flightsArray = new JSONArray();
        try {
            file.put("uri", "file://somefilename.tlm");
            file.put("flights", flightsArray);
        } catch (JSONException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

        for (Flight flight : this.flights) {
            flightsArray.put(this.buildFlight(false, flight));
        }

        return file;
    }

    public JSONObject exportFlightData(JSONObject flightJO) {
        JSONObject newFlightJO = null;
        for (Flight flight : this.flights) {
            int joId = 0;
            try {
                joId = flightJO.getInt("_id");
            } catch (JSONException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
            if (flight.hashCode() != joId)
                continue;

            newFlightJO = this.buildFlight(true, flight);
        }

        return newFlightJO;
    }

    private JSONObject buildFlight(boolean includeBlockData, Flight flight) {
        JSONObject flightJO = new JSONObject();
        try {
            flightJO.put("_id", flight.hashCode());
            flightJO.put("duration", flight.get_duration().getMillis());
        } catch (JSONException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

        if (includeBlockData) {
            JSONArray blockArray = new JSONArray();

            for (Block b : flight) {
                JSONObject blockJSON = new JSONObject();
                try {
                    blockJSON.put("blockType", b.getClass().getSimpleName());
                } catch (JSONException e) {
                    e.printStackTrace();
                }

                if (b instanceof HeaderBlock) {
                    handleHeaderBlock(flightJO, blockJSON, flight,
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
                flightJO.put("blocks", blockArray);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }

        return flightJO;
    }

    void handleHeaderBlock(JSONObject fjsonFlight, JSONObject jsonBlock,
                           Flight flight, HeaderBlock headerBlock) {

    }

    void handleDataBlock(JSONObject jsonBlock, DataBlock dataBlock) throws JSONException {
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
