
The world has entities
- The virtual world space is [0-2000] x [0-3000] with (0,0) in top left.

Entities have various Payloads.
  - All Entities have a Core Entity payload. All others are optional.
  - Some entities are Widgets: they have a WidgetPayload and AABB-rectangular hulls
     - Widgets can't be physics-enabled.

Any pointer event does:
- On down, hit test for any widgets. Dispatch the stream only to that widget.
- If the down doesn't hit a widget, dispatch to whatever is the active Control
  - "Controls" are generally user behavior actions in the physics space, eg jump.

When Rendering each frame:
- Any Entity that is a Widget is rendered by the corresponding Widget
- Any other Entity is rendered based on the specific RenderingPayload
- Otherwise nothing is drawn.