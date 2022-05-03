import Foundation

final class Interactive {
    private static let TRUE_STRING = "TRUE"
    private static let FALSE_STRING = "FALSE"

    let boolValue: Bool

    init?(stringValue: String) {
        switch stringValue {
        case Interactive.TRUE_STRING:
            boolValue = true
        case Interactive.FALSE_STRING:
            boolValue = false
        default:
            assertionFailure("The only allowed values for the 'interactive' prop are '\(Interactive.TRUE_STRING)' and '\(Interactive.FALSE_STRING)', but it was '\(stringValue)'.")
            return nil
        }
    }

    public var description: String {
        return boolValue ? Interactive.TRUE_STRING : Interactive.FALSE_STRING
    }
}
