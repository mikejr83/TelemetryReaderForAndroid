package com.monstarmike.telemetry.plugins;

import android.net.Uri;
import android.preference.PreferenceActivity;
import android.util.Log;

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
import com.monstarmike.tlmreader.datablock.HeaderDataBlock;
import com.monstarmike.tlmreader.datablock.HeaderNameBlock;
import com.monstarmike.tlmreader.datablock.PowerboxBlock;
import com.monstarmike.tlmreader.datablock.RXBlock;
import com.monstarmike.tlmreader.datablock.StandardBlock;
import com.monstarmike.tlmreader.datablock.VarioBlock;
import com.monstarmike.tlmreader.datablock.VoltageBlock;

import java.util.Iterator;

public class Exporter {
    Iterable<Flight> flights;
    Uri uri;

    private static final String TAG = "TLMDecoder";
    private static final String JSONTemplate = "{\n" +
            "          \"altitude\": {\n" +
            "            \"basic\": {\n" +
            "              \"zoomEnabled\": true,\n" +
            "              \"animationEnabled\": true,\n" +
            "              \"title\": {\n" +
            "                \"text\": \"Altitude\"\n" +
            "              },\n" +
            "              \"axisX\": {\n" +
            "                \"title\": \"Time\"\n" +
            "              },\n" +
            "              \"axisY\": {\n" +
            "                \"title\": \"Altitude (meters)\"\n" +
            "              },\n" +
            "              \"toolTip\": {\n" +
            "              }\n" +
            "            },\n" +
            "            \"chartSeriesTypes\": [\n" +
            "              {\n" +
            "                \"data\": [\n" +
            "                  {\n" +
            "                    \"name\": \"Altitude\",\n" +
            "                    \"type\": \"line\",\n" +
            "                    \"dataPoints\": []\n" +
            "                }\n" +
            "              ]\n" +
            "            }\n" +
            "          ]\n" +
            "          },\n" +
            "          \"current\": {\n" +
            "            \"basic\": {\n" +
            "              \"zoomEnabled\": true,\n" +
            "              \"animationEnabled\": true,\n" +
            "              \"title\": {\n" +
            "                \"text\": \"Current\"\n" +
            "              },\n" +
            "              \"axisX\": {\n" +
            "                \"title\": \"Time\"\n" +
            "              },\n" +
            "              \"axisY\": {\n" +
            "                \"title\": \"Current (mA)\"\n" +
            "              },\n" +
            "              \"toolTip\": {\n" +
            "              }\n" +
            "            },\n" +
            "            \"chartSeriesTypes\": [\n" +
            "              {\n" +
            "                \"data\": [\n" +
            "                  {\n" +
            "                    \"name\": \"Current\",\n" +
            "                    \"type\": \"line\",\n" +
            "                    \"dataPoints\": []\n" +
            "                }\n" +
            "              ]\n" +
            "            }\n" +
            "          ]\n" +
            "          },\n" +
            "          \"gforce\": {\n" +
            "            \"animationEnabled\": true,\n" +
            "            \"title\": {\n" +
            "              \"text\": \"G-Force\"\n" +
            "            },\n" +
            "            \"legend\": {\n" +
            "              \"horizontalAlign\": \"center\",\n" +
            "              \"verticalAlign\": \"bottom\"\n" +
            "            },\n" +
            "            \"axisX\": {\n" +
            "              \"title\": \"Time\"\n" +
            "            },\n" +
            "            \"axisY\": {\n" +
            "              \"title\": \"Volts\"\n" +
            "            },\n" +
            "            \"axisY2\": {\n" +
            "              \"title\": \"Capacity (mAh)\"\n" +
            "            },\n" +
            "            \"toolTip\": {\n" +
            "            },\n" +
            "            \"data\": [\n" +
            "              {\n" +
            "                \"showInLegend\": true,\n" +
            "                \"name\": \"Voltage One\",\n" +
            "                \"type\": \"line\",\n" +
            "                \"dataPoints\": []\n" +
            "            },\n" +
            "              {\n" +
            "                \"showInLegend\": true,\n" +
            "                \"name\": \"Voltage Two\",\n" +
            "                \"type\": \"line\",\n" +
            "                \"dataPoints\": []\n" +
            "            },\n" +
            "              {\n" +
            "                \"showInLegend\": true,\n" +
            "                \"name\": \"Capacity One\",\n" +
            "                \"type\": \"line\",\n" +
            "                \"axisYType\": \"secondary\",\n" +
            "                \"dataPoints\": []\n" +
            "            },\n" +
            "              {\n" +
            "                \"showInLegend\": true,\n" +
            "                \"name\": \"Capacity Two\",\n" +
            "                \"type\": \"line\",\n" +
            "                \"axisYType\": \"secondary\",\n" +
            "                \"dataPoints\": []\n" +
            "            }\n" +
            "          ]\n" +
            "          },\n" +
            "          \"powerbox\": {\n" +
            "            \"basic\": {\n" +
            "              \"zoomEnabled\": true,\n" +
            "              \"animationEnabled\": true,\n" +
            "              \"title\": {\n" +
            "                \"text\": \"PowerBox\"\n" +
            "              },\n" +
            "              \"legend\": {\n" +
            "                \"horizontalAlign\": \"center\",\n" +
            "                \"verticalAlign\": \"bottom\"\n" +
            "              },\n" +
            "              \"axisX\": {\n" +
            "                \"title\": \"Time\"\n" +
            "              }\n" +
            "            },\n" +
            "            \"chartSeriesTypes\": [\n" +
            "              {\n" +
            "                \"selected\": true,\n" +
            "                \"axis\": {\n" +
            "                  \"title\": \"Volts\"\n" +
            "                },\n" +
            "                \"tooltip\": {\n" +
            "                },\n" +
            "                \"data\": [\n" +
            "                  {\n" +
            "                    \"showInLegend\": true,\n" +
            "                    \"name\": \"Voltage One\",\n" +
            "                    \"type\": \"line\",\n" +
            "                    \"dataPoints\": []\n" +
            "                },\n" +
            "                  {\n" +
            "                    \"showInLegend\": true,\n" +
            "                    \"name\": \"Voltage Two\",\n" +
            "                    \"type\": \"line\",\n" +
            "                    \"dataPoints\": []\n" +
            "                }\n" +
            "              ]\n" +
            "            },\n" +
            "              {\n" +
            "                \"selected\": true,\n" +
            "                \"axis\": {\n" +
            "                  \"title\": \"Capacity (mAh)\"\n" +
            "                },\n" +
            "                \"tooltip\": {\n" +
            "                },\n" +
            "                \"data\": [\n" +
            "                  {\n" +
            "                    \"showInLegend\": true,\n" +
            "                    \"name\": \"Capacity One\",\n" +
            "                    \"type\": \"line\",\n" +
            "                    \"dataPoints\": []\n" +
            "                },\n" +
            "                  {\n" +
            "                    \"showInLegend\": true,\n" +
            "                    \"name\": \"Capacity Two\",\n" +
            "                    \"type\": \"line\",\n" +
            "                    \"dataPoints\": []\n" +
            "                }\n" +
            "              ]\n" +
            "            }\n" +
            "          ]\n" +
            "          },\n" +
            "          \"rx\": {\n" +
            "            \"basic\": {\n" +
            "              \"animationEnabled\": true,\n" +
            "              \"zoomEnabled\": true,\n" +
            "              \"title\": {\n" +
            "                \"text\": \"RX\"\n" +
            "              },\n" +
            "              \"legend\": {\n" +
            "                \"horizontalAlign\": \"center\",\n" +
            "                \"verticalAlign\": \"bottom\"\n" +
            "              },\n" +
            "              \"axisX\": {\n" +
            "                \"title\": \"Time\"\n" +
            "              }\n" +
            "            },\n" +
            "            \"chartSeriesTypes\": [\n" +
            "              {\n" +
            "                \"selected\": true,\n" +
            "                \"axis\": {\n" +
            "                  \"title\": \"Signal\"\n" +
            "                },\n" +
            "                \"tooltip\": {\n" +
            "                },\n" +
            "                \"data\": [\n" +
            "                  {\n" +
            "                    \"showInLegend\": true,\n" +
            "                    \"name\": \"A\",\n" +
            "                    \"type\": \"line\",\n" +
            "                    \"dataPoints\": []\n" +
            "                },\n" +
            "                  {\n" +
            "                    \"showInLegend\": true,\n" +
            "                    \"name\": \"B\",\n" +
            "                    \"type\": \"line\",\n" +
            "                    \"dataPoints\": []\n" +
            "                },\n" +
            "                  {\n" +
            "                    \"showInLegend\": true,\n" +
            "                    \"name\": \"L\",\n" +
            "                    \"type\": \"line\",\n" +
            "                    \"dataPoints\": []\n" +
            "                },\n" +
            "                  {\n" +
            "                    \"showInLegend\": true,\n" +
            "                    \"name\": \"R\",\n" +
            "                    \"type\": \"line\",\n" +
            "                    \"dataPoints\": []\n" +
            "                }\n" +
            "              ]\n" +
            "            },\n" +
            "              {\n" +
            "                \"selected\": true,\n" +
            "                \"axis\": {\n" +
            "                  \"title\": \"Fades and Holds\",\n" +
            "                  \"minimum\": 0\n" +
            "                },\n" +
            "                \"data\": [\n" +
            "                  {\n" +
            "                    \"showInLegend\": true,\n" +
            "                    \"name\": \"Frame Loss\",\n" +
            "                    \"axisYType\": \"secondary\",\n" +
            "                    \"type\": \"line\",\n" +
            "                    \"dataPoints\": []\n" +
            "                },\n" +
            "                  {\n" +
            "                    \"showInLegend\": true,\n" +
            "                    \"name\": \"Holds\",\n" +
            "                    \"axisYType\": \"secondary\",\n" +
            "                    \"type\": \"line\",\n" +
            "                    \"dataPoints\": []\n" +
            "                }\n" +
            "              ]\n" +
            "            },\n" +
            "              {\n" +
            "                \"selected\": false,\n" +
            "                \"axis\": {\n" +
            "                  \"title\": \"Volts\",\n" +
            "                  \"minimum\": 0\n" +
            "                },\n" +
            "                \"toolTip\": {\n" +
            "                },\n" +
            "                \"data\": [\n" +
            "                  {\n" +
            "                    \"showInLegend\": true,\n" +
            "                    \"name\": \"RX Voltage\",\n" +
            "                    \"type\": \"line\",\n" +
            "                    \"dataPoints\": []\n" +
            "                }\n" +
            "              ]\n" +
            "            }\n" +
            "          ]\n" +
            "          },\n" +
            "          \"standard\": {\n" +
            "            \"basic\": {\n" +
            "              \"animationEnabled\": true,\n" +
            "              \"zoomEnabled\": true,\n" +
            "              \"title\": {\n" +
            "                \"text\": \"RX\"\n" +
            "              },\n" +
            "              \"legend\": {\n" +
            "                \"horizontalAlign\": \"center\",\n" +
            "                \"verticalAlign\": \"bottom\"\n" +
            "              },\n" +
            "              \"axisX\": {\n" +
            "                \"title\": \"Time\"\n" +
            "              }\n" +
            "            },\n" +
            "            \"chartSeriesTypes\": [\n" +
            "              {\n" +
            "                \"selected\": true,\n" +
            "                \"axis\": {\n" +
            "                  \"title\": \"RPM\",\n" +
            "                  \"minimum\": 0\n" +
            "                },\n" +
            "                \"tooltip\": {\n" +
            "                },\n" +
            "                \"data\": [\n" +
            "                  {\n" +
            "                    \"showInLegend\": true,\n" +
            "                    \"name\": \"RPM\",\n" +
            "                    \"type\": \"line\",\n" +
            "                    \"dataPoints\": []\n" +
            "                }\n" +
            "              ]\n" +
            "            },\n" +
            "              {\n" +
            "                \"selected\": true,\n" +
            "                \"axis\": {\n" +
            "                  \"title\": \"Temperature\",\n" +
            "                  \"minimum\": -100\n" +
            "                },\n" +
            "                \"tooltip\": {\n" +
            "                },\n" +
            "                \"data\": [\n" +
            "                  {\n" +
            "                    \"showInLegend\": true,\n" +
            "                    \"name\": \"Temperature\",\n" +
            "                    \"type\": \"line\",\n" +
            "                    \"dataPoints\": []\n" +
            "                }\n" +
            "              ]\n" +
            "            },\n" +
            "              {\n" +
            "                \"selected\": false,\n" +
            "                \"axis\": {\n" +
            "                  \"title\": \"Volts\",\n" +
            "                  \"minimum\": 0\n" +
            "                },\n" +
            "                \"tooltip\": {\n" +
            "                },\n" +
            "                \"data\": [\n" +
            "                  {\n" +
            "                    \"showInLegend\": true,\n" +
            "                    \"name\": \"Voltage\",\n" +
            "                    \"type\": \"line\",\n" +
            "                    \"dataPoints\": []\n" +
            "                  }\n" +
            "                ]\n" +
            "              }\n" +
            "          ]\n" +
            "        },\n" +
            "        \"vario\": {\n" +
            "          \"type\": \"serial\",\n" +
            "          \"categoryField\": \"timestamp\",\n" +
            "          \"startDuration\": 1,\n" +
            "          \"startEffect\": \"easeOutSine\",\n" +
            "          \"theme\": \"light\",\n" +
            "          \"categoryAxis\": {\n" +
            "            \"gridPosition\": \"start\"\n" +
            "          },\n" +
            "          \"trendLines\": [],\n" +
            "          \"graphs\": [],\n" +
            "          \"legend\": {\n" +
            "            \"useGraphSettings\": true\n" +
            "          },\n" +
            "          \"titles\": [\n" +
            "            {\n" +
            "              \"id\": \"Title-1\",\n" +
            "              \"size\": 15,\n" +
            "              \"text\": \"Vario\"\n" +
            "                  }\n" +
            "              ],\n" +
            "          \"dataProvider\": []\n" +
            "        }\n" +
            "      }";

