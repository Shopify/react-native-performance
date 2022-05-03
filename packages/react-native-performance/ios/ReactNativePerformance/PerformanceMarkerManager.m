#import <Foundation/Foundation.h>
#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE(PerformanceMarkerManager, RCTViewManager)

RCT_EXPORT_VIEW_PROPERTY(renderPassName, NSString)
RCT_EXPORT_VIEW_PROPERTY(interactive, NSString)
RCT_EXPORT_VIEW_PROPERTY(destinationScreen, NSString)
RCT_EXPORT_VIEW_PROPERTY(componentInstanceId, NSString)

@end
