package com.monstarmike.telemetry.plugins;

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
  
  private JSONObject flight;
  private JSONObject file;
  private CallbackContext callbackContext;
  
  public JSONObject get_flight() {
    return this.flight;
  }
  
  public void set_flight(JSONObject flight) {
    this.flight = flight;
  }
  
  public JSONObject get_file() {
    return this.file;
  }
  
  public void set_file(JSONObject file) {
    this.file = file;
  }
  
  public CallbackContext get_callbackContext () {
    return this.callbackContext;
  }
  
  public void set_callbackContext (CallbackContext callbackContext) {
    this.callbackContext = callbackContext;
  }
  
  private ServiceDataTransfer() { }
  
  public void resetData () {
    this.flight = null;
    this.file = null;
    this.callbackContext = null;
  }
}