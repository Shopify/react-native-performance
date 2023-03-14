#import "ReactNativePerformance.h"
#import "ReactNativePerformance-Swift.h"

static NSTimeInterval startupTimestamp = -1.0;

@implementation ReactNativePerformance

+ (void)onAppStarted {
    startupTimestamp = Timestamp.nowMillis;
}

+ (NSTimeInterval)startupTimestamp {
    return startupTimestamp;
}

@end