    public Exporter(Uri uri, Iterable<Flight> flights) {
        this.flights = flights;
        this.uri = uri;
    }

    public JSONObject exportFlights() {
        JSONObject file = new JSONObject();

        JSONArray flightsArray = new JSONArray();
        try {
            file.put("uri", uri);
            file.put("flights", flightsArray);
        } catch (JSONException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

        int index = 0;
        for (Flight flight : this.flights) {
            JSONObject flightJO =this.buildFlight(false, flight);
                try {
                    flightJO.put("_id", index++);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                flightsArray.put(flightJO);
        }

        return file;
    }

    public JSONObject exportFlightData(JSONObject flightJO) {
        JSONObject newFlightJO = null;
        int index = 0;
        for (Flight flight : this.flights) {
            int joId = 0;
            try {
                joId = flightJO.getInt("_id");
            } catch (JSONException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }

            if (index != joId) {
                Log.d(TAG, "Flight index: " + index + " != passed in value: " + joId);
                index++;
                continue;
            }

            Log.d(TAG, "Found flight. Going to do a full decode.");
            newFlightJO = this.buildFlight(true, flight);
            if(newFlightJO != null) {
                try {
                    newFlightJO.put("_id", joId);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
            break;
        }

        return newFlightJO;
    }

    private JSONObject buildFlight(boolean includeBlockData, Flight flight) {
        JSONObject flightJO = new JSONObject();
        try {
            flightJO.put("_id", flight.hashCode());
            flightJO.put("duration", flight.get_duration().getMillis());
                Iterator<HeaderBlock> iterator = flight.get_headerBlocks();
            while(iterator.hasNext()) {
              HeaderBlock headerBlock = iterator.next();
              if (headerBlock instanceof HeaderNameBlock) {
                HeaderNameBlock nameBlock = (HeaderNameBlock)headerBlock;
                flightJO.put("name", nameBlock.get_modelName());
                flightJO.put("modelNumber", nameBlock.get_modelNumber());
                flightJO.put("bindInfo", nameBlock.get_bindInfo());
                flightJO.put("modelType", nameBlock.get_modelType());
              }
            }
        } catch (JSONException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

        if (includeBlockData) {
            JSONObject flightData = null;
            try {
                flightData = this.loadChartDataTemplate();
            } catch (JSONException e) {
                e.printStackTrace();
            }
            try {
                flightJO.put("flightData", flightData);
            } catch (JSONException e) {
                e.printStackTrace();
            }

            for (Block b : flight) {
                JSONObject blockJSON = new JSONObject();
                try {
                    blockJSON.put("blockType", b.getClass().getSimpleName());
                } catch (JSONException e) {
                    e.printStackTrace();
                }

                if (b instanceof HeaderBlock) {
                    try {
                        handleHeaderBlock(flightJO, (HeaderBlock) b);
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                } else if (b instanceof DataBlock) {
                    try {
                        handleDataBlock(flightData, blockJSON, (DataBlock) b);
                    } catch (JSONException e) {
                        Log.w(TAG, "JSON error when working with data block", e);
                    }
                }
            }
        }

        return flightJO;
    }

    private JSONObject loadChartDataTemplate() throws JSONException {
        return new JSONObject(JSONTemplate);
    }

    private JSONArray findDataPointsArray(JSONObject flightData, String sensorName,
                                          int seriesPostion, int dataSetPosition) throws JSONException {
        return flightData.getJSONObject(sensorName)
                .getJSONArray("chartSeriesTypes")
                .getJSONObject(seriesPostion)
                .getJSONArray("data")
                .getJSONObject(dataSetPosition)
                .getJSONArray("dataPoints");
    }

    void handleHeaderBlock(JSONObject jsonFlight, HeaderBlock headerBlock) throws JSONException {
        JSONObject jsonHeaderBlock = null;

        if (headerBlock instanceof HeaderNameBlock) {
            HeaderNameBlock nameBlock = (HeaderNameBlock) headerBlock;
            jsonHeaderBlock = new JSONObject();
            jsonHeaderBlock.put("modelNumber", nameBlock.get_modelNumber());
            jsonHeaderBlock.put("bindInfo", nameBlock.get_bindInfo());
            jsonHeaderBlock.put("modelName", nameBlock.get_modelName());
            jsonHeaderBlock.put("modelType", nameBlock.get_modelType());
        }

        if(jsonHeaderBlock == null) return;

        if(jsonFlight.has("headers")) {
            jsonFlight.getJSONArray("headers").put(jsonHeaderBlock);
        } else {
            JSONArray headersArray = new JSONArray();
            headersArray.put(jsonHeaderBlock);
            jsonFlight.put("headers", headersArray);
        }
    }

    void handleDataBlock(JSONObject flightData, JSONObject jsonBlock, DataBlock dataBlock) throws JSONException {
        jsonBlock.put("timestamp", dataBlock.get_timestamp());

        if (dataBlock instanceof AirspeedBlock) {

        } else if (dataBlock instanceof AltitudeBlock) {
            JSONArray dataPoints =this.findDataPointsArray(flightData, "altitude", 0, 0);

            dataPoints.put(jsonBlock);
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
