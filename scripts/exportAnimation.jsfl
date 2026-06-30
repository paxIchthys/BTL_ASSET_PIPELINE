// BTL Asset Pipeline - Adobe Animate Export Script
// Exports semantic animation data (no pixel coordinates)
// Naming convention:
//   - Layer name = slot (e.g., "Left_Hand")
//   - Movieclip instance name = pose (e.g., "flap_up")
//   - If instance name is empty, defaults to "neutral"
// Only processes movieclip instances on keyframes

// JSON polyfill for older Animate versions
if (typeof JSON === 'undefined') {
    JSON = {
        stringify: function(obj, indent) {
            var tabs = indent || 0;
            var str = "";
            var pad = "";
            for (var i = 0; i < tabs; i++) pad += "  ";
            
            if (typeof obj === 'string') {
                return '"' + obj.replace(/"/g, '\\"') + '"';
            } else if (typeof obj === 'number' || typeof obj === 'boolean') {
                return String(obj);
            } else if (obj === null) {
                return "null";
            } else if (Array.isArray(obj)) {
                if (obj.length === 0) return "[]";
                str += "[\n";
                for (var i = 0; i < obj.length; i++) {
                    str += pad + "  " + JSON.stringify(obj[i], tabs + 1);
                    if (i < obj.length - 1) str += ",";
                    str += "\n";
                }
                str += pad + "]";
                return str;
            } else if (typeof obj === 'object') {
                var keys = [];
                for (var k in obj) keys.push(k);
                if (keys.length === 0) return "{}";
                str += "{\n";
                for (var i = 0; i < keys.length; i++) {
                    str += pad + "  " + '"' + keys[i] + '": ' + JSON.stringify(obj[keys[i]], tabs + 1);
                    if (i < keys.length - 1) str += ",";
                    str += "\n";
                }
                str += pad + "}";
                return str;
            }
            return String(obj);
        }
    };
}

(function() {
    var doc = fl.getDocumentDOM();
    if (!doc) {
        alert("Please open a FLA document first.");
        return;
    }

// Get animation metadata
var animationId = prompt("Enter animation ID:", doc.name.replace(".fla", ""));
if (!animationId) {
    alert("Animation ID is required.");
    return;
}

var skeletonId = prompt("Enter skeleton ID:", "default_skeleton");
if (!skeletonId) {
    alert("Skeleton ID is required.");
    return;
}

// Initialize animation data
var animationData = {
    id: animationId,
    skeleton: skeletonId,
    frames: []
};

// Get timeline
var timeline = doc.getTimeline();
var totalFrames = timeline.frameCount;

// Process each frame
for (var frame = 0; frame < totalFrames; frame++) {
    var frameData = {
        frame: frame,
        slots: {}
    };
    
    var hasChanges = false;
    
    // Process each layer
    for (var layerIndex = 0; layerIndex < timeline.layers.length; layerIndex++) {
        var layer = timeline.layers[layerIndex];
        
        // Skip guide/hidden layers
        if (layer.layerType === "guide" || layer.visible === false) {
            continue;
        }
        
        // Check if this layer has a keyframe on the current frame
        var frameObj = layer.frames[frame];
        if (!frameObj || frameObj.startFrame !== frame) {
            continue; // Skip if not a keyframe
        }
        
        // Get elements on this keyframe
        var elements = frameObj.elements;
        if (!elements || elements.length === 0) {
            continue;
        }
        
        // Process each element (movieclip instance)
        for (var elemIndex = 0; elemIndex < elements.length; elemIndex++) {
            var element = elements[elemIndex];
            
            // Only process movieclip symbols
            if (element.elementType !== "instance") {
                continue;
            }
            
            // Layer name = slot ID
            var slotId = layer.name;
            if (!slotId) {
                continue; // Skip unnamed layers
            }
            
            // Instance name = pose ID (defaults to "neutral" if empty)
            var poseId = element.name || "neutral";
            
            frameData.slots[slotId] = { pose: poseId };
            hasChanges = true;
        }
    }
    
    // Only add frame if it has slot data
    if (hasChanges) {
        animationData.frames.push(frameData);
    }
}

// Convert to JSON
var jsonString = JSON.stringify(animationData, null, 2);

// Save to file
var outputURI = fl.browseForFileURL("save", "Save animation data as JSON", "animation.json");
if (outputURI) {
    FLfile.write(outputURI, jsonString);
    alert("Animation exported successfully to:\n" + outputURI);
} else {
    alert("Export cancelled.");
}

// Log summary
fl.trace("=== Animation Export Summary ===");
fl.trace("Animation ID: " + animationId);
fl.trace("Skeleton ID: " + skeletonId);
fl.trace("Total Frames: " + animationData.frames.length);
if (animationData.frames.length > 0) {
    fl.trace("Slots: " + Object.keys(animationData.frames[0].slots).join(", "));
} else {
    fl.trace("Warning: No frames exported - check if layers have keyframes");
}

})();
