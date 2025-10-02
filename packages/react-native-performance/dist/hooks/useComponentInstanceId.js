"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var utils_1 = require("../utils");
function useComponentInstanceId() {
    var componentInstanceId = (0, react_1.useRef)((0, utils_1.inMemoryCounter)()).current;
    return componentInstanceId;
}
exports.default = useComponentInstanceId;
//# sourceMappingURL=useComponentInstanceId.js.map