Input is a singleton which listens for any user inputs (mouse/touch/keyboard)

It first tries to see if there's a matching widget. If there is, that gets the stream.

If there isn't, then it dispatches to the fallback handler (which we expect to be a Control)