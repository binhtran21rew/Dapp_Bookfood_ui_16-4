 const modifiedBGColor = (animation, r, g, b, alpha = 0.1) => {
    // Normalize color to Lottie's 0–1 range
    const normalizedColor = [
      parseInt(r) / 255,
      parseInt(g) / 255,
      parseInt(b) / 255,
      alpha // Try to use alpha if Lottie accepts it
    ];
  
    const modified = { ...animation };
  
    modified.layers.forEach((layer) => {
      if (layer.nm === "BG") {
        // Try setting layer opacity (fallback for alpha)
        if (layer.ks?.o) {
          layer.ks.o.k = alpha * 100; // 0.7 -> 70% opacity
        }
  
        // Modify fill color inside shapes
        if (layer.shapes) {
          layer.shapes.forEach((shape) => {
            if (shape.it) {
              shape.it.forEach((item) => {
                if (item.ty === "fl" && item.c?.k) {
                  // Try to apply RGBA
                  item.c.k = normalizedColor;
  
                  // Fallback to RGB if RGBA isn't accepted
                  if (item.c.k.length > 3 && !item.c.k[3]) {
                    item.c.k = normalizedColor.slice(0, 3);
                  }
                }
              });
            }
          });
        }
      }
    });
  
    return modified;
  };

export default modifiedBGColor ;
  