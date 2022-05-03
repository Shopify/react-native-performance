#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_REMAP_MODULE(Performance, ReactNativePerformanceModule, NSObject)

RCT_EXTERN_METHOD(getNativeStartupTimestamp:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getNativeTime:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getNativeUuid:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject)

@end
