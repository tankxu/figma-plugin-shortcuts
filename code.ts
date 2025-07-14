// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

// Message types definition
interface PluginMessage {
  type: string;
  action?: string;
  shortcuts?: any;
  customActions?: any;
  count?: number;
  actionName?: string;
}

/* === 1. NEW defaultActions ============================================ */
const defaultActions = {
  Alignment: {
    alignLeft: 'Align Left',
    alignRight: 'Align Right',
    alignTop: 'Align Top',
    alignBottom: 'Align Bottom',
    alignHorizontalCenter: 'Align Horizontal Center',
    alignVerticalCenter: 'Align Vertical Center',
    distributeHorizontal: 'Distribute Horizontally',
    distributeVertical: 'Distribute Vertically'
  },
  'Auto-layout & Spacing': {
    layoutHorizontal: 'Apply Auto-layout Horizontal',
    layoutVertical: 'Apply Auto-layout Vertical',
    tidyUp: 'Tidy Up',
    gap0: 'Set Gap 0',
    gap8: 'Set Gap 8',
    gap16: 'Set Gap 16',
    paddingUniform8: 'Padding 8'
  },
  Sizing: {
    fullWidth: 'Full Width',
    fullHeight: 'Full Height',
    widthHug: 'Width Hug',
    widthFill: 'Width Fill',
    widthFixed: 'Width Fixed',
    heightHug: 'Height Hug',
    heightFill: 'Height Fill',
    heightFixed: 'Height Fixed'
  },
  'Corner & Radius': {
    radius0: 'Radius 0',
    radius4: 'Radius 4',
    radius8: 'Radius 8',
    radius16: 'Radius 16',
    radiusFull: 'Radius Full',
    cornerSmoothingIos: 'iOS Corner Smoothing'
  },
  'Border & Stroke': {
    strokeAlignInside: 'Stroke Align Inside',
    strokeAlignCenter: 'Stroke Align Center',
    strokeAlignOutside: 'Stroke Align Outside',
    borderBox: 'Border Box',
    contentBox: 'Content Box',
    swapFillStroke: 'Swap Fill/Stroke',
    removeFill: 'Remove Fill',
    removeStroke: 'Remove Stroke',
    strokeWidthHalf: 'Stroke 0.5px'
  },
  Text: {
    fontSizeIncrease: 'Font Size +1',
    fontSizeDecrease: 'Font Size -1',
    letterSpacingIncrease: 'Letter Spacing +1',
    letterSpacingDecrease: 'Letter Spacing -1',
    lineHeightIncrease: 'Line Height +1',
    lineHeightDecrease: 'Line Height -1',
    textAlignLeft: 'Text Align Left',
    textAlignCenter: 'Text Align Center',
    textAlignRight: 'Text Align Right',
    textAlignJustify: 'Text Align Justify'
  },
  Positioning: {
    absolute: 'Set Absolute Position',
    relative: 'Set Relative Position',
    flipHorizontal: 'Flip Horizontal',
    flipVertical: 'Flip Vertical'
  },
  'Boolean & Vector': {
    booleanUnion: 'Union Selection',
    booleanSubtract: 'Subtract Selection',
    booleanIntersect: 'Intersect Selection',
    booleanExclude: 'Exclude Selection',
    outlineStroke: 'Outline Stroke',
    flattenSelection: 'Flatten Selection'
  }
};
/* ====================================================================== */

// Utility function to safely access node properties
function safeNodeAccess(node: SceneNode, requiredProperties: string[], callback: (node: any) => void) {
  try {
    // Check if all required properties exist on the node
    const hasAllProperties = requiredProperties.every(prop => prop in node);
    if (hasAllProperties) {
      callback(node as any);
    }
  } catch (err) {
    console.log(err);
  }
}



