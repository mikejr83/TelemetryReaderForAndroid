package com.monstarmike.telemetry.plugins;

import android.net.Uri;

import org.apache.cordova.CallbackContext;
import org.json.JSONObject;

public class ServiceDataTransfer {
    private static ServiceDataTransfer instance = null;

    public static ServiceDataTransfer getInstance() {
        if (ServiceDataTransfer.instance == null) {
            instance = new ServiceDataTransfer();
        }

        return ServiceDataTransfer.instance;
    }

    private JSONObject file;
    private JSONObject flight;
    private Uri fileUri;
    private CallbackContext callbackContext;

    public JSONObject get_flight() {
        return this.flight;
    }

    public void set_flight(JSONObject flight) {
        this.flight = flight;
    }

    public Uri get_fileUri() {
        return this.fileUri;
    }

    public void set_fileUri(Uri fileUri) {
        this.fileUri = fileUri;
    }

    public CallbackContext get_callbackContext() {
        return this.callbackContext;
    }

    public void set_callbackContext(CallbackContext callbackContext) {
        this.callbackContext = callbackContext;
    }

    public JSONObject get_file() {
        return this.file;
    }

    public void set_file(JSONObject file) {
        this.file = file;
    }

    private ServiceDataTransfer() {
    }

    public void resetData() {
        this.flight = null;
        this.fileUri = null;
        this.callbackContext = null;
    }
}
