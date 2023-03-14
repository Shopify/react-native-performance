#import <Foundation/Foundation.h>
#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE(PerformanceMarkerManager, RCTViewManager)

RCT_EXPORT_VIEW_PROPERTY(renderPassName, NSString)
RCT_EXPORT_VIEW_PROPERTY(interactive, BOOL)
RCT_EXPORT_VIEW_PROPERTY(reportOnDraw, BOOL)
RCT_EXPORT_VIEW_PROPERTY(destinationScreen, NSString)
RCT_EXPORT_VIEW_PROPERTY(componentInstanceId, NSString)
RCT_EXPORT_VIEW_PROPERTY(onRenderComplete, RCTDirectEventBlock)

@end
