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

// Define categorized actions list
const defaultActions = {
  'Alignment': {
    'alignItemsStart': 'Align Items Start',
    'alignItemsCenter': 'Align Items Center',
    'alignItemsEnd': 'Align Items End',
    'justifyContentStart': 'Justify Content Start',
    'justifyContentCenter': 'Justify Content Center',
    'justifyContentEnd': 'Justify Content End',
    'placeItemsCenter': 'Place Items Center',
    'spaceBetween': 'Space Between'
  },
  'Border & Stroke': {
    'borderBox': 'Border Box',
    'contentBox': 'Content Box',
    'strokeAlignOutside': 'Stroke Align Outside',
    'strokeAlignCenter': 'Stroke Align Center',
    'strokeAlignInside': 'Stroke Align Inside'
  },
  'Corner & Radius': {
    'cornerSmoothingIos': 'Corner Smoothing as iOS',
    'radiusFull': 'Radius Full'
  },
  'Layout': {
    'layoutHorizontal': 'Layout Horizontal',
    'layoutVertical': 'Layout Vertical'
  },
  'Positioning': {
    'absolute': 'Absolute Position',
    'relative': 'Relative Position'
  },
  'Sizing': {
    'fullWidth': 'Full Width',
    'fullHeight': 'Full Height',
    'widthHug': 'Width Hug',
    'widthFill': 'Width Fill',
    'widthFixed': 'Width Fixed',
    'heightHug': 'Height Hug',
    'heightFill': 'Height Fill',
    'heightFixed': 'Height Fixed'
  }
};

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

  let processedCount = 0;
  let errorCount = 0;

  try {
    switch (action) {
      case 'fullWidth':
        fullWidth();
        processedCount = selection.length;
        break;
      case 'fullHeight':
        fullHeight();
        processedCount = selection.length;
        break;
      case 'strokeAlignOutside':
        strokeAlignOutside();
        processedCount = selection.length;
        break;
      case 'strokeAlignCenter':
        strokeAlignCenter();
        processedCount = selection.length;
        break;
      case 'strokeAlignInside':
        strokeAlignInside();
        processedCount = selection.length;
        break;
      case 'cornerSmoothingIos':
        cornerSmoothingIos();
        processedCount = selection.length;
        break;
      case 'radiusFull':
        radiusFull();
        processedCount = selection.length;
        break;
      case 'layoutHorizontal':
        layoutHorizontal();
        processedCount = selection.length;
        break;
      case 'layoutVertical':
        layoutVertical();
        processedCount = selection.length;
        break;
      case 'spaceBetween':
        spaceBetween();
        processedCount = selection.length;
        break;
      case 'justifyContentStart':
        justifyContentStart();
        processedCount = selection.length;
        break;
      case 'justifyContentCenter':
        justifyContentCenter();
        processedCount = selection.length;
        break;
      case 'justifyContentEnd':
        justifyContentEnd();
        processedCount = selection.length;
        break;
      case 'alignItemsStart':
        alignItemsStart();
        processedCount = selection.length;
        break;
      case 'alignItemsCenter':
        alignItemsCenter();
        processedCount = selection.length;
        break;
      case 'alignItemsEnd':
        alignItemsEnd();
        processedCount = selection.length;
        break;
      case 'widthHug':
        widthHug();
        processedCount = selection.length;
        break;
      case 'widthFill':
        widthFill();
        processedCount = selection.length;
        break;
      case 'widthFixed':
        widthFixed();
        processedCount = selection.length;
        break;
      case 'heightHug':
        heightHug();
        processedCount = selection.length;
        break;
      case 'heightFill':
        heightFill();
        processedCount = selection.length;
        break;
      case 'heightFixed':
        heightFixed();
        processedCount = selection.length;
        break;
      case 'contentBox':
        contentBox();
        processedCount = selection.length;
        break;
      case 'borderBox':
        borderBox();
        processedCount = selection.length;
        break;
      case 'absolute':
        absolute();
        processedCount = selection.length;
        break;
      case 'relative':
        relative();
        processedCount = selection.length;
        break;
      case 'placeItemsCenter':
        placeItemsCenter();
        processedCount = selection.length;
        break;
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

  if (processedCount === 0) {
    if (selection.length === 0) {
      return {
        success: false,
        message: "No layers selected"
      };
    } else {
      const actionName = await getActionName(action);
      return {
        success: false,
        message: `Cannot apply ${actionName} to selected layers`
      };
    }
  }

  const actionName = await getActionName(action);
  return {
    success: true,
    message: `Applied ${actionName} to ${processedCount} layer(s)${errorCount > 0 ? ` (${errorCount} failed)` : ''}`
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
      // Save data to client storage
      figma.clientStorage.setAsync('shortcuts', msg.shortcuts || {});
      figma.clientStorage.setAsync('customActions', msg.customActions || []);
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