// Action implementations
function fullWidth() {
  figma.currentPage.selection.forEach((node) => {
    if (node.parent && 'layoutMode' in node.parent && node.parent.layoutMode !== "NONE") {
      // Node is in auto layout frame
      safeNodeAccess(node, ['layoutGrow', 'layoutAlign', 'layoutPositioning'], (node) => {
        if ('layoutPositioning' in node && node.layoutPositioning === "ABSOLUTE") {
          // Absolute positioned in auto layout - manually set width and position
          if (node.parent && 'width' in node.parent) {
            node.resize(node.parent.width, node.height);
            node.x = 0;
          }
        } else {
          // Normal auto layout behavior
          node.layoutSizingHorizontal = "FILL"
        }
      });
    } else {
      // Node is not in auto layout, set width to match parent
      if (node.parent && 'width' in node.parent) {
        safeNodeAccess(node, ['resize'], (node) => {
          node.resize(node.parent.width, node.height);
          node.x = 0;
        });
      }
    }
  });
}

function fullHeight() {
  figma.currentPage.selection.forEach((node) => {
    if (node.parent && 'layoutMode' in node.parent && node.parent.layoutMode !== "NONE") {
      // Node is in auto layout frame
      safeNodeAccess(node, ['layoutGrow', 'layoutAlign', 'layoutPositioning'], (node) => {
        if ('layoutPositioning' in node && node.layoutPositioning === "ABSOLUTE") {
          // Absolute positioned in auto layout - manually set height and position
          if (node.parent && 'height' in node.parent) {
            node.resize(node.width, node.parent.height);
            node.y = 0;
          }
        } else {
          // Normal auto layout behavior
          node.layoutSizingVertical = "FILL"
        }
      });
    } else {
      // Node is not in auto layout, set height to match parent
      if (node.parent && 'height' in node.parent) {
        safeNodeAccess(node, ['resize'], (node) => {
          node.resize(node.width, node.parent.height);
          node.y = 0;
        });
      }
    }
  });
}

function strokeAlignOutside() {
  figma.currentPage.selection.map((node) => {
    safeNodeAccess(node, ['strokeAlign'], (node) => {
      node.strokeAlign = "OUTSIDE";
    });
  });
}

function strokeAlignCenter() {
  figma.currentPage.selection.map((node) => {
    safeNodeAccess(node, ['strokeAlign'], (node) => {
      node.strokeAlign = "CENTER";
    });
  });
}

function strokeAlignInside() {
  figma.currentPage.selection.map((node) => {
    safeNodeAccess(node, ['strokeAlign'], (node) => {
      node.strokeAlign = "INSIDE";
    });
  });
}

function cornerSmoothingIos() {
  figma.currentPage.selection.map((node) => {
    safeNodeAccess(node, ['cornerSmoothing'], (node) => {
      node.cornerSmoothing = 60 / 100;
    });
  });
}

function radiusFull() {
  figma.currentPage.selection.map((node) => {
    safeNodeAccess(node, ['cornerRadius'], (node) => {
      node.cornerRadius = 999999;
    });
  });
}

function layoutHorizontal() {
  figma.currentPage.selection.map((node) => {
    safeNodeAccess(node, ['layoutMode'], (node) => {
      let justifyContent = node.primaryAxisAlignItems;
      let itemsAlign = node.counterAxisAlignItems;

      node.layoutMode = "HORIZONTAL";

      node.primaryAxisAlignItems = itemsAlign;
      node.counterAxisAlignItems = justifyContent;
    });
  });
}

function layoutVertical() {
  figma.currentPage.selection.map((node) => {
    safeNodeAccess(node, ['layoutMode'], (node) => {
      let justifyContent = node.primaryAxisAlignItems;
      let itemsAlign = node.counterAxisAlignItems;

      node.layoutMode = "VERTICAL";

      node.primaryAxisAlignItems = itemsAlign;
      node.counterAxisAlignItems = justifyContent;
    });
  });
}

function spaceBetween() {
  figma.currentPage.selection.map((node) => {
    safeNodeAccess(node, ['primaryAxisAlignItems'], (node) => {
      node.primaryAxisAlignItems = "SPACE_BETWEEN";
    });
  });
}

