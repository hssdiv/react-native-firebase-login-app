//
//  Sensors.swift
//  firebase_react_native_app
//
//  Created by Mac on 10.11.2020.
//

import Foundation
import CoreMotion

@objc(Sensors2)
class Sensors2: NSObject {
  let motion = CMMotionManager()
  
  @objc
  func getAccelerometerData(_ callback: RCTResponseSenderBlock) {
    callback([1,2,3])
    if self.motion.isAccelerometerAvailable {
       self.motion.accelerometerUpdateInterval = 1.0 / 60.0  // 60 Hz
       self.motion.startAccelerometerUpdates()
     if let data = self.motion.accelerometerData {
        let x = data.acceleration.x
        let y = data.acceleration.y
        let z = data.acceleration.z
        
        callback([x,y,z])
     }
       self.motion.stopAccelerometerUpdates()
    }
  }
  
  @objc
  func getGyroscopeData(_ callback: RCTResponseSenderBlock) {
    callback([2,3,4])
     if motion.isGyroAvailable {
        self.motion.gyroUpdateInterval = 1.0 / 60.0
        self.motion.startGyroUpdates()

      if let data = self.motion.gyroData {
         let x = data.rotationRate.x
         let y = data.rotationRate.y
         let z = data.rotationRate.z

        callback([x,y,z])
         self.motion.stopGyroUpdates()
         // Use the gyroscope data in your app.
      }
     }
  }
  
  @objc
  func showToast(_ message: NSString) {
    print("Toast!")
  }
  
  @objc
    static func requiresMainQueueSetup() -> Bool {
      return true
    }
}
