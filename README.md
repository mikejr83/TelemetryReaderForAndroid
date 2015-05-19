# Telemetry Reader For Android

This project is designed to provide Android users an application to read Spektrum's telemetry logs output from DX8/9/18 transmitters. The end goal for this application is to be able to chart over time the values of various telemetry sensor data.

## Architecture

This project will be created using the hybrid app technology presented by [Ionic](http://www.ionicframework.com), an extension of the PhoneGap and Cordova projects. This technology was chosen because it presents a rapid prototype to production model as well as allowing for cross platform implementations. While there is no goal for an iOS application at the moment no hinderence should be made toward the development of such an application.

## Features

Currently the app is under development and can not even be considered to be in an alpha state. The following are goals for features in the final app.

* Read all telemetry data from a Spektrum TLM file.
* Display data in a tabular format.
* Display data for various sensors in a graph format.
* Provide basic analysis for the data (min and max values and duration) (1st tier stretch goal)
* Keep historical information (number of flights, hours active, min and max) (2nd tier stretch goal)

*Please feel free to add feature requests in the issues section*

## Roadmap

 1. Alpha release - Ability to load TLM file, decode it, and view altitude data in a graph.
 2. Beta release - All features from the alpha release, along with the ability to see all sensor data in graphs.
 3. v1 release - All defects from alpha and beta fixed. App is styled based on the appropriate style guidelines for Android.
 4. v2 release - Stretch goals

## Contributing

Please feel free to fork this repository and make any fixes or enhancements you see fit. All change requests are welcome and will be reviewed once received. All help is appreciated and welcome! Ideas, suggestions, and enhancments will be greatly appreciated! 
