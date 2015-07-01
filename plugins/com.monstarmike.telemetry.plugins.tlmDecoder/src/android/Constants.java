package com.monstarmike.telemetry.plugins.tlmDecoder;

/**
 * Created by mgardner on 6/5/15.
 */
public final class Constants {
    public final class PluginIntentActions {
        public static final int GET_FILE = 9988;
    }

    public final class ExportServiceActions {
        public static final String READ_FILE = "com.monstarmike.telemetry.plugins.ExportService.ACTIONS.read_file";
        public static final String READ_FLIGHT = "com.monstarmike.telemetry.plugins.ExportService.ACTIONS.read_flight";
    }
    public static final String READ_FLIGHT_BROADCAST_ACTION = "com.monstarmike.telemetry.plugins.read_flight.BROADCAST";
    public static final String READ_FILE_BROADCAST_ACTION = "com.monstarmike.telemetry.plugins.read_file.BROADCAST";
}