function justifyContentStart() {
  figma.currentPage.selection.map((node) => {
    safeNodeAccess(node, ['primaryAxisAlignItems'], (node) => {
      node.primaryAxisAlignItems = "MIN";
    });
  });
}

function justifyContentCenter() {
  figma.currentPage.selection.map((node) => {
    safeNodeAccess(node, ['primaryAxisAlignItems'], (node) => {
      node.primaryAxisAlignItems = "CENTER";
    });
  });
}

function justifyContentEnd() {
  figma.currentPage.selection.map((node) => {
    safeNodeAccess(node, ['primaryAxisAlignItems'], (node) => {
      node.primaryAxisAlignItems = "MAX";
    });
  });
}

function alignItemsStart() {
  figma.currentPage.selection.map((node) => {
    safeNodeAccess(node, ['counterAxisAlignItems'], (node) => {
      node.counterAxisAlignItems = "MIN";
    });
  });
}

function alignItemsCenter() {
  figma.currentPage.selection.map((node) => {
    safeNodeAccess(node, ['counterAxisAlignItems'], (node) => {
      node.counterAxisAlignItems = "CENTER";
    });
  });
}

function alignItemsEnd() {
  figma.currentPage.selection.map((node) => {
    safeNodeAccess(node, ['counterAxisAlignItems'], (node) => {
      node.counterAxisAlignItems = "MAX";
    });
  });
}

function widthHug() {
  figma.currentPage.selection.map((node) => {
    safeNodeAccess(node, ['layoutGrow', 'layoutAlign'], (node) => {
      node.layoutSizingHorizontal = "HUG";
    });
  });
}

function widthFill() {
  figma.currentPage.selection.map((node) => {
    safeNodeAccess(node, ['layoutGrow', 'layoutAlign'], (node) => {
      node.layoutSizingHorizontal = "FILL";
    });
  });
}

function widthFixed() {
  figma.currentPage.selection.map((node) => {
    safeNodeAccess(node, ['layoutGrow', 'layoutAlign'], (node) => {
      node.layoutSizingHorizontal = "FIXED";
    });
  });
}

function heightHug() {
  figma.currentPage.selection.map((node) => {
    safeNodeAccess(node, ['layoutGrow', 'layoutAlign'], (node) => {
      node.layoutSizingVertical = "HUG";
    });
  });
}

function heightFill() {
  figma.currentPage.selection.map((node) => {
    safeNodeAccess(node, ['layoutGrow', 'layoutAlign'], (node) => {
      node.layoutSizingVertical = "FILL";
    });
  });
}

function heightFixed() {
  figma.currentPage.selection.map((node) => {
    safeNodeAccess(node, ['layoutGrow', 'layoutAlign'], (node) => {
      node.layoutSizingVertical = "FIXED";
    });
  });
}

function contentBox() {
  figma.currentPage.selection.map((node) => {
    safeNodeAccess(node, ['strokesIncludedInLayout'], (node) => {
      node.strokesIncludedInLayout = true;
    });
  });
}

function borderBox() {
  figma.currentPage.selection.map((node) => {
    safeNodeAccess(node, ['strokesIncludedInLayout'], (node) => {
      node.strokesIncludedInLayout = false;
    });
  });
}

function absolute() {
  figma.currentPage.selection.forEach((node) => {
    if (node.parent && 'layoutMode' in node.parent && node.parent.layoutMode !== "NONE") {
      // Node is in auto layout frame, toggle positioning
      safeNodeAccess(node, ['layoutPositioning'], (node) => {
        if ('layoutPositioning' in node) {
          node.layoutPositioning = "ABSOLUTE";
        }
      });
    } else {
      // Node is not in auto layout, notify user
      figma.notify(`${node.name} is not in an auto layout frame`);
    }
  });
}

