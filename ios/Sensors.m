//
//  Sensors.m
//  firebase_react_native_app
//
//  Created by Mac on 10.11.2020.
//

#import "React/RCTBridgeModule.h"
#import <React/RCTLog.h>

@interface RCT_EXTERN_MODULE(Sensors, NSObject)

RCT_EXTERN_METHOD(showToast: (NSString)message)
RCT_EXTERN_METHOD(getAccelerometerData: (RCTResponseSenderBlock)callback)
RCT_EXTERN_METHOD(getGyroscopeData: (RCTResponseSenderBlock)callback)

@end
