import React, { useMemo } from "react";
import {
  DrawerContentComponentProps,
  createDrawerNavigator,
  DrawerContent,
} from "@react-navigation/drawer";
import {
  useErrorHandler,
  useStartProfiler,
} from "@shopify/react-native-performance";
import { DrawerNavigationHelpers } from "@react-navigation/drawer/lib/typescript/src/types";

export const DEFAULT_SOURCE_NAME = "Drawer";

type DrawerContentType = (
  props: DrawerContentComponentProps
) => React.ReactNode;
type ErrorHandler = ReturnType<typeof useErrorHandler>;
type StartProfiler = ReturnType<typeof useStartProfiler>;

const createProfiledNavigation = ({
  navigation,
  startProfiler,
  source,
}: {
  navigation: DrawerNavigationHelpers;
  errorHandler: ErrorHandler;
  startProfiler: StartProfiler;
  source: string;
}): DrawerNavigationHelpers => {
  const wrappedNav: typeof navigation = Object.create(navigation);

  const profiledDispatch: typeof navigation.dispatch = (action) => {
    // Note that the drawer navigator internally uses custom animated touchables
    // that do not expose the native press timetamps. So we cannot
    // compute the `timeToConsumeTouchEvent`.
    if ("type" in action && action.type === "NAVIGATE") {
      startProfiler({
        source,
      });
    }

    return navigation.dispatch(action);
  };

  wrappedNav.dispatch = profiledDispatch;

  return wrappedNav;
};

function createProfiledDrawerContent({
  InnerDrawerContent,
  source,
  startProfiler,
  errorHandler,
}: {
  InnerDrawerContent: DrawerContentType;
  source: string;
  startProfiler: ReturnType<typeof useStartProfiler>;
  errorHandler: ReturnType<typeof useErrorHandler>;
}): DrawerContentType {
  const ProfiledDrawerContent: DrawerContentType = ({
    navigation,
    ...rest
  }) => {
    const profiledNavigation = createProfiledNavigation({
      navigation,
      source,
      errorHandler,
      startProfiler,
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return <InnerDrawerContent {...rest} navigation={profiledNavigation} />;
  };

  return ProfiledDrawerContent;
}

const createProfiledDrawerNavigator = <
  TParamList extends { [key: string]: { [key: string]: unknown } | undefined }
>({ source = DEFAULT_SOURCE_NAME }: { source?: string } = {}) => {
  const BaseDrawer = createDrawerNavigator<TParamList>();

  const ProfiledDrawer: typeof BaseDrawer = Object.create(BaseDrawer);

  const ProfiledNavigator: typeof BaseDrawer.Navigator = ({
    drawerContent = DrawerContent,
    ...rest
  }) => {
    const errorHandler = useErrorHandler();
    const startProfiler = useStartProfiler();
    const profiledDrawerContent = useMemo(() => {
      return createProfiledDrawerContent({
        InnerDrawerContent: drawerContent,
        source,
        errorHandler,
        startProfiler,
      });
    }, [drawerContent, errorHandler, startProfiler]);

    return (
      <BaseDrawer.Navigator {...rest} drawerContent={profiledDrawerContent} />
    );
  };

  ProfiledDrawer.Navigator = ProfiledNavigator;

  return ProfiledDrawer;
};

export default createProfiledDrawerNavigator;
