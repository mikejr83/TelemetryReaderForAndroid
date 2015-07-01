package com.monstarmike.telemetry.plugins.sharing;

import android.os.Environment;

import java.io.File;

/**
 * Created by mgardner on 6/28/15.
 */
public final class Constants {
    public static final String TEMP_FILE_NAME = "telemetry_sharing_temp_image.png";
    public static final String APP_FOLDER = "TelemetryReader";

    public  final class BroadcastActions {
        public static final String PREPARE_SHARE_IMAGE_BROADCAST_ACTION = "com.monstarmike.telemetry.plugins.sharing.share.prepareShareImage.BROADCAST";
    }

    public final class PluginActions {
        public static final String ACTION_SHARE = "Share";

        public static final int SHARE_INTENT_ACTIVITY_RESULT = 2620972;
    }

    public final class SharingService {
        public final class PrepareShareImage {
            public static final String ACTION = "com.monstarmike.telemetry.plugins.sharing.action.prepareShareImage";
        }

    }

    public static String get_temporaryFilename() {
        return Environment.getExternalStorageDirectory() + File.separator + Constants.APP_FOLDER +
                File.separator + Constants.TEMP_FILE_NAME;
    }
}
