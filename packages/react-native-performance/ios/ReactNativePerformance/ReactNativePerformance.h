#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface ReactNativePerformance : NSObject
+ (NSTimeInterval)startupTimestamp;
+ (void)onAppStarted;
@end

NS_ASSUME_NONNULL_END
