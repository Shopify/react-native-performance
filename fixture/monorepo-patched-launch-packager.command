# Set terminal title
echo -en "\\033]0;Metro\\a"
clear

PROJECT_ROOT="$( cd "$( dirname "$0" )" && pwd )"
REACT_NATIVE_ROOT="$PROJECT_ROOT/../node_modules/react-native"
source "${PROJECT_ROOT}/../node_modules/react-native/scripts/node-binary.sh"

cd "$PROJECT_ROOT" || exit # Go to fixture directory
"$NODE_BINARY" "$REACT_NATIVE_ROOT/cli.js" start # Call React Native CLI

if [[ -z "$CI" ]]; then
  echo "Process terminated. Press <enter> to close the window"
  read -r
fi
