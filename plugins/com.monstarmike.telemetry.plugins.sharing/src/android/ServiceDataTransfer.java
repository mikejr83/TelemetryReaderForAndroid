package com.monstarmike.telemetry.plugins.sharing;

import org.apache.cordova.CallbackContext;

/**
 * Created by mgardner on 6/29/15.
 */
public class ServiceDataTransfer {
    private static ServiceDataTransfer instance = null;

    public static ServiceDataTransfer getInstance() {
        if (ServiceDataTransfer.instance == null) {
            instance = new ServiceDataTransfer();
        }

        return ServiceDataTransfer.instance;
    }

    private CallbackContext callbackContext;
    private String dataUrl;

    public CallbackContext get_callbackContext() {
        return this.callbackContext;
    }

    public void set_callbackContext(CallbackContext callbackContext) {
        this.callbackContext = callbackContext;
    }

    public String get_dataUrl() {
        return this.dataUrl;
    }

    public void set_dataUrl(String dataUrl) {
        this.dataUrl = dataUrl;
    }

    private ServiceDataTransfer() {
    }

    public void resetData() {
        this.callbackContext = null;
    }
}
