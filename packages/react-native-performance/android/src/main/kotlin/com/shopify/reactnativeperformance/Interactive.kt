package com.shopify.reactnativeperformance

// On iOS, we cannot send back non-object types to JS via a dictionary,
// so we have to use strings. Legal values: `TRUE` and `FALSE`.
// Using the same convention of android for consistency.
private const val TRUE_STRING = "TRUE"
private const val FALSE_STRING = "FALSE"

class Interactive(stringValue: String) {
  val boolValue: Boolean

  init {
    if (stringValue == TRUE_STRING) {
      this.boolValue = true
    } else if (stringValue == FALSE_STRING) {
      this.boolValue = false
    } else {
      throw IllegalArgumentException("The only allowed values for the 'interactive' prop are '$TRUE_STRING' and '$FALSE_STRING', but it was '$stringValue'.")
    }
  }

  override fun toString() = if (boolValue) TRUE_STRING else FALSE_STRING
}
