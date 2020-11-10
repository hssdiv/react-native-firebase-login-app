#import <Foundation/Foundation.h>

@interface SensorsLog : NSObject
+ (void)info:(NSString * _Nonnull)message;
@end


@implementation SensorsLog
+ (void)info:(NSString *)message
{
  RCTLogInfo(@"log in ios with message", message);
  }
@end