function relative() {
  figma.currentPage.selection.forEach((node) => {
    if (node.parent && 'layoutMode' in node.parent && node.parent.layoutMode !== "NONE") {
      // Node is in auto layout frame, toggle positioning
      safeNodeAccess(node, ['layoutPositioning'], (node) => {
        if ('layoutPositioning' in node) {
          node.layoutPositioning = "AUTO";
        }
      });
    } else {
      // Node is not in auto layout, notify user
      figma.notify(`${node.name} is not in an auto layout frame`);
    }
  });
}

function placeItemsCenter() {
  justifyContentCenter();
  alignItemsCenter();
}

/* === 2. INSERT new helper & action implementations ==================== */
/* ---------- Additional action implementations ---------- */
function alignLeft() {
  const s = figma.currentPage.selection;
  if (!s.length) return;
  const minX = Math.min(...s.map(n => n.x));
  s.forEach(n => (n.x = minX));
}
function alignHorizontalCenter() {
  const s = figma.currentPage.selection;
  if (!s.length) return;
  const minX = Math.min(...s.map(n => n.x));
  const maxX = Math.max(...s.map(n => n.x + n.width));
  const mid = (minX + maxX) / 2;
  s.forEach(n => (n.x = mid - n.width / 2));
}
function alignRight() {
  const s = figma.currentPage.selection;
  if (!s.length) return;
  const maxX = Math.max(...s.map(n => n.x + n.width));
  s.forEach(n => (n.x = maxX - n.width));
}
function alignTop() {
  const s = figma.currentPage.selection;
  if (!s.length) return;
  const minY = Math.min(...s.map(n => n.y));
  s.forEach(n => (n.y = minY));
}
function alignVerticalCenter() {
  const s = figma.currentPage.selection;
  if (!s.length) return;
  const minY = Math.min(...s.map(n => n.y));
  const maxY = Math.max(...s.map(n => n.y + n.height));
  const mid = (minY + maxY) / 2;
  s.forEach(n => (n.y = mid - n.height / 2));
}
function alignBottom() {
  const s = figma.currentPage.selection;
  if (!s.length) return;
  const maxY = Math.max(...s.map(n => n.y + n.height));
  s.forEach(n => (n.y = maxY - n.height));
}
function distributeHorizontal() {
  const nodes = figma.currentPage.selection.slice().sort((a, b) => a.x - b.x);
  if (nodes.length <= 2) return;
  const first = nodes[0];
  const last = nodes[nodes.length - 1];
  const totalW = nodes.reduce((p, n) => p + n.width, 0);
  const gap = (last.x + last.width - first.x - totalW) / (nodes.length - 1);
  let cursor = first.x;
  nodes.forEach(n => {
    n.x = cursor;
    cursor += n.width + gap;
  });
}
function distributeVertical() {
  const nodes = figma.currentPage.selection.slice().sort((a, b) => a.y - b.y);
  if (nodes.length <= 2) return;
  const first = nodes[0];
  const last = nodes[nodes.length - 1];
  const totalH = nodes.reduce((p, n) => p + n.height, 0);
  const gap = (last.y + last.height - first.y - totalH) / (nodes.length - 1);
  let cursor = first.y;
  nodes.forEach(n => {
    n.y = cursor;
    cursor += n.height + gap;
  });
}
function tidyUp() {
  const s = figma.currentPage.selection;
  if (s.length <= 2) return;
  const wSpread =
    Math.max(...s.map(n => n.x + n.width)) - Math.min(...s.map(n => n.x));
  const hSpread =
    Math.max(...s.map(n => n.y + n.height)) - Math.min(...s.map(n => n.y));
  wSpread >= hSpread ? distributeHorizontal() : distributeVertical();
}
function gap(val: number) {
  figma.currentPage.selection.forEach(n =>
    safeNodeAccess(n, ['itemSpacing', 'layoutMode'], node => {
      if (node.layoutMode !== 'NONE') node.itemSpacing = val;
    })
  );
}
function gap0() { gap(0); }
function gap8() { gap(8); }
function gap16() { gap(16); }
function paddingUniform(val: number) {
  figma.currentPage.selection.forEach(n =>
    safeNodeAccess(
      n,
      ['paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom', 'layoutMode'],
      node => {
        if (node.layoutMode !== 'NONE') {
          node.paddingLeft = node.paddingRight = node.paddingTop = node.paddingBottom = val;
        }
      }
    )
  );
}
function paddingUniform8() { paddingUniform(8); }
function radius(val: number) {
  figma.currentPage.selection.forEach(n =>
    safeNodeAccess(n, ['cornerRadius'], node => {
      node.cornerRadius = val;
    })
  );
}
function radius0() { radius(0); }
function radius4() { radius(4); }
function radius8() { radius(8); }
function radius16() { radius(16); }
function swapFillStroke() {
  figma.currentPage.selection.forEach(n =>
    safeNodeAccess(n, ['fills', 'strokes'], node => {
      const f = node.fills;
      node.fills = node.strokes;
      node.strokes = f;
    })
  );
}
function removeFill() {
  figma.currentPage.selection.forEach(n =>
    safeNodeAccess(n, ['fills'], node => {
      node.fills = [];
    })
  );
}
function removeStroke() {
  figma.currentPage.selection.forEach(n =>
    safeNodeAccess(n, ['strokes'], node => {
      node.strokes = [];
    })
  );
}
function strokeWidth(width: number) {
  figma.currentPage.selection.forEach(n =>
    safeNodeAccess(n, ['strokes'], node => {
      node.strokes = [{
        type: 'SOLID',
        color: { r: 0, g: 0, b: 0 },
        opacity: 1,
        width: width
      }];
    })
  );
}
/* ------ text helpers ------ */
async function adjustFontSize(delta: number) {
  const texts = figma.currentPage.selection.filter(n => n.type === 'TEXT') as TextNode[];
  for (const t of texts) {
    await figma.loadFontAsync(t.fontName as FontName);
    if (typeof t.fontSize === 'number') t.fontSize += delta;
  }
}
async function fontSizeIncrease() { await adjustFontSize(1); }
async function fontSizeDecrease() { await adjustFontSize(-1); }
async function adjustLetterSpacing(delta: number) {
  const texts = figma.currentPage.selection.filter(n => n.type === 'TEXT') as TextNode[];
  for (const t of texts) {
    await figma.loadFontAsync(t.fontName as FontName);
    if (typeof t.letterSpacing === 'number') {
      t.letterSpacing = { value: t.letterSpacing + delta, unit: 'PIXELS' };
    }
  }
}
async function letterSpacingIncrease() { await adjustLetterSpacing(1); }
async function letterSpacingDecrease() { await adjustLetterSpacing(-1); }
async function adjustLineHeight(delta: number) {
  const texts = figma.currentPage.selection.filter(n => n.type === 'TEXT') as TextNode[];
  for (const t of texts) {
    await figma.loadFontAsync(t.fontName as FontName);
    if (typeof t.lineHeight === 'number') {
      t.lineHeight = { value: t.lineHeight + delta, unit: 'PIXELS' };
    }
  }
}
async function lineHeightIncrease() { await adjustLineHeight(1); }
async function lineHeightDecrease() { await adjustLineHeight(-1); }
async function setTextAlign(align: 'LEFT' | 'CENTER' | 'RIGHT' | 'JUSTIFIED') {
  const texts = figma.currentPage.selection.filter(n => n.type === 'TEXT') as TextNode[];
  for (const t of texts) {
    await figma.loadFontAsync(t.fontName as FontName);
    t.textAlignHorizontal = align;
  }
}
async function textAlignLeft() { await setTextAlign('LEFT'); }
async function textAlignCenter() { await setTextAlign('CENTER'); }
async function textAlignRight() { await setTextAlign('RIGHT'); }
async function textAlignJustify() { await setTextAlign('JUSTIFIED'); }
/* ------ flip ------ */
function flipHorizontal() {
  figma.currentPage.selection.forEach(n => {
    const m = n.relativeTransform;
    m[0][0] *= -1;
    m[0][2] += n.width;
    n.relativeTransform = m;
  });
}
function flipVertical() {
  figma.currentPage.selection.forEach(n => {
    const m = n.relativeTransform;
    m[1][1] *= -1;
    m[1][2] += n.height;
    n.relativeTransform = m;
  });
}
/* ------ boolean & vector ------ */
function booleanUnion() {
  if (figma.currentPage.selection.length >= 2)
    figma.union(figma.currentPage.selection, figma.currentPage.selection[0].parent!);
}
function booleanSubtract() {
  if (figma.currentPage.selection.length >= 2)
    figma.subtract(figma.currentPage.selection, figma.currentPage.selection[0].parent!);
}
function booleanIntersect() {
  if (figma.currentPage.selection.length >= 2)
    figma.intersect(figma.currentPage.selection, figma.currentPage.selection[0].parent!);
}
function booleanExclude() {
  if (figma.currentPage.selection.length >= 2)
    figma.exclude(figma.currentPage.selection, figma.currentPage.selection[0].parent!);
}
function outlineStroke() {
  figma.currentPage.selection.forEach(n =>
    safeNodeAccess(n, ['outlineStroke'], node => node.outlineStroke())
  );
}
function flattenSelection() {
  if (figma.currentPage.selection.length >= 2)
    figma.flatten(figma.currentPage.selection);
}
/* ---------- End additional implementations ---------- */
/* ====================================================================== */

