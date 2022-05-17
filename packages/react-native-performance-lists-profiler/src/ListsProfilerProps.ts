interface ListsProfilerProps {
  /**
   * Triggered when a list wrapped in a list performance view becomes interactive.
   * @param TTI: Reported time-to-interactive
   * @param listName - Name of the list that triggered the event defined in the list performance view
   */
  onInteractive?: (TTI: number, listName: string) => void;
  /**
   * Triggered when a list wrapped in a list performance view is scrolled and reports a blank area.
   * @param offsetStart - Offset at the beginning of the list (top when the list is vertical)
   * @param offsetEnd - Offset at the end of the list (bottom when the list is vertical)
   * @param listName - Name of the list that triggered the event defined in the list performance view
   */
  onBlankArea?: (offsetStart: number, offsetEnd: number, listName: string) => void;
  children: JSX.Element;
}

export default ListsProfilerProps;