// Get action name from default actions
async function getActionName(action: string) {
  // Search through all categories to find the action
  for (const category in defaultActions) {
    if ((defaultActions as any)[category][action]) {
      return (defaultActions as any)[category][action];
    }
  }
  
  // Check if it's a custom action
  if (action.startsWith('custom_')) {
    try {
      const customActions = await figma.clientStorage.getAsync('customActions') || [];
      const customAction = customActions.find((actionItem: any) => actionItem.id === action);
      if (customAction) {
        return customAction.name;
      }
    } catch (error) {
      console.error('Error getting custom action name:', error);
    }
    return action; // Return the action ID if not found
  }
  
  return action; // Return the action ID if not found
}

// Execute action function
async function executeAction(action: string) {
  const selection = figma.currentPage.selection;

  // let processedCount = 0;
  // let errorCount = 0;

  try {
    switch (action) {
      /* === 3. NEW switch‑cases in executeAction ============================= */
      case 'alignLeft':
        alignLeft(); break;
      case 'alignHorizontalCenter':
        alignHorizontalCenter(); break;
      case 'alignRight':
        alignRight(); break;
      case 'alignTop':
        alignTop(); break;
      case 'alignVerticalCenter':
        alignVerticalCenter(); break;
      case 'alignBottom':
        alignBottom(); break;
      case 'distributeHorizontal':
        distributeHorizontal(); break;
      case 'distributeVertical':
        distributeVertical(); break;
      case 'tidyUp':
        tidyUp(); break;
      case 'gap0':
        gap0(); break;
      case 'gap8':
        gap8(); break;
      case 'gap16':
        gap16(); break;
      case 'paddingUniform8':
        paddingUniform8(); break;
      case 'radius0':
        radius0(); break;
      case 'radius4':
        radius4(); break;
      case 'radius8':
        radius8(); break;
      case 'radius16':
        radius16(); break;
      case 'swapFillStroke':
        swapFillStroke(); break;
      case 'removeFill':
        removeFill(); break;
      case 'removeStroke':
        removeStroke(); break;
      case 'fontSizeIncrease':
        await fontSizeIncrease(); break;
      case 'fontSizeDecrease':
        await fontSizeDecrease(); break;
      case 'letterSpacingIncrease':
        await letterSpacingIncrease(); break;
      case 'letterSpacingDecrease':
        await letterSpacingDecrease(); break;
      case 'lineHeightIncrease':
        await lineHeightIncrease(); break;
      case 'lineHeightDecrease':
        await lineHeightDecrease(); break;
      case 'textAlignLeft':
        await textAlignLeft(); break;
      case 'textAlignCenter':
        await textAlignCenter(); break;
      case 'textAlignRight':
        await textAlignRight(); break;
      case 'textAlignJustify':
        await textAlignJustify(); break;
      case 'flipHorizontal':
        flipHorizontal(); break;
      case 'flipVertical':
        flipVertical(); break;
      case 'booleanUnion':
        booleanUnion(); break;
      case 'booleanSubtract':
        booleanSubtract(); break;
      case 'booleanIntersect':
        booleanIntersect(); break;
      case 'booleanExclude':
        booleanExclude(); break;
      case 'outlineStroke':
        outlineStroke(); break;
      case 'flattenSelection':
        flattenSelection(); break;
      /* ====================================================================== */
      case 'fullWidth':
        fullWidth(); break;
      case 'fullHeight':
        fullHeight(); break;
      case 'strokeAlignOutside':
        strokeAlignOutside(); break;
      case 'strokeAlignCenter':
        strokeAlignCenter(); break;
      case 'strokeAlignInside':
        strokeAlignInside(); break;
      case 'cornerSmoothingIos':
        cornerSmoothingIos(); break;
      case 'strokeWidthHalf':
        strokeWidth(0.5); break;
      case 'radiusFull':
        radiusFull(); break;
      case 'layoutHorizontal':
        layoutHorizontal(); break;
      case 'layoutVertical':
        layoutVertical(); break;
      case 'spaceBetween':
        spaceBetween(); break;
      case 'justifyContentStart':
        justifyContentStart(); break;
      case 'justifyContentCenter':
        justifyContentCenter(); break;
      case 'justifyContentEnd':
        justifyContentEnd(); break;
      case 'alignItemsStart':
        alignItemsStart(); break;
      case 'alignItemsCenter':
        alignItemsCenter(); break;
      case 'alignItemsEnd':
        alignItemsEnd(); break;
      case 'widthHug':
        widthHug(); break;
      case 'widthFill':
        widthFill(); break;
      case 'widthFixed':
        widthFixed(); break;
      case 'heightHug':
        heightHug(); break;
      case 'heightFill':
        heightFill(); break;
      case 'heightFixed':
        heightFixed(); break;
      case 'contentBox':
        contentBox(); break;
      case 'borderBox':
        borderBox(); break;
      case 'absolute':
        absolute(); break;
      case 'relative':
        relative(); break;
      case 'placeItemsCenter':
        placeItemsCenter(); break;
      default:
        // Check if it's a custom action
        if (action.startsWith('custom_')) {
          return executeCustomAction(action);
        }
        const actionName = await getActionName(action);
        return { success: false, message: `Unknown action: ${actionName}` };
    }
  } catch (error) {
    console.error('Error executing action:', action, error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const actionName = await getActionName(action);
    return { success: false, message: `Error executing ${actionName}: ${errorMessage}` };
  }

  if (selection.length === 0) {
    return {
      success: false,
      message: "No layers selected"
    };
  }

  const actionName = await getActionName(action);
  return {
    success: true,
    message: `Applied ${actionName}`
  };
}

// Execute custom action function
async function executeCustomAction(actionId: string) {
  try {
    // Get custom actions from storage
    const customActions = await figma.clientStorage.getAsync('customActions') || [];
    const customAction = customActions.find((action: any) => action.id === actionId);
    
    if (!customAction) {
      return { success: false, message: `Custom action not found: ${actionId}` };
    }

    // Create a safe execution environment
    const functionCode = customAction.function;
    const actionName = customAction.name;
    
    // Backend security check - prevent postMessage attacks
    if (functionCode.includes('postMessage')) {
      return { 
        success: false, 
        message: `Security violation: postMessage is not allowed in custom actions` 
      };
    }
    
    try {
      // Create a function from the code with proper context
      const customFunction = new Function(
        'figma', 
        'selection', 
        `
        try {
          ${functionCode}
        } catch (error) {
          throw new Error('Custom action execution failed: ' + error.message);
        }
      `);
      
      // Execute the custom function
      const result = customFunction(figma, figma.currentPage.selection);
      
      return {
        success: true,
        message: `Executed custom action: ${actionName}`
      };
    } catch (executionError) {
      console.error('Error executing custom action:', executionError);
      const errorMessage = executionError instanceof Error ? executionError.message : 'Unknown execution error';
      return { 
        success: false, 
        message: `Error executing custom action "${actionName}": ${errorMessage}` 
      };
    }
  } catch (error) {
    console.error('Error loading custom action:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { 
      success: false, 
      message: `Error loading custom action: ${errorMessage}` 
    };
  }
}

// Common UI setup and message handling
function setupUI() {
  // Show the UI
  figma.showUI(__html__, { width: 320, height: 450 });

  // Handle messages from UI
  figma.ui.onmessage = async (msg: PluginMessage) => {
    console.log('Received message:', msg);

    if (msg.type === 'close-plugin') {
      figma.closePlugin();
      return;
    }

    if (msg.type === 'load-data') {
      // Load saved data from client storage
      figma.clientStorage.getAsync('shortcuts').then(shortcuts => {
        figma.clientStorage.getAsync('customActions').then(customActions => {
          figma.ui.postMessage({
            type: 'data-loaded',
            shortcuts: shortcuts || {},
            customActions: customActions || [],
            defaultActions: defaultActions // Send the categorized actions list
          });
        });
      });
      return;
    }

    if (msg.type === 'save-data') {
      // Backend security validation before saving
      const customActions = msg.customActions || [];
      for (const action of customActions) {
        if (action.function && action.function.includes('postMessage')) {
          console.error('Security violation: Attempted to save custom action with postMessage');
          figma.notify('Security violation: postMessage is not allowed');
          return;
        }
      }
      
      // Save data to client storage
      figma.clientStorage.setAsync('shortcuts', msg.shortcuts || {});
      figma.clientStorage.setAsync('customActions', customActions);
      return;
    }

    if (msg.type === 'shortcut-triggered') {
      // Handle shortcut commands
      const action = msg.action;

      if (action) {
        // Execute the action
        const result = await executeAction(action);

        // Only add environment info if the error is about unsupported action
        if (!result.success && result.message.includes('not supported')) {
          const environmentName = figma.editorType === 'figma' ? 'Figma' :
            figma.editorType === 'figjam' ? 'FigJam' : 'Slides';
          const actionName = await getActionName(action);
          result.message = `error-${actionName} action not supported in ${environmentName}`;
        }

        // Send result back to UI
        figma.ui.postMessage({
          type: 'shortcut-result',
          success: result.success,
          message: result.message
        });

        // Show notification
        figma.notify(result.message);

        // Close plugin after successful execution
        if (result.success) {
          figma.closePlugin();
        }
        return;
      }
    }

    if (msg.type === 'custom-action-added') {
      // Handle custom action
      const customAction = msg.action;

      if (customAction && typeof customAction === 'object' && customAction !== null && 'name' in customAction) {
        // For now, just acknowledge the custom action
        figma.notify(`Custom action "${(customAction as any).name}" added`);
      } else {
        figma.notify('Custom action added');
      }
      return;
    }

    if (msg.type === 'shortcut-set-success') {
      // Handle shortcut set success notification
      const actionName = msg.actionName || 'Unknown action';
      figma.notify(`Successfully set shortcut for ${actionName}`);
      return;
    }

    if (msg.type === 'cancel') {
      figma.closePlugin();
      return;
    }
  };
}

async function main() {
  // figma.clientStorage.setAsync('shortcuts', {})
  console.log('shortcuts')
  await figma.clientStorage.getAsync('shortcuts').then(shortcuts => console.log(shortcuts))
  console.log('customActions')
  // figma.clientStorage.setAsync('customActions', [])
  figma.clientStorage.getAsync('customActions').then(customActions => console.log(customActions))
  setupUI();
}

main()